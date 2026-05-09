# Workload Management

## Objective
The intent is to make team collaboration visible instead of hidden in chat apps. By making stage assignments explicit, we expose bottlenecks before they cause publishing delays.

## Bottleneck Rules
1. If a stage (e.g. `FACT_CHECK`) sits in a review queue for >24h, the Workload Board flags the Assignee.
2. An Assignee can be re-assigned with a `Handoff Note`.
3. If an assignee uses the "Blocked" flag, it immediately populates on the `WorkloadBoard` in the Warning tier.

## Escalation
If a visual designer is blocked due to poor script notes, they set `blockedReason` and assign it back to the Scriptwriter or Producer.
