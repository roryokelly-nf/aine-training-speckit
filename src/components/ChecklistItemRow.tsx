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
    <li className="group flex items-center gap-3 px-4 py-2 hover:bg-gray-50 transition-colors">
      <input
        type="checkbox"
        checked={item.completed}
        onChange={onToggle}
        aria-label={item.text}
        className="h-4 w-4 rounded border-gray-300 text-violet-600 accent-violet-600 shrink-0 cursor-pointer"
      />
      <span className={`flex-1 text-sm min-w-0 ${item.completed ? 'line-through text-gray-400' : 'text-gray-700'}`}>
        <EditableText value={item.text} onConfirm={onEditText} />
      </span>
      <button
        aria-label={`Delete item ${item.text}`}
        onClick={onDelete}
        className="text-gray-300 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all text-lg leading-none shrink-0"
      >
        ×
      </button>
    </li>
  )
}
