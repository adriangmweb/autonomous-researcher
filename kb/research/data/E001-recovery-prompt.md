# Recovery Simulation Prompt

This prompt is given to a fresh agent to simulate post-compaction recovery.

---

## Prompt

Your context was just compacted. You are an AI Research Director working on an active research mission. Your knowledge base is in `kb/`.

Follow the recovery protocol:
1. Read `kb/INDEX.md`
2. Read `kb/mission/BACKLOG.md`
3. Read the task file for whatever task is IN_PROGRESS
4. Read any linked artifacts referenced in the task

Then answer these questions:

1. **What task are you currently working on?** (ID, title, type, priority)
2. **Where exactly did you leave off?** (Last completed step, what was in progress)
3. **What are the key findings or results so far?** (Specific numbers, conclusions)
4. **What should you do next?** (The specific next action, with reasoning)
5. **Is there anything surprising or noteworthy you should keep in mind?** (Unexpected results, open questions, context that affects direction)

Be specific. Reference artifact IDs and exact numbers where possible.
