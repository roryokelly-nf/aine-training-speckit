import { useState, useEffect } from 'react'
import type { Checklist } from '../models/Checklist'
import { createChecklist } from '../models/Checklist'
import { createChecklistItem } from '../models/ChecklistItem'
import { loadChecklists, saveChecklists } from '../services/storage'
import { ChecklistBoard } from './ChecklistBoard'

export function App() {
  const [checklists, setChecklists] = useState<Checklist[]>([])

  useEffect(() => {
    setChecklists(loadChecklists())
  }, [])

  function persist(updated: Checklist[]) {
    setChecklists(updated)
    saveChecklists(updated)
  }

  function handleCreate(name: string) {
    persist([...checklists, createChecklist(name)])
  }

  function handleRename(id: string, newName: string) {
    persist(checklists.map((cl) => cl.id === id ? { ...cl, name: newName } : cl))
  }

  function handleDelete(id: string) {
    persist(checklists.filter((cl) => cl.id !== id))
  }

  function handleAddItem(checklistId: string, text: string) {
    persist(checklists.map((cl) =>
      cl.id === checklistId
        ? { ...cl, items: [...cl.items, createChecklistItem(text)] }
        : cl
    ))
  }

  function handleToggleItem(checklistId: string, itemId: string) {
    persist(checklists.map((cl) =>
      cl.id === checklistId
        ? { ...cl, items: cl.items.map((item) => item.id === itemId ? { ...item, completed: !item.completed } : item) }
        : cl
    ))
  }

  function handleEditItem(checklistId: string, itemId: string, newText: string) {
    persist(checklists.map((cl) =>
      cl.id === checklistId
        ? { ...cl, items: cl.items.map((item) => item.id === itemId ? { ...item, text: newText } : item) }
        : cl
    ))
  }

  function handleDeleteItem(checklistId: string, itemId: string) {
    persist(checklists.map((cl) =>
      cl.id === checklistId
        ? { ...cl, items: cl.items.filter((item) => item.id !== itemId) }
        : cl
    ))
  }

  return (
    <main>
      <h1>Checklists</h1>
      <ChecklistBoard
        checklists={checklists}
        onCreateChecklist={handleCreate}
        onRenameChecklist={handleRename}
        onDeleteChecklist={handleDelete}
        onAddItem={handleAddItem}
        onToggleItem={handleToggleItem}
        onEditItem={handleEditItem}
        onDeleteItem={handleDeleteItem}
      />
    </main>
  )
}
