# Knowledge Index

> **Last updated**: 2026-03-20

## Mission

- **CHALLENGE.md** — Optimize embedding model selection for real-time product search; target recall@10 >= 85% with p95 latency < 200ms
- **BACKLOG.md** — 1 task (T001 IN_PROGRESS); E001 completed, designing E002
- **DECISIONS.md** — No major decisions yet (pending E002 results)

## Tasks

- **T001** — Embedding model selection for product search (IN_PROGRESS, P1, research)

## Research

### Hypotheses

- **H001** — Larger embedding models produce better recall for product search (TESTING) — E001 partially confirms but latency trade-off is severe

### Experiments

- **E001** — Embedding model benchmark: text-embedding-3-small vs text-embedding-3-large vs Cohere embed-v3 (COMPLETED) — large wins on recall (87%) but 3x latency penalty

### Literature

_None yet._

### Findings

_None yet — awaiting E002 results before synthesizing._

## Engineering

_No engineering artifacts yet._

## Reports

_No reviews yet._
