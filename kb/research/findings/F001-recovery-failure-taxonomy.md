# F001 — Recovery failure mode taxonomy

> **Date**: 2026-03-21
> **Task**: T002
> **Hypothesis**: H001
> **Experiment**: E001
> **Impact**: HIGH

## Finding

Three distinct failure modes in post-compaction recovery, ranked by impact:

### FM1: Context Isolation Failure (HIGH impact)

**What**: When artifacts are sparse (early-stage work), the agent reaches beyond its working scope to find context. It reads unrelated files, conflates separate workstreams, or gets confused by meta-level information.

**Root cause**: The recovery protocol says "read INDEX.md → BACKLOG.md → task file" but doesn't say "read ONLY these files." With minimal artifact content, the agent's uncertainty drives it to explore broadly, and anything it finds becomes part of its reconstructed context.

**When it occurs**: Early in a task when only 1-2 artifacts exist. Also when multiple workstreams share the same kb/ and boundaries are unclear.

**Evidence**: Early-stage simulation scored 20/25. Agent read files outside the seed directory, conflated the real project with the seed scenario, and identified itself as being inside its own experiment.

**Impact**: Wrong task identification, contaminated context, wasted work on wrong direction. This is the most dangerous failure because the agent proceeds confidently with wrong context.

### FM2: Cross-Reference Inconsistency Blindness (MEDIUM impact)

**What**: The agent reconstructs facts from artifacts but does not cross-check consistency between them. If two artifacts contain contradictory numbers (due to updates, typos, or drift), the agent uses whichever it read last without flagging the discrepancy.

**Root cause**: The recovery protocol is designed for reconstruction, not verification. There is no "validate consistency" step. The agent trusts artifact content at face value.

**When it occurs**: In long-running research with many artifacts, especially after edits or when multiple agents contribute to the same kb/.

**Evidence**: Late-stage simulation scored 25/25 on reconstruction but did not flag intentional inconsistencies between F001 and D002 (p95: 95ms vs 112ms, cost: $310 vs $320).

**Impact**: Decisions based on contradictory data, silent drift in key metrics, inability to detect data quality issues. Medium impact because the core direction is usually right even with minor inconsistencies.

### FM3: Artifact Detail Quality Determines Recovery Ceiling (MEDIUM impact)

**What**: Recovery quality is directly proportional to artifact detail quality. Rich Progress sections, specific numbers, and clear next-step indicators enable perfect recovery. Sparse artifacts with minimal checkpoints produce poor recovery.

**Root cause**: The recovery protocol reads artifacts but cannot infer context that was never written down. If the agent didn't checkpoint its reasoning or intermediate state, that information is permanently lost.

**When it occurs**: Always — this is a structural property of the system, not an occasional failure. The difference between 20/25 and 25/25 was entirely attributable to artifact richness.

**Evidence**: Mid (rich experiment with detailed results) and late (multiple detailed artifacts) scored 25/25. Early (sparse hypothesis-only) scored 20/25.

**Impact**: Determines the ceiling of recovery quality. Not a failure per se, but the leverage point for improvement. Medium impact because the system already encourages detailed artifacts — the question is enforcement.

## Evidence

| Source | Finding |
|--------|---------|
| E001 Early simulation | FM1: Context contamination, agent conflated real and seed state (20/25) |
| E001 Mid simulation | No failures — rich artifacts enabled perfect recovery (25/25) |
| E001 Late simulation | FM2: Numeric inconsistencies between artifacts not flagged (25/25 but with hidden weakness) |
| E001 All stages | FM3: Score directly correlated with artifact detail level |

## Implications

1. **FM1 (isolation)** → Improvement needed: Add scope boundaries to recovery protocol. "Read ONLY the artifacts linked from your current task." Prevents contamination from unrelated workstreams.
2. **FM2 (cross-validation)** → Improvement needed: Add a consistency-check step to recovery protocol. "After reconstruction, spot-check that key numbers are consistent across artifacts."
3. **FM3 (artifact quality)** → Improvement needed: Strengthen Progress section templates to enforce richer checkpoints. Consider adding a "Recovery Context" section to experiment/task templates.

## Actions Taken

- H001 rejected (recovery improves with state, doesn't degrade)
- Failure taxonomy documented for T003 improvement design
- T002 acceptance criteria met: taxonomy created, examples provided, ranking by impact, root causes identified
