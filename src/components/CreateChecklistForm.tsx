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
    <div>
      <input
        value={name}
        onChange={(e) => { setName(e.target.value); setError(false) }}
        onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
        placeholder="New checklist name"
      />
      <button onClick={handleSubmit}>Create</button>
      {error && <span role="alert">Name cannot be empty</span>}
    </div>
  )
}
