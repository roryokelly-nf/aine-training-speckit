<!--
Sync Impact Report
==================
Version change: N/A → 1.0.0 (initial ratification)
New sections: Core Principles (4 principles), Quality Standards, Development Workflow, Governance
Modified principles: None — initial creation
Templates checked:
  - .specify/templates/plan-template.md ✅ Constitution Check section dynamically resolved at runtime
  - .specify/templates/spec-template.md ✅ Aligned with Spec-Driven and Story Independence principles
  - .specify/templates/tasks-template.md ✅ Aligned with Test-First and Story Independence principles
Deferred TODOs: None
-->

# Checklist App Constitution

## Core Principles

### I. Spec-Driven Development
Every feature MUST have an approved `spec.md` before implementation begins. Features without a
corresponding specification MUST NOT be coded. Specifications MUST be reviewed and all ambiguities
resolved via `/speckit-clarify` before planning or implementation starts.

**Rationale**: Prevents scope creep, aligns intent before costly implementation work, and ensures
features are deliberately designed rather than discovered during coding.

### II. Test-First (TDD) — NON-NEGOTIABLE
Tests MUST be written before implementation code. The Red-Green-Refactor cycle is mandatory:
write failing tests → confirm they fail → implement → confirm they pass. No feature is considered
complete without passing tests that were written before the implementation.

**Rationale**: Test-first development forces clear interface design, catches integration issues
early, and produces a living specification proving the system behaves as intended.

### III. Simplicity (YAGNI)
Solutions MUST start with the simplest approach that satisfies the specification. Abstractions,
additional frameworks, and speculative complexity MUST NOT be introduced without a concrete,
present need. Three similar lines of code are preferable to a premature abstraction.

**Rationale**: Premature complexity is the primary source of maintenance burden and defects.
Features not yet required must not be built.

### IV. Independent Story Delivery
Each user story MUST be independently implementable, testable, and demonstrable as a standalone
MVP slice. Cross-story dependencies MUST be explicitly declared in the spec. No story may block
another unless that dependency is documented and agreed upon before implementation begins.

**Rationale**: Independent stories enable incremental delivery, reduce integration risk, and
allow meaningful progress demonstrations at every stage without waiting for all stories to be done.

## Quality Standards

All code MUST pass the full test suite before merging. Every pull request MUST include or update
tests that verify changed behavior. Code review is required for all changes affecting core logic
or data models. Performance-impacting changes MUST include a rationale in the PR description.
No `TODO` comments may be merged without a corresponding tracked issue.

## Development Workflow

Features MUST follow this phase sequence — skipping phases requires documented justification:

1. Write the feature description and run `/speckit-specify`.
2. Resolve ambiguities with `/speckit-clarify` until the spec is unambiguous.
3. Generate an implementation plan with `/speckit-plan`.
4. Generate tasks with `/speckit-tasks`.
5. Implement using `/speckit-implement`.

## Governance

This constitution supersedes all ad-hoc practices and informal agreements. Amendments MUST:

1. Be proposed with a clear rationale.
2. Increment the version number per semantic versioning:
   - **MAJOR**: Principle removal, redefinition, or backward-incompatible governance change.
   - **MINOR**: New principle or section added, or materially expanded guidance.
   - **PATCH**: Clarifications, wording improvements, or non-semantic refinements.
3. Record an updated `Last Amended` date in ISO 8601 format.

All PRs and code reviews MUST verify compliance with the principles above. Complexity violations
MUST be justified using the Complexity Tracking table in `plan.md`.

**Version**: 1.0.0 | **Ratified**: 2026-04-29 | **Last Amended**: 2026-04-29
