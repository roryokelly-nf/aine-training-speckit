import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { EditableText } from '../../src/components/EditableText'

describe('EditableText', () => {
  it('renders value as text by default', () => {
    render(<EditableText value="Hello" onConfirm={vi.fn()} />)
    expect(screen.getByText('Hello')).toBeInTheDocument()
    expect(screen.queryByRole('textbox')).toBeNull()
  })

  it('switches to input on click', async () => {
    render(<EditableText value="Hello" onConfirm={vi.fn()} />)
    await userEvent.click(screen.getByText('Hello'))
    expect(screen.getByRole('textbox')).toBeInTheDocument()
  })

  it('calls onConfirm with new value on Enter', async () => {
    const onConfirm = vi.fn()
    render(<EditableText value="Hello" onConfirm={onConfirm} />)
    await userEvent.click(screen.getByText('Hello'))
    await userEvent.clear(screen.getByRole('textbox'))
    await userEvent.type(screen.getByRole('textbox'), 'World{Enter}')
    expect(onConfirm).toHaveBeenCalledWith('World')
  })

  it('calls onConfirm on blur', async () => {
    const onConfirm = vi.fn()
    render(<EditableText value="Hello" onConfirm={onConfirm} />)
    await userEvent.click(screen.getByText('Hello'))
    await userEvent.clear(screen.getByRole('textbox'))
    await userEvent.type(screen.getByRole('textbox'), 'Blurred')
    await userEvent.tab()
    expect(onConfirm).toHaveBeenCalledWith('Blurred')
  })

  it('reverts on Escape without calling onConfirm', async () => {
    const onConfirm = vi.fn()
    render(<EditableText value="Hello" onConfirm={onConfirm} />)
    await userEvent.click(screen.getByText('Hello'))
    await userEvent.clear(screen.getByRole('textbox'))
    await userEvent.type(screen.getByRole('textbox'), 'Changed')
    await userEvent.keyboard('{Escape}')
    expect(onConfirm).not.toHaveBeenCalled()
    expect(screen.getByText('Hello')).toBeInTheDocument()
  })

  it('reverts to original value when empty string confirmed', async () => {
    const onConfirm = vi.fn()
    render(<EditableText value="Hello" onConfirm={onConfirm} />)
    await userEvent.click(screen.getByText('Hello'))
    await userEvent.clear(screen.getByRole('textbox'))
    await userEvent.keyboard('{Enter}')
    expect(onConfirm).not.toHaveBeenCalled()
    expect(screen.getByText('Hello')).toBeInTheDocument()
  })
})
