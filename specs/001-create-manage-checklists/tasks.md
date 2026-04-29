---
description: "Task list for Create and Manage Checklists"
---

# Tasks: Create and Manage Checklists

**Input**: Design documents from `specs/001-create-manage-checklists/`
**Prerequisites**: plan.md ✅, spec.md ✅, research.md ✅, data-model.md ✅, contracts/ui-contracts.md ✅

**Tests**: Included — TDD is NON-NEGOTIABLE per constitution (Principle II).
Red-Green-Refactor is mandatory: write tests first, verify they fail, then implement.

**Organization**: Tasks grouped by user story for independent implementation and delivery.

## Format: `[ID] [P?] [Story?] Description with file path`

- **[P]**: Can run in parallel (different files, no shared dependencies)
- **[Story]**: User story label (US1, US2, US3)

---

## Phase 1: Setup

**Purpose**: Initialize project tooling and directory structure

- [ ] T001 Initialize Vite + React + TypeScript project in repository root (`npm create vite@latest . -- --template react-ts`)
- [ ] T002 Install test dependencies: vitest, @testing-library/react, @testing-library/user-event, @testing-library/jest-dom, jsdom (`npm install -D ...`)
- [ ] T003 [P] Configure Vitest in vite.config.ts (jsdom environment, globals: true, setupFiles: ['./src/test-setup.ts'])
- [ ] T004 [P] Create src/test-setup.ts with `import '@testing-library/jest-dom'`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Shared types, storage service, and the reusable EditableText component — all user stories depend on these

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] T005 [P] Create Checklist type + `createChecklist()` factory in src/models/Checklist.ts
- [ ] T006 [P] Create ChecklistItem type + `createChecklistItem()` factory in src/models/ChecklistItem.ts
- [ ] T007 Write storage service tests in tests/services/storage.test.ts — must FAIL before T008
- [ ] T008 Implement `loadChecklists`, `saveChecklists`, `clearChecklists` in src/services/storage.ts (depends on T007)
- [ ] T009 Write EditableText component tests in tests/components/EditableText.test.tsx — must FAIL before T010
- [ ] T010 Implement EditableText component in src/components/EditableText.tsx (depends on T009)

**Checkpoint**: Models, storage, and EditableText pass all tests — user story implementation can now begin in parallel

---

## Phase 3: User Story 1 — Create a Checklist (Priority: P1) 🎯 MVP

**Goal**: Users can create a named checklist, add items to it, and see it persist across sessions

**Independent Test**: Open app → create checklist → add items → refresh page → checklist and items are still present

### Tests for User Story 1 ⚠️ Write these FIRST — verify they FAIL before implementing

- [ ] T011 [P] [US1] Write CreateChecklistForm tests (empty name rejected, valid name submits, input clears) in tests/components/CreateChecklistForm.test.tsx
- [ ] T012 [P] [US1] Write ChecklistCard add-item tests (item appears after submit, blank item rejected) in tests/components/ChecklistCard.test.tsx

### Implementation for User Story 1

