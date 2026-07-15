# VN->EN A1 Audio Link

Work package: `WP-AUDIO-LINK-1`

Inventory source: `reports/cell-inventory/vn-en-a1-inventory.json`

Audio-map source: `reports/cell-inventory/audio-map-vn-en-a1.json`

## Verdict

All 627 canonical VN->EN A1 cells are linked by persisted UUID to deterministic English-target Azure TTS cache URLs. The link is `cache_addressable`: it is a committed, replayable cache-address tuple, not a checked-in per-cell reference audio asset and not a lesson-source mutation.

## Summary

| Metric | Count |
| --- | ---: |
| Total linked cells | 627 |
| Vocabulary Item links | 412 |
| Dialogue Turn links | 215 |
| Cache-addressable links | 627 |
| English target tuples | 627 |
| Vietnamese TTS cache tuples | 0 |
| Runtime-TTS-only source cells before link | 627 |

## Amendments Folded In

- canonical UUID cell_id is the primary join key; legacy vi-en:A1 addresses are retained only as lineage
- phrases arrays are counted as vocabulary cells
- audio linkage is cache_addressable, not checked_in_reference audio
- only English target TTS tuples are emitted for this wedge
- INT fold-in state is preserved from the merged inventory and is not re-probed

## INT State Preservation

| State | All cells | Dialogue cells |
| --- | ---: | ---: |
| covered | 54 | 54 |
| blind | 16 | 16 |
| unmeasured | 557 | 145 |

## First 10 Links

| Cell UUID | Legacy address | Type | Tuple text | Hash |
| --- | --- | --- | --- | --- |
| `ac42c0db-b4d5-52af-b9ae-ea4117ff970c` | `vi-en:A1:lesson-001:vocabulary-001` | Vocabulary Item | Hello | `6957d5f33b59b60982b6c9703c1e2f34c1729da83a3140bf25568407b18688e5` |
| `befee1e7-12cd-598a-9792-d6cf0e78b923` | `vi-en:A1:lesson-001:vocabulary-002` | Vocabulary Item | Good morning | `4686dfd02c20910fe679a1041d7166096d62e36ff704911356e79178a28851a2` |
| `81ab277f-7027-5e4a-a276-ffdd02dda4e4` | `vi-en:A1:lesson-001:vocabulary-003` | Vocabulary Item | How are you? | `0facd0c9c49fc299c183bae6dce20701d131c0e307eeaebcf1ecba8c404e824a` |
| `90fe27fc-6d1d-5863-8c0e-a5e15cd025e3` | `vi-en:A1:lesson-001:vocabulary-004` | Vocabulary Item | Goodbye | `e8adeee80a31a504362350deaa08dfb61fd2483251c6c44a629c0ee895a1f696` |
| `82f70c1f-0ebe-5b0f-b5cd-8a3cd4b9fb2b` | `vi-en:A1:lesson-002:vocabulary-001` | Vocabulary Item | One iced milk coffee, please. | `86c684572f98cc3ea94ab8904a7473db2c9e15350bc4ae4a1da28f08916cd800` |
| `5ec4ed20-1698-53a0-a719-deaf99e93d9c` | `vi-en:A1:lesson-002:vocabulary-002` | Vocabulary Item | I want to eat pho. | `f2cf37999fab45aa7650dc6747a31665df8c9228d86deef4a6610baa4096ef5a` |
| `cf90fa98-3489-526a-91fb-3a5f556e2d60` | `vi-en:A1:lesson-002:vocabulary-003` | Vocabulary Item | No chili, please. | `e395d0049578e7bfd6bf4f65019067b6d55748bc2d6aa3088032a097746097b3` |
| `8628be32-6e70-5b09-9146-23d750f6305e` | `vi-en:A1:lesson-002:vocabulary-004` | Vocabulary Item | The bill, please. | `2196a3fc43795029969149a44208f9280c1c848eb4470a887d8d8c8016eb817e` |
| `047c4e8e-c5fb-54d0-ac3f-60e2769d6d3c` | `vi-en:A1:lesson-003:vocabulary-001` | Vocabulary Item | Please take me to this address. | `71e7febba2319112e86db2d93183c6218154d7eebbba701aadfb6e9349e8f94e` |
| `a9ad3c81-a477-59cf-add5-52728e215a33` | `vi-en:A1:lesson-003:vocabulary-002` | Vocabulary Item | Turn left. | `c1f75378ccbc966de05b9b660a82c7ce86832433718c3697d2a68f304b9c084d` |
