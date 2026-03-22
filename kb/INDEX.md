# Knowledge Index

> **Last updated**: 2026-03-21

Living summary of all accumulated knowledge. **Read this at session start** to know what you know without opening every file.

## Current Challenge

Investigate and improve session continuity in the Autonomous Researcher system. **Status: COMPLETE.** All 3 tasks done, 2 validated improvements delivered.

## Tasks

| ID | Task | Type | Status | Priority |
|---|---|---|---|---|
| T001 | Measure baseline recovery quality after simulated compaction | research | DONE | P0 |
| T002 | Identify and categorize recovery failure modes | research | DONE | P1 |
| T003 | Design and test recovery improvements | research | DONE | P1 |

## Research

### Hypotheses

| ID | Statement | Status |
|---|---|---|
| H001 | Recovery quality degrades as accumulated state grows | REJECTED |
| H002 | Scope boundaries improve early-stage recovery | CONFIRMED |
| H003 | Consistency-check step catches cross-reference drift | CONFIRMED |

### Experiments

| ID | Tests | Status | Key result |
|---|---|---|---|
| E001 | H001 | COMPLETED | Recovery improves with more state (20→25→25/25). H001 rejected. |
| E002 | H002 | COMPLETED | Scope boundaries: early stage 20→25/25. H002 confirmed. |
| E003 | H003 | COMPLETED | Consistency check: caught 8 discrepancies, 0 false positives. H003 confirmed. |

### Findings

| ID | Finding | Impact |
|---|---|---|
| F001 | Recovery failure taxonomy: 3 modes (isolation, cross-ref blindness, artifact detail ceiling) | HIGH |
| F002 | Two validated improvements: scope boundaries + consistency check step | HIGH |

### Literature
_None needed — this was empirical research on the tool itself._

## Engineering

### Features
_None._

### Investigations
_None._

### Implementations
_None._

## Reviews

### Challenge Reviews
_None._

### Strategic Reviews
_None._

## Key Decisions

| # | Type | Decision |
|---|---|---|
| D001 | ENG | Dual-flow project structure (research vs engineering) |

---

**Maintenance rule**: Update this file every time you create, close, or significantly update any core kb/ artifact. Keep each entry to one line. Details live in the individual files.