- [ ] T013 [US1] Implement CreateChecklistForm component in src/components/CreateChecklistForm.tsx (depends on T011)
- [ ] T014 [US1] Implement ChecklistCard with add-item form (no toggle/progress yet) in src/components/ChecklistCard.tsx (depends on T012)
- [ ] T015 [US1] Write ChecklistBoard tests (empty state prompt, list of cards, create flow) in tests/components/ChecklistBoard.test.tsx
- [ ] T016 [US1] Implement ChecklistBoard component in src/components/ChecklistBoard.tsx (depends on T015)
- [ ] T017 [US1] Implement App.tsx: load from storage on mount, hold `checklists` state, persist on every mutation, render ChecklistBoard in src/components/App.tsx
- [ ] T018 [US1] Configure src/main.tsx entry point (render App into #root)

**Checkpoint**: User Story 1 is fully functional — create checklist, add items, refresh, items persist

---

## Phase 4: User Story 2 — Complete and Track Checklist Items (Priority: P2)

**Goal**: Users can check/uncheck items and see progress (e.g., "2 / 5 items done"); fully-completed checklists are visually distinguished

**Independent Test**: Open existing checklist → check items → progress count updates → uncheck → count reverts → check all → checklist marked complete → refresh → state persists

### Tests for User Story 2 ⚠️ Write these FIRST — verify they FAIL before implementing

- [ ] T019 [P] [US2] Write ChecklistItemRow tests (renders text + checkbox, toggle calls handler, completed item has strikethrough) in tests/components/ChecklistItemRow.test.tsx
- [ ] T020 [P] [US2] Add ChecklistCard progress tests (displays X/Y count, all-complete indicator) to tests/components/ChecklistCard.test.tsx

### Implementation for User Story 2

- [ ] T021 [US2] Implement ChecklistItemRow with checkbox toggle + completed visual style in src/components/ChecklistItemRow.tsx (depends on T019)
- [ ] T022 [US2] Update ChecklistCard to render ChecklistItemRow list + progress display (`completedCount / totalCount`) + all-complete indicator in src/components/ChecklistCard.tsx (depends on T020)
- [ ] T023 [US2] Wire `onToggleItem` callback through App.tsx state mutations in src/components/App.tsx

**Checkpoint**: User Stories 1 and 2 both work independently — create, add, check, track progress, persist

---

## Phase 5: User Story 3 — Edit and Delete Checklists (Priority: P3)

**Goal**: Users can rename a checklist, edit item text, delete individual items, and delete an entire checklist (with confirmation)

**Independent Test**: Rename checklist → new name shown everywhere. Edit item → new text shown. Delete item → removed, others unaffected. Delete checklist → confirmation shown → checklist and all items gone

### Tests for User Story 3 ⚠️ Write these FIRST — verify they FAIL before implementing

- [ ] T024 [P] [US3] Add ChecklistCard rename + delete-with-confirmation tests to tests/components/ChecklistCard.test.tsx
- [ ] T025 [P] [US3] Add ChecklistItemRow edit-text + delete-item tests to tests/components/ChecklistItemRow.test.tsx

### Implementation for User Story 3

- [ ] T026 [US3] Update ChecklistCard: rename via EditableText, delete button with `window.confirm` guard in src/components/ChecklistCard.tsx (depends on T024)
- [ ] T027 [US3] Update ChecklistItemRow: inline text edit via EditableText, delete button in src/components/ChecklistItemRow.tsx (depends on T025)
- [ ] T028 [US3] Wire `onRenameChecklist`, `onDeleteChecklist`, `onEditItem`, `onDeleteItem` callbacks through App.tsx in src/components/App.tsx

**Checkpoint**: All three user stories independently functional and tested

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final validation and production readiness

- [ ] T029 [P] Run full test suite and confirm all tests pass (`npm test -- --run`)
- [ ] T030 [P] Run production build and verify bundle size < 5MB (`npm run build`)
- [ ] T031 Manual validation: follow all scenarios in specs/001-create-manage-checklists/quickstart.md

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — start immediately
- **Foundational (Phase 2)**: Depends on Setup — **blocks all user stories**
- **User Story 1 (Phase 3)**: Depends on Foundational
- **User Story 2 (Phase 4)**: Depends on Foundational; integrates with US1 components
- **User Story 3 (Phase 5)**: Depends on Foundational; integrates with US1+US2 components
- **Polish (Phase 6)**: Depends on all desired user stories complete

### Within Each User Story

1. Write tests → verify they FAIL
2. Models (if any) before services
3. Services before components
4. Core component before wiring through App.tsx
5. Story complete before moving to next priority

### Parallel Opportunities

- T003, T004 can run in parallel (different files)
- T005, T006 can run in parallel (different model files)
- T007, T009 can run in parallel (different test files)
- T011, T012 can run in parallel (different test files)
- T019, T020 can run in parallel (different test files)
- T024, T025 can run in parallel (different test files)
- T029, T030 can run in parallel

---

## Parallel Example: User Story 1

```bash
# Write both test files together:
Task: "Write CreateChecklistForm tests in tests/components/CreateChecklistForm.test.tsx"  # T011
Task: "Write ChecklistCard add-item tests in tests/components/ChecklistCard.test.tsx"     # T012

# Then implement in order: T013 → T014 → T015 → T016 → T017 → T018
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL — blocks all stories)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Open app, create checklist, add items, refresh — all persists
5. Ship/demo if ready

### Incremental Delivery

1. Setup + Foundational → base ready
2. User Story 1 → Create & persist checklists (MVP)
3. User Story 2 → Check off items + track progress
4. User Story 3 → Full management (rename, edit, delete)

Each story adds value without breaking previous stories.

---

## Notes

- `[P]` = different files, no dependency conflicts — safe to run concurrently
- `[US#]` maps each task to its user story for traceability
- Tests marked "must FAIL before implementing" enforce Red-Green-Refactor (TDD Principle II)
- Each story phase ends with a Checkpoint — validate independently before continuing
- Commit after each task or logical group
