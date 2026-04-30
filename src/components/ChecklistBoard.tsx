import { useState } from 'react'
import type { Checklist } from '../models/Checklist'
import { CreateChecklistForm } from './CreateChecklistForm'
import { ChecklistCard } from './ChecklistCard'
import { SearchFilterBar } from './SearchFilterBar'
import type { FilterValue } from './SearchFilterBar'

interface Props {
  checklists: Checklist[]
  onCreateChecklist: (name: string) => void
  onRenameChecklist: (id: string, newName: string) => void
  onDeleteChecklist: (id: string) => void
  onAddItem: (checklistId: string, text: string) => void
  onToggleItem: (checklistId: string, itemId: string) => void
  onEditItem: (checklistId: string, itemId: string, newText: string) => void
  onDeleteItem: (checklistId: string, itemId: string) => void
  onShareChecklist?: (id: string) => void
}

function matchesQuery(cl: Checklist, query: string): boolean {
  const q = query.trim().toLowerCase()
  if (!q) return true
  return (
    cl.name.toLowerCase().includes(q) ||
    cl.items.some((item) => item.text.toLowerCase().includes(q))
  )
}

function matchesFilter(cl: Checklist, filter: FilterValue): boolean {
  if (filter === 'all') return true
  if (filter === 'active') return cl.items.some((item) => !item.completed)
  return cl.items.length > 0 && cl.items.every((item) => item.completed)
}

export function ChecklistBoard({
  checklists,
  onCreateChecklist,
  onRenameChecklist,
  onDeleteChecklist,
  onAddItem,
  onToggleItem,
  onEditItem,
  onDeleteItem,
  onShareChecklist,
}: Props) {
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState<FilterValue>('all')

  const visible = checklists
    .filter((cl) => matchesFilter(cl, filter))
    .filter((cl) => matchesQuery(cl, query))

  function emptyMessage(): string {
    if (query.trim()) return 'No checklists match your search.'
    if (filter !== 'all') return `No ${filter} checklists.`
    return 'No checklists yet. Create one above.'
  }

  return (
    <div className="space-y-6">
      <CreateChecklistForm onSubmit={onCreateChecklist} />
      {checklists.length > 0 && (
        <SearchFilterBar
          query={query}
          onQueryChange={setQuery}
          filter={filter}
          onFilterChange={setFilter}
        />
      )}
      {visible.length === 0 ? (
        <p className="text-center text-gray-400 py-16 text-sm">
          {emptyMessage()}
        </p>
      ) : (
        <div className="space-y-4">
          {visible.map((cl) => (
            <ChecklistCard
              key={cl.id}
              checklist={cl}
              onRename={(name) => onRenameChecklist(cl.id, name)}
              onDelete={() => onDeleteChecklist(cl.id)}
              onAddItem={(text) => onAddItem(cl.id, text)}
              onToggleItem={(itemId) => onToggleItem(cl.id, itemId)}
              onEditItem={(itemId, text) => onEditItem(cl.id, itemId, text)}
              onDeleteItem={(itemId) => onDeleteItem(cl.id, itemId)}
              onShare={onShareChecklist}
            />
          ))}
        </div>
      )}
    </div>
  )
}
