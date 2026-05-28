// src/utils/exercisePlanner.ts
import type { ExercisePlan, ExerciseEntry } from '@/types'
import { EXERCISE_DATABASE } from '@/constants/exerciseDatabase'
import { DEFAULT_AEROBIC_EXERCISES, DEFAULT_ANAEROBIC_EXERCISES } from '@/constants/exerciseDatabase'

export function generateExercisePlan(
  exerciseCalorieTarget: number,
  bodyWeightKg: number,
  ratios: { aerobicRatio: number; anaerobicRatio: number },
): ExercisePlan {
  const aerobicCal = exerciseCalorieTarget * ratios.aerobicRatio
  const anaerobicCal = exerciseCalorieTarget * ratios.anaerobicRatio

  function planForType(calTarget: number, defaultIds: string[], type: 'aerobic' | 'anaerobic'): ExerciseEntry[] {
    const exercises = defaultIds
      .map(id => EXERCISE_DATABASE.find(e => e.id === id))
      .filter((e): e is typeof EXERCISE_DATABASE[number] => !!e && e.type === type)

    if (exercises.length === 0) return []

    const calPerExercise = calTarget / exercises.length
    return exercises.map(ex => {
      const calPerMinute = (ex.kcalPerKgPerHour * bodyWeightKg) / 60
      const minutes = Math.round(calPerExercise / calPerMinute)
      const actualCal = Math.round(calPerMinute * minutes)
      return { exerciseId: ex.id, minutes: Math.max(5, minutes), calories: Math.max(10, actualCal) }
    })
  }

  return {
    aerobic: planForType(aerobicCal, DEFAULT_AEROBIC_EXERCISES, 'aerobic'),
    anaerobic: planForType(anaerobicCal, DEFAULT_ANAEROBIC_EXERCISES, 'anaerobic'),
  }
}
