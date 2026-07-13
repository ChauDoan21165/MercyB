# IPA EN Map: Vietnamese->English A1

Source inventory: `reports/cell-inventory/vn-en-a1-inventory.json`

CMUdict source: https://raw.githubusercontent.com/cmusphinx/cmudict/master/cmudict.dict

Vendored dictionary: `scripts/data/cmudict.dict`

Vendored dictionary sha256: `81917843c7f44ce2b094ac63873c2c7a4cf802040792c455ba3ca406891c3d22`

Convention: this generator emits citation-form dictionary IPA from CMUdict. ARPABET stress digits `1` and `2` become `ˈ` and `ˌ`, placed immediately before the stressed vowel phone. Stress digit `0` is unstressed; `AH0` is rendered `ə` and `ER0` is rendered `ɚ`. Connected-speech phenomena, reductions across word boundaries, linking, flapping, and accent-specific alternates are out of scope.

Honesty rules: out-of-vocabulary words receive no fabricated IPA; their utterance is marked `partial` with the OOV words listed. CMUdict homographs/multiple pronunciations use the first listed variant deterministically.

## Headline

| Metric | Count |
| --- | ---: |
| Total cells | 627 |
| Complete cells | 610 |
| Partial cells | 17 |
| Distinct OOV words | 5 |
| Unique multi-pronunciation words affected | 127 |
| Cell word instances using first-variant multi-pronunciation entries | 1379 |

## OOV Words

`kh`, `otp`, `stomachache`, `wi`, `xem`

## Fixture Words

| Word | IPA | CMUdict ARPABET |
| --- | --- | --- |
| hello | /həlˈoʊ/ | HH AH0 L OW1 |
| water | /wˈɔtɚ/ | W AO1 T ER0 |
| teacher | /tˈitʃɚ/ | T IY1 CH ER0 |
| hospital | /hˈɑspˌɪtəl/ | HH AA1 S P IH2 T AH0 L |
| ticket | /tˈɪkət/ | T IH1 K AH0 T |
| coffee | /kˈɑfi/ | K AA1 F IY0 |
| airport | /ˈɛrpˌɔrt/ | EH1 R P AO2 R T |
| doctor | /dˈɑktɚ/ | D AA1 K T ER0 |
| pharmacy | /fˈɑrməsi/ | F AA1 R M AH0 S IY0 |
| apartment | /əpˈɑrtmənt/ | AH0 P AA1 R T M AH0 N T |
| restaurant | /rˈɛstɚˌɑnt/ | R EH1 S T ER0 AA2 N T |
| address | /ˈædrˌɛs/ | AE1 D R EH2 S |
| weekend | /wˈikˌɛnd/ | W IY1 K EH2 N D |
| what's | /wˈʌts/ | W AH1 T S |
| o'clock | /əklˈɑk/ | AH0 K L AA1 K |
