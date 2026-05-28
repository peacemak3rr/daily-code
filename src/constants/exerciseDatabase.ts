// src/constants/exerciseDatabase.ts
import type { ExerciseDef } from '@/types'

export const EXERCISE_DATABASE: ExerciseDef[] = [
  // ===== 有氧运动 (aerobic) =====
  { id: 'running', name: '跑步(8km/h)', type: 'aerobic', kcalPerKgPerHour: 7.0 },
  { id: 'brisk_walking', name: '快走(6km/h)', type: 'aerobic', kcalPerKgPerHour: 4.3 },
  { id: 'walking', name: '慢走(4km/h)', type: 'aerobic', kcalPerKgPerHour: 2.8 },
  { id: 'cycling', name: '骑行(中等)', type: 'aerobic', kcalPerKgPerHour: 6.4 },
  { id: 'swimming', name: '游泳(自由泳)', type: 'aerobic', kcalPerKgPerHour: 7.0 },
  { id: 'jump_rope', name: '跳绳', type: 'aerobic', kcalPerKgPerHour: 10.0 },
  { id: 'hiit', name: 'HIIT', type: 'aerobic', kcalPerKgPerHour: 10.5 },
  { id: 'elliptical', name: '椭圆机', type: 'aerobic', kcalPerKgPerHour: 5.7 },
  { id: 'stair_climbing', name: '爬楼梯', type: 'aerobic', kcalPerKgPerHour: 7.8 },
  { id: 'rowing', name: '划船机', type: 'aerobic', kcalPerKgPerHour: 6.4 },

  // ===== 无氧运动 (anaerobic) =====
  { id: 'squat', name: '深蹲', type: 'anaerobic', kcalPerKgPerHour: 4.3 },
  { id: 'pushup', name: '俯卧撑', type: 'anaerobic', kcalPerKgPerHour: 3.8 },
  { id: 'pullup', name: '引体向上', type: 'anaerobic', kcalPerKgPerHour: 4.7 },
  { id: 'dumbbell_press', name: '哑铃推举', type: 'anaerobic', kcalPerKgPerHour: 3.6 },
  { id: 'deadlift', name: '硬拉', type: 'anaerobic', kcalPerKgPerHour: 5.1 },
  { id: 'bench_press', name: '卧推', type: 'anaerobic', kcalPerKgPerHour: 4.1 },
  { id: 'crunch', name: '卷腹', type: 'anaerobic', kcalPerKgPerHour: 3.0 },
  { id: 'plank', name: '平板支撑', type: 'anaerobic', kcalPerKgPerHour: 2.6 },
  { id: 'kettlebell_swing', name: '壶铃摆动', type: 'anaerobic', kcalPerKgPerHour: 5.5 },
  { id: 'yoga', name: '瑜伽', type: 'anaerobic', kcalPerKgPerHour: 2.6 },
]

export const DEFAULT_AEROBIC_EXERCISES = ['running', 'brisk_walking', 'cycling', 'jump_rope']
export const DEFAULT_ANAEROBIC_EXERCISES = ['squat', 'pushup', 'crunch', 'dumbbell_press']
