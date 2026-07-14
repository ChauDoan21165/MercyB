# Pronunciation Prewarm 2

## Headline

- Target units: 668
- Cached/reference-audio objects HEAD 200 after approved run: 342/668
- Missing after approved run: 326
- Phase-1 overlap excluded: 0
- Stop condition: persistent deployed-function 429 after unit 340; no direct storage writes performed.

## Target Counts

| category | units | HEAD 200 | missing |
| --- | ---: | ---: | ---: |
| speech_drill_sentence | 300 | 169 | 131 |
| ielts_speaking_sample_sentence | 338 | 167 | 171 |
| ielts_listening_script | 30 | 6 | 24 |

## Sample Gate

Approved by Chau after these deployed-function cache URLs were produced:

1. https://buemdfxyhxunzpgdoqin.supabase.co/storage/v1/object/public/room-audio/tts-cache/1a1c5baea30dbb9a356a19297caff083691c8fa0a237da5436f53211de618a28.mp3
2. https://buemdfxyhxunzpgdoqin.supabase.co/storage/v1/object/public/room-audio/tts-cache/fa14c92c2dd75d6882f8b5bf382bc0dbfc48b49ec262892798a3856488acc437.mp3
3. https://buemdfxyhxunzpgdoqin.supabase.co/storage/v1/object/public/room-audio/tts-cache/337d1f850302877e65acbbbb7f8b016dd036417ecf81f65964079d49d5b39232.mp3
4. https://buemdfxyhxunzpgdoqin.supabase.co/storage/v1/object/public/room-audio/tts-cache/b0c53c6ee6ca08868caae18bfd86a65ad904dab5cc4434da0d77001f95b8d8f2.mp3
5. https://buemdfxyhxunzpgdoqin.supabase.co/storage/v1/object/public/room-audio/tts-cache/68964ed483acb03ccf3a8b7a13351b00feadc66859d7edb1ef283429a0cf2f2d.mp3

## Cap Finding

The approved run warmed successfully until the first persistent cap response. Unit 340 (`speech_drill_sentence`, source index 607) returned five consecutive `429` responses and still HEAD-checked missing. A follow-up deployed-function probe against the first missing unit also returned:

```json
{
  "status": 429,
  "ok": false,
  "body": {
    "error": "Daily TTS limit reached globally",
    "code": "cap_global"
  }
}
```

The run stopped there to avoid spending roughly one minute per remaining miss against a persistent cap. This report is therefore a partial warmup artifact, not the final all-cached artifact.

## Verification

Expected keys were recomputed with `buildAzureTtsCacheReference` from `supabase/functions/mercy-tts/core.ts`, then every public `room-audio` object was HEAD-checked. The warmup path used only deployed `mercy-tts` POSTs; no direct storage writes were performed.

## Missing Units

