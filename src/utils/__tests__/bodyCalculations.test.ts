// src/utils/__tests__/bodyCalculations.test.ts
import { describe, it, expect } from 'vitest'
import {
  estimateBodyFatNavy,
  calculateBMR,
  calculateTDEE,
  calculateCalorieTarget,
} from '../bodyCalculations'
import type { UserProfile } from '@/types'

const sampleProfile: UserProfile = {
  gender: 'male',
  age: 30,
  height: 175,
  weight: 80,
  neck: 38,
  waist: 90,
  hip: 100,
  manualBodyFat: null,
  targetBodyFat: 15,
  activityLevel: 'moderate',
}

describe('estimateBodyFatNavy', () => {
  it('should estimate male body fat percentage', () => {
    const bf = estimateBodyFatNavy('male', 175, 90, 38, 100)
    expect(bf).toBeCloseTo(20.67, 0)
  })

  it('should estimate female body fat percentage', () => {
    const bf = estimateBodyFatNavy('female', 165, 75, 34, 100)
    expect(bf).toBeGreaterThan(0)
    expect(bf).toBeLessThan(60)
  })
})

describe('calculateBMR', () => {
  it('should compute male BMR', () => {
    const bmr = calculateBMR('male', 80, 175, 30)
    expect(bmr).toBeCloseTo(1748.75, 0)
  })

  it('should compute female BMR', () => {
    const bmr = calculateBMR('female', 60, 165, 25)
    expect(bmr).toBeCloseTo(1345.25, 0)
  })
})

describe('calculateTDEE', () => {
  it('should multiply BMR by activity factor', () => {
    expect(calculateTDEE(1748.75, 'moderate')).toBeCloseTo(1748.75 * 1.55, 0)
  })
})

describe('calculateCalorieTarget', () => {
  it('should compute daily calorie target with deficit', () => {
    const profile = { ...sampleProfile }
    const target = calculateCalorieTarget(profile, 500)
    const bmr = calculateBMR('male', 80, 175, 30)
    const tdee = bmr * 1.55
    expect(target).toBeCloseTo(tdee - 500, 0)
  })
})
