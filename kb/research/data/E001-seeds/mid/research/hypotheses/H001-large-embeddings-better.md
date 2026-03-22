# H001 — Larger Embedding Models Produce Better Recall for Product Search

> **Status**: TESTING
> **Task**: T001
> **Created**: 2026-03-18
> **Last updated**: 2026-03-20

## Statement

If we use larger embedding models (higher dimensionality, more parameters) for product search, then recall@10 will be significantly higher (>= 85%) compared to smaller models, because larger models capture finer semantic distinctions between product descriptions that matter for precise retrieval.

## Rationale

- OpenAI's benchmarks show text-embedding-3-large outperforms small on MTEB retrieval tasks by 5-10 points.
- Product search requires distinguishing between closely related items (e.g., "Nike Pegasus 40" vs "Nike Pegasus 39"), which benefits from higher-dimensional representations.
- However, there is a known trade-off: larger models have higher embedding generation latency and higher vector search latency due to increased dimensions. For real-time product search (p95 < 200ms), latency may be a binding constraint.

## Test Plan

- Experiment(s) to run: E001 (three-model benchmark), E002 (hybrid approach if needed)
- Data needed: 500K product catalog, 1,200 human-judged evaluation queries
- Success metric: recall@10, p95 search latency, embedding cost
- Confirm if: larger model recall@10 >= 85% AND latency is within acceptable bounds
- Reject if: larger models don't meaningfully improve recall, OR the latency penalty makes them impractical for real-time search

## Evidence

| Source | Supports/Contradicts | Notes |
|---|---|---|
| E001 results | Partially supports | text-embedding-3-large achieves 87% recall@10 (above 85% target) but p95 latency is 580ms — 3x over target. The hypothesis that larger = better recall is confirmed, but the latency constraint makes direct use impractical. |
| E001 results | Supports (recall) | Clear monotonic relationship: small (1536d) = 74%, Cohere (1024d) = 83%, large (3072d) = 87%. More dimensions = better recall. |
| E001 results | Contradicts (feasibility) | Latency scaling is super-linear with dimensions in pgvector HNSW. 3072d is not viable for real-time search at 500K scale without a hybrid approach. |

## Conclusion

_Pending — E001 confirms the recall side of the hypothesis but reveals a hard latency barrier. Designing E002 to test whether a hybrid approach (small for retrieval + large for reranking) can get the best of both worlds. Final conclusion will depend on E002 results._
