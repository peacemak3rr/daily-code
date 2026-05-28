// src/constants/foodDatabase.ts
import type { FoodItem } from '@/types'

export const FOOD_DATABASE: FoodItem[] = [
  // ===== 主食类 (staple) =====
  { id: 'oatmeal', name: '燕麦片', category: 'staple', per100g: { calories: 377, protein: 13.5, carbs: 66.3, fat: 6.7 } },
  { id: 'whole_wheat_bread', name: '全麦面包', category: 'staple', per100g: { calories: 246, protein: 10.7, carbs: 42.5, fat: 3.0 } },
  { id: 'brown_rice', name: '糙米饭(熟)', category: 'staple', per100g: { calories: 123, protein: 2.7, carbs: 25.6, fat: 0.9 } },
  { id: 'mixed_grain_porridge', name: '杂粮粥', category: 'staple', per100g: { calories: 56, protein: 1.3, carbs: 11.5, fat: 0.3 } },
  { id: 'sweet_potato', name: '红薯', category: 'staple', per100g: { calories: 86, protein: 1.6, carbs: 20.1, fat: 0.1 } },
  { id: 'corn', name: '玉米', category: 'staple', per100g: { calories: 112, protein: 4.0, carbs: 22.8, fat: 1.2 } },
  { id: 'whole_wheat_noodles', name: '全麦面条(熟)', category: 'staple', per100g: { calories: 132, protein: 5.3, carbs: 26.1, fat: 1.1 } },
  { id: 'millet_porridge', name: '小米粥', category: 'staple', per100g: { calories: 46, protein: 1.4, carbs: 8.4, fat: 0.7 } },
  { id: 'buckwheat_noodles', name: '荞麦面(熟)', category: 'staple', per100g: { calories: 138, protein: 5.5, carbs: 24.3, fat: 1.6 } },
  { id: 'potato', name: '土豆', category: 'staple', per100g: { calories: 76, protein: 2.0, carbs: 17.2, fat: 0.2 } },
  { id: 'purple_sweet_potato', name: '紫薯', category: 'staple', per100g: { calories: 106, protein: 1.8, carbs: 24.6, fat: 0.1 } },
  { id: 'quinoa', name: '藜麦(熟)', category: 'staple', per100g: { calories: 120, protein: 4.4, carbs: 21.3, fat: 1.9 } },
  { id: 'black_rice', name: '黑米饭(熟)', category: 'staple', per100g: { calories: 116, protein: 3.2, carbs: 24.3, fat: 0.9 } },

  // ===== 蛋白质类 (protein) =====
  { id: 'chicken_breast', name: '鸡胸肉', category: 'protein', per100g: { calories: 133, protein: 31.0, carbs: 1.0, fat: 1.5 } },
  { id: 'egg_boiled', name: '鸡蛋(煮)', category: 'protein', per100g: { calories: 151, protein: 12.5, carbs: 1.5, fat: 10.5 } },
  { id: 'beef_shank', name: '牛腱子', category: 'protein', per100g: { calories: 125, protein: 22.3, carbs: 1.8, fat: 3.6 } },
  { id: 'salmon', name: '三文鱼', category: 'protein', per100g: { calories: 208, protein: 20.4, carbs: 0, fat: 13.4 } },
  { id: 'shrimp', name: '虾仁', category: 'protein', per100g: { calories: 93, protein: 20.3, carbs: 1.4, fat: 0.6 } },
  { id: 'pork_loin', name: '猪里脊', category: 'protein', per100g: { calories: 143, protein: 21.1, carbs: 2.3, fat: 5.8 } },
  { id: 'sea_bass', name: '鲈鱼', category: 'protein', per100g: { calories: 105, protein: 18.6, carbs: 0, fat: 3.4 } },
  { id: 'chicken_thigh_skinless', name: '去皮鸡腿', category: 'protein', per100g: { calories: 119, protein: 19.7, carbs: 0.3, fat: 3.9 } },
  { id: 'lean_beef', name: '瘦牛肉', category: 'protein', per100g: { calories: 125, protein: 22.2, carbs: 1.6, fat: 3.8 } },
  { id: 'egg_white', name: '鸡蛋白', category: 'protein', per100g: { calories: 48, protein: 11.0, carbs: 0.7, fat: 0 } },
  { id: 'chicken_liver', name: '鸡肝', category: 'protein', per100g: { calories: 119, protein: 17.0, carbs: 3.2, fat: 4.8 } },

  // ===== 乳制品/豆类 (dairy_soy) =====
  { id: 'yogurt_plain', name: '纯酸奶', category: 'dairy_soy', per100g: { calories: 72, protein: 5.3, carbs: 7.0, fat: 2.7 } },
  { id: 'milk_whole', name: '纯牛奶', category: 'dairy_soy', per100g: { calories: 54, protein: 3.0, carbs: 4.8, fat: 3.0 } },
  { id: 'soy_milk', name: '豆浆(无糖)', category: 'dairy_soy', per100g: { calories: 31, protein: 3.0, carbs: 1.2, fat: 1.6 } },
  { id: 'milk_skim', name: '脱脂牛奶', category: 'dairy_soy', per100g: { calories: 35, protein: 3.4, carbs: 5.0, fat: 0.1 } },
  { id: 'greek_yogurt', name: '希腊酸奶', category: 'dairy_soy', per100g: { calories: 97, protein: 9.0, carbs: 4.0, fat: 5.0 } },
  { id: 'tofu', name: '豆腐', category: 'dairy_soy', per100g: { calories: 76, protein: 8.1, carbs: 3.2, fat: 3.7 } },

  // ===== 蔬菜类 (vegetable) =====
  { id: 'broccoli', name: '西兰花', category: 'vegetable', per100g: { calories: 34, protein: 2.8, carbs: 6.6, fat: 0.4 } },
  { id: 'spinach', name: '菠菜', category: 'vegetable', per100g: { calories: 23, protein: 2.9, carbs: 3.6, fat: 0.4 } },
  { id: 'tomato', name: '番茄', category: 'vegetable', per100g: { calories: 18, protein: 0.9, carbs: 3.9, fat: 0.2 } },
  { id: 'cucumber', name: '黄瓜', category: 'vegetable', per100g: { calories: 16, protein: 0.7, carbs: 3.0, fat: 0.1 } },
  { id: 'napa_cabbage', name: '大白菜', category: 'vegetable', per100g: { calories: 13, protein: 1.5, carbs: 2.2, fat: 0.3 } },
  { id: 'lettuce', name: '生菜', category: 'vegetable', per100g: { calories: 14, protein: 1.4, carbs: 2.1, fat: 0.2 } },
  { id: 'carrot', name: '胡萝卜', category: 'vegetable', per100g: { calories: 37, protein: 1.0, carbs: 8.8, fat: 0.2 } },
  { id: 'celery', name: '芹菜', category: 'vegetable', per100g: { calories: 14, protein: 0.7, carbs: 3.0, fat: 0.1 } },
  { id: 'winter_melon', name: '冬瓜', category: 'vegetable', per100g: { calories: 12, protein: 0.4, carbs: 2.6, fat: 0.2 } },
  { id: 'mushroom', name: '菌菇类', category: 'vegetable', per100g: { calories: 27, protein: 2.7, carbs: 3.9, fat: 0.3 } },
  { id: 'pumpkin', name: '南瓜', category: 'vegetable', per100g: { calories: 22, protein: 0.7, carbs: 5.3, fat: 0.1 } },
  { id: 'green_pepper', name: '青椒', category: 'vegetable', per100g: { calories: 22, protein: 0.9, carbs: 4.6, fat: 0.2 } },

  // ===== 水果类 (fruit) =====
  { id: 'apple', name: '苹果', category: 'fruit', per100g: { calories: 53, protein: 0.3, carbs: 13.8, fat: 0.2 } },
  { id: 'banana', name: '香蕉', category: 'fruit', per100g: { calories: 93, protein: 1.4, carbs: 22.8, fat: 0.3 } },
  { id: 'blueberry', name: '蓝莓', category: 'fruit', per100g: { calories: 57, protein: 0.7, carbs: 14.5, fat: 0.3 } },
  { id: 'orange', name: '橙子', category: 'fruit', per100g: { calories: 47, protein: 0.9, carbs: 11.8, fat: 0.1 } },
  { id: 'kiwi', name: '猕猴桃', category: 'fruit', per100g: { calories: 61, protein: 1.1, carbs: 14.7, fat: 0.5 } },
  { id: 'strawberry', name: '草莓', category: 'fruit', per100g: { calories: 32, protein: 0.7, carbs: 7.7, fat: 0.3 } },
  { id: 'watermelon', name: '西瓜', category: 'fruit', per100g: { calories: 30, protein: 0.6, carbs: 7.6, fat: 0.1 } },

  // ===== 坚果油脂类 (nut_oil) =====
  { id: 'walnut', name: '核桃', category: 'nut_oil', per100g: { calories: 654, protein: 15.2, carbs: 13.7, fat: 65.2 } },
  { id: 'almond', name: '杏仁', category: 'nut_oil', per100g: { calories: 579, protein: 21.2, carbs: 21.7, fat: 49.9 } },
  { id: 'peanut', name: '花生', category: 'nut_oil', per100g: { calories: 567, protein: 25.8, carbs: 16.1, fat: 49.2 } },
  { id: 'avocado', name: '牛油果', category: 'nut_oil', per100g: { calories: 160, protein: 2.0, carbs: 8.5, fat: 14.7 } },
  { id: 'olive_oil', name: '橄榄油', category: 'nut_oil', per100g: { calories: 899, protein: 0, carbs: 0, fat: 99.9 } },
]

