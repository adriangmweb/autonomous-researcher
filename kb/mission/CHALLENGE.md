# Challenge

> **Status**: ACTIVE

## Objective

Investigate and improve session continuity in the Autonomous Researcher system. When an agent's context is compacted (long conversation, session restart, or handoff), how well does it recover its working state from `kb/` artifacts? Where does information get lost, and what changes to the methodology, templates, or artifact structure would improve recovery?

## Success Criteria

1. Measured baseline: quantify what an agent retains and loses after simulated compaction across at least 3 recovery scenarios
2. Identified the top failure modes (e.g., lost progress checkpoints, contradicted findings, repeated experiments)
3. Delivered at least 2 concrete, tested improvements to CLAUDE.md, templates, or artifact structure that measurably improve recovery quality
4. All findings documented with evidence in `kb/`

## Constraints

- **Budget**: $5 API cost total for experiments
- **Scope**: Focus on the recovery protocol (INDEX.md → BACKLOG.md → task file → Lessons Learned), not on the agent's general reasoning ability
- **Method**: Simulate compaction by starting fresh sessions with only `kb/` state — do not rely on actual context window compaction events

## Scope

### In scope
- Recovery protocol effectiveness (what the agent reads, what it misses)
- Progress section formats and their impact on recovery
- INDEX.md detail levels and their impact on orientation
- Template structure changes that improve checkpoint quality
- Lessons Learned section effectiveness

### Out of scope
- Agent reasoning quality beyond recovery (prompt engineering for general tasks)
- Multi-agent coordination continuity
- UI/tooling changes
- Cost optimization of the research loop itself

## Background

The Autonomous Researcher uses a file-based knowledge base (`kb/`) as persistent memory. After context compaction, the agent is instructed to read INDEX.md → BACKLOG.md → task file → Lessons Learned before continuing. This protocol was designed intuitively but has never been empirically validated. The quality of recovery directly determines whether the agent can sustain multi-session research without regressing.
