# UI Contracts: Create and Manage Checklists

**Phase**: 1 — Design & Contracts
**Date**: 2026-04-29

These contracts define the public interface of each React component — their required and
optional props. Contracts are technology-agnostic in intent; the TypeScript signatures are
the implementation-level expression of each contract.

---

## App (root)

**Responsibility**: Loads checklists from storage on mount; holds the master `checklists`
array in state; persists on every mutation; passes data and callbacks to child components.

**Props**: None (root component)

**State**:
```typescript
checklists: Checklist[]   // loaded from storage.loadChecklists()
```

**Behaviours**:
- On mount: load from localStorage → set state
- On any mutation (add/rename/delete checklist, add/toggle/edit/delete item): update state → persist

---

## ChecklistBoard

**Responsibility**: Renders the list of all checklists; provides the "new checklist" entry point.

```typescript
interface ChecklistBoardProps {
  checklists: Checklist[];
  onCreateChecklist: (name: string) => void;
  onRenameChecklist: (id: string, newName: string) => void;
  onDeleteChecklist: (id: string) => void;
  onAddItem:         (checklistId: string, text: string) => void;
  onToggleItem:      (checklistId: string, itemId: string) => void;
  onEditItem:        (checklistId: string, itemId: string, newText: string) => void;
  onDeleteItem:      (checklistId: string, itemId: string) => void;
}
```

**Acceptance contracts**:
- When `checklists` is empty, renders a prompt to create the first checklist.
- Renders one `ChecklistCard` per checklist in creation order.

---

## ChecklistCard

**Responsibility**: Renders a single checklist — its name, progress, items, and action buttons.

```typescript
interface ChecklistCardProps {
  checklist: Checklist;
  onRename:     (newName: string) => void;
  onDelete:     () => void;
  onAddItem:    (text: string) => void;
  onToggleItem: (itemId: string) => void;
  onEditItem:   (itemId: string, newText: string) => void;
  onDeleteItem: (itemId: string) => void;
}
```

**Acceptance contracts**:
- Displays checklist name (editable via `EditableText`).
- Displays progress as `{completedCount} / {totalCount}` items.
- When all items are completed and `totalCount > 0`, displays a "complete" visual indicator.
- Delete action MUST show a confirmation before invoking `onDelete`.

---

## ChecklistItemRow

**Responsibility**: Renders a single item row — checkbox, editable text, delete button.

```typescript
interface ChecklistItemRowProps {
  item: ChecklistItem;
  onToggle:     () => void;
  onEditText:   (newText: string) => void;
  onDelete:     () => void;
}
```

**Acceptance contracts**:
- Checkbox reflects `item.completed`; toggling calls `onToggle`.
- Item text is editable inline via `EditableText`; confirmed edit calls `onEditText`.
- Delete button calls `onDelete` (no confirmation at item level — only at checklist level).
- Completed items MUST be visually distinguished (e.g., strikethrough text, muted colour).

---

## CreateChecklistForm

**Responsibility**: Input field + submit button for creating a new checklist.

```typescript
interface CreateChecklistFormProps {
  onSubmit: (name: string) => void;
}
```

**Acceptance contracts**:
- Submitting an empty or whitespace-only name MUST show a validation error and NOT call
  `onSubmit`.
- On successful submit, the input is cleared and focus is returned to the input.

---

## EditableText

**Responsibility**: Displays text as a label; switches to an input on activation (click/focus);
confirms on Enter or blur; cancels on Escape.

```typescript
interface EditableTextProps {
  value: string;
  onConfirm: (newValue: string) => void;
  placeholder?: string;
  className?: string;
}
```

**Acceptance contracts**:
- Confirming an empty or whitespace-only value MUST revert to the original value without
  calling `onConfirm`.
- Pressing Escape MUST cancel the edit and revert without calling `onConfirm`.
- After confirming, the component returns to display (non-editing) mode.

---

## storage service

**Responsibility**: Pure functions for reading and writing the checklists array to/from
localStorage. No React dependencies.

```typescript
function loadChecklists(): Checklist[]
function saveChecklists(checklists: Checklist[]): void
function clearChecklists(): void   // used in tests only
```

**Acceptance contracts**:
- `loadChecklists()` returns `[]` if the key is absent or the stored value is not valid JSON.
- `saveChecklists([])` writes an empty array (does not delete the key).
- Both functions are synchronous.
