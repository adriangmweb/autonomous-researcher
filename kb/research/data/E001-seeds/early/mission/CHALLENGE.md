# Challenge: Optimize Embedding Model Selection for Product Search

> **Created**: 2026-03-20
> **Status**: ACTIVE

## Context

Our product search system serves a catalog of ~50,000 items. The current keyword-based search suffers from vocabulary mismatch: users searching for "wireless headphones" miss results labeled "Bluetooth earbuds," and queries like "gift for dad" return nothing useful. We need to move to semantic search using embedding models.

## Objective

Identify the embedding model that maximizes retrieval quality (recall@10) for our product catalog while keeping latency and cost within acceptable bounds. The catalog consists of product titles, descriptions, and category metadata across electronics, home goods, apparel, and sporting goods verticals.

## Constraints

- **Catalog size**: ~50,000 products with title + description text
- **Query volume**: ~200,000 searches/day
- **Latency budget**: p95 retrieval under 200ms (embedding generation + ANN lookup)
- **Cost ceiling**: Embedding generation for the full catalog must cost under $50; per-query embedding cost must be negligible at scale
- **Infrastructure**: We have access to OpenAI and Cohere APIs. Self-hosted models are out of scope for now.

## Success Criteria

- Select an embedding model with statistically significant recall@10 advantage over alternatives, or confirm they are equivalent and choose on cost/latency
- Deliver a benchmark report with per-model recall@10, MRR@10, latency, and cost metrics
- Provide a recommendation with clear reasoning for the CEO to approve

## Candidate Models

1. **text-embedding-3-small** (OpenAI) — 1536 dimensions, lowest cost
2. **text-embedding-3-large** (OpenAI) — 3072 dimensions, higher cost, expected better quality
3. **Cohere embed-v3** (Cohere) — 1024 dimensions, multilingual, competitive pricing

## Key Risks

- Models may perform similarly on our data, making the choice a cost/latency decision rather than a quality one
- Product descriptions vary wildly in quality — short titles vs. rich descriptions may affect model performance differently
- Evaluation requires a ground-truth relevance dataset, which we need to construct or source
