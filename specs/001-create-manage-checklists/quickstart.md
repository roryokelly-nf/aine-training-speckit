# Quickstart: Create and Manage Checklists

**Date**: 2026-04-29

## Prerequisites

- Node.js 18+ installed
- `npm` available

## Setup

```bash
npm create vite@latest . -- --template react-ts
npm install
npm install -D vitest @testing-library/react @testing-library/user-event @testing-library/jest-dom jsdom
```

Add to `vite.config.ts`:

```typescript
/// <reference types="vitest" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test-setup.ts'],
    globals: true,
  },
})
```

Create `src/test-setup.ts`:

```typescript
import '@testing-library/jest-dom'
```

## Development

```bash
npm run dev        # Start dev server at http://localhost:5173
npm test           # Run tests in watch mode
npm run build      # Production build to dist/
```

## Running Tests (TDD flow)

Tests live in `tests/`. Write tests first, verify they fail, then implement.

```bash
npm test                    # Watch mode (all tests)
npm test -- --run           # Run once (CI)
npm test -- storage         # Filter by filename
```

## Validation

To manually validate the quickstart against spec acceptance scenarios:

1. `npm run dev` → open `http://localhost:5173`
2. **US1 (Create)**: Enter a checklist name → submit → checklist appears. Add an item → it appears.
3. **US2 (Track)**: Check an item → progress count updates. Uncheck → reverts. Check all → checklist marked complete.
4. **US3 (Edit/Delete)**: Rename a checklist → new name shown everywhere. Delete an item → removed.
   Delete checklist → confirmation shown → checklist removed.
5. Refresh the page → all checklists and item states persist (localStorage).
