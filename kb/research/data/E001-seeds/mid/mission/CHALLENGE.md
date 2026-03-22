# Challenge: Optimize Embedding Model Selection for Product Search

> **Created**: 2026-03-18
> **Status**: Active

## Problem Statement

Our product search system currently uses a basic TF-IDF approach for retrieval. We need to move to embedding-based semantic search to handle synonym matching, typo tolerance, and conceptual similarity (e.g., "running shoes" matching "athletic sneakers").

## Constraints

- **Real-time product search**: p95 latency must stay below 200ms end-to-end for retrieval. Users abandon search after ~300ms perceived delay.
- **Catalog size**: ~500K product SKUs, each with title, description, and category metadata.
- **Quality bar**: Recall@10 >= 85% on our internal evaluation set (1,200 queries with human-judged relevant products).
- **Infrastructure**: We run on AWS with pgvector for storage. Budget allows up to 2x current compute cost, but not 5x.
- **Embedding dimensions**: Must fit within pgvector's practical limits. Higher dimensions increase storage and search cost.

## Success Criteria

1. Select an embedding model (or combination) that meets both the recall and latency targets.
2. Produce a recommendation backed by benchmark data on our evaluation set.
3. Document trade-offs so engineering can make informed implementation decisions.

## Scope

- Evaluate at least 3 candidate embedding models.
- Benchmark on recall@10, p95 latency, embedding dimensions, and estimated cost.
- If no single model meets both targets, explore hybrid approaches (e.g., two-stage retrieval + reranking).

## Non-Goals

- Building the full production pipeline (that's a follow-up engineering task).
- Fine-tuning models on our data (may be a future research task if off-the-shelf models fall short).
- Evaluating non-embedding approaches (keyword search is being sunset regardless).
