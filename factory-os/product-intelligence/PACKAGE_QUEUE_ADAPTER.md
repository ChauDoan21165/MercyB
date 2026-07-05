# Package Queue Adapter

Converts one FactoryExecutionPackage into one queue-ready FactoryQueueItem.

Purpose:
- persist package JSON
- create a queue-ready work item
- bridge package preparation to C2 Factory automation
- avoid manual relay from Chau

Boundary:
- Factory OS only
- no implementation execution
- no Judge execution
- no runtime readiness claim
- no product capability verified claim
- no merge, push, deploy, or verified marking
