# English tts-cache Orphan Attribution

Generated: 2026-07-14T08:34:45.975Z
Commit: e30bbe6c9a34223033beff0107f33efbdefbe44d

Input: `reports/audio-census/en-reconcile.json` corrected orphan set. Read-only: no deletion, no synthesis, no bucket listing.

## Method

- Candidate key generation imports `buildAzureTtsCacheReference` from `supabase/functions/mercy-tts/core.ts`.
- Candidate tiers: MR 2702 reconcile classifications, committed audio maps, current speakable source strings, then historical source strings and parent versions.
- Historical `azureProvider.ts` contains no alternate voice names beyond the current resolver map; voice pairs are listed below.

## Summary

| class | files | bytes |
| --- | ---: | ---: |
| matched-current-content | 8 | 144144 |
| matched-stale-content | 0 | 0 |
| unattributed-presumed-dynamic | 49 | 957600 |
| total | 57 | 1101744 |

## Voice Pairs

- de / de-DE-KatjaNeural — current azureVoiceFor(language)
- en / en-US-AvaMultilingualNeural — current azureVoiceFor(language)
- es / es-ES-ElviraNeural — current azureVoiceFor(language)
- fr / fr-FR-DeniseNeural — current azureVoiceFor(language)
- ja / ja-JP-NanamiNeural — current azureVoiceFor(language)
- ko / ko-KR-SunHiNeural — current azureVoiceFor(language)
- vi / vi-VN-HoaiMyNeural — current azureVoiceFor(language)
- zh / zh-CN-XiaoxiaoNeural — current azureVoiceFor(language)

## Matched

| hash | class | lang | voice | text | source | last seen commit |
| --- | --- | --- | --- | --- | --- | --- |
| `07e7e214d1da7153702bbfa45db5d4a21f0cdf706bc87fc4cb3e3c54fd602121` | matched_current_content | vi | vi-VN-HoaiMyNeural | Xin chào | reports/cell-inventory/audio-map-vn-en-a1.json | e30bbe6c9a34223033beff0107f33efbdefbe44d |
| `57b28689f5a595cf42149682c587ed357579ff9815e5df4b7653569c414c4c5f` | matched_current_content | zh | zh-CN-XiaoxiaoNeural | 你早上通常做什么？ | src/lib/tutor/__tests__/tutorCopy.test.ts | e30bbe6c9a34223033beff0107f33efbdefbe44d |
| `585e9f2ec42daa78346d08baf61c06a256ddd42fda1b95075f5c216f2fe80138` | matched_current_content | en | en-US-AvaMultilingualNeural | What do you usually do in the morning? | src/components/ai-tutor/SpeakPracticeMode.tsx | e30bbe6c9a34223033beff0107f33efbdefbe44d |
| `7415828a37df50960ca98f98ce2d50c3b6f06918f4a52e3caa8223914704e8c6` | matched_current_content | ja | ja-JP-NanamiNeural | 朝、たいてい何をしますか？ | src/lib/tutor/languages/ja.ts | e30bbe6c9a34223033beff0107f33efbdefbe44d |
| `9a845ebb725caf7aaecc64bf2c2fe9fe8489e73488387b1d0f48bb42baf66049` | matched_current_content | en | en-US-AvaMultilingualNeural | Xin chào | reports/cell-inventory/audio-map-vn-en-a1.json | e30bbe6c9a34223033beff0107f33efbdefbe44d |
| `9f48c4e2b2148a2c425464e1c8bf105664f471b883b13dbdadb1f8dce4199ace` | matched_current_content | en | en-US-AvaMultilingualNeural | I didn't catch that clearly. Can you say it again? | src/components/ai-tutor/__tests__/SpeakPracticeMode.test.tsx | e30bbe6c9a34223033beff0107f33efbdefbe44d |
| `d58167633ad96ffa138cd379307c511f49e4ee25a6aa35223aafff43ccb8dd35` | matched_current_content | en | en-US-AvaMultilingualNeural | Why do you need the hat? | src/lib/tutor/__tests__/speakFollowups.test.ts | e30bbe6c9a34223033beff0107f33efbdefbe44d |
| `ec83b718658d53205e8287a75dd49df6e3707c0b4f2bff8d6bd4f8db04750eab` | matched_current_content | vi | vi-VN-HoaiMyNeural | Mercy chưa nghe rõ. Bạn nói lại câu đó nhé. I didn't catch that clearly. Can you say it again? | src/lib/teacher-mercy/__tests__/voiceEngine.test.ts | e30bbe6c9a34223033beff0107f33efbdefbe44d |

