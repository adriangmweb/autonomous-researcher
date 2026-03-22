# T001 — Embedding model selection for product search

> **Status**: IN_PROGRESS
> **Priority**: P1
> **Type**: research
> **Created**: 2026-03-19

## Description

Evaluate embedding models for our product search system and produce an evidence-backed recommendation. The current system uses text-embedding-3-small with basic cosine similarity and achieves only 72% recall@10, which is below our 85% target. We need to find the optimal model or model combination that maximizes recall while keeping p95 latency under 200ms and monthly cost under $500.

## Acceptance Criteria

- [x] Benchmark at least 3 candidate embedding models on our product evaluation set
- [x] Measure recall@10, p95 latency, and estimated monthly cost for each
- [x] Test at least one hybrid/reranking approach if no single model meets all constraints
- [x] Write finding with evidence-backed recommendation
- [ ] Write final recommendation document summarizing the approach, architecture, and known limitations
- [ ] Consider whether multilingual performance warrants a follow-up research task

## Progress

- [x] (`2026-03-19`) Created task, defined evaluation set of 1,200 queries across 12 product categories
- [x] (`2026-03-19`) Formulated H001: larger models should produce better recall
- [x] (`2026-03-19`) Designed E001: benchmark text-embedding-3-small, text-embedding-3-large, and Cohere embed-v3
- [x] (`2026-03-20`) Ran E001: embedded all 1,200 queries and 2M product descriptions with each model
- [x] (`2026-03-20`) Analyzed E001 results: large best recall (87%) but 3x latency (245ms p95). Discovered Cohere excels on non-English (91% vs 78% for large)
- [x] (`2026-03-20`) Designed E002: hybrid approach — small for initial retrieval, large for reranking top-50
- [x] (`2026-03-20`) Ran E002: hybrid achieves 85% recall@10 at 112ms p95 — meets all constraints
- [x] (`2026-03-21`) Wrote F001: hybrid retrieval+reranking is the recommended approach
- [x] (`2026-03-21`) Recorded D002: chose hybrid over pure-large based on latency/recall/cost tradeoff
- [ ] (`—`) Write final recommendation and close task
- [ ] (`—`) Evaluate whether to create T002 for multilingual embedding investigation (Cohere finding)

## Surprises

- **Cohere multilingual advantage**: Cohere embed-v3 scored 91% recall@10 on non-English queries (Spanish, French, German subset — ~180 queries) compared to 78% for text-embedding-3-large and 65% for text-embedding-3-small. This was not part of the original hypothesis but represents a significant finding given that ~15% of production queries are non-English. This should spawn a new research question.
- **Reranking diminishing returns past top-50**: E002 tested reranking top-20, top-50, and top-100. Top-50 and top-100 produced nearly identical recall (85.0% vs 85.2%) while top-20 was noticeably worse (81.3%). The sweet spot is clearly around top-50 — going beyond adds latency without meaningful recall gain.

## Linked Artifacts

- H001, E001, E002, F001, D001, D002

## Notes

- Evaluation dataset: 1,200 queries sampled from production logs, stratified by category. ~1,020 English, ~180 non-English (60 Spanish, 60 French, 60 German).
- Product catalog snapshot: 2M products from 2026-03-18 export.
- All embedding API calls cached locally to ensure reproducibility and avoid re-running $40+ worth of API calls.
- Cost estimates based on OpenAI and Cohere pricing as of 2026-03-19.
