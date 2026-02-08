# Decision Log

Significant research and engineering decisions, their rationale, and expected impact.

| # | Date | Type | Decision | Summary |
|---|---|---|---|---|
| D001 | 2026-02-06 | ENGINEERING | Dual-flow project structure | Separate research (hypotheses, experiments, benchmarks) from engineering (features, investigations, implementations) |

---

## D001 — Dual-flow project structure

> **Date**: 2026-02-06
> **Type**: ENGINEERING

**Decision**: Organize the knowledge base into two distinct flows — Research and Engineering — under a shared mission layer.

**Reasoning**: Research work (validate approaches with benchmarks) and engineering work (build features, validate in market) have fundamentally different validation criteria. Mixing them creates confusion about what "done" means.

**Alternatives considered**:
- Single flat structure with tags → Too ambiguous, hard to know which process to follow
- Completely separate projects → Too much overhead, loses the feedback loop between flows

**Expected impact**: Clear process for each type of work. Research findings can trigger engineering features. Engineering work can surface research questions. No confusion about whether we need benchmarks or just need to ship.
