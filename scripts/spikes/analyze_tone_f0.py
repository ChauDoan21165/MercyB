#!/usr/bin/env python3
"""Local F0 spike for Vietnamese tone fixtures.

Uses only ffmpeg + Python stdlib so the spike can run without installing
audio packages. The pitch estimator is a Web Audio-compatible normalized
autocorrelation over short frames.
"""

from __future__ import annotations

import json
import math
import statistics
import subprocess
import tempfile
import wave
from dataclasses import dataclass
from pathlib import Path


ROOT = Path(__file__).resolve().parents[2]
FIXTURE_DIR = ROOT / "public" / "audio" / "tones"
OUT = ROOT / "docs" / "axis-2" / "spike-results.md"
SAMPLE_RATE = 16_000
FRAME_MS = 40
HOP_MS = 10
MIN_F0 = 75
MAX_F0 = 500
CORR_THRESHOLD = 0.45


TONE_BY_MARK = {
    "à": "huyen",
    "ằ": "huyen",
    "ầ": "huyen",
    "è": "huyen",
    "ề": "huyen",
    "ì": "huyen",
    "ò": "huyen",
    "ồ": "huyen",
    "ờ": "huyen",
    "ù": "huyen",
    "ừ": "huyen",
    "ỳ": "huyen",
    "á": "sac",
    "ắ": "sac",
    "ấ": "sac",
    "é": "sac",
    "ế": "sac",
    "í": "sac",
    "ó": "sac",
    "ố": "sac",
    "ớ": "sac",
    "ú": "sac",
    "ứ": "sac",
    "ý": "sac",
    "ả": "hoi",
    "ẳ": "hoi",
    "ẩ": "hoi",
    "ẻ": "hoi",
    "ể": "hoi",
    "ỉ": "hoi",
    "ỏ": "hoi",
    "ổ": "hoi",
    "ở": "hoi",
    "ủ": "hoi",
    "ử": "hoi",
    "ỷ": "hoi",
    "ã": "nga",
    "ẵ": "nga",
    "ẫ": "nga",
    "ẽ": "nga",
    "ễ": "nga",
    "ĩ": "nga",
    "õ": "nga",
    "ỗ": "nga",
    "ỡ": "nga",
    "ũ": "nga",
    "ữ": "nga",
    "ỹ": "nga",
    "ạ": "nang",
    "ặ": "nang",
    "ậ": "nang",
    "ẹ": "nang",
    "ệ": "nang",
    "ị": "nang",
    "ọ": "nang",
    "ộ": "nang",
    "ợ": "nang",
    "ụ": "nang",
    "ự": "nang",
    "ỵ": "nang",
}


@dataclass
class FixtureResult:
    file: str
    syllable: str
    tone: str
    duration_ms: int
    frames: int
    voiced_frames: int
    median_f0: float
    start_f0: float
    mid_f0: float
    end_f0: float
    slope_semitones: float
    range_semitones: float
    contour: list[float]
    normalized_contour: list[float]


def tone_for(syllable: str) -> str:
    for char in syllable:
        if char in TONE_BY_MARK:
            return TONE_BY_MARK[char]
    return "ngang"


def decode_mp3(path: Path) -> tuple[list[float], int]:
    with tempfile.NamedTemporaryFile(suffix=".wav") as tmp:
        subprocess.run(
            [
                "ffmpeg",
                "-v",
                "error",
                "-y",
                "-i",
                str(path),
                "-ac",
                "1",
                "-ar",
                str(SAMPLE_RATE),
                "-f",
                "wav",
                tmp.name,
            ],
            check=True,
        )
        with wave.open(tmp.name, "rb") as wav:
            raw = wav.readframes(wav.getnframes())
            sample_width = wav.getsampwidth()
            if sample_width != 2:
                raise RuntimeError(f"expected 16-bit PCM for {path}")
            samples = [
                int.from_bytes(raw[i : i + 2], "little", signed=True) / 32768.0
                for i in range(0, len(raw), 2)
            ]
            return samples, wav.getframerate()


def rms(frame: list[float]) -> float:
    return math.sqrt(sum(x * x for x in frame) / max(1, len(frame)))


def estimate_f0(frame: list[float], sample_rate: int) -> tuple[float | None, float]:
    mean = sum(frame) / len(frame)
    centered = [x - mean for x in frame]
    energy = sum(x * x for x in centered)
    if energy <= 1e-9:
        return None, 0.0

    min_lag = int(sample_rate / MAX_F0)
    max_lag = int(sample_rate / MIN_F0)
    best_lag = 0
    best_corr = -1.0
    for lag in range(min_lag, max_lag + 1):
        a = centered[:-lag]
        b = centered[lag:]
        denom = math.sqrt(sum(x * x for x in a) * sum(y * y for y in b))
        if denom <= 1e-9:
            continue
        corr = sum(x * y for x, y in zip(a, b)) / denom
        if corr > best_corr:
            best_corr = corr
            best_lag = lag

    if best_lag == 0 or best_corr < CORR_THRESHOLD:
        return None, best_corr
    return sample_rate / best_lag, best_corr


