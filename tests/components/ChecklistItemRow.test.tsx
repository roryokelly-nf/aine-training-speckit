import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ChecklistItemRow } from '../../src/components/ChecklistItemRow'
import { createChecklistItem } from '../../src/models/ChecklistItem'

function makeItem(overrides = {}) {
  return { ...createChecklistItem('Buy milk'), ...overrides }
}

function makeProps(overrides = {}) {
  return {
    item: makeItem(),
    onToggle: vi.fn(),
    onEditText: vi.fn(),
    onDelete: vi.fn(),
    ...overrides,
  }
}

describe('ChecklistItemRow (US2)', () => {
  it('renders item text', () => {
    render(<ChecklistItemRow {...makeProps()} />)
    expect(screen.getByText('Buy milk')).toBeInTheDocument()
  })

  it('renders unchecked checkbox when item is not completed', () => {
    render(<ChecklistItemRow {...makeProps()} />)
    expect(screen.getByRole('checkbox')).not.toBeChecked()
  })

  it('renders checked checkbox when item is completed', () => {
    render(<ChecklistItemRow {...makeProps({ item: makeItem({ completed: true }) })} />)
    expect(screen.getByRole('checkbox')).toBeChecked()
  })

  it('calls onToggle when checkbox is clicked', async () => {
    const onToggle = vi.fn()
    render(<ChecklistItemRow {...makeProps({ onToggle })} />)
    await userEvent.click(screen.getByRole('checkbox'))
    expect(onToggle).toHaveBeenCalled()
  })

  it('applies strikethrough style to completed item text', () => {
    const { container } = render(
      <ChecklistItemRow {...makeProps({ item: makeItem({ completed: true }) })} />
    )
    const styledEl = container.querySelector('[style*="line-through"]')
    expect(styledEl).not.toBeNull()
  })
})

describe('ChecklistItemRow — edit + delete (US3)', () => {
  it('calls onDelete when delete button is clicked', async () => {
    const onDelete = vi.fn()
    render(<ChecklistItemRow {...makeProps({ onDelete })} />)
    await userEvent.click(screen.getByRole('button'))
    expect(onDelete).toHaveBeenCalled()
  })

  it('calls onEditText when text is edited via EditableText', async () => {
    const onEditText = vi.fn()
    render(<ChecklistItemRow {...makeProps({ onEditText })} />)
    await userEvent.click(screen.getByText('Buy milk'))
    await userEvent.clear(screen.getByRole('textbox'))
    await userEvent.type(screen.getByRole('textbox'), 'Buy eggs{Enter}')
    expect(onEditText).toHaveBeenCalledWith('Buy eggs')
  })
})