// Default meal templates (food IDs per meal slot)
export const MEAL_TEMPLATES = {
  breakfast: {
    staples: ['oatmeal', 'whole_wheat_bread', 'mixed_grain_porridge', 'sweet_potato', 'corn', 'millet_porridge'],
    proteins: ['egg_boiled', 'egg_white', 'milk_whole', 'milk_skim', 'soy_milk', 'greek_yogurt', 'yogurt_plain'],
    extras: ['apple', 'banana', 'blueberry', 'tomato', 'cucumber'],
  },
  lunch: {
    staples: ['brown_rice', 'black_rice', 'quinoa', 'whole_wheat_noodles', 'buckwheat_noodles', 'sweet_potato'],
    proteins: ['chicken_breast', 'beef_shank', 'lean_beef', 'shrimp', 'pork_loin', 'tofu', 'sea_bass'],
    vegetables: ['broccoli', 'spinach', 'napa_cabbage', 'lettuce', 'carrot', 'celery', 'green_pepper', 'mushroom'],
  },
  dinner: {
    staples: ['sweet_potato', 'potato', 'purple_sweet_potato', 'pumpkin', 'corn'],
    proteins: ['sea_bass', 'shrimp', 'tofu', 'chicken_breast', 'egg_white', 'salmon'],
    vegetables: ['broccoli', 'spinach', 'tomato', 'cucumber', 'winter_melon', 'lettuce', 'celery', 'mushroom'],
  },
}
