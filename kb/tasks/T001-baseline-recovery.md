# T001 — Measure baseline recovery quality after simulated compaction

> **Status**: DONE
> **Priority**: P0
> **Type**: research
> **Created**: 2026-03-21

## Description

Establish how well the agent recovers its working state after simulated context compaction. Run the agent on a small research task, let it accumulate state in `kb/`, then start a fresh session where the agent must continue from `kb/` alone. Measure what it retains, what it misses, and where it contradicts itself.

This is the foundation for all subsequent experiments — we need a quantified baseline before testing improvements.

## Acceptance Criteria

- [ ] At least 3 simulated compaction scenarios tested (different stages of a research task)
- [ ] Recovery quality scored on: task identification, progress awareness, prior finding retention, no contradictions, correct next step
- [ ] Baseline metrics documented in experiment file with raw data in `kb/research/data/`
- [ ] Failure modes categorized and ranked by frequency/severity

## Progress

- [x] (`2026-03-21`) Task started, creating H001 and E001
- [x] (`2026-03-21`) Seed scenarios created (early/mid/late in kb/research/data/E001-seeds/)
- [x] (`2026-03-21`) 3 simulated compaction scenarios run
- [x] (`2026-03-21`) Scored and documented — H001 REJECTED. Recovery improves with more state.

**Result**: Baseline established. Early: 20/25, Mid: 25/25, Late: 25/25. Key failure modes: context isolation (sparse artifacts), missing cross-reference validation. Moving to T002.

## Surprises

_None yet._

## Linked Artifacts

H001, E001

## Notes

Budget-efficient approach: use a single small research task as the "seed" scenario, then simulate compaction at 3 different stages (early, mid, late). This avoids running 3 separate full tasks.
