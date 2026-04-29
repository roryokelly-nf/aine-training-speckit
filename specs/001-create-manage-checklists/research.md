# Research: Create and Manage Checklists

**Phase**: 0 — Outline & Research
**Date**: 2026-04-29
**Branch**: `001-create-manage-checklists`

---

## Decision 1: Target Platform

**Decision**: Browser-based single-page application (SPA)

**Rationale**: The spec assumption refers to "device/browser" as the persistence boundary,
and a web app is the most broadly accessible delivery format requiring no installation. It
satisfies the offline-capable constraint via localStorage without any native app tooling.

**Alternatives considered**:
- CLI (Node.js): Would suit the `chkl` shorthand but narrows the user base and complicates
  item-completion interaction patterns compared to a checkbox UI.
- Native desktop app (Electron/Tauri): Adds significant build/distribution complexity with
  no user-facing benefit given the single-user, local-only scope.

---

## Decision 2: Language and Framework

**Decision**: TypeScript 5.x + React 18 + Vite 5

**Rationale**: React is the simplest mature framework for interactive UI components with
per-item state (checked/unchecked, inline edit). TypeScript prevents a class of runtime
errors on the data model. Vite offers fast dev server startup and near-zero configuration.

**Alternatives considered**:
- Vanilla HTML/CSS/JS: Feasible for this scale but managing DOM state manually for 3 user
  stories (create, track, edit/delete) adds incidental complexity that React eliminates.
- Vue 3: Comparable to React but React Testing Library tooling is more mature for this
  test-first approach.
- Svelte: Smaller output but narrower ecosystem; RTL support less mature.

---

## Decision 3: Persistence Layer

**Decision**: `localStorage` via a thin `storage.ts` service module

**Rationale**: localStorage is universally available in modern browsers, requires no server,
works offline, and persists across sessions — satisfying all spec requirements (FR-009).
A dedicated `storage.ts` module wraps `getItem`/`setItem` so the rest of the app is
decoupled from the storage mechanism, making unit tests straightforward.

**Data layout**:
```json
{
  "chkl:checklists": "[{...Checklist}, ...]"
}
```
All checklists are stored as a single serialized array under one key. For the single-user,
single-device scope this is simpler and faster than per-checklist keys.

**Alternatives considered**:
- IndexedDB: More capable but adds async complexity for no benefit at this scale.
- sessionStorage: Does not persist across sessions — violates FR-009.
- A backend/database: Violates YAGNI and the "no server required" constraint.

---

## Decision 4: Testing Strategy

**Decision**: Vitest + React Testing Library (RTL)

**Rationale**: Vitest runs in the same Vite pipeline (no separate Jest config), and RTL
tests components via user-visible behaviour rather than implementation details, aligning
with the test-first principle. `localStorage` is mocked in tests via `vi.stubGlobal`.

**Test layers**:
- **Unit tests**: `storage.ts` functions (save/load/clear) with mocked localStorage.
- **Component tests**: Each component rendered via RTL; interactions via `userEvent`.
  Written before implementation code per TDD principle.
- **No E2E tests in scope for v1**: The spec does not require them; adds complexity.

**Alternatives considered**:
- Jest: More configuration needed to work alongside Vite; no advantage over Vitest here.
- Playwright E2E: Out of scope per YAGNI — no spec requirement for end-to-end coverage.

---

## Decision 5: Component Design Pattern

**Decision**: Controlled components with state lifted to `App.tsx`; no global state library

**Rationale**: With one feature (checklists) and straightforward data flow
(load → display → mutate → save), prop-drilling one level is cleaner than adding
Redux/Zustand (YAGNI). `App.tsx` loads from localStorage on mount, holds the
`checklists` array in state, and persists on every mutation.

**Alternatives considered**:
- Context API: Adds indirection without benefit when state only flows two levels deep.
- Redux / Zustand: Significant overhead for a single domain object type.
- Local component state (no lifting): Would make cross-checklist operations awkward and
  complicate persistence triggering.

---

## Resolved NEEDS CLARIFICATION Items

None — the spec was generated without any unresolved clarification markers. All technical
decisions above were inferred from spec requirements and YAGNI principle.
