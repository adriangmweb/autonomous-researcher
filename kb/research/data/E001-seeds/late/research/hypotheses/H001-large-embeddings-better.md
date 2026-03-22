# H001 — Larger embedding models produce better recall for product search

> **Status**: CONFIRMED (with nuance)
> **Task**: T001
> **Created**: 2026-03-19
> **Last updated**: 2026-03-21

## Statement

If we use a larger embedding model (text-embedding-3-large, 3072 dimensions) instead of the current small model (text-embedding-3-small, 1536 dimensions), then recall@10 will improve by at least 10 percentage points (from ~72% to >= 82%), because larger models capture finer semantic distinctions that are critical for product search queries like "lightweight waterproof jacket for hiking" where multiple attributes must be matched simultaneously.

## Rationale

Product search queries tend to be multi-attribute ("red leather wallet under $50") and the current small model struggles to capture all facets in a single embedding. Larger models with higher dimensionality should represent these compound queries more faithfully. OpenAI's published benchmarks show text-embedding-3-large outperforming small on MTEB retrieval tasks by 5-15%, and our domain (e-commerce product matching) is well-represented in those benchmarks.

## Test Plan

- Experiment(s) to run: E001 (model benchmark), E002 (hybrid approach)
- Data needed: 1,200 evaluation queries + 2M product embeddings per model
- Success metric: recall@10 on evaluation set
- Confirm if: text-embedding-3-large achieves recall@10 >= 82% (10pp improvement over small's 72%)
- Reject if: text-embedding-3-large achieves recall@10 < 78% (less than 6pp improvement)

## Evidence

| Source | Supports/Contradicts | Notes |
|---|---|---|
| E001 results | Supports | text-embedding-3-large achieved 87% recall@10 vs 72% for small — a 15pp improvement, exceeding the 10pp threshold |
| E001 latency | Complicates | large model p95 latency is 245ms (3x small's 80ms), exceeding the 200ms production target |
| E002 results | Supports (indirectly) | Hybrid approach using large for reranking achieves 85% recall@10 — confirms large model's superior semantic understanding can be leveraged without full latency penalty |
| E001 Cohere results | Neutral | Cohere embed-v3 achieved 83% recall@10 overall — competitive but not as strong as large on English queries |

## Conclusion

**CONFIRMED with nuance.** Larger embedding models do produce significantly better recall for product search — text-embedding-3-large improved recall@10 from 72% to 87%, a 15pp gain that far exceeds our 10pp threshold. However, the latency penalty (3x) makes deploying the large model as the sole retrieval engine impractical for our production constraints. The practical solution is a hybrid architecture (E002) where the large model is used only for reranking, capturing most of the recall benefit (85% vs 87%) at a fraction of the latency cost (1.4x vs 3x). The hypothesis is confirmed in principle but the deployment strategy required adaptation.
