import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { CreateChecklistForm } from '../../src/components/CreateChecklistForm'

describe('CreateChecklistForm', () => {
  it('renders a text input and submit button', () => {
    render(<CreateChecklistForm onSubmit={vi.fn()} />)
    expect(screen.getByRole('textbox')).toBeInTheDocument()
    expect(screen.getByRole('button')).toBeInTheDocument()
  })

  it('calls onSubmit with the entered name', async () => {
    const onSubmit = vi.fn()
    render(<CreateChecklistForm onSubmit={onSubmit} />)
    await userEvent.type(screen.getByRole('textbox'), 'Groceries')
    await userEvent.click(screen.getByRole('button'))
    expect(onSubmit).toHaveBeenCalledWith('Groceries')
  })

  it('clears the input after successful submit', async () => {
    render(<CreateChecklistForm onSubmit={vi.fn()} />)
    const input = screen.getByRole('textbox')
    await userEvent.type(input, 'Groceries')
    await userEvent.click(screen.getByRole('button'))
    expect(input).toHaveValue('')
  })

  it('does not call onSubmit when name is empty', async () => {
    const onSubmit = vi.fn()
    render(<CreateChecklistForm onSubmit={onSubmit} />)
    await userEvent.click(screen.getByRole('button'))
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('does not call onSubmit when name is whitespace only', async () => {
    const onSubmit = vi.fn()
    render(<CreateChecklistForm onSubmit={onSubmit} />)
    await userEvent.type(screen.getByRole('textbox'), '   ')
    await userEvent.click(screen.getByRole('button'))
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('shows a validation error for empty submission', async () => {
    render(<CreateChecklistForm onSubmit={vi.fn()} />)
    await userEvent.click(screen.getByRole('button'))
    expect(screen.getByRole('alert')).toBeInTheDocument()
  })
})
