<script setup lang="ts">
import { ref, computed } from 'vue'
import HomeView from './views/HomeView.vue'
import DietView from './views/DietView.vue'
import ExerciseView from './views/ExerciseView.vue'
import ProfileView from './views/ProfileView.vue'

const active = ref(0)
const views = [HomeView, DietView, ExerciseView, ProfileView]
const currentView = computed(() => views[active.value])
</script>

<template>
  <div class="app-shell">
    <div class="app-content">
      <component :is="currentView" />
    </div>
    <van-tabbar v-model="active" :fixed="true" :safe-area-inset-bottom="true">
      <van-tabbar-item icon="home-o">首页</van-tabbar-item>
      <van-tabbar-item icon="orders-o">饮食</van-tabbar-item>
      <van-tabbar-item icon="fire-o">运动</van-tabbar-item>
      <van-tabbar-item icon="user-o">我的</van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<style>
* { margin: 0; padding: 0; box-sizing: border-box; }
html, body, #app { height: 100%; }
body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  background: #f7f8fa;
  -webkit-font-smoothing: antialiased;
}
.app-shell {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}
.app-content {
  flex: 1;
  overflow-y: auto;
}
</style>
