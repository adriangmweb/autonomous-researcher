# H001 — Recovery quality degrades as accumulated state grows

> **Status**: REJECTED
> **Task**: T001
> **Created**: 2026-03-21
> **Last updated**: 2026-03-21

## Statement

If an agent recovers from compaction at progressively later stages of a research task (early → mid → late), then recovery quality will degrade, because the recovery protocol (INDEX.md → BACKLOG.md → task file) was designed for orientation, not for reconstructing rich working context built over many steps.

## Rationale

The current recovery protocol reads 4 files sequentially. Early in a task there's little to reconstruct. But by mid/late stages, the agent has accumulated implicit context — reasoning chains, failed approaches, nuanced interpretations — that may not survive compression into kb/ artifact sections. The Progress section is a checklist, not a narrative. INDEX.md is one-line summaries.

## Test Plan

1. Create a realistic seed research scenario with kb/ artifacts at 3 stages:
   - **Early**: Task created + hypothesis formulated, no experiments yet
   - **Mid**: 1 experiment completed with results, working on next experiment
   - **Late**: 2 experiments done, 1 finding written, strategic decisions made
2. For each stage, simulate fresh agent recovery by prompting a new agent with only the recovery protocol instructions and the kb/ state
3. Score recovery on 5 dimensions (1-5 scale each):
   - **Task ID**: Does it identify the correct current task?
   - **Progress**: Does it know where it left off (not restart from beginning)?
   - **Retention**: Does it reference prior findings/results accurately?
   - **Consistency**: Does it avoid contradicting prior decisions/findings?
   - **Next step**: Does it propose the correct next action?
4. Max score per scenario: 25. Baseline measured as average across 3 stages.

## Evidence

| Source | Supports | Notes |
|--------|----------|-------|
| E001 | Pending | Baseline measurement experiment |

## Conclusion

**REJECTED.** E001 showed the opposite pattern: recovery *improved* with more accumulated state (Early: 20/25, Mid: 25/25, Late: 25/25). More artifacts provide more recovery context, not less. The real failure modes are context isolation (sparse artifacts → agent reaches for wrong context) and missing cross-reference validation (agent trusts numbers without checking consistency between artifacts).
