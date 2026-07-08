# Multi-Graph Architecture v1

MercyB must not use one master graph for every relationship. Objects are anatomy. Meaning and intelligence live in separate graphs between objects.

## Graphs

- Ownership Graph: `owns`, `contains`, `belongs_to`.
- Knowledge Graph: `teaches`, `explains`, `illustrates`, `prerequisite`.
- Runtime Graph: `observes`, `triggers`, `influences`, `replays`.
- Evidence Graph: `verifies`, `proves`, `supports`, `references`.
- Dependency Graph: `requires`, `depends_on`, `blocks`.

## Core Rule

`Sentence -> Concept` is Knowledge Graph, not Ownership Graph.

## Examples

- `LESSON_CONTAINS_SENTENCE`: Ownership Graph.
- `SENTENCE_TEACHES_CONCEPT`: Knowledge Graph.
- `AUDIO_BELONGS_TO_SENTENCE`: Ownership Graph.
- `OBSERVATION_INFLUENCES_CAPABILITY`: Runtime Graph.
- `JUDGE_ARTIFACT_VERIFIES_CELL`: Evidence Graph.
- `AUDIO_REQUIRES_OWNER`: Dependency Graph.

## Integration Constraint

Graph edges are never anatomy objects. They must not inflate Cell counts.