1. ordinal 340, index 607, speech_drill_sentence, status 400, https://buemdfxyhxunzpgdoqin.supabase.co/storage/v1/object/public/room-audio/tts-cache/73538ecd1f1639c6aeba3e959bf4f38ab6dd347273dd7c1094d211b08453014e.mp3
2. ordinal 341, index 608, ielts_speaking_sample_sentence, status 400, https://buemdfxyhxunzpgdoqin.supabase.co/storage/v1/object/public/room-audio/tts-cache/6b6c213ca90ea8d310767c732f1f8b1c81701038901b34d3a533f02464b8ab55.mp3
3. ordinal 342, index 609, ielts_speaking_sample_sentence, status 400, https://buemdfxyhxunzpgdoqin.supabase.co/storage/v1/object/public/room-audio/tts-cache/e0671eaa056537dca8d0e8b316fd92ce5eaa19bd0fabc058b8e7ef7f0be66df3.mp3
4. ordinal 343, index 610, ielts_speaking_sample_sentence, status 400, https://buemdfxyhxunzpgdoqin.supabase.co/storage/v1/object/public/room-audio/tts-cache/36d4984749468dbe1123ea1969d425ff69c90c381c70e1a4f19d6f174eb1e9e6.mp3
5. ordinal 344, index 611, speech_drill_sentence, status 400, https://buemdfxyhxunzpgdoqin.supabase.co/storage/v1/object/public/room-audio/tts-cache/ec38a669f0be66a33fb041e7ac8e242fbb850f767b4c498175cc48a40573a92c.mp3
6. ordinal 345, index 612, speech_drill_sentence, status 400, https://buemdfxyhxunzpgdoqin.supabase.co/storage/v1/object/public/room-audio/tts-cache/dd8b1325357070c29d3b71fe8eda0ec49cbfea0b17da71cacbe3f413d397dd6e.mp3
7. ordinal 346, index 613, ielts_speaking_sample_sentence, status 400, https://buemdfxyhxunzpgdoqin.supabase.co/storage/v1/object/public/room-audio/tts-cache/acf44021fb2592bfd2127b2f40229c4d7aca6145fe8390afa76f9e2bfc6a3932.mp3
8. ordinal 347, index 614, ielts_speaking_sample_sentence, status 400, https://buemdfxyhxunzpgdoqin.supabase.co/storage/v1/object/public/room-audio/tts-cache/ddc43360a0a84fd341f9596d99bcd76cca7d3f8265a9c941971cef0305622e95.mp3
9. ordinal 348, index 615, ielts_speaking_sample_sentence, status 400, https://buemdfxyhxunzpgdoqin.supabase.co/storage/v1/object/public/room-audio/tts-cache/3fa40edb6874a29e762f409fb43722b778945ab0d278431c5d99602db4121b61.mp3
10. ordinal 349, index 616, ielts_speaking_sample_sentence, status 400, https://buemdfxyhxunzpgdoqin.supabase.co/storage/v1/object/public/room-audio/tts-cache/777d1e762ef5d52312e5ea5eaa18ff96e17c24491fd6d36944a7a2fe32537808.mp3
11. ordinal 350, index 617, speech_drill_sentence, status 400, https://buemdfxyhxunzpgdoqin.supabase.co/storage/v1/object/public/room-audio/tts-cache/50829aebbfc423534eab8c1984512306e5a99f244d4e6758b4fffb6a52cc4faf.mp3
12. ordinal 351, index 618, ielts_speaking_sample_sentence, status 400, https://buemdfxyhxunzpgdoqin.supabase.co/storage/v1/object/public/room-audio/tts-cache/6219058f5a199e47b27f82e54a73f2b5b7648584b0383418c42acda2f6d4f66c.mp3
13. ordinal 352, index 619, ielts_speaking_sample_sentence, status 400, https://buemdfxyhxunzpgdoqin.supabase.co/storage/v1/object/public/room-audio/tts-cache/0388f4bb61853a4a35a8f3095eb66b5256ef5a25893b070bdaeba8a52dc503f1.mp3
14. ordinal 353, index 620, speech_drill_sentence, status 400, https://buemdfxyhxunzpgdoqin.supabase.co/storage/v1/object/public/room-audio/tts-cache/d469a4a75c94790ab068b79b487f69b81bf085091781dee189e2265fd6d703cd.mp3
15. ordinal 354, index 621, ielts_speaking_sample_sentence, status 400, https://buemdfxyhxunzpgdoqin.supabase.co/storage/v1/object/public/room-audio/tts-cache/f9deb2ce0bdd0168fa5a2b88e1504dba4f88546afbe5b57eee8c75f431a529a7.mp3
16. ordinal 355, index 622, ielts_speaking_sample_sentence, status 400, https://buemdfxyhxunzpgdoqin.supabase.co/storage/v1/object/public/room-audio/tts-cache/2c4faf8fe6b07d02e6ead12bcfb3dbd18d2d4d908c76512323f52276e9f164d3.mp3
17. ordinal 356, index 623, ielts_speaking_sample_sentence, status 400, https://buemdfxyhxunzpgdoqin.supabase.co/storage/v1/object/public/room-audio/tts-cache/3b2b5d094500afc434c6a4042c658156976c5337b6a848d06ba31824cadb79b7.mp3
18. ordinal 357, index 624, ielts_speaking_sample_sentence, status 400, https://buemdfxyhxunzpgdoqin.supabase.co/storage/v1/object/public/room-audio/tts-cache/9453932aa4799b7c8a878056a2839328acae060c8abcf8fa101648eab2d3453b.mp3
19. ordinal 358, index 625, ielts_speaking_sample_sentence, status 400, https://buemdfxyhxunzpgdoqin.supabase.co/storage/v1/object/public/room-audio/tts-cache/37ee260f6ea13575febd4dc60f5ed442c5b44f5b0f301b8dc8e7099de000dca6.mp3
20. ordinal 359, index 626, ielts_speaking_sample_sentence, status 400, https://buemdfxyhxunzpgdoqin.supabase.co/storage/v1/object/public/room-audio/tts-cache/ef4a5de86b541d2670f2c5e3bfa289acfc7e76b93465eaa12399530f2f64afd9.mp3
21. ordinal 360, index 627, ielts_speaking_sample_sentence, status 400, https://buemdfxyhxunzpgdoqin.supabase.co/storage/v1/object/public/room-audio/tts-cache/4416bfeda0474f13acc748de3719a117d141bbc30ce12df4cf95ff6c0f7d33d9.mp3
22. ordinal 361, index 630, ielts_speaking_sample_sentence, status 400, https://buemdfxyhxunzpgdoqin.supabase.co/storage/v1/object/public/room-audio/tts-cache/1582301dc4819e1bdeb308823692d106747445e4a7203010ad10fe8a49edce3a.mp3
23. ordinal 362, index 636, speech_drill_sentence, status 400, https://buemdfxyhxunzpgdoqin.supabase.co/storage/v1/object/public/room-audio/tts-cache/073f569c244ff835096a181770c1722060eb2a791c86aaa4e3665569ba394c25.mp3
24. ordinal 363, index 641, speech_drill_sentence, status 400, https://buemdfxyhxunzpgdoqin.supabase.co/storage/v1/object/public/room-audio/tts-cache/eb884a6a6d849c9cdb05c5eed5388382fe2bb113d88de53d87377a9ef4bd3871.mp3
25. ordinal 364, index 648, speech_drill_sentence, status 400, https://buemdfxyhxunzpgdoqin.supabase.co/storage/v1/object/public/room-audio/tts-cache/1cb672e8a34bdd738a59713db291c439e5875d6bd1082f6f3a6338df79943cd1.mp3
26. ordinal 365, index 649, ielts_speaking_sample_sentence, status 400, https://buemdfxyhxunzpgdoqin.supabase.co/storage/v1/object/public/room-audio/tts-cache/b07ff2db995c144f6e0f9202228363e1ef6967ee391016db98824b18ae00a7ae.mp3
27. ordinal 366, index 653, ielts_listening_script, status 400, https://buemdfxyhxunzpgdoqin.supabase.co/storage/v1/object/public/room-audio/tts-cache/8a50b39de122fa8400440ca2708984198a31e3d635609a93d8db3a7ae86e0cd5.mp3
28. ordinal 367, index 659, speech_drill_sentence, status 400, https://buemdfxyhxunzpgdoqin.supabase.co/storage/v1/object/public/room-audio/tts-cache/0f9f3631540f180959f93986b153366cc4c7d5ca0ca7c9b3ebea7765281da3aa.mp3
29. ordinal 368, index 660, speech_drill_sentence, status 400, https://buemdfxyhxunzpgdoqin.supabase.co/storage/v1/object/public/room-audio/tts-cache/ea347a6cd2d96bbf46bac53c7e5a592b092a100e1f41282714870f4fb7801d7e.mp3
30. ordinal 369, index 661, speech_drill_sentence, status 400, https://buemdfxyhxunzpgdoqin.supabase.co/storage/v1/object/public/room-audio/tts-cache/41dbe80c12285bee98ce736a6296fa21bd6ebc1cb2acf3d09bd41b5bdb36b4f3.mp3
31. ordinal 370, index 662, speech_drill_sentence, status 400, https://buemdfxyhxunzpgdoqin.supabase.co/storage/v1/object/public/room-audio/tts-cache/14bde2fd9103e8cc85ee28c6f3086e32d36a179c0b2f2d90331bdb36058accfe.mp3
32. ordinal 371, index 665, ielts_listening_script, status 400, https://buemdfxyhxunzpgdoqin.supabase.co/storage/v1/object/public/room-audio/tts-cache/216326d4c6b751b94225b2cafb04167690b430baff3d36aabe780e47aa0617e3.mp3
33. ordinal 372, index 671, ielts_speaking_sample_sentence, status 400, https://buemdfxyhxunzpgdoqin.supabase.co/storage/v1/object/public/room-audio/tts-cache/35d989744afed0d1d9ed9aa9c8469ef37d3630b011d2de6505ce19c9df1caa71.mp3
34. ordinal 373, index 674, ielts_listening_script, status 400, https://buemdfxyhxunzpgdoqin.supabase.co/storage/v1/object/public/room-audio/tts-cache/850aa3d6612d9e34f393374bce3a74323705e76a64f12d10713bcfbedff47bd9.mp3
35. ordinal 374, index 683, ielts_speaking_sample_sentence, status 400, https://buemdfxyhxunzpgdoqin.supabase.co/storage/v1/object/public/room-audio/tts-cache/73e3ab8139619885476a7be6e0a4d65554af05c05438c73deb2708013910c22c.mp3
36. ordinal 375, index 692, speech_drill_sentence, status 400, https://buemdfxyhxunzpgdoqin.supabase.co/storage/v1/object/public/room-audio/tts-cache/d7d0c7f6e7e4249c6379a0ebc89a056d71482533fdce62ee79f4efd60717e219.mp3
37. ordinal 376, index 693, ielts_speaking_sample_sentence, status 400, https://buemdfxyhxunzpgdoqin.supabase.co/storage/v1/object/public/room-audio/tts-cache/748ad16d219b36706d2e0907e180b37f9120426325a1eea2f8ea7734772bdcbf.mp3
38. ordinal 377, index 694, ielts_speaking_sample_sentence, status 400, https://buemdfxyhxunzpgdoqin.supabase.co/storage/v1/object/public/room-audio/tts-cache/24e4e2626a1b89a36460170e3b445f352efcef7c0ecd8dbffd495e1858ccef15.mp3
39. ordinal 378, index 695, ielts_speaking_sample_sentence, status 400, https://buemdfxyhxunzpgdoqin.supabase.co/storage/v1/object/public/room-audio/tts-cache/873d766d302cf3257c67f7a45743620babf07004cedb33c5d792f78977dcdddf.mp3
40. ordinal 379, index 696, ielts_speaking_sample_sentence, status 400, https://buemdfxyhxunzpgdoqin.supabase.co/storage/v1/object/public/room-audio/tts-cache/fe60982040dcf13972099cb8877dd870c99f1e5a789eb68c718b77935f5709bc.mp3
41. ordinal 380, index 697, ielts_speaking_sample_sentence, status 400, https://buemdfxyhxunzpgdoqin.supabase.co/storage/v1/object/public/room-audio/tts-cache/cbb31a4410b60b156ea46f8ebac50472d8207c67ff924c21eae655a52b04e142.mp3
42. ordinal 381, index 698, ielts_speaking_sample_sentence, status 400, https://buemdfxyhxunzpgdoqin.supabase.co/storage/v1/object/public/room-audio/tts-cache/780313b88d431ec8f862cbf2a2cf10dca30e5029dd3f2cc40e209f6fcb8b8c58.mp3
43. ordinal 382, index 699, ielts_speaking_sample_sentence, status 400, https://buemdfxyhxunzpgdoqin.supabase.co/storage/v1/object/public/room-audio/tts-cache/24d6ea3c65ee3b2fe3945c9c976a8e718a498c213f18c1830dfcd7bfc2371700.mp3
44. ordinal 383, index 703, ielts_speaking_sample_sentence, status 400, https://buemdfxyhxunzpgdoqin.supabase.co/storage/v1/object/public/room-audio/tts-cache/b06e82369ce03de0f3045354da624283f628fced39488d548fe84c1c9047fd82.mp3
45. ordinal 384, index 707, ielts_speaking_sample_sentence, status 400, https://buemdfxyhxunzpgdoqin.supabase.co/storage/v1/object/public/room-audio/tts-cache/fa69ce6fd9e49bad67a7b33f1e95678f1ba372644f0b853e769fc297feabb158.mp3
46. ordinal 385, index 714, ielts_speaking_sample_sentence, status 400, https://buemdfxyhxunzpgdoqin.supabase.co/storage/v1/object/public/room-audio/tts-cache/31a6a2f875273d886f2506e2e2fde131bc91daf50d40af06ce9ac4c023ec3e64.mp3
47. ordinal 386, index 716, speech_drill_sentence, status 400, https://buemdfxyhxunzpgdoqin.supabase.co/storage/v1/object/public/room-audio/tts-cache/01d1f080cc936158db267ac18ab8df59201dcd65f20ba288bf6141ccb21580a2.mp3
48. ordinal 387, index 717, ielts_speaking_sample_sentence, status 400, https://buemdfxyhxunzpgdoqin.supabase.co/storage/v1/object/public/room-audio/tts-cache/ac5eb30388b308c9202b08381b47247838e447c0d39ec49c239b450b2a70509c.mp3
49. ordinal 388, index 721, ielts_speaking_sample_sentence, status 400, https://buemdfxyhxunzpgdoqin.supabase.co/storage/v1/object/public/room-audio/tts-cache/73ad7481540e219e88bdf8825de9ab89ae8d8a68fc5b8e36477599be929e9c4c.mp3
50. ordinal 389, index 722, speech_drill_sentence, status 400, https://buemdfxyhxunzpgdoqin.supabase.co/storage/v1/object/public/room-audio/tts-cache/98850ae2cd8e94d9ac25654673e113827dbc5804d21b46b3f6152c80c1a391dd.mp3

_First 50 shown; full missing list is in pronun-prewarm-2.json._

