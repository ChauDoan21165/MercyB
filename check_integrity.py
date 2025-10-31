#!/usr/bin/env python3
from pathlib import Path
import json, re, unicodedata as U, argparse, difflib, shutil, sys

root = Path('~/Desktop/A').expanduser()
RX_MP3 = re.compile(r'(?P<path>[^"\\]+?)\.(?P<ext>[mM][pP]3)\b')

def norm(name:str) -> str:
    stem,_sep,_ext = name.rpartition('.')
    nf = ''.join(c for c in U.normalize('NFKD', stem) if not U.combining(c)).lower()
    return re.sub(r'[^a-z0-9_]+','_',nf).strip('_') + '.mp3'

def safe_load(p:Path):
    try:
        return json.loads(p.read_text(encoding='utf-8'))
    except Exception as e:
        return None, e

def backup_once(p:Path):
    bak = p.with_suffix(p.suffix + '.bak')
    if not bak.exists():
        shutil.copy2(p, bak)

def escape_illegals_inside_strings(s:str)->str:
    out=[]; in_str=False; esc=False
    for ch in s:
        if in_str:
            if esc: out.append(ch); esc=False; continue
            if ch=='\\': out.append(ch); esc=True; continue
            if ch=='"': out.append(ch); in_str=False; continue
            if ch=='\n': out.append('\\n'); continue
            if ch=='\r': out.append('\\r'); continue
            if ch=='\t': out.append('\\t'); continue
            out.append(ch)
        else:
            if ch=='"': out.append(ch); in_str=True; esc=False; continue
            out.append(ch)
    return ''.join(out)

def collect_json():
    ok, bad = [], []
    for p in root.rglob('*.json'):
        if p.name.lower().startswith('tsconfig') or p.name in {
            'package.json','package-lock.json','components.json','Components.json'}:
            continue
        obj, err = safe_load(p)
        if obj is None: bad.append((p, err))
        else: ok.append((p, obj))
    return ok, bad

def collect_mp3():
    return [p for p in root.rglob('*.mp3') if p.is_file()]

def scan_mentions(obj):
    out=set()
    def walk(n):
        if isinstance(n, dict):
            for v in n.values(): walk(v)
        elif isinstance(n, list):
            for v in n: walk(v)
        elif isinstance(n, str):
            for m in RX_MP3.finditer(n):
                base=(m.group('path')+'.'+m.group('ext')).split('/')[-1].split('\\')[-1]
                out.add(norm(base))
    walk(obj)
    return out

def replace_missing_strings(obj, missing_name_norm, replacement):
    """Replace any string value equal to missing raw mp3 name or containing it; return (newobj, replaced_count)."""
    replaced=0
    def repl_str(s:str):
        nonlocal replaced
        # Replace if the normalized filename appears as a standalone portion
        # Try exact file name match first
        if s.strip().lower().endswith('.mp3'):
            if norm(s) == missing_name_norm:
                replaced += 1
                return replacement
        # Otherwise replace occurrences inside longer strings (conservative)
        if missing_name_norm in norm(s):
            # swap raw filename bits heuristically
            replaced += 1
            return s.replace(s, replacement) if s.strip().lower().endswith('.mp3') else s.replace(s, s.replace(s, s))  # keep original if not a pure filename
        return s
    def walk(n):
        if isinstance(n, dict):
            return {k:walk(v) for k,v in n.items()}
        if isinstance(n, list):
            return [walk(v) for v in n]
        if isinstance(n, str):
            return repl_str(n)
        return n
    new = walk(obj)
    return new, replaced

def add_audio_if_missing(obj, filename):
    """Add top-level 'audio' if obj is a dict and lacks it."""
    if isinstance(obj, dict) and 'audio' not in obj:
        obj['audio'] = filename
        return True
    return False

