import type { ChecklistItem } from './ChecklistItem'

export interface Checklist {
  id: string
  name: string
  items: ChecklistItem[]
  createdAt: string
}

export function createChecklist(name: string): Checklist {
  return {
    id: crypto.randomUUID(),
    name: name.trim(),
    items: [],
    createdAt: new Date().toISOString(),
  }
}

export function completedCount(checklist: Checklist): number {
  return checklist.items.filter((i) => i.completed).length
}

export function isComplete(checklist: Checklist): boolean {
  return checklist.items.length > 0 && completedCount(checklist) === checklist.items.length
}
