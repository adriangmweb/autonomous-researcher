# Decision Log

## D001 — Use dual-flow research methodology

> **Date**: 2026-03-19
> **Type**: RESEARCH
> **Task**: T001

**Decision**: Apply the research flow (H->E->F chain) for the embedding model selection task rather than treating it as a pure engineering task.

**Reasoning**: The CEO needs an evidence-backed recommendation, not just an implementation. There are multiple viable approaches (different models, hybrid architectures) and the right choice depends on quantitative benchmarks. This is fundamentally a "does approach X work better than Y?" question, which is research.

**Alternatives considered**:
- Engineering flow (just pick a model and implement) — rejected because we'd be guessing without data
- External consultant benchmark — rejected because our use case (product search with specific query patterns) may not match generic benchmarks

**Expected impact**: Adds 2-3 days for proper experimentation, but produces a defensible recommendation with clear evidence trail.

---

## D002 — Adopt hybrid retrieval+reranking architecture (small + large)

> **Date**: 2026-03-21
> **Type**: RESEARCH
> **Task**: T001

**Decision**: Recommend the hybrid approach — use text-embedding-3-small for initial retrieval from the full catalog, then rerank the top-50 candidates using text-embedding-3-large — over deploying text-embedding-3-large as the sole model.

**Reasoning**: E002 demonstrated that the hybrid approach achieves 85% recall@10 versus 87% for pure-large, but at only 1.4x the latency of small-only (p95: 112ms hybrid vs 80ms small vs 245ms large). The 2 percentage point recall gap is negligible for production use, while the latency difference is dramatic — 112ms vs 245ms puts us well within the 200ms target with headroom for network overhead. Cost analysis shows hybrid at ~$320/month vs ~$680/month for pure-large at projected volume.

**Evidence**:
- E001: Pure-large achieves 87% recall@10 but p95 latency of 245ms (exceeds 200ms target)
- E002: Hybrid achieves 85% recall@10 with p95 latency of 112ms and estimated $320/month cost
- The 2pp recall gap is within measurement noise (95% CI: [83.8%, 86.2%] for hybrid vs [85.7%, 88.3%] for large)

**Alternatives considered**:
- Pure text-embedding-3-large — higher recall (87%) but p95 latency of 245ms exceeds the 200ms target, and costs $680/month (2.1x budget)
- Pure text-embedding-3-small — cheapest and fastest but only 72% recall, well below the 85% target
- Cohere embed-v3 only — 83% recall on English, 91% on non-English, but API reliability concerns and vendor lock-in; also 2.2x latency vs small
- Hybrid with Cohere for non-English — promising but needs more investigation; flagged as potential follow-up task

**Expected impact**: Meets all three constraints (recall >= 85%, latency < 200ms, cost < $500/month). Implementation requires a two-stage retrieval pipeline but the architecture is well-understood.

**Open question**: Cohere embed-v3 outperformed all OpenAI models on non-English queries (91% vs 78% for large). If multilingual search is a priority, a separate investigation into Cohere or a language-routing hybrid may be warranted. See F001 and E001 Surprises section.
