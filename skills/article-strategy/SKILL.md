---
name: article-strategy
description: Generate publishable article ideas and drafts from kb evidence. Use when asked to propose content strategy, select article angles, or write technical articles grounded in research findings and decisions.
---

# Article Strategy

Turn `kb/` knowledge into high-value technical articles.

## Workflow

### Phase 1: Proposal

1. Read `kb/INDEX.md`.
2. Read relevant findings, experiments, decisions, and lessons.
3. Propose 5-8 article ideas with:
   - Title
   - Angle
   - Target audience
   - Source files in `kb/`
4. Ask the user which ideas to write.

### Phase 2: Writing

For each selected article:

1. Read all cited source files.
2. Write draft to `kb/articles/ART{NUM}-slug.md`.
3. Include front matter with title, date, status (`DRAFT`), and sources.
4. Update `kb/INDEX.md` with the new article.

## Quality Rules

- No fluff.
- Make claims traceable to `kb/` sources.
- Include failures and trade-offs, not only wins.
- Favor actionable takeaways for practitioners.

## Draft Template

```markdown
---
title: "Article Title"
date: YYYY-MM-DD
status: DRAFT
sources:
  - kb/research/findings/F001-example.md
tags: [research]
---

# Article Title

Article content...
```
