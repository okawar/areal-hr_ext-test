<script setup>
import { ref, watch } from 'vue'
import positionsApi from '../../api/positions'
import UiInput from '../ui/UiInput.vue'
import UiButton from '../ui/UiButton.vue'

const props = defineProps({
  position: Object,
  errors: Object
})

const emit = defineEmits(['close', 'save', 'error'])

const form = ref({
  id: null,
  name: ''
})

watch(() => props.position, (position) => {
  if (position) {
    form.value = { ...position }
  } else {
    resetForm()
  }
}, { immediate: true })

const resetForm = () => {
  form.value = {
    id: null,
    name: ''
  }
}

const save = async () => {
  try {
    if (form.value.id) {
      await positionsApi.update(form.value.id, form.value)
    } else {
      await positionsApi.create(form.value)
    }
    emit('save')
  } catch (e) {
    emit('error', e)
  }
}
</script>

<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center px-4">
    <div class="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm transition-opacity" @click="emit('close')" />
    <div class="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 z-50">
      <h2 class="text-xl font-semibold text-black mb-4">
        {{ form.id ? 'Редактирование должности' : 'Добавление должности' }}
      </h2>

      <div v-if="errors.general" class="bg-red-100 text-red-800 p-3 rounded mb-4 text-sm">
        {{ errors.general }}
      </div>

      <div class="space-y-4">
        <UiInput
          id="name"
          v-model="form.name"
          label="Название должности"
          placeholder="Введите название"
          :error="errors.name"
        />
      </div>

      <div class="mt-6 flex justify-end space-x-3">
        <UiButton variant="secondary" @click="emit('close')">Отмена</UiButton>
        <UiButton @click="save">Сохранить</UiButton>
      </div>
    </div>
  </div>
</template>