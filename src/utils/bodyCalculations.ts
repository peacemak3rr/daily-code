// src/utils/bodyCalculations.ts
import type { UserProfile, ActivityLevel } from '@/types'
import { ACTIVITY_MULTIPLIERS } from '@/constants/defaults'

/** US Navy method for body fat % estimation */
export function estimateBodyFatNavy(
  gender: 'male' | 'female',
  heightCm: number,
  waistCm: number,
  neckCm: number,
  hipCm: number,
): number {
  const h = Math.log10(heightCm)
  if (gender === 'male') {
    const denom = 1.0324 - 0.19077 * Math.log10(waistCm - neckCm) + 0.15456 * h
    return 495 / denom - 450
  }
  const denom = 1.29579 - 0.35004 * Math.log10(waistCm + hipCm - neckCm) + 0.221 * h
  return 495 / denom - 450
}

/** Mifflin-St Jeor equation */
export function calculateBMR(
  gender: 'male' | 'female',
  weightKg: number,
  heightCm: number,
  age: number,
): number {
  const base = 10 * weightKg + 6.25 * heightCm - 5 * age
  return gender === 'male' ? base + 5 : base - 161
}

/** Total Daily Energy Expenditure */
export function calculateTDEE(bmr: number, activityLevel: ActivityLevel): number {
  return bmr * (ACTIVITY_MULTIPLIERS[activityLevel] ?? 1.2)
}

/** Get current body fat % — manual override if set, otherwise Navy estimate */
export function getBodyFat(profile: UserProfile): number {
  if (profile.manualBodyFat !== null) return profile.manualBodyFat
  return estimateBodyFatNavy(profile.gender, profile.height, profile.waist, profile.neck, profile.hip)
}

/** Daily calorie intake target = TDEE - deficit */
export function calculateCalorieTarget(profile: UserProfile, deficit: number): number {
  const bmr = calculateBMR(profile.gender, profile.weight, profile.height, profile.age)
  const tdee = calculateTDEE(bmr, profile.activityLevel)
  return Math.round(tdee - deficit)
}

/** Weekly fat loss estimate in kg, based on 7700 kcal per kg of fat */
export function estimateWeeklyFatLoss(deficit: number): number {
  return (deficit * 7) / 7700
}

/** Days to reach target body fat */
export function estimateDaysToTarget(profile: UserProfile, currentBf: number): number {
  const fatMass = profile.weight * (currentBf / 100)
  const leanMass = profile.weight - fatMass
  const targetFatMass = leanMass / (1 - profile.targetBodyFat / 100) - leanMass
  const fatToLose = fatMass - targetFatMass
  if (fatToLose <= 0) return 0
  const weeklyLoss = estimateWeeklyFatLoss(500)
  return Math.ceil((fatToLose / weeklyLoss) * 7)
}