def percentile(values: list[float], p: float) -> float:
    if not values:
        return 0.0
    ordered = sorted(values)
    idx = min(len(ordered) - 1, max(0, round((len(ordered) - 1) * p)))
    return ordered[idx]


def resample(values: list[float], size: int = 12) -> list[float]:
    if not values:
        return []
    if len(values) == 1:
        return [values[0]] * size
    out: list[float] = []
    for i in range(size):
        pos = i * (len(values) - 1) / (size - 1)
        left = int(math.floor(pos))
        right = int(math.ceil(pos))
        if left == right:
            out.append(values[left])
        else:
            frac = pos - left
            out.append(values[left] * (1 - frac) + values[right] * frac)
    return out


def semitone_delta(a: float, b: float) -> float:
    if a <= 0 or b <= 0:
        return 0.0
    return 12 * math.log2(b / a)


def analyze_fixture(path: Path) -> FixtureResult:
    samples, sample_rate = decode_mp3(path)
    frame_size = int(sample_rate * FRAME_MS / 1000)
    hop = int(sample_rate * HOP_MS / 1000)
    frame_rms = [rms(samples[i : i + frame_size]) for i in range(0, len(samples) - frame_size, hop)]
    energy_cutoff = max(0.01, percentile(frame_rms, 0.70) * 0.30)
    f0s: list[float] = []

    for i in range(0, len(samples) - frame_size, hop):
        frame = samples[i : i + frame_size]
        if rms(frame) < energy_cutoff:
            continue
        f0, _corr = estimate_f0(frame, sample_rate)
        if f0 is not None:
            f0s.append(f0)

    if len(f0s) < 3:
        contour = f0s
    else:
        contour = []
        for idx in range(len(f0s)):
            lo = max(0, idx - 1)
            hi = min(len(f0s), idx + 2)
            contour.append(statistics.median(f0s[lo:hi]))

    compact = resample(contour, 12)
    median_f0 = statistics.median(contour) if contour else 0.0
    normalized = [semitone_delta(median_f0, x) for x in compact] if median_f0 else []
    start = statistics.mean(compact[:3]) if compact else 0.0
    mid = statistics.mean(compact[4:8]) if compact else 0.0
    end = statistics.mean(compact[-3:]) if compact else 0.0
    rng = semitone_delta(min(compact), max(compact)) if compact else 0.0
    return FixtureResult(
        file=str(path.relative_to(ROOT)),
        syllable=path.stem,
        tone=tone_for(path.stem),
        duration_ms=round(len(samples) / sample_rate * 1000),
        frames=len(frame_rms),
        voiced_frames=len(contour),
        median_f0=median_f0,
        start_f0=start,
        mid_f0=mid,
        end_f0=end,
        slope_semitones=semitone_delta(start, end),
        range_semitones=rng,
        contour=[round(x, 1) for x in compact],
        normalized_contour=[round(x, 2) for x in normalized],
    )


def vector_distance(a: list[float], b: list[float]) -> float:
    if not a or not b:
        return 0.0
    n = min(len(a), len(b))
    return math.sqrt(sum((a[i] - b[i]) ** 2 for i in range(n)) / n)


def mean_vector(vectors: list[list[float]]) -> list[float]:
    if not vectors:
        return []
    n = min(len(v) for v in vectors)
    return [sum(v[i] for v in vectors) / len(vectors) for i in range(n)]


def tone_profiles(results: list[FixtureResult]) -> dict[str, dict[str, object]]:
    profiles: dict[str, dict[str, object]] = {}
    for tone in sorted({r.tone for r in results}):
        members = [r for r in results if r.tone == tone]
        profiles[tone] = {
            "count": len(members),
            "fixtures": [m.syllable for m in members],
            "median_f0": statistics.median([m.median_f0 for m in members if m.median_f0]),
            "mean_slope_st": statistics.mean([m.slope_semitones for m in members]),
            "mean_range_st": statistics.mean([m.range_semitones for m in members]),
            "mean_norm_contour": mean_vector([m.normalized_contour for m in members if m.normalized_contour]),
        }
    return profiles


def matrix(profiles: dict[str, dict[str, object]]) -> dict[str, dict[str, float]]:
    tones = sorted(profiles)
    out: dict[str, dict[str, float]] = {}
    for tone_a in tones:
        out[tone_a] = {}
        for tone_b in tones:
            out[tone_a][tone_b] = round(
                vector_distance(
                    profiles[tone_a]["mean_norm_contour"],  # type: ignore[arg-type]
                    profiles[tone_b]["mean_norm_contour"],  # type: ignore[arg-type]
                ),
                2,
            )
    return out


def md_table(headers: list[str], rows: list[list[object]]) -> str:
    lines = ["| " + " | ".join(headers) + " |", "| " + " | ".join(["---"] * len(headers)) + " |"]
    for row in rows:
        lines.append("| " + " | ".join(str(x) for x in row) + " |")
    return "\n".join(lines)


