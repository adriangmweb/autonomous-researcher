# Challenge

> **Created**: 2026-03-19
> **Status**: ACTIVE

## Statement

Optimize embedding model selection for our real-time product search system. We need to find the best embedding model (or combination of models) that maximizes search recall while keeping latency within acceptable bounds for a production e-commerce environment.

## Constraints

- **Recall target**: recall@10 >= 85% on our product evaluation set (1,200 queries across 12 categories)
- **Latency target**: p95 latency < 200ms for end-to-end search (embedding + retrieval + reranking if applicable)
- **Scale**: ~2M product catalog, ~50 queries/second sustained, ~200 queries/second peak
- **Budget**: Embedding API costs must stay under $500/month at expected query volume
- **Language**: Primarily English, but ~15% of queries are in Spanish, French, or German

## Success Criteria

A clear, evidence-backed recommendation for which embedding model(s) to deploy, with:
1. Recall and latency benchmarks across candidate models
2. Cost projections at production scale
3. Architecture recommendation (single model vs hybrid approach)
4. Known limitations and open questions

## Context

Current system uses text-embedding-3-small with basic cosine similarity search. Recall@10 is approximately 72%, which is below acceptable levels for product search. Users report missing relevant results, especially for nuanced queries like "lightweight waterproof jacket for hiking."
