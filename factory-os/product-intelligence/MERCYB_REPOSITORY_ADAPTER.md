# MercyB Repository Adapter

Discovers objective-ready EngineeringInvestment records from real MercyB repository artifacts.

Purpose:
- make Factory OS understand MercyB repository data
- stop F workers from guessing product gaps
- select one real objective-ready investment
- hand normalized input to Product Intelligence Orchestrator

Boundary:
- discovery/normalization only
- no implementation execution
- no Judge execution
- no runtime readiness claim
- no product capability verified claim
- no merge, push, deploy, or verified marking

Metaphor:
The repository adapter is the warehouse worker. It finds a real box in MercyB, labels it correctly, and hands it to the conveyor.
