// src/utils/__tests__/storage.test.ts
import { describe, it, expect, beforeEach } from 'vitest'
import { loadFromStorage, saveToStorage, removeFromStorage } from '../storage'

describe('storage', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('should save and load data', () => {
    const data = { name: 'test', value: 42 }
    saveToStorage('test-key', data)
    const loaded = loadFromStorage<typeof data>('test-key')
    expect(loaded).toEqual(data)
  })

  it('should return null for missing key', () => {
    const result = loadFromStorage('nonexistent')
    expect(result).toBeNull()
  })

  it('should remove data', () => {
    saveToStorage('test-key', { a: 1 })
    removeFromStorage('test-key')
    expect(loadFromStorage('test-key')).toBeNull()
  })

  it('should return null for corrupt JSON', () => {
    localStorage.setItem('fitness-bad-key', 'not-json{{{')
    const result = loadFromStorage('bad-key')
    expect(result).toBeNull()
  })
})
