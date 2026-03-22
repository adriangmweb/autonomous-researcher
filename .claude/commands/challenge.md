# Challenge — Devil's Advocate Review

Spawn the Devil's Advocate to adversarially review a specific target. This is for **on-demand critical review** of any aspect of the project.

## Workflow

### Phase 1: Determine Target

Ask the user what to challenge using `AskUserQuestion`:

**Question**: What should the Devil's Advocate review?
- **Everything** — Full audit: code, KB consistency, decisions, research direction
- **Code** — Review codebase for bugs, security issues, design flaws, missing tests
- **Research direction** — Challenge current hypotheses, experiment design, and findings
- **Engineering decisions** — Review architecture choices, tech stack, implementation approach
- **KB health** — Audit knowledge base for consistency, orphans, staleness, gaps

### Phase 2: Read Context

Before spawning, read:
1. `kb/INDEX.md` — what knowledge exists
2. `kb/mission/BACKLOG.md` — current state of tasks
3. `kb/mission/DECISIONS.md` — decisions to challenge
4. The specific files related to the target (task files, experiment files, code, etc.)

Determine the next `CR{NUM}` by checking existing files in `kb/reports/` matching `CR*`.

### Phase 3: Spawn Devil's Advocate

Spawn the devil-advocate agent as a teammate (or subagent for focused reviews). Give it a specific, detailed prompt based on the target:

**For "Everything":**
```
Review the entire project state. Read kb/INDEX.md, kb/mission/BACKLOG.md, kb/mission/DECISIONS.md, and scan the codebase.
Audit for: code bugs, security issues, KB inconsistencies, questionable decisions, research methodology flaws, and process gaps.
Write your review to kb/reports/CR{NUM}-full-audit.md.
```

**For "Code":**
```
Review the codebase at src/ and experiments/. Read kb/project/ARCHITECTURE.md if it exists.
Look for: bugs, security vulnerabilities, design flaws, missing tests, dead code, and tech debt.
Write your review to kb/reports/CR{NUM}-code-review.md.
```

**For "Research direction":**
```
Read all hypothesis files in kb/research/hypotheses/, all experiment files in kb/research/experiments/,
and all findings in kb/research/findings/. Also read kb/mission/DECISIONS.md for research decisions.
Challenge: Are we testing the right things? Are our baselines fair? Are our conclusions supported?
Is there a fundamentally different approach we haven't considered?
Write your review to kb/reports/CR{NUM}-research-challenge.md.
```

**For "Engineering decisions":**
```
Read kb/mission/DECISIONS.md, all investigation files in kb/engineering/investigations/,
and all feature specs in kb/engineering/features/.
Challenge: Were enough alternatives considered? Are the trade-offs correctly evaluated?
Do decisions contradict each other? What's the cost of being wrong?
Write your review to kb/reports/CR{NUM}-engineering-challenge.md.
```

**For "KB health":**
```
Audit the entire kb/ directory structure. Check:
- Do BACKLOG.md task statuses match the task files?
- Are all artifacts in INDEX.md? Are there files NOT in INDEX.md?
- Are artifact IDs sequential with no gaps?
- Do all findings link to experiments? Do all experiments link to hypotheses?
- Are there stale/outdated decisions?
- Are Lessons Learned in CLAUDE.md consistent with findings?
Write your review to kb/reports/CR{NUM}-kb-health.md.
```

### Phase 4: Synthesize and Report

After the review completes:
1. Read the review file (CR{NUM})
2. Update `kb/INDEX.md` with the new review artifact
3. Present the executive summary to the CEO with critical issues highlighted
4. If critical issues were found, suggest immediate next steps
5. Run `python3 scripts/kb_validate.py` before closing the review

### Phase 5: Communicate

Post a concise summary in the active session:
```
Challenge Review CR{NUM} complete.

Target: {what was reviewed}
Critical issues: {count}
High-priority: {count}
Top finding: {most important issue in one sentence}

Review: kb/reports/CR{NUM}-{slug}.md
```
