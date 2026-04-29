import { useState, useRef, useEffect } from 'react'

interface Props {
  value: string
  onConfirm: (newValue: string) => void
  placeholder?: string
  className?: string
}

export function EditableText({ value, onConfirm, placeholder, className }: Props) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(value)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (editing) inputRef.current?.focus()
  }, [editing])

  function activate() {
    setDraft(value)
    setEditing(true)
  }

  function confirm() {
    const trimmed = draft.trim()
    if (trimmed) onConfirm(trimmed)
    setEditing(false)
    setDraft(value)
  }

  function cancel() {
    setEditing(false)
    setDraft(value)
  }

  if (!editing) {
    return (
      <span className={className} onClick={activate} style={{ cursor: 'pointer' }}>
        {value || <span style={{ opacity: 0.5 }}>{placeholder}</span>}
      </span>
    )
  }

  return (
    <input
      ref={inputRef}
      value={draft}
      placeholder={placeholder}
      onChange={(e) => setDraft(e.target.value)}
      onBlur={confirm}
      onKeyDown={(e) => {
        if (e.key === 'Enter') confirm()
        if (e.key === 'Escape') cancel()
      }}
    />
  )
}
