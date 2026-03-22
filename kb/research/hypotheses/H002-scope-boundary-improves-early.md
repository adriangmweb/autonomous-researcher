# H002 — Adding scope boundaries to recovery protocol improves early-stage recovery

> **Status**: CONFIRMED
> **Task**: T003
> **Created**: 2026-03-21
> **Last updated**: 2026-03-21

## Statement

If we add explicit scope boundaries to the recovery protocol ("Read ONLY artifacts linked from your current task. Do not explore files outside the task's linked artifacts."), then early-stage recovery will improve from 20/25 to 23+/25, because the agent will be constrained to relevant context and won't conflate unrelated information.

## Rationale

FM1 from F001 showed that sparse artifacts lead to context contamination. The agent reached beyond its scope because nothing told it not to. Adding an explicit boundary instruction is a zero-cost improvement to the recovery protocol in CLAUDE.md.

## Test Plan

1. Modify the recovery prompt to include scope boundaries
2. Re-run the early-stage simulation with the modified prompt
3. Score against the same ground truth and rubric
4. Compare to E001 baseline (20/25 for early stage)

## Evidence

| Source | Supports | Notes |
|--------|----------|-------|
| E001 | Yes | Early stage scored 20/25 due to context contamination |
| F001 | Yes | FM1 root cause identified as missing scope boundaries |
| E002 | Pending | Testing this hypothesis |

## Conclusion

**CONFIRMED.** E002 showed early-stage recovery improved from 20/25 to 25/25 with scope boundary instructions. The agent stayed within the seed directory, identified the correct task, and proposed exactly the right next step. Context contamination was completely eliminated.
