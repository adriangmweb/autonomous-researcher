# H001 — Higher-Dimensional Embeddings Outperform on Product Search Recall

> **Status**: PROPOSED
> **Task**: T001
> **Created**: 2026-03-21
> **Last updated**: 2026-03-21

## Statement

If we use text-embedding-3-large (3072 dimensions) instead of text-embedding-3-small (1536 dimensions) or Cohere embed-v3 (1024 dimensions) for product search embedding, then recall@10 will be at least 5 percentage points higher on a representative query set, because the larger embedding space can capture finer-grained semantic distinctions needed to disambiguate similar products (e.g., distinguishing "USB-C charging cable 6ft" from "USB-C charging cable 3ft" or "wireless mouse" from "wireless keyboard").

## Rationale

1. **Dimensionality and information capacity**: Higher-dimensional embeddings have more capacity to encode subtle distinctions. Product catalogs contain many near-duplicate items that differ on specific attributes (size, color, compatibility). A larger embedding space should separate these more effectively.

2. **OpenAI's own benchmarks**: OpenAI reports that text-embedding-3-large scores 64.6% on MTEB retrieval tasks vs. 61.0% for text-embedding-3-small — a ~3.6pp improvement. Product search is a retrieval task, so a similar or larger gap is plausible.

3. **Product search specificity**: Unlike general web search, product search queries are often short and attribute-heavy ("red Nike running shoes size 10"). Higher-dimensional models may better encode these multi-attribute queries.

4. **Cohere embed-v3 comparison**: Cohere's model uses 1024 dimensions but is trained on a different objective (with search-optimized variants). It may outperform text-embedding-3-small despite lower dimensionality, but is unlikely to beat text-embedding-3-large on pure recall.

## Test Plan

- Experiment(s) to run: E001 (not yet created)
- Data needed: 500+ evaluation queries with ground-truth relevant product IDs from the 50k catalog
- Success metric: recall@10 on the evaluation query set
- Confirm if: text-embedding-3-large recall@10 is >= 5pp higher than both alternatives (p < 0.05 on paired bootstrap test)
- Reject if: text-embedding-3-large recall@10 is < 3pp higher than the best alternative, OR another model matches/exceeds it

## Evidence

| Source | Supports/Contradicts | Notes |
|---|---|---|
| OpenAI MTEB benchmarks (2024) | Supports | 3-large scores 64.6% vs 3-small 61.0% on retrieval tasks |
| Cohere embed-v3 technical report | Neutral | Claims competitive with OpenAI on MTEB but uses different eval methodology |
| Internal observation | Supports | Current keyword search fails on semantic similarity — models with more capacity should help more |

## Conclusion

_Awaiting experiment E001 results._
