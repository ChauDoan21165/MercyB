# Anatomy Layer Model v1

MercyB anatomy separates durable objects from relationships and measurements.

## Layers

- SYSTEM: major MercyB domain such as Language Catalog, Runtime, Evidence Registry, Engineering, Public Room Registry.
- ORGAN: durable product/runtime unit such as Language, Level, Room, Lesson, Runtime Flow, Release.
- TISSUE: structured sub-unit inside an organ such as Dialogue, Vocabulary, Exercise, Pronunciation block, Cultural Note, Tip, Public Room Entry.
- CELL: smallest canonical reasoning object such as Sentence, Concept, Dialogue Turn, Vocabulary Item, Exercise Item, Pronunciation Item, Observation, Engineering Error, Capability.
- RESOURCE: attached asset/data such as Audio, Image, Translation, IPA, Hint, Evidence Ref, Judge Artifact, Verification Record.
- TEMPORARY: EO, Task, Workpack, Queue, Branch, Factory Job, Repair Package.
- MEASUREMENT: Coverage, Coverage History, Health Metric.
- DIAGNOSTIC: Gap, Signal, Repair Plan, Judge Decision.
- UNKNOWN: cannot safely classify.

## Counting Rule

Only `CELL` layer objects are Cell Runtime Cells. Organs, tissues, resources, temporary records, measurements, diagnostics, and graph edges are not Cell counts.

## Promotion Rule

An object can be promoted only when it has source evidence, a stable ID, a canonical type, and deterministic classification.
