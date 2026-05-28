// src/constants/defaults.ts
import type { AppSettings } from '@/types'

export const DEFAULT_SETTINGS: AppSettings = {
  calorieDeficit: 500,
  breakfastRatio: 0.3,
  lunchRatio: 0.4,
  dinnerRatio: 0.3,
  aerobicRatio: 0.6,
  anaerobicRatio: 0.4,
  proteinPerKg: 2.0,
  fatPerKg: 0.8,
}

export const ACTIVITY_MULTIPLIERS: Record<string, number> = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  very_active: 1.9,
}

export const ACTIVITY_LABELS: Record<string, string> = {
  sedentary: '久坐不动',
  light: '轻度活动(每周1-3天)',
  moderate: '中度活动(每周3-5天)',
  active: '非常活跃(每周6-7天)',
  very_active: '高强度(体力劳动/每天训练)',
}

// Dietary Guidelines constraints (daily totals)
export const DIETARY_GUIDE = {
  grainsMin: 250,       // g/day
  grainsMax: 400,
  vegetablesMin: 300,   // g/day
  vegetablesMax: 500,
  fruitsMin: 200,       // g/day
  fruitsMax: 350,
  dairyTarget: 300,     // g/day
  soyNutsMin: 25,       // g/day
  soyNutsMax: 35,
  animalProteinMin: 120, // g/day
  animalProteinMax: 200,
  oilMax: 30,           // g/day (for display only)
  saltMax: 5,           // g/day (for display only)
}
