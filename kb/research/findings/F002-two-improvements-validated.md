# F002 — Two validated improvements to the recovery protocol

> **Date**: 2026-03-21
> **Task**: T003
> **Hypothesis**: H002
> **Experiment**: E002
> **Impact**: HIGH

## Finding

Two concrete improvements to the post-compaction recovery protocol were designed, tested, and validated:

### Improvement 1: Scope Boundary Instructions (H002 ✓)

**Change**: Add to the "After Memory Compaction" section in CLAUDE.md:

> "Read ONLY the artifacts linked from your current task. Do not explore files outside the task scope. If you need broader context, read INDEX.md for orientation, but do not read unrelated artifact files."

**Evidence**: E002 showed early-stage recovery improved from 20/25 to 25/25. Context contamination (FM1) was completely eliminated.

**Why it works**: The instruction prevents the agent from compensating for sparse context by reaching into unrelated areas. It forces reliance on the task's own artifacts, which — even when sparse — contain the correct context.

### Improvement 2: Consistency-Check Step (H003 ✓)

**Change**: Add a new step 5 to the "After Memory Compaction" protocol:

> "5. Cross-check: Verify that key numbers, dates, and decisions are consistent across all artifacts you read. Flag any discrepancies before continuing work."

**Evidence**: E003 showed the agent caught 8 discrepancies (including all 3 intentional ones) with 0 false positives. It even caught a real maintenance drift bug in the live project. No degradation in reconstruction quality.

**Why it works**: The instruction shifts the agent from pure reconstruction mode to reconstruction + validation. The overhead is minimal (one extra pass over already-read content), and the payoff is catching drift before it compounds.

## Evidence

| Experiment | Baseline | With improvement | Delta |
|------------|----------|------------------|-------|
| E002 (scope boundary, early stage) | 20/25 | 25/25 | +5 (+25%) |
| E003 (consistency check, late stage) | 25/25 (hidden weakness) | 25/25 + 8 discrepancies caught | Qualitative improvement |

## Implications

1. Both improvements should be applied to CLAUDE.md and AGENTS.md
2. The improvements are complementary — scope boundaries prevent contamination, consistency checks prevent drift
3. The improvements are zero-cost (prompt changes only, no structural changes needed)
4. The recovery protocol should be updated from 4 steps to 6 steps:
   1. Read INDEX.md (orientation)
   2. Read BACKLOG.md (what to work on)
   3. Read the current task file (where you left off)
   4. Read ONLY the linked artifacts (scope boundary)
   5. Cross-check consistency across artifacts (validation)
   6. Only then continue working

## Actions Taken

- H002 CONFIRMED, H003 CONFIRMED
- Improvement recommendations documented
- Ready for application to CLAUDE.md
