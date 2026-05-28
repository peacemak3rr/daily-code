// src/utils/__tests__/exercisePlanner.test.ts
import { describe, it, expect } from 'vitest'
import { generateExercisePlan } from '../exercisePlanner'

describe('generateExercisePlan', () => {
  it('should produce aerobic and anaerobic entries', () => {
    const plan = generateExercisePlan(500, 80, { aerobicRatio: 0.6, anaerobicRatio: 0.4 })
    expect(plan.aerobic.length).toBeGreaterThan(0)
    expect(plan.anaerobic.length).toBeGreaterThan(0)
  })

  it('should match total calories to target', () => {
    const target = 500
    const plan = generateExercisePlan(target, 80, { aerobicRatio: 0.6, anaerobicRatio: 0.4 })
    const total = [...plan.aerobic, ...plan.anaerobic].reduce((s, e) => s + e.calories, 0)
    expect(total).toBeGreaterThan(target * 0.8)
    expect(total).toBeLessThan(target * 1.2)
  })
})
