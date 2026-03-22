# T001 — Embedding Model Selection for Product Search

> **Status**: IN_PROGRESS
> **Priority**: P1
> **Type**: research
> **Created**: 2026-03-18

## Description

Evaluate candidate embedding models for our product search system. The challenge is finding the right balance between retrieval quality (recall@10 >= 85%) and latency (p95 < 200ms) for a 500K SKU catalog. This is a real-time consumer-facing search, so latency is a hard constraint, not a nice-to-have.

## Acceptance Criteria

- [x] Benchmark at least 3 embedding models on recall@10, latency, and cost
- [ ] Identify a configuration (single model or hybrid) meeting both recall >= 85% and p95 latency < 200ms
- [ ] Produce a recommendation with supporting data in a finding (F001)
- [ ] Document trade-offs for the engineering team

## Progress

- [x] (`2026-03-18`) Created task, defined evaluation criteria and candidate models
- [x] (`2026-03-18`) Formulated H001: larger embedding models produce better recall
- [x] (`2026-03-19`) Designed E001: three-model benchmark on evaluation set
- [x] (`2026-03-19`) Ran E001: embedded all 500K products with 3 models, ran 1,200 eval queries
- [x] (`2026-03-20`) Analyzed E001 results: text-embedding-3-large best recall (87%) but 3x latency vs small; small only 74% recall; Cohere middle ground (83% recall, 2x latency)
- [ ] (`2026-03-20`) Designing E002: hybrid approach — small for initial retrieval, large for reranking top candidates. Goal: match large's recall with small's latency budget.

## Surprises

- text-embedding-3-small recall (74%) was lower than expected — the product description vocabulary is more nuanced than anticipated. Short titles like "Blue Widget Pro" don't embed well with the smaller model.
- Cohere embed-v3 showed strong performance on category-level queries ("men's running shoes") but weaker on specific product queries ("Nike Pegasus 40 wide"). This suggests the model's training data skews toward general concepts.
- Latency scaling is not linear with embedding dimensions — text-embedding-3-large (3072 dims) was 3x slower than small (1536 dims) at search time, not 2x. The pgvector HNSW index performance drops off sharply above 2048 dimensions.

## Linked Artifacts

- H001 — Larger embedding models produce better recall
- E001 — Embedding model benchmark (COMPLETED)
- E002 — Hybrid retrieval+reranking approach (DESIGNING)

## Notes

- Evaluation set: 1,200 queries with human-judged relevant products (3-5 relevant per query). Located at `experiments/E001/data/eval-queries-v1.json`.
- All embeddings cached in `experiments/E001/data/embeddings/` to avoid re-computing (~$45 in API costs for all 3 models).
- pgvector HNSW index with ef_construction=128, m=16. These are tuned for our 500K catalog size.
- The hybrid approach in E002 would use small's index for top-100 retrieval, then rerank with large. Reranking 100 candidates with large should be fast since it's compute, not index search.
