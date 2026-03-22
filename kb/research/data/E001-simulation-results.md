# E001 Simulation Results — Raw Scoring

## Early Stage Recovery

### Response Summary
The agent correctly identified T001 and its status (IN_PROGRESS). However, it deviated from the recovery prompt — instead of recovering the *seed scenario* state (embedding model selection), it recovered the *real project* state (session continuity research). It read both the real kb/ and the seed files. It identified that it was "inside its own experiment" — a meta-observation. It noticed the real kb/ INDEX.md was stale (showing TODO instead of IN_PROGRESS).

### Scoring (against seed scenario ground truth)
| Dimension | Score | Notes |
|-----------|-------|-------|
| Task ID | 3 | Identified T001 but conflated the real task (session continuity) with the seed task (embedding selection). Did identify the seed scenario correctly when reading those files. |
| Progress | 4 | Correctly identified that hypothesis was formulated and no experiments run. Knew seed artifacts were created. Missed that the "next step" in the seed scenario is to design E001 for benchmarking. |
| Retention | 5 | N/A — no prior findings in early stage. Correctly noted none exist. |
| Consistency | 5 | No contradictions with any prior work. |
| Next step | 3 | Proposed "run the early-stage simulation" (meta-level correct for the real project) rather than "design E001 to benchmark 3 models" (correct for the seed scenario). Reasonable but wrong frame. |
| **Total** | **20/25** | |

### Failure Modes Observed
- **F1: Context contamination** — Agent read files outside the seed directory (real kb/ files), contaminating the recovery with the actual project context
- **F2: Meta-confusion** — Agent realized it was inside its own experiment, breaking the simulation frame

---

## Mid Stage Recovery

### Response Summary
Excellent recovery. The agent correctly identified T001 (embedding selection), knew E001 was completed, accurately cited all key metrics (87.1% recall for large, 74.2% for small, 83.4% for Cohere), and correctly proposed designing E002 for hybrid reranking. It even retained nuances: pgvector latency cliff, small model's weakness on generic titles, Cohere's category/specificity split.

### Scoring
| Dimension | Score | Notes |
|-----------|-------|-------|
| Task ID | 5 | Correctly identified T001 — embedding model selection, research type, P1 priority |
| Progress | 5 | Knew exactly: E001 completed, E002 to be designed next. Cited specific checkpoint. |
| Retention | 5 | Cited all 3 model results with exact numbers. Referenced per-category breakdown. |
| Consistency | 5 | All statements consistent with seed data. No contradictions. |
| Next step | 5 | Proposed exactly the right action: design E002 hybrid approach with specific methodology. |
| **Total** | **25/25** | |

### Failure Modes Observed
- **None** — Perfect recovery. The mid-stage artifacts contained sufficient detail for complete reconstruction.

---

## Late Stage Recovery

### Response Summary
Strong recovery. Correctly identified T001, knew both experiments were completed, cited F001 finding, and proposed writing the final recommendation. Accurately retained the Cohere multilingual surprise and suggested T002. Got all the key numbers right (85.2% recall, 28ms p50, $310/mo). Retained the fashion/apparel outperformance and N=50 diminishing returns nuance.

### Scoring
| Dimension | Score | Notes |
|-----------|-------|-------|
| Task ID | 5 | Correctly identified T001, its status, and all linked artifacts |
| Progress | 5 | Knew E001+E002 completed, F001 written, preparing final recommendation |
| Retention | 5 | Cited exact numbers from both experiments and finding. Referenced per-category data. |
| Consistency | 5 | All statements consistent. Did not contradict any prior decisions. |
| Next step | 5 | Proposed exactly: write final recommendation, then evaluate T002 for multilingual |
| **Total** | **25/25** | |

### Failure Modes Observed
- **F3: Minor numeric inconsistencies not caught** — The seed data had intentional inconsistencies between F001 and D002 (p95: 95ms vs 112ms, cost: $310 vs $320). The agent did not flag these. This is a retention quality issue — it trusted the data without cross-checking.

---

## Summary

| Stage | Task ID | Progress | Retention | Consistency | Next Step | Total |
|-------|---------|----------|-----------|-------------|-----------|-------|
| Early | 3 | 4 | 5 | 5 | 3 | **20/25** |
| Mid | 5 | 5 | 5 | 5 | 5 | **25/25** |
| Late | 5 | 5 | 5 | 5 | 5 | **25/25** |
| **Average** | | | | | | **23.3/25** |

## Key Observations

1. **H001 is REJECTED** — recovery does NOT degrade with more state. Mid and late stages scored *higher* than early. More artifacts = more context to recover from, not less.

2. **The real vulnerability is not state volume but simulation isolation.** The early-stage agent leaked out of the seed directory and conflated real vs. seed state. This is an experimental methodology issue, not a recovery protocol issue.

3. **The recovery protocol works well when artifacts are detailed.** The mid and late seed scenarios had rich Progress sections, detailed experiment results, and clear next-step indicators. The agent recovered perfectly from these.

4. **Cross-reference validation is weak.** The late-stage agent didn't catch intentional numeric inconsistencies between artifacts. Recovery is about reconstruction, not verification.
