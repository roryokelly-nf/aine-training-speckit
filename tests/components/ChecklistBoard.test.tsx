import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ChecklistBoard } from '../../src/components/ChecklistBoard'
import { createChecklist } from '../../src/models/Checklist'
import { createChecklistItem } from '../../src/models/ChecklistItem'

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

describe('ChecklistBoard — search (US1)', () => {
  function makeChecklists() {
    const groceries = createChecklist('Groceries')
    groceries.items = [{ ...createChecklistItem('Milk'), completed: false }]
    const work = createChecklist('Work Tasks')
    work.items = [{ ...createChecklistItem('Write report'), completed: false }]
    const empty = createChecklist('Empty List')
    return [groceries, work, empty]
  }

  it('renders a search input', () => {
    render(<ChecklistBoard {...makeProps({ checklists: makeChecklists() })} />)
    expect(screen.getByRole('searchbox')).toBeInTheDocument()
  })

  it('shows all checklists when query is empty', () => {
    render(<ChecklistBoard {...makeProps({ checklists: makeChecklists() })} />)
    expect(screen.getByText('Groceries')).toBeInTheDocument()
    expect(screen.getByText('Work Tasks')).toBeInTheDocument()
  })

  it('hides checklists not matching the query', async () => {
    render(<ChecklistBoard {...makeProps({ checklists: makeChecklists() })} />)
    await userEvent.type(screen.getByRole('searchbox'), 'groc')
    expect(screen.getByText('Groceries')).toBeInTheDocument()
    expect(screen.queryByText('Work Tasks')).not.toBeInTheDocument()
  })

  it('matches checklist names case-insensitively', async () => {
    render(<ChecklistBoard {...makeProps({ checklists: makeChecklists() })} />)
    await userEvent.type(screen.getByRole('searchbox'), 'GROCERIES')
    expect(screen.getByText('Groceries')).toBeInTheDocument()
  })

  it('matches item text within a checklist', async () => {
    render(<ChecklistBoard {...makeProps({ checklists: makeChecklists() })} />)
    await userEvent.type(screen.getByRole('searchbox'), 'report')
    expect(screen.getByText('Work Tasks')).toBeInTheDocument()
    expect(screen.queryByText('Groceries')).not.toBeInTheDocument()
  })

  it('shows no-results message when query matches nothing', async () => {
    render(<ChecklistBoard {...makeProps({ checklists: makeChecklists() })} />)
    await userEvent.type(screen.getByRole('searchbox'), 'xyzzy')
    expect(screen.getByText(/no checklists match your search/i)).toBeInTheDocument()
  })

  it('restores all checklists when query is cleared', async () => {
    render(<ChecklistBoard {...makeProps({ checklists: makeChecklists() })} />)
    await userEvent.type(screen.getByRole('searchbox'), 'groc')
    await userEvent.clear(screen.getByRole('searchbox'))
    expect(screen.getByText('Work Tasks')).toBeInTheDocument()
  })
})

describe('ChecklistBoard — filter (US2)', () => {
  function makeChecklists() {
    const complete = createChecklist('Done List')
    complete.items = [{ ...createChecklistItem('Task'), completed: true }]

    const active = createChecklist('Active List')
    active.items = [{ ...createChecklistItem('Task'), completed: false }]

    const empty = createChecklist('Empty List')

    return [complete, active, empty]
  }

  it('shows all checklists with "All" filter (default)', () => {
    render(<ChecklistBoard {...makeProps({ checklists: makeChecklists() })} />)
    expect(screen.getByText('Done List')).toBeInTheDocument()
    expect(screen.getByText('Active List')).toBeInTheDocument()
    expect(screen.getByText('Empty List')).toBeInTheDocument()
  })

  it('shows only active checklists when Active filter is selected', async () => {
    render(<ChecklistBoard {...makeProps({ checklists: makeChecklists() })} />)
    await userEvent.click(screen.getByRole('button', { name: /^active$/i }))
    expect(screen.getByText('Active List')).toBeInTheDocument()
    expect(screen.queryByText('Done List')).not.toBeInTheDocument()
    expect(screen.queryByText('Empty List')).not.toBeInTheDocument()
  })

  it('shows only complete checklists when Complete filter is selected', async () => {
    render(<ChecklistBoard {...makeProps({ checklists: makeChecklists() })} />)
    await userEvent.click(screen.getByRole('button', { name: /^complete$/i }))
    expect(screen.getByText('Done List')).toBeInTheDocument()
    expect(screen.queryByText('Active List')).not.toBeInTheDocument()
    expect(screen.queryByText('Empty List')).not.toBeInTheDocument()
  })

  it('restores all checklists when All is selected', async () => {
    render(<ChecklistBoard {...makeProps({ checklists: makeChecklists() })} />)
    await userEvent.click(screen.getByRole('button', { name: /^active$/i }))
    await userEvent.click(screen.getByRole('button', { name: /^all$/i }))
    expect(screen.getByText('Done List')).toBeInTheDocument()
    expect(screen.getByText('Active List')).toBeInTheDocument()
  })

  it('composes search and filter — only checklists matching both are shown', async () => {
    const cl1 = createChecklist('Shopping')
    cl1.items = [{ ...createChecklistItem('Eggs'), completed: false }]
    const cl2 = createChecklist('Shopping Done')
    cl2.items = [{ ...createChecklistItem('Bread'), completed: true }]

    render(<ChecklistBoard {...makeProps({ checklists: [cl1, cl2] })} />)
    await userEvent.click(screen.getByRole('button', { name: /^active$/i }))
    await userEvent.type(screen.getByRole('searchbox'), 'shopping')
    expect(screen.getByText('Shopping')).toBeInTheDocument()
    expect(screen.queryByText('Shopping Done')).not.toBeInTheDocument()
  })
})
