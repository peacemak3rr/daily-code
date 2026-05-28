<script setup lang="ts">
import { ref, computed } from 'vue'
import type { FoodItem, FoodCategory } from '@/types'

const props = defineProps<{
  foods: FoodItem[]
  currentFoodId?: string
}>()

const emit = defineEmits<{
  select: [foodId: string]
  close: []
}>()

const searchText = ref('')
const activeCategory = ref<FoodCategory | 'all'>('all')

const categories: { key: FoodCategory | 'all'; label: string }[] = [
  { key: 'all', label: '全部' },
  { key: 'staple', label: '主食' },
  { key: 'protein', label: '蛋白质' },
  { key: 'dairy_soy', label: '乳制品/豆类' },
  { key: 'vegetable', label: '蔬菜' },
  { key: 'fruit', label: '水果' },
  { key: 'nut_oil', label: '坚果油脂' },
]

const filteredFoods = computed(() => {
  let list = props.foods
  if (activeCategory.value !== 'all') {
    list = list.filter(f => f.category === activeCategory.value)
  }
  if (searchText.value) {
    const q = searchText.value.toLowerCase()
    list = list.filter(f => f.name.includes(q))
  }
  return list
})
</script>

<template>
  <van-popup :show="true" round position="bottom" :style="{ height: '70%' }" @click-overlay="$emit('close')">
    <div class="picker-root">
      <div class="picker-header">
        <span @click="$emit('close')">取消</span>
        <span class="picker-title">选择食物</span>
        <span />
      </div>

      <van-search v-model="searchText" placeholder="搜索食物" shape="round" />

      <div class="picker-categories">
        <span
          v-for="cat in categories"
          :key="cat.key"
          class="cat-tag"
          :class="{ active: activeCategory === cat.key }"
          @click="activeCategory = cat.key"
        >{{ cat.label }}</span>
      </div>

      <div class="picker-list">
        <div
          v-for="food in filteredFoods"
          :key="food.id"
          class="picker-item"
          :class="{ selected: food.id === currentFoodId }"
          @click="$emit('select', food.id)"
        >
          <div class="picker-item-name">{{ food.name }}</div>
          <div class="picker-item-macros">
            {{ food.per100g.calories }}kcal | 蛋白{{ food.per100g.protein }}g | 碳水{{ food.per100g.carbs }}g | 脂肪{{ food.per100g.fat }}g
          </div>
        </div>
        <div v-if="filteredFoods.length === 0" class="picker-empty">无匹配食物</div>
      </div>
    </div>
  </van-popup>
</template>

<style scoped>
.picker-root { padding: 8px 0; }
.picker-header {
  display: flex;
  justify-content: space-between;
  padding: 12px 16px;
  font-size: 14px;
  color: #1989fa;
}
.picker-title { color: #323233; font-weight: 600; }
.picker-categories {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  padding: 8px 16px;
}
.cat-tag {
  padding: 4px 12px;
  border-radius: 14px;
  font-size: 12px;
  background: #f7f8fa;
  color: #646566;
}
.cat-tag.active { background: #1989fa; color: #fff; }
.picker-list { max-height: 40vh; overflow-y: auto; }
.picker-item {
  padding: 12px 16px;
  border-bottom: 1px solid #f0f0f0;
}
.picker-item.selected { background: #ecf5ff; }
.picker-item-name { font-size: 14px; color: #323233; }
.picker-item-macros { font-size: 11px; color: #969799; margin-top: 2px; }
.picker-empty { text-align: center; padding: 24px; color: #c8c9cc; }
</style>
