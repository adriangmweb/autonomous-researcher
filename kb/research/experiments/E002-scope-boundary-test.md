# E002 — Test scope boundary improvement on early-stage recovery

> **Status**: COMPLETED
> **Hypothesis**: H002
> **Task**: T003
> **Created**: 2026-03-21
> **Completed**: 2026-03-21

## Objective

Test whether adding explicit scope boundaries to the recovery prompt improves early-stage recovery quality.

## Setup

Same as E001 but with modified recovery prompt that includes scope boundary instructions.

## Procedure

1. Use the same early-stage seed scenario from E001
2. Modify the recovery prompt to add: "Read ONLY the artifacts linked from the current task. Do not explore files outside the task scope."
3. Run the simulation
4. Score against E001 ground truth

## Expected Outcome

Early-stage score improves from 20/25 to 23+/25.

## Progress

- [x] Hypothesis H002 created
- [ ] Simulation running
- [ ] Scoring

## Results

Early-stage score: **25/25** (up from 20/25 baseline). Full scoring in `kb/research/data/E002-E003-results.md`.

Agent stayed within scope, correctly identified task, progress, and next step. Zero context contamination.

## Decision

H002 CONFIRMED. Scope boundary instruction should be added to CLAUDE.md recovery protocol.
