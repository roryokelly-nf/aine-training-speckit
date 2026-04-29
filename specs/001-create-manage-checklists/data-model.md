# Data Model: Create and Manage Checklists

**Phase**: 1 — Design & Contracts
**Date**: 2026-04-29

---

## Entities

### Checklist

Represents a named, ordered collection of checklist items.

```typescript
interface Checklist {
  id: string;           // UUID v4, generated at creation
  name: string;         // Non-empty; user-provided; duplicates allowed
  items: ChecklistItem[];
  createdAt: string;    // ISO 8601 timestamp
}
```

**Validation rules**:
- `name` MUST NOT be empty or whitespace-only (FR-010)
- `id` MUST be unique across all checklists
- `items` may be an empty array (a checklist can be created with no items)

**Computed properties** (derived, not stored):
- `completedCount`: `items.filter(i => i.completed).length`
- `totalCount`: `items.length`
- `isComplete`: `totalCount > 0 && completedCount === totalCount`

**Factory**:
```typescript
function createChecklist(name: string): Checklist {
  return { id: crypto.randomUUID(), name: name.trim(), items: [], createdAt: new Date().toISOString() };
}
```

---

### ChecklistItem

Represents a single actionable item within a checklist.

```typescript
interface ChecklistItem {
  id: string;           // UUID v4, generated at creation
  text: string;         // Non-empty; user-provided
  completed: boolean;   // Default: false
  createdAt: string;    // ISO 8601 timestamp
}
```

**Validation rules**:
- `text` MUST NOT be empty or whitespace-only (FR-011)
- `id` MUST be unique within its parent checklist

**Factory**:
```typescript
function createChecklistItem(text: string): ChecklistItem {
  return { id: crypto.randomUUID(), text: text.trim(), completed: false, createdAt: new Date().toISOString() };
}
```

---

## State Transitions

### ChecklistItem completion state

```
uncompleted ──(user checks)──► completed
completed   ──(user unchecks)─► uncompleted
```

### Checklist completion state (derived)

```
incomplete ──(all items checked)──► complete
complete   ──(any item unchecked)─► incomplete
complete   ──(item added)──────────► incomplete  (new item defaults to uncompleted)
```

---

## Persistence Schema

All checklists are stored as a single JSON array under `localStorage` key `chkl:checklists`.

```json
[
  {
    "id": "a1b2c3d4-...",
    "name": "Grocery Run",
    "items": [
      { "id": "e5f6...", "text": "Milk", "completed": true,  "createdAt": "2026-04-29T10:00:00Z" },
      { "id": "g7h8...", "text": "Eggs", "completed": false, "createdAt": "2026-04-29T10:00:05Z" }
    ],
    "createdAt": "2026-04-29T10:00:00Z"
  }
]
```

**Constraints**:
- The stored array is parsed on app load; if parsing fails, the app starts with an empty array
  (corrupt data is discarded, not surfaced as an error to the user).
- No migration strategy is needed for v1 — schema is stable across the single feature scope.

---

## Relationships

```
Checklist 1──* ChecklistItem
```

- A Checklist owns zero or more ChecklistItems.
- ChecklistItems do not exist outside a Checklist.
- Deleting a Checklist cascades to delete all its items (handled by removing the Checklist
  object from the array — items are inline, not stored separately).
