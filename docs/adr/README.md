# Architecture Decision Records

This directory contains Architecture Decision Records (ADRs) for the AICcountancy project.

## What is an ADR?

An Architecture Decision Record captures an important architectural decision made along with its context and consequences.

## ADR Template

When creating a new ADR, use the following template:

```markdown
# ADR-XXXX: [Title]

## Status
[Proposed | Accepted | Deprecated | Superseded by ADR-YYYY]

## Context
What is the issue that we're seeing that is motivating this decision or change?

## Decision
What is the change that we're proposing and/or doing?

## Consequences
What becomes easier or more difficult to do because of this change?
```

## Current ADRs

- [ADR-0001: Migrate to Separate Database](./0001-migrate-to-separate-database.md)
- [ADR-0002: AI Integration Architecture](./0002-ai-integration-architecture.md)

## Creating a New ADR

1. Copy the template above
2. Create a new file with the pattern: `XXXX-brief-description.md`
3. Fill in all sections
4. Submit a PR with the ADR for review