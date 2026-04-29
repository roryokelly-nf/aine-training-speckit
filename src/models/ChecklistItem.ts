export interface ChecklistItem {
  id: string
  text: string
  completed: boolean
  createdAt: string
}

export function createChecklistItem(text: string): ChecklistItem {
  return {
    id: crypto.randomUUID(),
    text: text.trim(),
    completed: false,
    createdAt: new Date().toISOString(),
  }
}
