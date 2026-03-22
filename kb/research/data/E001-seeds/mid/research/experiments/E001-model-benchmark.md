# E001 — Embedding Model Benchmark for Product Search

> **Status**: COMPLETED
> **Hypothesis**: H001
> **Task**: T001
> **Created**: 2026-03-19
> **Completed**: 2026-03-20

## Objective

Benchmark three candidate embedding models on our product search evaluation set to measure recall@10, p95 search latency, and cost. Determine which model (if any) meets both the recall >= 85% and p95 latency < 200ms targets simultaneously.

## Setup

- **Environment**: Python 3.11, pgvector 0.7.4 on PostgreSQL 16, AWS r6g.xlarge (4 vCPU, 32GB RAM)
- **Dependencies**: openai==1.52.0, cohere==5.11.0, psycopg2==2.9.9, numpy==1.26.4, pgvector==0.3.5
- **Hardware/Compute**: Single r6g.xlarge for pgvector. Embedding API calls to OpenAI and Cohere cloud endpoints.
- **Data**: 500,247 product SKUs (title + description concatenated, avg 84 tokens). 1,200 evaluation queries with 3-5 human-judged relevant products each.

## Parameters

| Parameter | Value | Rationale |
|---|---|---|
| HNSW ef_construction | 128 | Standard for 500K scale, balances build time and recall |
| HNSW m | 16 | Default recommended for moderate dimensionality |
| HNSW ef_search | 64 | Tuned for target latency range; higher values tested but exceeded budget |
| Top-K | 10 | Matches recall@10 metric |
| Batch size (embedding) | 256 | Max batch for OpenAI API; Cohere uses 96 |
| Embedding dimensions | Model-native (no truncation) | small: 1536d, large: 3072d, Cohere: 1024d |

## Procedure

1. Embed all 500,247 products using each model (3 separate runs). Cache all embeddings to `experiments/E001/data/embeddings/`.
2. Create 3 separate pgvector tables with HNSW indexes, one per model.
3. Run all 1,200 evaluation queries against each index. Record per-query: retrieved product IDs, latency, and relevance judgments.
4. Compute recall@10, p50/p95/p99 latency, and total embedding cost per model.
5. Analyze results and compare against targets (recall >= 85%, p95 latency < 200ms).

## Expected Outcome

- Confirm if: At least one model achieves recall@10 >= 85% with p95 latency < 200ms.
- Reject if: No single model meets both targets simultaneously, indicating a hybrid approach is needed.

## Progress

- [x] (`2026-03-19`) Embedded products with text-embedding-3-small — 1,200 queries run. Cost: $8.50.
- [x] (`2026-03-19`) Embedded products with text-embedding-3-large — 1,200 queries run. Cost: $25.50.
- [x] (`2026-03-19`) Embedded products with Cohere embed-v3 — 1,200 queries run. Cost: $11.20.
- [x] (`2026-03-20`) Computed recall@10 and latency metrics for all 3 models.
- [x] (`2026-03-20`) Analysis complete. Results written up.

## Results

### Raw Data

Per-query results saved to:
- `experiments/E001/data/results/small-per-query.jsonl` (1,200 rows)
- `experiments/E001/data/results/large-per-query.jsonl` (1,200 rows)
- `experiments/E001/data/results/cohere-per-query.jsonl` (1,200 rows)

Summary metrics:

| Model | Dimensions | Recall@10 | p50 Latency | p95 Latency | p99 Latency | Embed Cost (500K) | Index Size |
|---|---|---|---|---|---|---|---|
| text-embedding-3-small | 1536 | 74.2% | 45ms | 89ms | 142ms | $8.50 | 3.2 GB |
| text-embedding-3-large | 3072 | 87.1% | 125ms | 580ms | 1,240ms | $25.50 | 6.8 GB |
| Cohere embed-v3 | 1024 | 83.4% | 38ms | 72ms | 118ms | $11.20 | 2.1 GB |

### Observations

- text-embedding-3-large is the only model meeting the 85% recall target, but its p95 latency (580ms) is nearly 3x the 200ms ceiling.
- text-embedding-3-small has excellent latency (p95 = 89ms, well under target) but recall is 11 points below the 85% threshold.
- Cohere embed-v3 is the best balance: 83.4% recall with p95 = 72ms. Only 1.6 points short of the recall target.
- Latency distribution for large is heavily right-skewed — p50 is 125ms (acceptable) but tail latencies blow up. This is the pgvector HNSW index struggling with 3072 dimensions.
- The 1024d Cohere embeddings search faster than 1536d OpenAI small, despite Cohere having slightly higher recall. Fewer dimensions = faster HNSW traversal.

## Surprises

- **pgvector latency cliff at high dimensions**: Expected ~2x latency for 2x dimensions, but got ~6.5x at the tail (p95). HNSW index performance degrades super-linearly above ~2048 dimensions. This is a critical constraint for any high-dimensional model. Evidence: p95 ratio is 580/89 = 6.5x for a 2x dimension increase.
- **Small model struggles with short product titles**: Queries targeting products with short, generic titles ("Blue Widget Pro", "Classic Leather Belt") had recall as low as 40% with the small model. The small model can't distinguish these from similar products. Large model maintained ~80% recall even on these hard cases.
- **Cohere's category vs. specificity split**: Cohere embed-v3 scored 91% recall on broad category queries ("men's running shoes") but only 72% on specific product queries ("Nike Pegasus 40 wide"). OpenAI large was more consistent: 89% broad, 84% specific.

## Analysis

No single model meets both targets simultaneously:

- **text-embedding-3-large**: Meets recall (87.1% >= 85%) but fails latency (580ms >> 200ms). Not viable for direct use in real-time search at this catalog scale without dimensional reduction or a fundamentally different index.
- **text-embedding-3-small**: Meets latency (89ms < 200ms) but fails recall (74.2% << 85%). The gap is too large to close with index tuning alone.
- **Cohere embed-v3**: Best latency (72ms) and close on recall (83.4%), but still 1.6 points short. Might be closable with ef_search tuning, but higher ef_search values tested (128, 256) only gained +0.8 recall points while doubling latency.

The core tension is clear: quality requires more dimensions, but pgvector search latency scales super-linearly with dimensions at our catalog size. This points toward a **two-stage approach**: use a fast, lower-dimensional model for initial candidate retrieval, then rerank the top candidates with a higher-quality model where the compute cost is bounded (reranking 50-100 candidates, not searching 500K).

### Potential hybrid design (for E002)

1. **Stage 1**: text-embedding-3-small retrieves top-100 candidates. Cost: ~89ms p95.
2. **Stage 2**: Rerank top-100 with text-embedding-3-large embeddings (pre-computed, stored separately). Reranking 100 vectors by cosine similarity with a query embedding is pure compute — estimated <20ms.
3. **Total budget**: ~110ms p95, well within the 200ms target.
4. **Expected recall**: If large's 87% recall is mostly contained in small's top-100, the hybrid should approach large's recall. Need to verify this assumption in E002.

## Recovery

- All embeddings are cached — no need to re-embed ($45 total API cost).
- pgvector indexes can be rebuilt from cached embeddings in ~15 minutes per model.
- Evaluation queries and judgments are version-controlled at `experiments/E001/data/eval-queries-v1.json`.

## Decision

- [x] Update hypothesis status — H001 partially confirmed (recall side yes, feasibility side no)
- [ ] Design follow-up experiment — E002: hybrid retrieval (small) + reranking (large) approach
- [ ] Record finding — Deferred until E002 completes; will synthesize E001 + E002 into F001
