import { useState, useEffect } from 'react'
import type { Checklist } from '../models/Checklist'
import { createChecklist } from '../models/Checklist'
import { createChecklistItem } from '../models/ChecklistItem'
import { loadChecklists, saveChecklists } from '../services/storage'
import { ChecklistBoard } from './ChecklistBoard'
import { ShareLinkModal } from './ShareLinkModal'
import { SharedChecklistView } from './SharedChecklistView'

function getSharedData(): string | null {
  const hash = window.location.hash
  if (hash.startsWith('#shared/')) return hash.slice('#shared/'.length)
  return null
}

export function App() {
  const sharedData = getSharedData()

  if (sharedData !== null) {
    return <SharedChecklistView encodedData={sharedData} />
  }

  return <ChecklistApp />
}

function ChecklistApp() {
  const [checklists, setChecklists] = useState<Checklist[]>([])
  const [sharingId, setSharingId] = useState<string | null>(null)

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

  function handleShare(id: string) {
    setSharingId(id)
  }

  function handleShareDataGenerated(id: string, shareData: string) {
    persist(checklists.map((cl) => cl.id === id ? { ...cl, shareData } : cl))
  }

  const sharingChecklist = sharingId ? checklists.find((cl) => cl.id === sharingId) : null

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">Checklists</h1>
      </header>
      <main className="max-w-3xl mx-auto px-6 py-8">
        <ChecklistBoard
          checklists={checklists}
          onCreateChecklist={handleCreate}
          onRenameChecklist={handleRename}
          onDeleteChecklist={handleDelete}
          onAddItem={handleAddItem}
          onToggleItem={handleToggleItem}
          onEditItem={handleEditItem}
          onDeleteItem={handleDeleteItem}
          onShareChecklist={handleShare}
        />
      </main>
      {sharingChecklist && (
        <ShareLinkModal
          checklist={sharingChecklist}
          onClose={() => setSharingId(null)}
          onShareDataGenerated={handleShareDataGenerated}
        />
      )}
    </div>
  )
}
