#!/usr/bin/env python3
import os, sys, json, time, argparse

try:
    import requests
except ImportError:
    print("ERROR: please run:  pip3 install requests")
    sys.exit(1)

# ── SET YOUR API KEY HERE ──────────────────────────────────
API_KEY = "sk_66e7091eab5bf4473ef4974fb1f9190084675d23ec094f8c"  # set your key here   # ← paste your ElevenLabs key here
# ──────────────────────────────────────────────────────────

VOICE_ID       = "21m00Tcm4TlvDq8ikWAM"
MODEL_ID       = "eleven_v3"
VOICE_SETTINGS = {"stability":0.55,"similarity_boost":0.85,"style":0.15,"use_speaker_boost":True}
DELAY          = 0.7
MAX_CHARS      = 2500


def scan(public_dir):
    data_dir  = os.path.join(public_dir, "data")
    audio_dir = os.path.join(public_dir, "audio")
    os.makedirs(audio_dir, exist_ok=True)
    if not os.path.isdir(data_dir):  print(f"ERROR: no data/ at {data_dir}");  sys.exit(1)
    if not os.path.isdir(audio_dir): print(f"ERROR: no audio/ at {audio_dir}"); sys.exit(1)

    existing   = set(f.lower() for f in os.listdir(audio_dir) if f.lower().endswith(".mp3"))
    json_files = sorted(f for f in os.listdir(data_dir) if f.endswith(".json"))
    print(f"  Existing audio : {len(existing)}")
    print(f"  JSON files     : {len(json_files)}\n")

    missing, seen = [], set()

    for jf in json_files:
        try:
            with open(os.path.join(data_dir, jf), "r", encoding="utf-8") as f:
                data = json.load(f)
        except Exception as e:
            print(f"  SKIP bad JSON: {jf} — {e}"); continue

        for entry in data.get("entries", []):
            raw = entry.get("audio", "")
            audio_files = []
            if isinstance(raw, str):
                audio_files = [x for x in raw.strip().split() if x.endswith(".mp3")]
            elif isinstance(raw, dict):
                for v in raw.values():
                    if isinstance(v, str):
                        audio_files += [x for x in v.strip().split() if x.endswith(".mp3")]
            elif isinstance(raw, list):
                for item in raw:
                    if isinstance(item, str):
                        audio_files += [x for x in item.strip().split() if x.endswith(".mp3")]

            if not audio_files: continue

            copy    = entry.get("copy", {})
            text_en = (copy.get("en","") if isinstance(copy,dict) else str(copy)).strip()
            slug    = entry.get("slug","")

            for fname in audio_files:
                fname = fname.strip()
                if not fname: continue
                # Skip malformed paths with slashes — broken JSON entries
                if '/' in fname or chr(92) in fname:
                    continue
                key = fname.lower()
                if key in seen or key in existing: continue
                seen.add(key)
                missing.append({"filename":fname,"text_en":text_en,"source_json":jf,"slug":slug})

    return missing, audio_dir


def write_report(missing, path):
    with open(path, "w", encoding="utf-8") as f:
        f.write(f"MISSING AUDIO — {time.strftime('%Y-%m-%d %H:%M:%S')} — Total: {len(missing)}\n")
        f.write("="*70+"\n\n")
        for i,item in enumerate(missing,1):
            preview = item["text_en"][:120].replace("\n"," ")
            if len(item["text_en"])>120: preview+="..."
            f.write(f"[{i:04d}] {item['filename']}\n")
            f.write(f"       {item['source_json']}  slug:{item['slug']}\n")
            f.write(f"       {preview}\n\n")
    print(f"  Report : {path}")


def call_api(text, out_path, api_key, retry=True):
    url = f"https://api.elevenlabs.io/v1/text-to-speech/{VOICE_ID}"
    headers = {"Accept":"audio/mpeg","Content-Type":"application/json","xi-api-key":api_key}
    payload = {"text":text,"model_id":MODEL_ID,"voice_settings":VOICE_SETTINGS}
    try:
        r = requests.post(url, json=payload, headers=headers, timeout=60)
        if r.status_code == 200:
            with open(out_path,"wb") as f: f.write(r.content)
            return True
        elif r.status_code == 401:
            print(f"\n  ERROR 401: {r.text[:200]}")
            print("  Your API key is invalid or missing text_to_speech permission.")
            sys.exit(1)
        elif r.status_code == 429:
            print("\n  Rate limited — waiting 20s...", end="", flush=True)
            time.sleep(20)
            return call_api(text, out_path, api_key, retry=False) if retry else False
        else:
            print(f"\n  HTTP {r.status_code}: {r.text[:150]}", end=""); return False
    except Exception as e:
        print(f"\n  Error: {e}", end=""); return False


def generate(missing, audio_dir, api_key):
    total, done, failed, skipped = len(missing), 0, 0, 0
    print(f"\n  Generating {total} files → {audio_dir}\n")
    for i, item in enumerate(missing, 1):
        fname    = item["filename"]
        out_path = os.path.join(audio_dir, fname)
        if os.path.exists(out_path):
            skipped += 1
            print(f"  [{i:04d}/{total}] SKIP : {fname}")
            continue
        text = item["text_en"]
        if not text:
            skipped += 1
            print(f"  [{i:04d}/{total}] SKIP no text : {fname}")
            continue
        if len(text) > MAX_CHARS: text = text[:MAX_CHARS-10]+"..."
        print(f"  [{i:04d}/{total}] {fname} ...", end="", flush=True)
        if call_api(text, out_path, api_key):
            kb = os.path.getsize(out_path)//1024
            print(f" ✓ {kb}KB"); done += 1
        else:
            print(f" ✗ FAILED"); failed += 1
        time.sleep(DELAY)
    print(f"\n{'='*60}")
    print(f"  Generated:{done}  Skipped:{skipped}  Failed:{failed}")
    if failed: print(f"  Re-run to retry {failed} failed files.")
    print(f"{'='*60}")


def main():
    p = argparse.ArgumentParser(description="MercyB missing audio scanner")
    p.add_argument("--public",   required=True, help="Path to public/ folder")
    p.add_argument("--key",      default="",    help="ElevenLabs API key (overrides API_KEY in script)")
    p.add_argument("--generate", action="store_true", help="Generate missing audio")
    args = p.parse_args()

    public_dir = os.path.abspath(args.public)
    print(f"\nMercyB Missing Audio Scanner")
    print(f"Public dir : {public_dir}")
    print("="*60)

    missing, audio_dir = scan(public_dir)

    if not missing:
        print("✅  All audio files present — nothing missing!"); return

    print(f"⚠️  Missing : {len(missing)} files\n")
    write_report(missing, "missing_audio_report.txt")

    # --key argument takes priority, then fall back to API_KEY set at top of file
    api_key = args.key.strip() or API_KEY.strip()

    if api_key:
        generate(missing, audio_dir, api_key)
    else:
        print(f"\n  To generate missing audio, either:")
        print(f"  1. Set API_KEY at the top of this script, then run:")
        print(f"       python3 scan_missing_audio.py --public {public_dir}")
        print(f"  2. Or pass key on command line:")
        print(f"       python3 scan_missing_audio.py --public {public_dir} --key YOUR_KEY")


if __name__ == "__main__":
    main()