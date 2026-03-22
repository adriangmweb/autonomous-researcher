# E002 & E003 Simulation Results

## E002 — Scope Boundary Test (Early Stage)

### Response Summary
The agent stayed entirely within the seed directory. It correctly identified T001 (embedding model selection), knew the exact stopping point (H001 formulated, E001 not yet designed), accurately described the hypothesis details (5pp threshold, MTEB benchmarks, Cohere search-optimized variant), and proposed exactly the right next step (design E001, resolve eval dataset question first). It also retained nuances: dimensionality reduction follow-up, Cohere's different training objective, the gray zone between confirm/reject thresholds.

### Scoring
| Dimension | Score | Notes |
|-----------|-------|-------|
| Task ID | 5 | Correctly identified T001 — embedding model selection, research type |
| Progress | 5 | Knew exactly: H001 written, E001 not yet designed. Cited BACKLOG Last IDs as evidence. |
| Retention | 5 | N/A for findings (none exist), but accurately recalled all hypothesis details and open questions |
| Consistency | 5 | All statements consistent. No contamination from outside the seed directory. |
| Next step | 5 | Proposed exactly: design E001, resolve eval dataset question first. Correct sequencing. |
| **Total** | **25/25** | |

### Comparison to Baseline
- **E001 early baseline**: 20/25
- **E002 with scope boundary**: 25/25
- **Improvement**: +5 points (25% improvement)
- **H002 CONFIRMED**: Scope boundaries completely eliminated the context isolation failure.

---

## E003 — Consistency Check Test (Late Stage)

### Response Summary
The agent performed a thorough cross-reference validation and found **8 discrepancies** across the seed artifacts:

1. Small model recall: 72.1% (E001) vs 74.0% (F001/E002) — **HIGH severity**
2. Hybrid p95 latency: 95ms (E002/F001) vs 112ms (D002) — **HIGH severity** (intentional)
3. Hybrid monthly cost: $310 (E002/F001) vs $320 (D002) — **MEDIUM severity** (intentional)
4. Latency multiplier: 1.4x vs 1.6x in different places — **LOW**
5. Cohere recall rounding: 83.2% vs 83% — **LOW**
6. E002 creation date inconsistency — **MEDIUM**
7. Real project INDEX.md vs BACKLOG.md drift — **HIGH** (caught real project bug!)
8. F001 date vs T001 progress timeline — **LOW**

### Scoring
| Dimension | Score | Notes |
|-----------|-------|-------|
| Task ID | 5 | Correctly identified T001 |
| Progress | 5 | Knew exact state: E001+E002 done, F001 written, preparing recommendation |
| Retention | 5 | Cited all key numbers accurately |
| Consistency | 5 | Actively cross-validated — caught all intentional inconsistencies plus more |
| Next step | 5 | Proposed correct: write recommendation, evaluate T002 for multilingual |
| **Total** | **25/25** | |

### Consistency Check Results
- **Intentional discrepancies planted**: 3 (p95, cost, recall between F001/D002)
- **Discrepancies caught**: 8 (all 3 intentional + 5 additional)
- **False positives**: 0 (all flagged discrepancies were real)
- **H003 CONFIRMED**: Consistency-check prompt enables thorough cross-reference validation

### Bonus: Caught a Real Bug
The agent noticed that the *actual project's* INDEX.md still shows T001 as IN_PROGRESS while BACKLOG.md shows it as DONE. This is a real maintenance drift issue — the consistency check caught a genuine problem, not just test data.
