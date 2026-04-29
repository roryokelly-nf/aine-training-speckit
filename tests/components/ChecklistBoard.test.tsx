import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ChecklistBoard } from '../../src/components/ChecklistBoard'
import { createChecklist } from '../../src/models/Checklist'

function makeProps(overrides = {}) {
  return {
    checklists: [],
    onCreateChecklist: vi.fn(),
    onRenameChecklist: vi.fn(),
    onDeleteChecklist: vi.fn(),
    onAddItem: vi.fn(),
    onToggleItem: vi.fn(),
    onEditItem: vi.fn(),
    onDeleteItem: vi.fn(),
    ...overrides,
  }
}

describe('ChecklistBoard', () => {
  it('shows empty state prompt when no checklists exist', () => {
    render(<ChecklistBoard {...makeProps()} />)
    expect(screen.getByText(/no checklists/i)).toBeInTheDocument()
  })

  it('renders a card for each checklist', () => {
    const checklists = [createChecklist('Alpha'), createChecklist('Beta')]
    render(<ChecklistBoard {...makeProps({ checklists })} />)
    expect(screen.getByText('Alpha')).toBeInTheDocument()
    expect(screen.getByText('Beta')).toBeInTheDocument()
  })

  it('calls onCreateChecklist when a new checklist is submitted', async () => {
    const onCreateChecklist = vi.fn()
    render(<ChecklistBoard {...makeProps({ onCreateChecklist })} />)
    await userEvent.type(screen.getByPlaceholderText(/new checklist/i), 'My List')
    await userEvent.click(screen.getByRole('button', { name: /create/i }))
    expect(onCreateChecklist).toHaveBeenCalledWith('My List')
  })
})
