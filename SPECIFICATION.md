# Claude Research Director: An Autonomous AI Director with Persistent Memory, Dual-Flow Methodology, and Adversarial Agent Teams

**Version**: 2.0
**Date**: February 2026
**Authors**: The Agile Monkeys

---

## Abstract

We present the Claude Research Director, a methodology and infrastructure that transforms Claude Code into an autonomous AI Research & Engineering Director. The system addresses three fundamental limitations of LLM-based coding agents: (1) stateless memory that resets between sessions, (2) loss of accumulated knowledge during context window compaction, and (3) absence of self-correction mechanisms that prevent local optimization and error propagation.

The system introduces a file-based persistent knowledge base (`kb/`) with strict artifact registration, dual-flow task execution (research and engineering) with full traceability chains, and an adversarial agent team architecture where a Devil's Advocate agent provides independent critical review of all work. The result is an AI agent that accumulates knowledge across sessions, follows reproducible scientific and engineering workflows, and systematically challenges its own outputs through multi-agent delegation.

The system is deployed in production for AI search optimization research and is distributed as an installable skill (`/researcher-init`) for bootstrapping new projects.

---

## Table of Contents

1. [Introduction](#1-introduction)
2. [Problem Statement](#2-problem-statement)
3. [System Architecture](#3-system-architecture)
4. [The Knowledge Base](#4-the-knowledge-base)
5. [The Task System](#5-the-task-system)
6. [Dual-Flow Methodology](#6-dual-flow-methodology)
7. [Agent Teams & Adversarial Review](#7-agent-teams--adversarial-review)
8. [Compaction Safety](#8-compaction-safety)
9. [Communication Protocol](#9-communication-protocol)
10. [Distribution & Bootstrapping](#10-distribution--bootstrapping)
11. [Production Deployment](#11-production-deployment)
12. [Limitations & Future Work](#12-limitations--future-work)
13. [Conclusion](#13-conclusion)

---

## 1. Introduction

Large Language Model (LLM) coding agents have demonstrated remarkable capability in executing software engineering tasks — writing code, debugging, refactoring, and even conducting research. However, deploying these agents for sustained, multi-session projects exposes fundamental limitations that undermine their effectiveness:

- **Ephemeral memory**: Every session starts from zero. Prior discoveries, failed approaches, and accumulated expertise vanish.
- **Context compaction loss**: When conversations exceed the context window, compression discards nuance, intermediate reasoning, and state.
- **Confirmation bias**: A single agent reviewing its own work exhibits the same blind spots that produced the work. Without external challenge, errors propagate and compound.
- **No structured methodology**: Without enforced workflows, agents skip steps, produce unreproducible results, and make decisions without documenting reasoning.

The Claude Research Director addresses all four limitations through three interlocking mechanisms:

1. **A persistent, file-based knowledge base** that serves as the agent's long-term memory
2. **A dual-flow methodology** (research and engineering) with mandatory artifact registration and traceability chains
3. **An adversarial agent team architecture** where specialized agents — including a Devil's Advocate — provide independent review, parallel execution, and systematic error detection

The system is implemented entirely through Claude Code's native capabilities: `CLAUDE.md` files (auto-loaded instructions), custom agents (`.claude/agents/`), slash commands (`.claude/commands/`), and experimental agent teams. No external infrastructure is required beyond the file system.

---

## 2. Problem Statement

### 2.1 The Stateless Agent Problem

An LLM agent without persistent memory is a stateless function: it produces outputs based solely on its current input, with no access to prior invocations. This creates several failure modes:

- **Repeated exploration**: The agent re-investigates approaches it already tried and rejected in prior sessions.
- **Contradictory decisions**: Without access to prior reasoning, the agent may make decisions that contradict earlier ones.
- **Lost compounding**: Knowledge that should compound over time (e.g., "library X has a known bug with feature Y") is lost entirely.

### 2.2 The Compaction Problem

Claude Code compresses conversation history when approaching context window limits. This compression is lossy — it preserves high-level summaries but discards:

- Exact metric values and experimental parameters
- Intermediate reasoning steps
- The "surprises" and unexpected observations that often contain the most valuable insights
- Progress checkpoints needed to resume interrupted work

An agent that relies solely on compacted context will reconstruct an incomplete or distorted version of its prior work.

### 2.3 The Self-Review Problem

When an agent reviews its own work, it operates under the same assumptions, biases, and blind spots that produced the work. This is not a theoretical concern — it manifests concretely:

- **Hypothesis confirmation**: The agent designs experiments that are more likely to confirm than falsify its hypotheses.
- **Baseline selection bias**: The agent chooses baselines that make its approach look favorable.
- **Error blindness**: The agent cannot see bugs in code it wrote for the same reason the original programmer can't — both share the same mental model of what the code "should" do.
- **Local optimization**: The agent optimizes the current approach incrementally when a fundamentally different approach might be 10x better.

### 2.4 The Methodology Problem

Without enforced structure, agents exhibit several anti-patterns:

- Running experiments before formalizing hypotheses (making results uninterpretable)
- Producing findings disconnected from any experiment (making them untraceable)
- Making decisions without documenting alternatives considered (making them unreviewable)
- Implementing features without investigation (introducing avoidable technical debt)

---

## 3. System Architecture

### 3.1 Overview

The Claude Research Director consists of four layers:

```
┌─────────────────────────────────────────────────────────────┐
│                    LAYER 4: AGENT TEAMS                     │
│  Devil's Advocate · Researcher · Surveyor · Builder · Reviewer │
│  /challenge · /research-sprint · /engineering-sprint        │
├─────────────────────────────────────────────────────────────┤
│                 LAYER 3: METHODOLOGY                        │
│  Research Flow (H→E→F) · Engineering Flow (INV→FT→IMP)     │
│  Strategic Reviews · Traceability Chains                    │
├─────────────────────────────────────────────────────────────┤
│               LAYER 2: TASK SYSTEM                          │
│  Tasks (T{NUM}) · Priorities · Status Tracking · BACKLOG.md │
├─────────────────────────────────────────────────────────────┤
│            LAYER 1: PERSISTENT KNOWLEDGE BASE               │
│  kb/ directory · INDEX.md · Artifact Files · Lessons Learned │
└─────────────────────────────────────────────────────────────┘
```

**Layer 1** provides persistence. **Layer 2** provides work decomposition and tracking. **Layer 3** provides methodology and reproducibility. **Layer 4** provides adversarial review and parallelism.

Each layer depends on the ones below it. Agent teams write to the knowledge base. The methodology produces artifacts registered in the task system. The task system organizes work stored in the knowledge base.

### 3.2 File System Layout

```
project-root/
├── CLAUDE.md                    # Runtime instructions (auto-loaded every turn)
├── .claude/
│   ├── agents/                  # Agent role definitions
│   │   ├── devil-advocate.md    # Adversarial reviewer
│   │   ├── researcher.md       # Experiment executor
│   │   ├── surveyor.md         # Literature & SOTA specialist
│   │   ├── builder.md          # Feature implementer
│   │   └── reviewer.md         # Code & architecture reviewer
│   ├── commands/                # Slash commands (team orchestration)
│   │   ├── challenge.md        # /challenge — spawn devil's advocate
│   │   ├── research-sprint.md  # /research-sprint — spawn research team
│   │   ├── engineering-sprint.md # /engineering-sprint — spawn eng team
│   │   └── notion-sync.md      # /notion-sync — export to Notion
│   └── settings.json            # Agent teams feature flag
├── kb/                          # Persistent knowledge base
│   ├── INDEX.md                 # One-line summary of every artifact
│   ├── mission/                 # Challenge, backlog, decisions, CEO requests
│   ├── tasks/                   # Task detail files (T001-slug.md)
│   ├── research/                # Hypotheses, experiments, findings, literature, data
│   ├── engineering/             # Features, investigations, implementations, retrospectives
│   └── reports/                 # Strategic reviews, challenge reviews, milestone reports
├── templates/                   # 11 artifact templates
├── scripts/                     # Utility scripts (Notion sync)
├── skills/                      # Installable skills
├── experiments/                 # Experiment code (one dir per experiment)
└── src/                         # Engineering feature code
```

### 3.3 The Runtime: CLAUDE.md

The `CLAUDE.md` file is the system's runtime. Claude Code auto-loads it on every turn, which means the methodology is always active without requiring user reminders. This file contains:

- **Non-negotiable rules** (9 rules that survive compaction)
- **Session protocols** (what to read at start, during, and before ending)
- **Workflow definitions** (research and engineering)
- **Agent team configurations** and delegation patterns
- **Lessons learned** (appended over time, auto-loaded every turn)

The Lessons Learned section at the bottom of CLAUDE.md is the system's most compaction-resistant storage mechanism. Because CLAUDE.md reloads fully on every turn — even after compaction — lessons written here are never lost.

---

## 4. The Knowledge Base

### 4.1 Design Philosophy

The knowledge base (`kb/`) is the agent's persistent brain. Its design follows one principle: **if it's not in `kb/`, it didn't happen.** This is not bureaucracy — it is the mechanism that transforms a stateless agent into one that accumulates knowledge over time.

Every piece of work produces one or more artifacts. Every artifact has:
- A **sequential ID** (e.g., `H001`, `E003`, `F012`) — no gaps, globally unique per type
- A **file** in the appropriate `kb/` subdirectory
- A **row** in `kb/INDEX.md` for discoverability
- A **status** field tracking its lifecycle
- **Links** to related artifacts (backward to source, forward to consequences)

### 4.2 Structure

```
kb/
├── INDEX.md                      # Quick overview of ALL artifacts
├── mission/                      # Shared mission layer
│   ├── CHALLENGE.md              # Project objective
│   ├── BACKLOG.md                # Master task table + last artifact IDs
│   ├── DECISIONS.md              # Decision log with reasoning
│   └── CEO_REQUESTS.md           # Resource/info requests to the user
├── tasks/                        # Task detail files
│   ├── T001-slug.md
│   └── ...
├── research/                     # Research flow artifacts
│   ├── hypotheses/               # H001-xxx.md
│   ├── experiments/              # E001-xxx.md
│   ├── findings/                 # F001-xxx.md
│   ├── literature/               # L001-xxx.md
│   └── data/                     # Raw data, metrics, logs
├── engineering/                  # Engineering flow artifacts
│   ├── features/                 # FT001-xxx.md
│   ├── investigations/           # INV001-xxx.md
│   ├── implementations/          # IMP001-xxx.md
│   └── retrospectives/           # RET001-xxx.md
└── reports/                      # Strategic reviews (SR), challenge reviews (CR), milestones
```

### 4.3 INDEX.md and BACKLOG.md

Two files serve as the agent's primary navigation:

- **INDEX.md**: One-line summary per artifact. When the agent starts a session, it reads this to know what it knows. Analogous to a table of contents.
- **BACKLOG.md**: Current state of all tasks plus the last used ID for every artifact type. When the agent starts a session, it reads this to know what to work on. Prevents ID collisions.

### 4.4 Artifact ID Management

All artifacts use sequential, gapless IDs managed through BACKLOG.md:

| Prefix | Type | Example |
|---|---|---|
| T | Task | T001, T002, T003 |
| H | Hypothesis | H001, H002 |
| E | Experiment | E001, E002 |
| F | Finding | F001, F002 |
| L | Literature | L001, L002 |
| FT | Feature | FT001, FT002 |
| INV | Investigation | INV001, INV002 |
| IMP | Implementation | IMP001, IMP002 |
| RET | Retrospective | RET001, RET002 |
| CR | Challenge Review | CR001, CR002 |
| SR | Strategic Review | SR001, SR002 |
| D | Decision | D001, D002 |

Before creating any artifact, the agent checks BACKLOG.md for the next available ID. After creating it, the agent updates BACKLOG.md and INDEX.md. This ensures no duplicates or gaps, even across sessions.

### 4.5 Knowledge Retrieval Protocol

Before writing anything new to `kb/`, the agent searches for related prior work:

| Before... | First do... |
|---|---|
| Creating a task | Search `kb/tasks/` for related terms |
| Formulating a hypothesis | Search `kb/research/hypotheses/` for similar hypotheses |
| Designing an experiment | Read the hypothesis; check `kb/research/experiments/` for related experiments |
| Making a decision | Read `kb/mission/DECISIONS.md` for prior decisions on the same topic |
| Starting an investigation | Search `kb/engineering/investigations/` for the tool/approach |

This prevents redundant work and ensures new artifacts reference prior findings.

---

## 5. The Task System

### 5.1 Task Properties

Every unit of work is a task with:

| Property | Values |
|---|---|
| **ID** | `T{NUM}` — sequential, no gaps |
| **Type** | `research` or `engineering` |
| **Status** | `BACKLOG` → `TODO` → `IN_PROGRESS` → `DONE` (or `BLOCKED`) |
| **Priority** | `P0` (critical) / `P1` (high) / `P2` (normal) / `P3` (low) |
| **Linked Artifacts** | References to H, E, F, FT, INV, IMP, CR artifacts |

### 5.2 Source of Truth

The task file (`kb/tasks/T{NUM}-slug.md`) is the authoritative source. BACKLOG.md is a summary view. When they drift, the task file wins.

### 5.3 Task Lifecycle

```
CEO provides challenge
    │
    ▼
Director decomposes into tasks (T001, T002, ...)
    │
    ▼
Each task is typed: research or engineering
    │
    ├─ research → Research workflow (H→E→F chain)
    │
    └─ engineering → Engineering workflow (INV→FT→IMP)
    │
    ▼
Task produces artifacts, linked bidirectionally
    │
    ▼
Task marked DONE, artifacts indexed, lessons captured
```

---

## 6. Dual-Flow Methodology

The system recognizes that research and engineering have fundamentally different definitions of "done" and enforces different workflows for each.

### 6.1 Research Flow

**Purpose**: Validate technical viability. Answer: "Does approach X work, and how well?"

**Validation**: Evidence — confirmed/rejected hypotheses, benchmark results.

**Traceability chain**:
```
Task T{N} → Hypothesis H{N} → Experiment E{N} → Finding F{N} → Decision D{N}
                                                              → or next Hypothesis H{N+1}
```

**Workflow**:

| Step | Action | Artifact |
|---|---|---|
| 1. UNDERSTAND | Read/update mission context | — |
| 2. SURVEY | Search SOTA, review literature | L{NUM} |
| 3. HYPOTHESIZE | Formulate falsifiable hypothesis with metrics | H{NUM} |
| 4. DESIGN | Create experiment with procedure, baselines, expected outcome | E{NUM} |
| 5. EXECUTE | Run code, collect data | `kb/research/data/` |
| 6. ANALYZE | Update experiment with results and analysis | E{NUM} updated |
| 7. SYNTHESIZE | Write finding linking to H and E | F{NUM} |
| 8. REVIEW | Adversarial review via devil-advocate (every 3 experiments) | CR{NUM} |
| 9. DECIDE | Update hypothesis status, plan next iteration | D{NUM} |
| 10. REPORT | Milestone report | `kb/reports/` |

**Mandatory constraints**:
- Hypothesis file MUST exist before experiment file (Rule 3)
- Finding MUST link to an experiment (Rule 4)
- Adversarial review MUST occur every 3 experiments (Rule 5)

### 6.2 Engineering Flow

**Purpose**: Investigate, design, and ship features. Answer: "What is the best way to build X?"

**Validation**: Working, delivered code. Market validation, not benchmarks.

**Traceability chain**:
```
Task T{N} → Investigation INV{N} → Feature FT{N} → Implementation IMP{N} → Retrospective RET{N}
```

**Workflow**:

| Step | Action | Artifact |
|---|---|---|
| 1. UNDERSTAND | Read/update mission context | — |
| 2. INVESTIGATE | Research tools, libraries, patterns | INV{NUM} |
| 3. DECIDE | Document trade-offs and chosen approach | D{NUM} |
| 4. DESIGN | Write feature specification | FT{NUM} |
| 5. IMPLEMENT | Write code, track progress | IMP{NUM} |
| 6. TEST & DELIVER | Tests, integration, deployment | — |
| 7. REVIEW | Code review + adversarial challenge | CR{NUM} |
| 8. RETROSPECTIVE | Capture learnings | RET{NUM} |

**Engineering does NOT require** formal hypotheses, reproducible experiments, or statistical analysis. The investigation phase serves as "research-lite" for evaluating approaches.

### 6.3 Cross-Feeding

The two flows are not isolated. Research can trigger engineering and vice versa:

- **Research → Engineering**: "Finding F003 confirms approach Y gives 20% improvement → Create task T005 (type: engineering) to productionize it."
- **Engineering → Research**: "While implementing feature X, we discovered approach Z might be faster → Create task T008 (type: research) with hypothesis H005 to test it."

---

## 7. Agent Teams & Adversarial Review

### 7.1 Motivation

The most significant architectural addition in v2.0 is the adversarial agent team system. It addresses the self-review problem (Section 2.3) by introducing independent agents with opposing mandates.

The key insight: **self-assessment has inherent confirmation bias**. When the same agent that formulated a hypothesis also reviews the experiment results, it is predisposed to interpret ambiguous evidence as confirmation. An independent adversarial agent — with the explicit mandate to find flaws — produces qualitatively different feedback.

### 7.2 Agent Roles

Five specialized agents are defined in `.claude/agents/`:

| Agent | Mandate | Scope |
|---|---|---|
| **Devil's Advocate** | Destroy weak ideas before they waste time. Find bugs, challenge assumptions, expose hidden biases. | Code, research, decisions, KB structure, process |
| **Researcher** | Execute experiments with rigor. Follow H→E→F chain. Collect complete data. | Experiment design, execution, data collection |
| **Surveyor** | Find what exists. Establish baselines. Identify gaps. | Literature, SOTA, competing approaches |
| **Builder** | Ship working code. Clean, secure, tested. | Feature implementation, tests, delivery |
| **Reviewer** | Ensure quality. Catch issues before they ship. | Code review, architecture, security, test coverage |

Each agent is defined as a markdown file containing:
- Role description and mandate
- What it reviews and how
- Output format and artifact structure
- Rules and constraints
- Severity classification (for the Devil's Advocate)

### 7.3 Team Patterns

Three team patterns are implemented as slash commands:

#### 7.3.1 Research Sprint (`/research-sprint`)

Spawns a 3-agent team for research tasks:

```
Director (lead, delegate mode — coordinates, does not implement)
  ├─ Surveyor    → Literature, SOTA, baselines (starts immediately)
  ├─ Researcher  → Design & run experiments (may wait for baselines)
  └─ Critic      → Challenge hypotheses, experiment design, findings (devil-advocate role)
```

**Coordination**:
- Surveyor has no dependencies — begins immediately
- Researcher may wait for Surveyor to establish baselines
- Critic reviews hypotheses before experiments run, and results after
- Director synthesizes all outputs, resolves conflicts, updates `kb/`

#### 7.3.2 Engineering Sprint (`/engineering-sprint`)

Spawns a 3-agent team for engineering tasks:

```
Director (lead, delegate mode — coordinates, does not implement)
  ├─ Builder     → Implement feature (plan approval required before coding)
  ├─ Reviewer    → Code review, architecture check, test coverage
  └─ Critic      → Challenge approach, find edge cases, security audit (devil-advocate role)
```

**Coordination**:
- Builder must submit a plan; Director approves before implementation begins
- Reviewer reviews code as Builder produces it
- Critic challenges the approach from the start, independent of implementation
- Task cannot close until Reviewer approves and Critic's critical issues are resolved

#### 7.3.3 Challenge Review (`/challenge`)

Spawns the Devil's Advocate for targeted review of a specific domain:

| Target | What the Devil's Advocate Audits |
|---|---|
| **Everything** | Full audit: code, KB, decisions, research direction, process |
| **Code** | Bugs, security vulnerabilities, design flaws, missing tests, tech debt |
| **Research direction** | Hypothesis quality, experiment design, finding validity, local optimization |
| **Engineering decisions** | Approach selection, alternative analysis, consistency with prior decisions |
| **KB health** | Artifact consistency, orphaned files, ID gaps, stale decisions, index accuracy |

### 7.4 The Devil's Advocate in Detail

The Devil's Advocate is the system's most distinctive agent. Its design principles:

1. **Specificity over vagueness**: "Line 47: `users.find()` returns null when no match, but line 52 calls `.name` on the result without a null check" — not "the code has issues."
2. **Evidence-based criticism**: Every critique cites specific files, line numbers, KB artifacts, or data points.
3. **Severity classification**:
   - **CRITICAL**: Will cause data loss, security breach, wrong research conclusions, or production failure
   - **HIGH**: Significant flaw that undermines the work's value
   - **MEDIUM**: Real issue that won't invalidate the overall outcome
   - **LOW**: Improvement opportunity
4. **Honesty over adversarialism**: If something is genuinely solid, the agent says so and explains why. Manufactured criticism is explicitly prohibited.
5. **Constructive destruction**: Every criticism includes a suggested fix when possible.

### 7.5 Mandatory Adversarial Triggers

The Devil's Advocate is not optional. These events MUST spawn it:

| Trigger | Review Type |
|---|---|
| Every 3 completed research experiments | Research direction challenge |
| Every major decision (D{NUM}) | Decision review before finalizing |
| Every feature delivery (IMP{NUM} → DONE) | Code + approach review |
| CEO invokes `/challenge` | On-demand review of specified target |

### 7.6 Challenge Review Artifacts

Reviews are written to `kb/reports/CR{NUM}-{slug}.md` with a standardized structure:

```
# CR{NUM}: Challenge Review — {Target}

- Date, Target, Requestor, Reviewer
- Summary (1-2 sentences)
- Critical Issues (must address before proceeding)
- High-Priority Issues (should address)
- Medium-Priority Issues (real but lower urgency)
- Low-Priority Issues (improvement opportunities)
- What's Actually Good (credibility requires honesty)
- Recommendations (concrete next steps by priority)
```

### 7.7 Team Coordination Rules

1. **Director stays in delegate mode** during sprints — coordination only, no implementation
2. **Builder requires plan approval** — the Director reviews the plan before coding begins
3. **Critic reviews are blocking** — critical issues must be resolved before task completion
4. **All artifacts go to `kb/`** — teammates follow the same registration rules as the Director
5. **Last IDs are shared** — coordination through BACKLOG.md prevents ID conflicts
6. **Clean up teams** — teammates are shut down and team resources cleaned up after each sprint

### 7.8 When to Use Teams vs. Solo

| Situation | Recommended Approach |
|---|---|
| Simple bug fix or small feature | Solo — teams add coordination overhead |
| Research task with clear hypothesis | Solo researcher, then `/challenge` the results |
| Complex research with unknown landscape | `/research-sprint` — parallel survey + execution + critique |
| Feature with architectural implications | `/engineering-sprint` — build + review + critique in parallel |
| Every 3 experiments (mandatory) | `/challenge` with "Research direction" |
| Before any major delivery | `/challenge` with "Code" |
| Suspicion of local optimization | `/challenge` with "Everything" |

---

## 8. Compaction Safety

### 8.1 The Problem

When Claude Code's context window fills, it compresses prior conversation. This compression:
- Preserves high-level summaries
- Discards exact values, parameters, and intermediate reasoning
- May introduce inconsistencies between the compressed summary and reality

### 8.2 The Solution: Three Layers of Protection

**Layer 1: CLAUDE.md auto-reload**

CLAUDE.md reloads fully on every turn, even after compaction. The Lessons Learned section at its bottom is the highest-priority compaction-safe storage. Anything written here is never lost.

**Layer 2: Post-compaction recovery protocol**

After compaction, the agent executes a mandatory recovery sequence:
1. Read `kb/INDEX.md` — what knowledge exists
2. Read `kb/mission/BACKLOG.md` — current task state
3. Read the active task file's **Progress** section — exact checkpoint of where work stopped
4. Read **Lessons Learned** in CLAUDE.md
5. Only then resume work

**Layer 3: Artifact-level progress tracking**

Every task, experiment, and implementation file has a **Progress** section updated at every stopping point. This is the breadcrumb trail that allows recovery from any compaction event. Additionally, a **Surprises** section captures unexpected observations immediately, before they can be lost.

### 8.3 What Goes Where

| Information Type | Storage Location | Compaction Survival |
|---|---|---|
| Reusable lessons (anti-patterns, tool quirks) | CLAUDE.md Lessons Learned section | Highest — auto-reloads every turn |
| Current work checkpoint | Task/experiment Progress section | High — explicitly read in recovery protocol |
| Unexpected observations | Artifact Surprises section | High — part of artifact file |
| Raw data and metrics | `kb/research/data/` | Permanent — file system |
| Decisions with reasoning | `kb/mission/DECISIONS.md` | Permanent — file system |
| All artifact summaries | `kb/INDEX.md` | Permanent — first thing read on recovery |

---

## 9. Communication Protocol

### 9.1 CEO Communication

The user (CEO) receives proactive updates, not just responses to queries:

| Event | Communication |
|---|---|
| Completing an experiment cycle | Telegram: hypothesis, result, next step |
| Making a significant decision | Telegram: decision, reasoning, impact |
| Strategic review | Telegram: review conclusions, direction change if any |
| Getting blocked | AskUserQuestion + update CEO_REQUESTS.md |
| Session end | Telegram: session summary, state, next steps |

### 9.2 CEO Requests

When the agent needs resources, information, or permissions, it:
1. Asks the CEO via `AskUserQuestion` (specifying what, why, and impact if denied)
2. Logs the request in `kb/mission/CEO_REQUESTS.md` with status PENDING
3. Updates status to RESOLVED / DENIED / DEFERRED when the CEO responds

### 9.3 Inter-Agent Communication

During team sprints, agents communicate via Claude Code's messaging system:
- **Direct messages**: Agent-to-agent for specific coordination
- **Broadcast**: Team-wide announcements (used sparingly due to token cost)
- **Shared task list**: All agents read from and write to the same task list
- **kb/ files**: The knowledge base serves as the persistent communication medium

---

## 10. Distribution & Bootstrapping

### 10.1 The researcher-init Skill

The system is distributed as a Claude Code skill that can bootstrap any project:

```
/researcher-init
```

This skill:
1. Asks for project name, workflow type (research/engineering/both), and challenge description
2. Creates the complete `kb/` directory structure (15 directories)
3. Generates a customized `CLAUDE.md` with the full methodology
4. Copies 11 artifact templates
5. Creates 5 agent role definitions
6. Creates 3 team command files
7. Enables agent teams in `.claude/settings.json`
8. Sets up Notion sync infrastructure

### 10.2 Templates

Eleven standardized templates ensure consistency across all artifacts:

| Template | Artifact Type | Key Sections |
|---|---|---|
| task.md | T{NUM} | Description, acceptance criteria, linked artifacts, progress |
| hypothesis.md | H{NUM} | Statement, variables, success metrics, falsification criteria |
| experiment.md | E{NUM} | Hypothesis link, setup, procedure, expected outcome, results, analysis |
| finding.md | F{NUM} | Experiment link, evidence, conclusion, implications |
| literature.md | L{NUM} | Source, summary, methodology, relevance, limitations |
| feature.md | FT{NUM} | User story, acceptance criteria, technical approach |
| investigation.md | INV{NUM} | Options evaluated, trade-offs, recommendation |
| implementation.md | IMP{NUM} | Feature spec link, approach, code location, validation |
| retrospective.md | RET{NUM} | What worked, what didn't, lessons, process improvements |
| report.md | R{NUM} | Executive summary, findings, recommendations |
| backlog.md | BACKLOG.md | Task table, last IDs for all artifact types |

### 10.3 Notion Sync

An optional one-way sync exports the knowledge base to Notion:

```
/notion-sync
```

This creates Notion databases for structured collections (tasks, hypotheses, experiments, findings) and pages for narrative content (challenge, decisions, reports). Change tracking via content hashing prevents duplicate syncs.

---

## 11. Production Deployment

### 11.1 AIFindr Search Research

The system is deployed in production for the AIFindr Search project — an AI-powered fashion e-commerce search engine. Over the course of the research:

- **13 hypotheses** formulated and tested
- **15 experiments** executed with full reproducibility
- **27 findings** synthesized with traceability to source experiments
- **6 strategic reviews** conducted
- **67 lessons learned** accumulated and persisted across sessions
- **23+ decisions** documented with reasoning and alternatives

The knowledge base grew to 180+ data files while remaining navigable through INDEX.md and BACKLOG.md.

### 11.2 Key Observations from Production Use

1. **The Lessons Learned section is the system's most valuable feature.** It is the only storage that truly survives everything — compaction, session boundaries, and even new project members reading into the codebase.

2. **The H→E→F chain prevents post-hoc rationalization.** By requiring the hypothesis before the experiment, and the experiment before the finding, the system forces the agent to commit to predictions before seeing results.

3. **Strategic reviews at 3-experiment intervals catch pivoting moments.** In the AIFindr deployment, strategic review SR003 identified that incremental improvements to query understanding had hit a ceiling, leading to a pivot toward multimodal reranking — a fundamentally different approach.

4. **The agent teams feature (v2.0) addresses the primary remaining weakness**: the agent reviewing its own work. The Devil's Advocate catches issues the Director consistently misses.

---

## 12. Limitations & Future Work

### 12.1 Current Limitations

- **Agent teams are experimental.** Claude Code's agent teams feature has known limitations: no session resumption with in-process teammates, task status can lag, and one team per session.
- **Token cost of teams.** Each teammate is a separate Claude instance. Research and engineering sprints consume 3-4x the tokens of solo work. The system provides guidance on when teams are worth the cost.
- **No automated triggers.** The Devil's Advocate triggers (every 3 experiments, every delivery) are enforced by CLAUDE.md rules, not by automated hooks. The agent must self-enforce. Future versions could use Claude Code's `TaskCompleted` hooks for true automation.
- **File-based coordination.** Multiple agents writing to `kb/` simultaneously could theoretically create race conditions on ID assignment. In practice, BACKLOG.md coordination prevents this, but it is not formally locked.
- **Notion sync is one-way.** Changes in Notion are not reflected back to `kb/`. The file system is the source of truth.

### 12.2 Future Work

- **Hook-based triggers**: Use Claude Code's `TeammateIdle` and `TaskCompleted` hooks to automatically enforce quality gates and trigger the Devil's Advocate.
- **Persistent team configurations**: Allow named team presets (e.g., "deep-research" with 5 agents, "quick-review" with just the Devil's Advocate) saved in `.claude/teams/`.
- **Cross-project knowledge transfer**: A mechanism for one project's findings and lessons to inform another project's investigations, without conflating their knowledge bases.
- **Quantitative self-improvement**: Track the Devil's Advocate's hit rate — what percentage of critical issues identified were genuine? Use this to calibrate severity thresholds.
- **Automated KB health checks**: A scheduled `/challenge` with "KB health" that runs at session start, not just on demand.

---

## 13. Conclusion

The Claude Research Director transforms Claude Code from a stateless coding assistant into an autonomous AI director with persistent memory, reproducible workflows, and adversarial self-correction. Its three core mechanisms — file-based knowledge persistence, dual-flow methodology with traceability chains, and adversarial agent teams — address the fundamental limitations that prevent LLM agents from conducting sustained, multi-session research and engineering work.

The Devil's Advocate agent is the system's most distinctive contribution. By replacing self-assessment with independent adversarial review, it introduces a quality control mechanism that no single-agent system can achieve. The agent that writes the code is not the same agent that reviews it — and the reviewing agent's explicit mandate is to find flaws.

The system is available as an installable skill (`/researcher-init`) and has been validated in production on a multi-month AI search optimization research project, accumulating 67 lessons learned, 27 findings, and 15 experiments — all reproducible, traceable, and navigable.

---

*Made with AI by [The Agile Monkeys](https://theagilemonkeys.com)*
