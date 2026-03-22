# E003 — Test consistency-check improvement on late-stage recovery

> **Status**: COMPLETED
> **Hypothesis**: H003
> **Task**: T003
> **Created**: 2026-03-21
> **Completed**: 2026-03-21

## Objective

Test whether adding a consistency-check step to the recovery prompt catches cross-reference inconsistencies.

## Setup

Same as E001 but with modified recovery prompt that includes consistency validation instructions.

## Procedure

1. Use the same late-stage seed scenario from E001 (which has intentional inconsistencies)
2. Modify the recovery prompt to add: "After reconstructing context, cross-check key numbers between related artifacts. Flag any discrepancies you find."
3. Run the simulation
4. Score: (a) Does it catch the inconsistencies? (b) Does the check degrade other recovery dimensions?

## Expected Outcome

Agent flags at least 2 of the 3 intentional inconsistencies (p95 latency, cost, recall numbers between F001 and D002).

## Progress

- [x] Hypothesis H003 created
- [ ] Simulation running
- [ ] Scoring

## Results

Agent caught **8 discrepancies** (3 intentional + 5 additional), **0 false positives**. Also caught a real project maintenance bug (INDEX.md stale). Full details in `kb/research/data/E002-E003-results.md`.

All 5 standard recovery dimensions scored 25/25 — consistency check adds validation without degrading reconstruction quality.

## Decision

H003 CONFIRMED. Consistency-check step should be added to CLAUDE.md recovery protocol.