def write_report(results: list[FixtureResult]) -> None:
    profiles = tone_profiles(results)
    distances = matrix(profiles)
    tones = sorted(profiles)
    fixture_rows = [
        [
            r.syllable,
            r.tone,
            r.duration_ms,
            r.voiced_frames,
            f"{r.median_f0:.1f}",
            f"{r.slope_semitones:+.2f}",
            f"{r.range_semitones:.2f}",
            json.dumps(r.contour, ensure_ascii=False),
        ]
        for r in results
    ]
    profile_rows = [
        [
            tone,
            ", ".join(profiles[tone]["fixtures"]),  # type: ignore[arg-type]
            f"{profiles[tone]['median_f0']:.1f}",
            f"{profiles[tone]['mean_slope_st']:+.2f}",
            f"{profiles[tone]['mean_range_st']:.2f}",
            json.dumps([round(x, 2) for x in profiles[tone]["mean_norm_contour"]], ensure_ascii=False),  # type: ignore[index]
        ]
        for tone in tones
    ]
    matrix_rows = [[tone] + [distances[tone][other] for other in tones] for tone in tones]

    four_tone_cluster = ["ngang", "huyen", "sac", "nang"]
    min_four = min(
        distances[a][b]
        for idx, a in enumerate(four_tone_cluster)
        for b in four_tone_cluster[idx + 1 :]
        if a in distances and b in distances[a]
    )
    nga_nang_distance = distances.get("nga", {}).get("nang", 0.0)
    hoi_nga_distance = distances.get("hoi", {}).get("nga", 0.0)
    viable = min_four >= 0.9 and nga_nang_distance >= 0.7

    text = f"""# Bar #2 Option B F0 Spike

## Method

- Input fixtures: MP3 files in `public/audio/tones/`.
- Decode path: `ffmpeg` converts each fixture to mono 16 kHz 16-bit PCM WAV in a temp file.
- F0 estimator: Web Audio-compatible normalized autocorrelation on 40 ms frames with 10 ms hop, 75-500 Hz search range, and correlation threshold `{CORR_THRESHOLD}`.
- Silence handling: dynamic RMS gate per fixture; only voiced frames enter the contour.
- Contour comparison: each voiced contour is median-smoothed, resampled to 12 points, normalized around its own median F0 in semitones, then averaged per tone.
- Distance matrix: root-mean-square distance between tone-level normalized contour vectors, in semitone units.

This is a local spike, not production code. Absolute F0 depends on the fixture voice; the decision uses normalized contour shape and relative tone separability.

## Fixtures Analyzed

{md_table(["fixture", "tone", "duration_ms", "voiced_frames", "median_f0_hz", "slope_st", "range_st", "f0_contour_hz_12pt"], fixture_rows)}

## Tone Contour Summaries

{md_table(["tone", "fixtures", "median_f0_hz", "mean_slope_st", "mean_range_st", "mean_normalized_contour_st"], profile_rows)}

## Pairwise Distance Matrix

{md_table(["tone"] + tones, matrix_rows)}

## Empirical Findings

- Four-tone separation (`ngang`, `huyen`, `sac`, `nang`): minimum pairwise distance = `{min_four:.2f}` semitone RMS.
- `ngã` / `nặng` reachability: distance = `{nga_nang_distance:.2f}` semitone RMS.
- `hỏi` / `ngã` separation: distance = `{hoi_nga_distance:.2f}` semitone RMS.
- `ngã` has only one fixture (`mã`), and `hỏi` has only one fixture (`mả`), so those conclusions are low-confidence.
- The fixture set is TTS-like and clean; this does not prove learner microphone scoring will be stable.

## Pass/Fail Conclusion

- Four tones separate cleanly enough for a prototype: **{'PASS' if min_four >= 0.9 else 'FAIL'}**.
- `ngã`/`nặng` are reachable from the fixture contours: **{'PASS' if nga_nang_distance >= 0.7 else 'FAIL'}**.
- Option B viable as designed: **{'YES' if viable else 'NO'}**, for fixture-based listen/compare or guided prototype scoring only.

## Recommendation for Bar #2 Option B

{'PR-b can ship only as a guarded prototype if it keeps this F0-contour approach local, transparent, and non-authoritative. Do not claim full tone-production grading yet; require more human-recorded fixtures and device-microphone tests before learner scoring is treated as reliable.' if viable else 'Option B needs redesign before PR-b. The current fixtures do not provide enough contour separation for the proposed scoring approach.'}
"""
    OUT.write_text(text, encoding="utf-8")


def main() -> None:
    fixtures = sorted(FIXTURE_DIR.glob("*.mp3"))
    if len(fixtures) != 18:
        raise SystemExit(f"expected 18 fixtures in {FIXTURE_DIR}, found {len(fixtures)}")
    results = [analyze_fixture(path) for path in fixtures]
    write_report(results)
    print(f"wrote {OUT.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
