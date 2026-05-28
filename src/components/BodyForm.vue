<script setup lang="ts">
import { reactive, ref } from 'vue'
import type { UserProfile } from '@/types'
import { ACTIVITY_LABELS } from '@/constants/defaults'

const props = defineProps<{
  initial?: UserProfile | null
}>()

const emit = defineEmits<{
  save: [profile: UserProfile]
}>()

const showActivityPicker = ref(false)

const form = reactive<UserProfile>({
  gender: props.initial?.gender ?? 'male',
  age: props.initial?.age ?? 30,
  height: props.initial?.height ?? 170,
  weight: props.initial?.weight ?? 70,
  neck: props.initial?.neck ?? 37,
  waist: props.initial?.waist ?? 85,
  hip: props.initial?.hip ?? 95,
  manualBodyFat: props.initial?.manualBodyFat ?? null,
  targetBodyFat: props.initial?.targetBodyFat ?? 15,
  activityLevel: props.initial?.activityLevel ?? 'moderate',
})

const activityOptions = Object.entries(ACTIVITY_LABELS).map(([value, label]) => ({
  value, label,
}))

function onSubmit() {
  emit('save', { ...form })
}
</script>

<template>
  <van-form @submit="onSubmit">
    <van-field name="gender" label="性别">
      <template #input>
        <van-radio-group v-model="form.gender" direction="horizontal">
          <van-radio name="male">男</van-radio>
          <van-radio name="female">女</van-radio>
        </van-radio-group>
      </template>
    </van-field>

    <van-field v-model.number="form.age" name="age" label="年龄" type="number" placeholder="输入年龄" :rules="[{ required: true }]" />

    <van-field v-model.number="form.height" name="height" label="身高(cm)" type="number" placeholder="输入身高" :rules="[{ required: true }]" />

    <van-field v-model.number="form.weight" name="weight" label="体重(kg)" type="number" placeholder="输入体重" :rules="[{ required: true }]" />

    <van-field v-model.number="form.neck" name="neck" label="颈围(cm)" type="number" placeholder="输入颈围" />

    <van-field v-model.number="form.waist" name="waist" label="腰围(cm)" type="number" placeholder="输入腰围" />

    <van-field v-model.number="form.hip" name="hip" label="臀围(cm)" type="number" placeholder="输入臀围" />

    <van-field :model-value="form.manualBodyFat ?? ''" @update:model-value="form.manualBodyFat = $event === '' ? null : Number($event)" name="manualBodyFat" label="体脂率(%)" type="number" placeholder="留空则自动估算" />

    <van-field v-model.number="form.targetBodyFat" name="targetBodyFat" label="目标体脂率(%)" type="number" placeholder="输入目标体脂率" :rules="[{ required: true }]" />

    <van-field name="activityLevel" label="活动水平" :model-value="ACTIVITY_LABELS[form.activityLevel]" readonly clickable @click="showActivityPicker = true" />

    <van-popup v-model:show="showActivityPicker" round position="bottom">
      <van-picker
        :columns="activityOptions"
        :columns-field-names="{ text: 'label', value: 'value' }"
        :default-index="activityOptions.findIndex(o => o.value === form.activityLevel)"
        @confirm="({ selectedOptions }) => { form.activityLevel = selectedOptions[0].value as any; showActivityPicker = false }"
      />
    </van-popup>

    <div style="margin: 16px">
      <van-button round block type="primary" native-type="submit">保存</van-button>
    </div>
  </van-form>
</template>
