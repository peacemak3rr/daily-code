// src/composables/useSettings.ts
import { reactive, watch } from 'vue'
import type { AppSettings } from '@/types'
import { DEFAULT_SETTINGS } from '@/constants/defaults'
import { loadFromStorage, saveToStorage } from '@/utils/storage'

const STORAGE_KEY = 'settings'

const state = reactive<AppSettings>(loadFromStorage<AppSettings>(STORAGE_KEY) ?? { ...DEFAULT_SETTINGS })

watch(state, (val) => saveToStorage(STORAGE_KEY, val), { deep: true })

export function useSettings() {
  function resetToDefaults() {
    Object.assign(state, DEFAULT_SETTINGS)
  }

  function updateSettings(partial: Partial<AppSettings>) {
    Object.assign(state, partial)
  }

  return { settings: state, resetToDefaults, updateSettings }
}
