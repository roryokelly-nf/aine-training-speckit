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
}

export function ChecklistCard({
  checklist,
  onRename,
  onDelete,
  onAddItem,
  onToggleItem,
  onEditItem,
  onDeleteItem,
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
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <EditableText value={checklist.name} onConfirm={onRename} />
        {complete && <span>✓ Complete</span>}
        <button aria-label="Delete checklist" onClick={() => {
          if (window.confirm(`Delete "${checklist.name}"?`)) onDelete()
        }}>Delete</button>
      </div>

      {total > 0 && (
        <div>{done} / {total}</div>
      )}

      <ul>
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

      <input
        value={newItem}
        onChange={(e) => setNewItem(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && submitItem()}
        placeholder="Add item…"
      />
    </div>
  )
}
