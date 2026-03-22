# E001 — Embedding model benchmark: small vs large vs Cohere

> **Status**: COMPLETED
> **Hypothesis**: H001
> **Task**: T001
> **Created**: 2026-03-19
> **Completed**: 2026-03-20

## Objective

Measure recall@10, p95 latency, and estimated monthly cost for three candidate embedding models on our product search evaluation set. Establish which model(s) are viable candidates for production deployment.

## Setup

- **Environment**: Python 3.11, macOS, pgvector 0.5.1 on PostgreSQL 16 (local Docker)
- **Dependencies**: openai==1.52.0, cohere==5.11.0, psycopg2==2.9.9, numpy==1.26.4
- **Hardware/Compute**: M2 Max MacBook Pro (local); API calls to OpenAI and Cohere cloud endpoints
- **Data**: 1,200 evaluation queries (1,020 English, 180 non-English) + 2M product descriptions from 2026-03-18 catalog export

## Parameters

| Parameter | Value | Rationale |
|---|---|---|
| Models | text-embedding-3-small (1536d), text-embedding-3-large (3072d), Cohere embed-v3 (1024d) | Small is current baseline; large is OpenAI's best; Cohere is leading alternative vendor |
| Evaluation queries | 1,200 (stratified by 12 categories) | Sampled from 30 days of production query logs, deduplicated, stratified |
| Retrieval method | Cosine similarity via pgvector HNSW index | Matches production retrieval; HNSW for approximate nearest neighbor at scale |
| HNSW ef_construction | 200 | High enough for quality indexing without excessive build time |
| HNSW ef_search | 100 | Balances recall with query speed |
| Top-k | 10 | recall@10 is the primary metric per the challenge definition |
| Relevance labels | Human-judged, binary (relevant/not-relevant) | 3 annotators, majority vote, Cohen's kappa 0.82 |

## Procedure

1. Embed all 2M product descriptions with each of the 3 models (batch API, cached locally)
2. Build separate pgvector HNSW indexes for each model's embeddings
3. For each of the 1,200 queries, embed the query and retrieve top-10 nearest products
4. Compare retrieved products against human-judged relevance labels
5. Compute recall@10, precision@10, MRR@10 for each model
6. Measure p95 query latency (embedding + retrieval) over 3 runs of 1,000 random queries
7. Estimate monthly cost at 50 qps sustained using published API pricing

## Expected Outcome

- Confirm if: text-embedding-3-large recall@10 >= 82% (10pp improvement over small's ~72%)
- Reject if: text-embedding-3-large recall@10 < 78%

## Progress

- [x] (`2026-03-19`) Embedded 2M products with all 3 models. Total API cost: $38.40 (small: $4.20, large: $24.60, Cohere: $9.60)
- [x] (`2026-03-19`) Built HNSW indexes. Build times: small 12min, large 28min, Cohere 9min
- [x] (`2026-03-20`) Ran retrieval evaluation on all 1,200 queries, 3 models
- [x] (`2026-03-20`) Computed metrics, ran latency benchmarks (3 x 1,000 queries each)
- [x] (`2026-03-20`) Analysis complete, results written below

## Results

### Raw Data

Full per-query results saved to `kb/research/data/E001-model-benchmark-results.csv`.

### Summary

| Model | recall@10 | precision@10 | MRR@10 | p95 latency (ms) | Est. cost/month |
|---|---|---|---|---|---|
| text-embedding-3-small | 72.1% | 34.5% | 0.61 | 80 | $160 |
| text-embedding-3-large | 87.0% | 42.8% | 0.74 | 245 | $680 |
| Cohere embed-v3 | 83.2% | 39.1% | 0.69 | 178 | $410 |

### Breakdown by language

| Model | recall@10 (English, n=1020) | recall@10 (non-English, n=180) |
|---|---|---|
| text-embedding-3-small | 73.8% | 62.4% |
| text-embedding-3-large | 88.4% | 78.1% |
| Cohere embed-v3 | 81.8% | 91.2% |

### Observations

- text-embedding-3-large is the clear winner on English recall but its latency (245ms p95) exceeds the 200ms production target.
- Cohere embed-v3 is competitive overall (83.2%) and surprisingly fast for its quality level.
- All models show degraded performance on non-English queries except Cohere, which actually improves.
- The HNSW index for large embeddings (3072d) is 2x the size of small (1536d), which affects memory usage at scale.

## Surprises

- **Cohere multilingual dominance**: Cohere embed-v3 achieved 91.2% recall@10 on non-English queries (n=180) versus 78.1% for text-embedding-3-large and 62.4% for text-embedding-3-small. This was unexpected — we included Cohere primarily as a cost comparison point, not for multilingual capability. Given that ~15% of production traffic is non-English, this is a commercially significant finding. The gap is especially pronounced on Spanish product queries where Cohere hit 93.4% vs 76.2% for OpenAI large.
- **Large model latency variance**: text-embedding-3-large showed high latency variance (p50: 145ms, p95: 245ms, p99: 380ms) compared to small (p50: 52ms, p95: 80ms, p99: 95ms). The tail latency makes it unreliable for strict SLA targets.

## Analysis

H001 is **confirmed**: text-embedding-3-large achieves 87% recall@10, a 15pp improvement over small's 72%. This exceeds the 10pp threshold defined in the hypothesis. However, the latency constraint is binding — 245ms p95 exceeds the 200ms target, making pure-large deployment infeasible without architectural changes.

The cost picture also favors alternatives: large at $680/month exceeds the $500/month budget, while Cohere at $410/month is within budget but has lower English recall.

The most promising path forward is a **hybrid approach**: use text-embedding-3-small for initial retrieval (fast, cheap) and text-embedding-3-large for reranking a reduced candidate set. This could capture most of the recall benefit at a fraction of the latency and cost.

The Cohere multilingual finding is a separate but important result. It should be flagged for the CEO and potentially investigated in a follow-up task if multilingual support is a priority.

## Recovery

All embedding API responses are cached in `experiments/E001/cache/`. Re-running the evaluation does not require re-calling the APIs (~$38 saved). To fully reproduce from scratch, run `python experiments/E001/run_benchmark.py --no-cache`.

## Decision

- [x] Update hypothesis status: H001 confirmed with latency caveat
- [x] Design follow-up experiment: E002 — hybrid retrieval + reranking approach
- [ ] Record finding: deferred until E002 completes (to include hybrid results)
- [x] Flag Cohere multilingual result for potential follow-up task
