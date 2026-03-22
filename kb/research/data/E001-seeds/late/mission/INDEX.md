# Knowledge Index

> **Last updated**: 2026-03-21

## Mission

- **CHALLENGE.md** — Optimize embedding model selection for real-time product search; target recall@10 >= 85% with p95 latency < 200ms
- **BACKLOG.md** — 1 task (T001 IN_PROGRESS); E001, E002 completed; F001 written; preparing final recommendation
- **DECISIONS.md** — D001 (dual-flow methodology), D002 (hybrid small+large reranking chosen over pure-large)

## Tasks

- **T001** — Embedding model selection for product search (IN_PROGRESS, P1, research) — final recommendation pending

## Research

### Hypotheses

- **H001** — Larger embedding models produce better recall for product search (CONFIRMED with nuance) — large models win on recall but hybrid approach achieves near-parity at fraction of latency cost

### Experiments

- **E001** — Embedding model benchmark: text-embedding-3-small vs text-embedding-3-large vs Cohere embed-v3 (COMPLETED) — large wins on recall (87%) but 3x latency; Cohere surprisingly strong on non-English queries
- **E002** — Hybrid retrieval+reranking: small for initial retrieval, large for reranking top-50 (COMPLETED) — 85% recall@10 at only 1.4x latency vs small alone; recommended approach

### Literature

_None yet._

### Findings

- **F001** — Hybrid retrieval+reranking achieves near-optimal recall (85%) with acceptable latency (1.4x baseline) (HIGH impact) — recommends hybrid as production approach; flags Cohere multilingual advantage as open question

## Engineering

_No engineering artifacts yet._

## Reports

_No reviews yet._
