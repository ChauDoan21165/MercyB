# A34 Native Permission Audit

Date: 2026-05-20
Scope: static native-config patch only.

## Result

| Platform | Permission | Status | Evidence |
|---|---|---|---|
| iOS | `NSMicrophoneUsageDescription` | Present | `ios/App/App/Info.plist` |
| iOS | `NSSpeechRecognitionUsageDescription` | Present | `ios/App/App/Info.plist` |
| Android | `android.permission.RECORD_AUDIO` | Added | `android/app/src/main/AndroidManifest.xml` |
| Android 13+ | Nearby devices / media permissions | Not needed for this patch | Microphone-only recording does not require `BLUETOOTH_*`, `NEARBY_WIFI_DEVICES`, `READ_MEDIA_AUDIO`, or `READ_EXTERNAL_STORAGE` unless a future implementation records through Bluetooth-device discovery or reads saved audio from shared media storage. |

## iOS Copy Verified

`NSMicrophoneUsageDescription`:

> MercyBlade cần truy cập micro để giúp bạn luyện phát âm tiếng Anh. / MercyBlade needs microphone access to help you practice English pronunciation.

`NSSpeechRecognitionUsageDescription`:

> MercyBlade dùng nhận dạng giọng nói để chấm điểm phát âm cho bạn. / MercyBlade uses speech recognition to score your pronunciation.

## Android Permission Fix

Added:

```xml
<uses-permission android:name="android.permission.RECORD_AUDIO" />
```

No Android 13+ media permission was added. Runtime microphone capture requires `RECORD_AUDIO`; media-library permissions are for reading shared media files and are not part of a direct microphone recording flow.

## Runtime Validation Status

Runtime validation blocked by missing Azure/Supabase env vars.

Missing in the available shell:

- `AZURE_SPEECH_KEY`
- `AZURE_SPEECH_REGION`
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`

No native speaking success, Azure scoring success, screenshot, or audio evidence is claimed by this patch.
