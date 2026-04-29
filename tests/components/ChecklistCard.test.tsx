import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ChecklistCard } from '../../src/components/ChecklistCard'
import { createChecklist } from '../../src/models/Checklist'
import { createChecklistItem } from '../../src/models/ChecklistItem'

function makeProps(overrides = {}) {
  return {
    checklist: createChecklist('Test List'),
    onRename: vi.fn(),
    onDelete: vi.fn(),
    onAddItem: vi.fn(),
    onToggleItem: vi.fn(),
    onEditItem: vi.fn(),
    onDeleteItem: vi.fn(),
    ...overrides,
  }
}

describe('ChecklistCard — add item (US1)', () => {
  it('renders the checklist name', () => {
    render(<ChecklistCard {...makeProps()} />)
    expect(screen.getByText('Test List')).toBeInTheDocument()
  })

  it('calls onAddItem when a non-empty item is submitted', async () => {
    const onAddItem = vi.fn()
    render(<ChecklistCard {...makeProps({ onAddItem })} />)
    await userEvent.type(screen.getByPlaceholderText(/add item/i), 'Milk')
    await userEvent.keyboard('{Enter}')
    expect(onAddItem).toHaveBeenCalledWith('Milk')
  })

  it('does not call onAddItem for blank text', async () => {
    const onAddItem = vi.fn()
    render(<ChecklistCard {...makeProps({ onAddItem })} />)
    await userEvent.type(screen.getByPlaceholderText(/add item/i), '   ')
    await userEvent.keyboard('{Enter}')
    expect(onAddItem).not.toHaveBeenCalled()
  })

  it('clears the add-item input after submit', async () => {
    render(<ChecklistCard {...makeProps()} />)
    const input = screen.getByPlaceholderText(/add item/i)
    await userEvent.type(input, 'Eggs')
    await userEvent.keyboard('{Enter}')
    expect(input).toHaveValue('')
  })
})

describe('ChecklistCard — progress (US2)', () => {
  it('shows 0 / N progress when no items completed', () => {
    const checklist = createChecklist('Work')
    checklist.items = [
      { ...createChecklistItem('Task A'), completed: false },
      { ...createChecklistItem('Task B'), completed: false },
    ]
    render(<ChecklistCard {...makeProps({ checklist })} />)
    expect(screen.getByText(/0\s*\/\s*2/)).toBeInTheDocument()
  })

  it('shows completed / total progress', () => {
    const checklist = createChecklist('Work')
    checklist.items = [
      { ...createChecklistItem('Task A'), completed: true },
      { ...createChecklistItem('Task B'), completed: false },
    ]
    render(<ChecklistCard {...makeProps({ checklist })} />)
    expect(screen.getByText(/1\s*\/\s*2/)).toBeInTheDocument()
  })

  it('shows all-complete indicator when all items are done', () => {
    const checklist = createChecklist('Done')
    checklist.items = [{ ...createChecklistItem('Task'), completed: true }]
    render(<ChecklistCard {...makeProps({ checklist })} />)
    expect(screen.getByText(/complete/i)).toBeInTheDocument()
  })
})

describe('ChecklistCard — rename + delete (US3)', () => {
  it('calls onDelete after confirmation', async () => {
    const onDelete = vi.fn()
    vi.spyOn(window, 'confirm').mockReturnValue(true)
    render(<ChecklistCard {...makeProps({ onDelete })} />)
    await userEvent.click(screen.getByRole('button', { name: /delete/i }))
    expect(onDelete).toHaveBeenCalled()
    vi.restoreAllMocks()
  })

  it('does not call onDelete if confirmation is cancelled', async () => {
    const onDelete = vi.fn()
    vi.spyOn(window, 'confirm').mockReturnValue(false)
    render(<ChecklistCard {...makeProps({ onDelete })} />)
    await userEvent.click(screen.getByRole('button', { name: /delete/i }))
    expect(onDelete).not.toHaveBeenCalled()
    vi.restoreAllMocks()
  })
})
