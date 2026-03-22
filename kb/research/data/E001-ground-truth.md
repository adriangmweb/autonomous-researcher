# E001 Ground Truth — Scoring Reference

## Scoring Dimensions (1-5 each, max 25)

### 1. Task Identification
- 5: Correctly identifies T001 as current task, knows its title and type
- 4: Identifies T001 but misses some detail (e.g., priority, type)
- 3: Identifies the right area of work but not the specific task ID
- 2: Vague about what it's working on
- 1: Identifies wrong task or says no task is active

### 2. Progress Awareness
- 5: Knows exactly where it left off, cites specific completed and pending steps
- 4: Knows the general stage but misses the exact stopping point
- 3: Knows some work was done but wants to restart significant portions
- 2: Acknowledges prior work exists but can't locate where it stopped
- 1: Starts from scratch as if no work was done

### 3. Prior Finding Retention
- 5: Accurately references all key results/findings with correct numbers
- 4: References findings but gets a minor detail wrong
- 3: Knows findings exist but summarizes them inaccurately
- 2: Vaguely aware of prior results
- 1: No awareness of prior findings (or none exist yet — score N/A, give 5)

### 4. Consistency
- 5: All statements consistent with prior decisions and findings
- 4: Minor inconsistency that wouldn't affect direction
- 3: One meaningful contradiction with prior work
- 2: Multiple contradictions
- 1: Proposes direction that directly contradicts established findings

### 5. Correct Next Step
- 5: Proposes exactly the right next action with correct reasoning
- 4: Right general direction but misses a nuance (e.g., the multilingual finding)
- 3: Reasonable next step but not the optimal one given context
- 2: Proposes work that's already been done
- 1: Proposes something irrelevant or contradictory

---

## Ground Truth per Stage

### Early Stage
- **Task ID**: T001 — Embedding model selection for product search
- **Progress**: Hypothesis H001 formulated, no experiments run yet
- **Findings**: None yet
- **Next step**: Design E001 to benchmark 3 embedding models
- **Nuances**: None yet — this is straightforward

### Mid Stage
- **Task ID**: T001 — Embedding model selection for product search
- **Progress**: E001 completed, designing E002 (hybrid approach)
- **Findings**: text-embedding-3-large best recall (87%) but 3x slower; small is 74%; Cohere 83%
- **Next step**: Design and run E002 testing hybrid retrieval+reranking
- **Nuances**: Latency constraint is important (real-time product search)

### Late Stage
- **Task ID**: T001 — Embedding model selection for product search
- **Progress**: E001 + E002 completed, F001 written, preparing final recommendation
- **Findings**: Hybrid (small+large rerank) = 85% recall, 1.4x latency. Cohere better for non-English (91% vs 78%)
- **Next step**: Write final recommendation, consider new task for multilingual investigation
- **Nuances**: (1) Cohere multilingual surprise should be mentioned, (2) D002 decision about hybrid over pure-large, (3) potential new task for multilingual research