def main():
    ap = argparse.ArgumentParser(description="Mercy Blade integrity checker (with optional auto-fix).")
    ap.add_argument('--fix-controls', action='store_true', help='Escape bad control chars inside strings in invalid JSONs.')
    ap.add_argument('--repair-missing', action='store_true', help='Replace missing mp3 references in JSON strings with best existing filename.')
    ap.add_argument('--attach-orphans', action='store_true', help='Attach orphan mp3s to best-matching JSON by adding a top-level "audio" if absent.')
    ap.add_argument('--threshold', type=float, default=0.90, help='Similarity threshold for repairs (default 0.90).')
    args = ap.parse_args()

    ok, bad = collect_json()
    mp3s = collect_mp3()
    mp3_names = [p.name for p in mp3s]
    mp3_norm = {norm(p.name): p for p in mp3s}

    # Try to auto-fix invalid JSONs (control chars only) if requested
    if args.fix-controls and bad:
        fixed_now=[]
        for p, err in bad:
            txt = p.read_text(encoding='utf-8', errors='replace')
            new = escape_illegals_inside_strings(txt)
            try:
                json.loads(new)
                backup_once(p)
                p.write_text(new, encoding='utf-8')
                fixed_now.append(p.name)
            except Exception:
                pass
        if fixed_now:
            # refresh lists
            ok, bad = collect_json()

    # Build mentions set
    mentioned=set()
    for _, obj in ok:
        mentioned |= scan_mentions(obj)

    # Orphans and missing
    orphans = [p for p in mp3s if norm(p.name) not in mentioned]
    missing = []  # list of (json_path, missing_raw, missing_norm)
    for p, obj in ok:
        def walkm(n):
            if isinstance(n, dict):
                for v in n.values(): walkm(v)
            elif isinstance(n, list):
                for v in n: walkm(v)
            elif isinstance(n, str):
                for m in RX_MP3.finditer(n):
                    base=(m.group('path')+'.'+m.group('ext')).split('/')[-1].split('\\')[-1]
                    if norm(base) not in mp3_norm:
                        missing.append((p, base, norm(base)))
        walkm(obj)

    # Auto-repair missing refs
    repaired_missing=0
    if args.repair-missing and missing:
        for p, raw, miss_norm in missing:
            # pick best existing mp3 by similarity
            best=None; score=0.0
            for name in mp3_names:
                s = difflib.SequenceMatcher(None, raw.lower(), name.lower()).ratio()
                if s > score:
                    score, best = s, name
            if best and score >= args.threshold:
                obj, _ = safe_load(p)
                obj2, replaced = replace_missing_strings(obj, miss_norm, best)
                if replaced:
                    backup_once(p)
                    p.write_text(json.dumps(obj2, ensure_ascii=False, indent=2), encoding='utf-8')
                    repaired_missing += 1

        # refresh state
        ok, bad = collect_json()
        mentioned=set()
        for _, obj in ok: mentioned |= scan_mentions(obj)
        mp3_names = [p.name for p in mp3s]
        mp3_norm = {norm(p.name): p for p in mp3s}
        orphans = [p for p in mp3s if norm(p.name) not in mentioned]
        missing = []
        for p, obj in ok:
            def walkm(n):
                if isinstance(n, dict):
                    for v in n.values(): walkm(v)
                elif isinstance(n, list):
                    for v in n: walkm(v)
                elif isinstance(n, str):
                    for m in RX_MP3.finditer(n):
                        base=(m.group('path')+'.'+m.group('ext')).split('/')[-1].split('\\')[-1]
                        if norm(base) not in mp3_norm:
                            missing.append((p, base, norm(base)))
            walkm(obj)

    # Attach orphans
    attached=0
    if args.attach-orphans and orphans:
        json_files=[p for p,_ in ok]
        for mp3 in orphans:
            base = mp3.stem
            best_file=None;best_score=0.0
            for jf in json_files:
                s = difflib.SequenceMatcher(None, base.lower(), jf.stem.lower()).ratio()
                if s>best_score: best_score=s; best_file=jf
            if best_file and best_score >= args.threshold:
                obj, _ = safe_load(best_file)
                if isinstance(obj, dict) and add_audio_if_missing(obj, mp3.name):
                    backup_once(best_file)
                    best_file.write_text(json.dumps(obj, ensure_ascii=False, indent=2), encoding='utf-8')
                    attached += 1

    # Final report
    print("=== MERCY BLADE DATA INTEGRITY REPORT ===")
    print(f"Valid JSON files : {len(ok)}")
    print(f"Invalid JSON     : {len(bad)}")
    print(f"Total MP3 files  : {len(mp3s)}")
    print(f"Orphan MP3 files : {len(orphans)}")
    print(f"Missing MP3 refs : {len(missing)}")
    if bad:
        print("\n⚠️  Invalid JSONs:")
        for p,e in bad: print(f"  - {p.name}: {e}")
    if orphans:
        print("\n🎧  Orphan MP3s (not referenced):")
        for p in sorted(orphans, key=lambda x:str(x).lower()):
            print(f"  - {p.name}")
    if missing:
        print("\n📄  Missing MP3 references (mentioned but file not found):")
        for j,a,_ in missing: print(f"  - {j.name} → {a}")
    if not bad and not orphans and not missing:
        print("\n✅ All mothers and children accounted for. Harmony restored.")
    print("============================================")
