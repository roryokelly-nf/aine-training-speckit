import type { Checklist } from '../models/Checklist'
import { CreateChecklistForm } from './CreateChecklistForm'
import { ChecklistCard } from './ChecklistCard'

interface Props {
  checklists: Checklist[]
  onCreateChecklist: (name: string) => void
  onRenameChecklist: (id: string, newName: string) => void
  onDeleteChecklist: (id: string) => void
  onAddItem: (checklistId: string, text: string) => void
  onToggleItem: (checklistId: string, itemId: string) => void
  onEditItem: (checklistId: string, itemId: string, newText: string) => void
  onDeleteItem: (checklistId: string, itemId: string) => void
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
}: Props) {
  return (
    <div>
      <CreateChecklistForm onSubmit={onCreateChecklist} />
      {checklists.length === 0 ? (
        <p>No checklists yet. Create one above.</p>
      ) : (
        checklists.map((cl) => (
          <ChecklistCard
            key={cl.id}
            checklist={cl}
            onRename={(name) => onRenameChecklist(cl.id, name)}
            onDelete={() => onDeleteChecklist(cl.id)}
            onAddItem={(text) => onAddItem(cl.id, text)}
            onToggleItem={(itemId) => onToggleItem(cl.id, itemId)}
            onEditItem={(itemId, text) => onEditItem(cl.id, itemId, text)}
            onDeleteItem={(itemId) => onDeleteItem(cl.id, itemId)}
          />
        ))
      )}
    </div>
  )
}
