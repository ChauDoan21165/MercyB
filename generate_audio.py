# Path: generate_audio.py

import os
import re
import time
import requests

API_KEY = "sk_e7cc66e98d7b3db5932ce4ee16e38cb92f94114c582e570c"
BASE_DIR = "/Users/admin/MercyB/public/images"
VOICE_ID = "DODLEQrClDo8wCz460ld"
MODEL_ID = "eleven_v3"

VOICE_SETTINGS = {
    "stability": 0.55,
    "similarity_boost": 0.85,
    "style": 0.20,
    "use_speaker_boost": True,
}

DELAY_BETWEEN_CALLS = 0.5

PHRASE_OVERRIDES = {
    "i_am_eating_now": "I am eating now",
    "she_is_dancing_now": "She is dancing now",
    "it_is_raining_now": "It is raining now",
    "they_are_playing_now": "They are playing now",
    "the_baby_is_sleeping_now": "The baby is sleeping now",
    "i_will_be_a_doctor": "I will be a doctor",
    "i_woke_up_early": "I woke up early",
    "pho": "Pho noodle soup",
    "banh_mi": "Banh mi",
    "banh mi": "Banh mi",
    "a": "The letter A",
    "b": "The letter B",
    "c": "The letter C",
    "d": "The letter D",
    "e": "The letter E",
    "f": "The letter F",
    "g": "The letter G",
    "h": "The letter H",
    "i": "The letter I",
    "j": "The letter J",
    "k": "The letter K",
    "l": "The letter L",
    "m": "The letter M",
    "n": "The letter N",
    "o": "The letter O",
    "p": "The letter P",
    "q": "The letter Q",
    "r": "The letter R",
    "s": "The letter S",
    "t": "The letter T",
    "u": "The letter U",
    "v": "The letter V",
    "w": "The letter W",
    "x": "The letter X",
    "y": "The letter Y",
    "z": "The letter Z",
}


def filename_to_text(filename: str) -> str:
    name = os.path.splitext(filename)[0]
    name = re.sub(r"^k\d+_\d+_", "", name)

    if name in PHRASE_OVERRIDES:
        return PHRASE_OVERRIDES[name]

    text = name.replace("_", " ").strip()
    if not text:
        return ""

    words = text.split()
    if not words:
        return ""

    lower_words = {
        "a", "an", "the", "and", "or", "but", "in", "on", "at", "to", "for",
        "of", "is", "are", "was", "were", "be", "it", "do", "does", "did",
        "not", "my", "your", "his", "her", "our", "their",
    }

    normalized_words = []
    for index, word in enumerate(words):
        lower = word.lower()

        if lower == "i":
            normalized_words.append("I")
        elif lower == "im":
            normalized_words.append("I'm")
        elif lower == "youre":
            normalized_words.append("you're" if index > 0 else "You're")
        elif lower == "lets":
            normalized_words.append("let's" if index > 0 else "Let's")
        elif lower == "dont":
            normalized_words.append("don't" if index > 0 else "Don't")
        elif lower == "cant":
            normalized_words.append("can't" if index > 0 else "Can't")
        elif lower == "wont":
            normalized_words.append("won't" if index > 0 else "Won't")
        elif index > 0 and lower in lower_words:
            normalized_words.append(lower)
        else:
            normalized_words.append(lower)

    text = " ".join(normalized_words)
    return text[:1].upper() + text[1:]


def generate_audio(text: str, output_path: str, api_key: str) -> bool:
    url = f"https://api.elevenlabs.io/v1/text-to-speech/{VOICE_ID}"

    headers = {
        "Accept": "audio/mpeg",
        "Content-Type": "application/json",
        "xi-api-key": api_key,
    }

    payload = {
        "text": text,
        "model_id": MODEL_ID,
        "voice_settings": VOICE_SETTINGS,
    }

    try:
        response = requests.post(url, json=payload, headers=headers, timeout=30)

        if response.status_code == 200:
            with open(output_path, "wb") as file_handle:
                file_handle.write(response.content)
            return True

        if response.status_code == 401:
            print("\n❌ API key error")
            return False

        if response.status_code == 402:
            print(f"\n❌ Payment or plan error {response.status_code}: {response.text[:200]}")
            return False

        if response.status_code == 429:
            print("\n⏳ Rate limited — waiting 10 seconds...")
            time.sleep(10)

            retry_response = requests.post(
                url,
                json=payload,
                headers=headers,
                timeout=30,
            )
            if retry_response.status_code == 200:
                with open(output_path, "wb") as file_handle:
                    file_handle.write(retry_response.content)
                return True

            print(f"\n❌ Retry failed {retry_response.status_code}: {retry_response.text[:200]}")
            return False

        print(f"\n❌ Error {response.status_code}: {response.text[:200]}")
        return False

    except requests.exceptions.Timeout:
        print(f"\n⏱ Timeout — skipping {output_path}")
        return False
    except Exception as error:
        print(f"\n❌ Exception: {error}")
        return False


def find_all_images(base_dir: str) -> list[tuple[str, str]]:
    all_files: list[tuple[str, str]] = []

    if not os.path.isdir(base_dir):
        return all_files

    for folder_name in sorted(os.listdir(base_dir)):
        folder_path = os.path.join(base_dir, folder_name)

        if not os.path.isdir(folder_path):
            continue

        if not re.match(r"^mercy-kids-page-\d+$", folder_name):
            continue

        for filename in sorted(os.listdir(folder_path)):
            if filename.lower().endswith(".png"):
                all_files.append((folder_path, filename))

    return all_files


def main() -> None:
    all_images = find_all_images(BASE_DIR)

    if not all_images:
        print(f"\n❌ No images found in: {BASE_DIR}")
        return

    total = len(all_images)
    processed = 0
    skipped = 0
    failed = 0
    succeeded = 0

    print("=" * 60)
    print("Mercy Blade Kids — Audio Generator")
    print("Voice ID:", VOICE_ID)
    print("Base dir:", BASE_DIR)
    print("Model:", MODEL_ID)
    print("=" * 60)
    print(f"\nFound {total} images")
    print("Starting audio generation...\n")

    for folder_path, filename in all_images:
        mp3_name = os.path.splitext(filename)[0] + ".mp3"
        mp3_path = os.path.join(folder_path, mp3_name)

        if os.path.exists(mp3_path):
            skipped += 1
            continue

        spoken_text = filename_to_text(filename)
        processed += 1
        pct = int(((processed + skipped) / total) * 100)

        print(
            f'[{pct:3d}%] {filename[:45]:<45} -> "{spoken_text}"',
            end="",
            flush=True,
        )

        success = generate_audio(spoken_text, mp3_path, API_KEY)

        if success:
            succeeded += 1
            size_kb = os.path.getsize(mp3_path) // 1024
            print(f" ✓ {size_kb}KB")
        else:
            failed += 1
            print(" ✗ FAILED")

        time.sleep(DELAY_BETWEEN_CALLS)

    print("\n" + "=" * 60)
    print("COMPLETE")
    print(f"Generated: {succeeded}")
    print(f"Skipped:   {skipped}")
    print(f"Failed:    {failed}")
    print(f"Total:     {total}")
    print("=" * 60)


if __name__ == "__main__":
    main()