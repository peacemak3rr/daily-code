// src/composables/useProfile.ts
import { ref, computed, watch } from 'vue'
import type { UserProfile } from '@/types'
import { loadFromStorage, saveToStorage } from '@/utils/storage'
import { getBodyFat, calculateBMR, calculateTDEE } from '@/utils/bodyCalculations'

const STORAGE_KEY = 'profile'

const profile = ref<UserProfile | null>(loadFromStorage<UserProfile>(STORAGE_KEY))

watch(profile, (val) => {
  if (val) saveToStorage(STORAGE_KEY, val)
}, { deep: true })

export function useProfile() {
  const hasProfile = computed(() => profile.value !== null)

  const currentBodyFat = computed(() => {
    if (!profile.value) return null
    return getBodyFat(profile.value)
  })

  const bmr = computed(() => {
    if (!profile.value) return null
    return calculateBMR(profile.value.gender, profile.value.weight, profile.value.height, profile.value.age)
  })

  const tdee = computed(() => {
    if (!profile.value || !bmr.value) return null
    return calculateTDEE(bmr.value, profile.value.activityLevel)
  })

  const bfDistance = computed(() => {
    if (!profile.value || !currentBodyFat.value) return null
    return currentBodyFat.value - profile.value.targetBodyFat
  })

  function saveProfile(data: UserProfile) {
    profile.value = { ...data }
  }

  function updateProfile(partial: Partial<UserProfile>) {
    if (profile.value) {
      profile.value = { ...profile.value, ...partial }
    }
  }

  function clearProfile() {
    profile.value = null
    localStorage.removeItem('fitness-profile')
  }

  return { profile, hasProfile, currentBodyFat, bmr, tdee, bfDistance, saveProfile, updateProfile, clearProfile }
}
