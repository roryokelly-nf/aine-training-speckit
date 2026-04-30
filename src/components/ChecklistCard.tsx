import { useState } from 'react'
import type { Checklist } from '../models/Checklist'
import { completedCount, isComplete } from '../models/Checklist'
import { EditableText } from './EditableText'
import { ChecklistItemRow } from './ChecklistItemRow'

interface Props {
  checklist: Checklist
  onRename: (newName: string) => void
  onDelete: () => void
  onAddItem: (text: string) => void
  onToggleItem: (itemId: string) => void
  onEditItem: (itemId: string, newText: string) => void
  onDeleteItem: (itemId: string) => void
  onShare?: (id: string) => void
}

export function ChecklistCard({
  checklist,
  onRename,
  onDelete,
  onAddItem,
  onToggleItem,
  onEditItem,
  onDeleteItem,
  onShare,
}: Props) {
  const [newItem, setNewItem] = useState('')

  function submitItem() {
    if (!newItem.trim()) return
    onAddItem(newItem.trim())
    setNewItem('')
  }

  const done = completedCount(checklist)
  const total = checklist.items.length
  const complete = isComplete(checklist)

  return (
    <div className={`bg-white rounded-xl border ${complete ? 'border-green-200' : 'border-gray-200'} shadow-sm overflow-hidden`}>
      <div className={`flex items-center justify-between px-4 py-3 ${complete ? 'bg-green-50' : 'bg-white'} border-b border-gray-100`}>
        <div className="flex items-center gap-2 min-w-0">
          <EditableText
            value={checklist.name}
            onConfirm={onRename}
            className="font-medium text-gray-900 text-sm truncate"
          />
          {complete && (
            <span className="inline-flex items-center gap-1 text-xs font-medium text-green-700 bg-green-100 px-2 py-0.5 rounded-full">
              ✓ Complete
            </span>
          )}
        </div>
        <div className="flex items-center gap-3 shrink-0 ml-2">
          {total > 0 && (
            <span className="text-xs text-gray-400 tabular-nums">{done}/{total}</span>
          )}
          {onShare && (
            <button
              aria-label="Share checklist"
              onClick={() => onShare(checklist.id)}
              className="text-xs text-gray-400 hover:text-blue-500 transition-colors"
            >
              Share
            </button>
          )}
          <button
            aria-label="Delete checklist"
            onClick={() => { if (window.confirm(`Delete "${checklist.name}"?`)) onDelete() }}
            className="text-xs text-gray-400 hover:text-red-500 transition-colors"
          >
            Delete
          </button>
        </div>
      </div>

      {checklist.items.length > 0 && (
        <ul className="divide-y divide-gray-50">
          {checklist.items.map((item) => (
            <ChecklistItemRow
              key={item.id}
              item={item}
              onToggle={() => onToggleItem(item.id)}
              onEditText={(text) => onEditItem(item.id, text)}
              onDelete={() => onDeleteItem(item.id)}
            />
          ))}
        </ul>
      )}

      <div className="px-4 py-2 border-t border-gray-100">
        <input
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && submitItem()}
          placeholder="Add item…"
          className="w-full text-sm text-gray-700 placeholder-gray-300 bg-transparent outline-none py-1"
        />
      </div>
    </div>
  )
}