## Unattributed

| hash | bytes | updated_at |
| --- | ---: | --- |
| `0710cc850604a357672f6d9cbb4f0dbc917214193edf04baed7f3411687f9e75` | 21168 | 2026-06-11T11:26:39.603Z |
| `0843763fa6b573f163f2ded524e44d731d5c6f8923e7481f781a4bf8a48dac6e` | 53424 | 2026-06-11T00:42:05.519Z |
| `11e972b6b0938f3970cf18db7384a65bb0096e3f46fae137b290c25ad1d238e8` | 9648 | 2026-06-12T04:00:00.534Z |
| `1333834a8dfb4bc4cef111a1947cbcd485ce3e216ee660ce76a137abdc310d26` | 27648 | 2026-06-11T01:15:59.215Z |
| `1399a345635ab23a53f2b69f2ae78c6a95fd05376aac3c806070c8dbaeace477` | 15840 | 2026-06-10T22:12:34.870Z |
| `176e57863ed79b816395122aba51d9412068952617878c2d687d29946d4438d1` | 15408 | 2026-06-10T22:15:21.617Z |
| `1a5bba2e34638c5b94a6449a8ceb1225083a7a9f7f34c6d0cb476a8937accd4f` | 9216 | 2026-07-11T00:17:44.401Z |
| `25638dffa5dd566d03395ca4a84b02e0953f11ebc1d2db7126f252772d9cf7a1` | 10800 | 2026-06-12T13:55:45.965Z |
| `26d0ef1cbc71ec231f6c2bca4bcb2392463af761ab81422fa53d38f56419e05c` | 26784 | 2026-06-12T03:32:28.460Z |
| `28dbf940115383b2e31ccdc946d2e1f65c8e725dc906eea671026deb5f709ec6` | 34272 | 2026-06-10T21:52:41.198Z |
| `2e78b8a15205504acc951f731c1a5b073b7cd973d762c956464f00c8852a9016` | 37872 | 2026-07-14T00:05:41.231Z |
| `362085950f0d5f944f10dee520158e92d7bfd0d90970ff6e391296249b91db25` | 5616 | 2026-06-20T10:38:51.698Z |
| `3b0176cde45b71392f29dc747a24b8f04ddc22aba325aa0b0a9944a2ca02f2af` | 28080 | 2026-06-12T13:53:43.383Z |
| `3d4bcff5cc768a4941cbf4b9ae830985c6124b0905e5dd028e13d00d18372221` | 19440 | 2026-06-10T22:17:34.293Z |
| `44feb11e31464ba9fc4e4cdd24683c4b6a19482d4be2addb8ae7667526cf0f09` | 12672 | 2026-06-11T22:14:21.724Z |
| `48628236d1001ee3dd9c11158f9b177729d13c80599afd74e98112dd9b64bc43` | 9360 | 2026-06-11T08:38:23.012Z |
| `4b1d947fac16d40a043d3c747f8fc6e8342f9137b76d0b7144279e0b03cdcd94` | 14688 | 2026-06-11T11:24:49.731Z |
| `5b917f3c5578d5f88a36acebe8882be00460c94edf91e7818182e6895463471f` | 10656 | 2026-06-14T16:13:07.430Z |
| `66c81208d2814500d59b47890516e8c3fcb65eaee2b0f1b60b5f7f72f6c7b957` | 27504 | 2026-06-11T02:26:00.038Z |
| `66e2aec697a0be906ed78bb99195e1d5aee388618ebd7588c156cfadd4fb114d` | 5328 | 2026-06-20T10:38:51.696Z |
| `6a80dd462ff98a27ef07b2006b2a9b2d81d42f8dca363878dc06eb3d063cf13e` | 10368 | 2026-06-10T22:13:08.164Z |
| `6b86cda54fcf84b1e775742be93c0e5ab098acc81210f0bad57bb535293b4106` | 14112 | 2026-06-14T15:26:32.605Z |
| `7d00ab891e7aefd68b04b1c91ae51dbbf8112a62a58fc527dff831b715937ec9` | 35856 | 2026-06-14T16:11:17.704Z |
| `8408ec1f0e17944eb7db72754976fed9d8e2d1087fbb240763e6b996a93da679` | 9648 | 2026-07-12T03:47:57.016Z |
| `85f4604d860c9faff5fbdb8b26ce11e4d5108bada022e8fc1ae509cdee15ac32` | 46656 | 2026-06-11T00:41:53.331Z |
| `887905bab575a20fd782ba91b0c38f82df910d58f2cc9f2b01573216404a278a` | 21024 | 2026-06-10T22:05:01.342Z |
| `8c4d1a147a71e3aa8203a4a32539f75d0db77ed66e17808d5b0a49490afefd65` | 36288 | 2026-06-11T00:33:26.035Z |
| `8d43fdf8f546d1c99f48bee79f55aaf735d5e031c5db353e665e9b3b1fba650f` | 14832 | 2026-06-11T08:36:22.499Z |
| `915026b4e0c444144097df06b2c8a6b533c54345711f2985dbe4e4af98addb0b` | 13680 | 2026-07-12T21:27:44.844Z |
| `94c63ceb4f670611adcc67159f79ce5b5dffad028f7618ea79a7c59104fe7b52` | 17136 | 2026-07-12T11:05:20.996Z |
| `96146ce977e328d2c6a487db7648e7237e5abde79fac55be68b92d1bf19f8a77` | 11232 | 2026-06-11T08:36:31.002Z |
| `975b641c7fb33165c6cdffa346ff97400ea7cf1a43b24b05c5f398fbe86e3aec` | 17568 | 2026-06-10T22:16:35.481Z |
| `9bd0e64cff5100d43020130bc7520cbdca3a883caad700d0fa6253c9fb34ebd5` | 34272 | 2026-06-11T08:33:06.027Z |
| `9c75fc0fb80c105060a8764df2e7dede157485b7e920889fbabe102a0b92b45e` | 36720 | 2026-07-10T13:43:29.686Z |
| `a0380fb3dc41a713e11e42432332353c3a6c031463c56e2cea9ad7b5a937583b` | 9504 | 2026-06-11T08:37:29.313Z |
| `ac2f08cfa5baa47e4156c14a358dec5cd5ce9baf620dd545b05c445c4687c715` | 38448 | 2026-06-11T11:22:54.947Z |
| `b734f3423e9d8bedbaa0ad705ab8c5b523252f3ea1e3b25bd8b64efb934291b4` | 11088 | 2026-06-12T03:34:15.975Z |
| `b7d832806d5ad0ad19d39987258a14adadd3217004e6aa6632d82923275e0f68` | 22752 | 2026-06-12T03:58:53.588Z |
| `bba214cd35426feae98f1dde5c9b1ac5b278dc81a1c698a0724dfb6afd2847a9` | 6768 | 2026-06-11T08:26:03.111Z |
| `dab5ca445b9985a28b3fa09a8147c568cced4ee7e2fc378fe9ce5c9e93282a7f` | 13248 | 2026-06-10T21:53:48.621Z |
| `de21edcdf499e60b4467808a40f4e419eb806ec59cbad1c4e3c0c25f9453ca50` | 8064 | 2026-06-12T15:10:56.614Z |
| `df83094c0b9128bb75ab507e2dfe2b3128fc336d6708a07874dc1d454729d40a` | 11520 | 2026-06-14T16:13:29.960Z |
| `e3e79617f1f89e9affcc20dd23a52a22855c18461499b673dc99a3be67467ea4` | 14688 | 2026-06-10T21:57:23.031Z |
| `e893d08ca40ae3e06909e8b8392871492178fd94703c9845f65262722a45249d` | 22176 | 2026-06-11T11:25:57.056Z |
| `ea2ceb9bc1568a3cd221918230939b3869e23ef9a2b102d3ad616b5c538ecf8b` | 9648 | 2026-06-12T13:55:21.621Z |
| `ee787f90e8517fc1c7fb89c97e9f44119dfbf1f12c7b923b814737c6b776a06b` | 14400 | 2026-06-12T03:35:02.274Z |
| `f4e4e8cc022d462a671569aa30057dc8451d2e6b8c8ef28d6583e4dc8a925c7a` | 18864 | 2026-06-14T16:12:41.079Z |
| `fb955996c6eb505f2d764fd923634913095b5ecfb9da98e37415d8e53a7bba64` | 9360 | 2026-06-11T10:51:08.116Z |
| `fda6eea4a7ace93f29564abd36ba8e58db7ca2bf35560bc1394f51733849dc40` | 32256 | 2026-06-11T02:12:58.901Z |

