// src/utils/storage.ts

const PREFIX = 'fitness-'

export function loadFromStorage<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(PREFIX + key)
    if (raw === null) return null
    return JSON.parse(raw) as T
  } catch {
    return null
  }
}

export function saveToStorage<T>(key: string, data: T): void {
  localStorage.setItem(PREFIX + key, JSON.stringify(data))
}

export function removeFromStorage(key: string): void {
  localStorage.removeItem(PREFIX + key)
}
