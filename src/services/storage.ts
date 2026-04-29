import type { Checklist } from '../models/Checklist'

const KEY = 'chkl:checklists'

export function loadChecklists(): Checklist[] {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? (JSON.parse(raw) as Checklist[]) : []
  } catch {
    return []
  }
}

export function saveChecklists(checklists: Checklist[]): void {
  localStorage.setItem(KEY, JSON.stringify(checklists))
}

export function clearChecklists(): void {
  localStorage.removeItem(KEY)
}
