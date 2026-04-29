import { describe, it, expect, beforeEach, vi } from 'vitest'
import { loadChecklists, saveChecklists, clearChecklists } from '../../src/services/storage'
import { createChecklist } from '../../src/models/Checklist'

describe('storage', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.restoreAllMocks()
  })

  describe('loadChecklists', () => {
    it('returns empty array when nothing stored', () => {
      expect(loadChecklists()).toEqual([])
    })

    it('returns stored checklists', () => {
      const cl = createChecklist('Groceries')
      saveChecklists([cl])
      const result = loadChecklists()
      expect(result).toHaveLength(1)
      expect(result[0].name).toBe('Groceries')
    })

    it('returns empty array when stored value is invalid JSON', () => {
      localStorage.setItem('chkl:checklists', 'not-json')
      expect(loadChecklists()).toEqual([])
    })
  })

  describe('saveChecklists', () => {
    it('persists checklists to localStorage', () => {
      const cl = createChecklist('Work')
      saveChecklists([cl])
      expect(localStorage.getItem('chkl:checklists')).not.toBeNull()
    })

    it('persists an empty array without deleting the key', () => {
      saveChecklists([])
      expect(localStorage.getItem('chkl:checklists')).toBe('[]')
    })
  })

  describe('clearChecklists', () => {
    it('removes all stored checklists', () => {
      saveChecklists([createChecklist('Temp')])
      clearChecklists()
      expect(loadChecklists()).toEqual([])
    })
  })
})
