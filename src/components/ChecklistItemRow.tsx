import type { ChecklistItem } from '../models/ChecklistItem'
import { EditableText } from './EditableText'

interface Props {
  item: ChecklistItem
  onToggle: () => void
  onEditText: (newText: string) => void
  onDelete: () => void
}

export function ChecklistItemRow({ item, onToggle, onEditText, onDelete }: Props) {
  return (
    <li style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <input type="checkbox" checked={item.completed} onChange={onToggle} aria-label={item.text} />
      <span style={{ textDecoration: item.completed ? 'line-through' : 'none', opacity: item.completed ? 0.6 : 1 }}>
        <EditableText value={item.text} onConfirm={onEditText} />
      </span>
      <button aria-label={`Delete item ${item.text}`} onClick={onDelete}>×</button>
    </li>
  )
}
