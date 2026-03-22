# H003 — Adding a consistency-check step catches cross-reference drift

> **Status**: CONFIRMED
> **Task**: T003
> **Created**: 2026-03-21
> **Last updated**: 2026-03-21

## Statement

If we add a consistency-check step to the recovery protocol ("After reconstructing context, verify that key numbers and decisions are consistent across all referenced artifacts. Flag any discrepancies."), then agents will catch cross-reference inconsistencies that the baseline protocol misses, because the current protocol only reads for reconstruction without validation.

## Rationale

FM2 from F001 showed that agents trust artifact content at face value. The late-stage simulation reconstructed all facts perfectly but missed intentional inconsistencies between artifacts. Adding a validation prompt is low-cost and directly addresses this blind spot.

## Test Plan

1. Modify the recovery prompt to include a consistency-check instruction
2. Re-run the late-stage simulation (which has intentional inconsistencies)
3. Score: Does the agent flag the discrepancies? (Binary: yes/no, plus how many caught)
4. Also measure whether the check adds overhead that degrades other dimensions

## Evidence

| Source | Supports | Notes |
|--------|----------|-------|
| E001 | Yes | Late stage scored 25/25 but missed inconsistencies |
| F001 | Yes | FM2 root cause: no validation step in protocol |
| E003 | Pending | Testing this hypothesis |

## Conclusion

**CONFIRMED.** E003 showed the agent caught all 3 intentional inconsistencies plus 5 additional ones (8 total, 0 false positives). It even caught a real project maintenance bug (INDEX.md/BACKLOG.md drift). The consistency-check prompt adds thorough cross-reference validation at zero false-positive cost.
