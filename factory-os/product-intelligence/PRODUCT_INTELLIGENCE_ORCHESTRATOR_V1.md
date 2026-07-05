# Product Intelligence Orchestrator v1

Builds one FactoryExecutionPackage from one objective-ready EngineeringInvestment.

Flow:
EngineeringInvestment
→ EngineeringObjective
→ ExecutionContract
→ WorkerPrompt
→ JudgePrompt
→ EconRunbook
→ FactoryExecutionPackage

Boundary:
- Factory OS only
- no implementation execution
- no Judge execution
- no runtime readiness claim
- no product capability verified claim
- no merge, push, deploy, or verified marking
- one objective at a time

Purpose:
- remove manual relay between Factory stages
- keep worker and Judge aligned to one ECON
- preserve dirty-repo safety through baseline-aware contracts
