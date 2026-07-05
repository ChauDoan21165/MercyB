# Repository Adapter Integration

Proves a repository-discovered objective-ready EngineeringInvestment can feed the Factory OS conveyor.

Flow:
MercyB Repository
→ Repository Adapter
→ objective_ready EngineeringInvestment
→ Product Intelligence Orchestrator
→ FactoryExecutionPackage
→ FactoryQueueItem
→ SingleObjectiveRunnerPlan
→ RunnerExecutionGate
→ STOP

Verified:
- repository discovery works
- normalized investment preserves ID, PCAP, PFLOW
- package generated
- queue item generated
- runner plan generated
- execution gate decision generated
- no worker execution
- no Judge execution
- no runtime readiness claim
- no product capability verified claim
- no merge, push, deploy, or verified marking

Metaphor:
The warehouse worker found a real box on the shelf, labeled it, placed it on the conveyor, and the conveyor carried it to the execution gate safely.
