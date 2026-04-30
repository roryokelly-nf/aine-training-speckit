import { useState } from 'react'

interface Props {
  onSubmit: (name: string) => void
}

export function CreateChecklistForm({ onSubmit }: Props) {
  const [name, setName] = useState('')
  const [error, setError] = useState(false)

  function handleSubmit() {
    if (!name.trim()) {
      setError(true)
      return
    }
    onSubmit(name.trim())
    setName('')
    setError(false)
  }

  return (
    <div className="space-y-1">
      <div className="flex gap-2">
        <input
          value={name}
          onChange={(e) => { setName(e.target.value); setError(false) }}
          onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
          placeholder="New checklist name"
          className={`flex-1 text-sm px-3 py-2 rounded-lg border ${error ? 'border-red-400 focus:ring-red-300' : 'border-gray-200 focus:ring-violet-300'} bg-white outline-none focus:ring-2 transition-shadow`}
        />
        <button
          onClick={handleSubmit}
          className="px-4 py-2 text-sm font-medium text-white bg-violet-600 hover:bg-violet-700 rounded-lg transition-colors"
        >
          Create
        </button>
      </div>
      {error && (
        <p role="alert" className="text-xs text-red-500 pl-1">Name cannot be empty</p>
      )}
    </div>
  )
}
