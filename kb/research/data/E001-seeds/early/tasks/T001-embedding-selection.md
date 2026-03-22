# T001 — Embedding Model Selection for Product Search

> **Status**: IN_PROGRESS
> **Priority**: P0
> **Type**: research
> **Created**: 2026-03-20

## Description

Evaluate three candidate embedding models for our product search system and select the one that maximizes recall@10 on a representative query set against the 50,000-item product catalog. The candidates are:

1. **text-embedding-3-small** (OpenAI, 1536-d) — cheapest option
2. **text-embedding-3-large** (OpenAI, 3072-d) — highest dimensionality, expected best quality
3. **Cohere embed-v3** (Cohere, 1024-d) — competitive pricing, multilingual support

This is a research task: we need statistically rigorous benchmarks before committing to an embedding model that will underpin the entire search stack.

## Acceptance Criteria

- [ ] Benchmark all 3 models on the same evaluation query set (minimum 500 queries with ground-truth relevance labels)
- [ ] Report recall@10 and MRR@10 for each model with confidence intervals
- [ ] Report embedding generation latency (per-query and full-catalog) and cost for each model
- [ ] Statistical significance test between top two models (paired t-test or bootstrap, p < 0.05)
- [ ] Final recommendation documented in DECISIONS.md with reasoning

## Progress

- [x] (2026-03-20) Challenge defined, task created
- [x] (2026-03-21) Hypothesis H001 formulated: text-embedding-3-large will outperform on recall@10
- [ ] Design experiment E001 to benchmark all three models
- [ ] Construct or source evaluation dataset (queries + relevance judgments)
- [ ] Run E001
- [ ] Analyze results, write finding F001
- [ ] Make final recommendation

## Surprises

_None yet._

## Linked Artifacts

- H001 — Higher-dimensional embeddings outperform on product search recall

## Notes

- We need a ground-truth evaluation dataset. Options: (a) sample 500 queries from search logs and have humans judge relevance, (b) use product category co-click data as a proxy, (c) synthetic queries generated from product descriptions. Need to decide before designing E001.
- Cost constraint: full catalog embedding must be under $50. At current pricing, text-embedding-3-large for 50k products is ~$6.50, so all candidates are well within budget. Per-query cost is negligible for all three.
- Consider whether dimensionality reduction (OpenAI's native shortening for text-embedding-3-large) could give us large-model quality at small-model cost. This could become H002 if H001 is confirmed.
