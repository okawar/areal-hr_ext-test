<script setup>
import { ref, watch } from 'vue'
import UiInput from '../ui/UiInput.vue'
import UiTextarea from '../ui/UiTextarea.vue'
import UiButton from '../ui/UiButton.vue'
import organizationsApi from '../../api/organizations'

const props = defineProps({
  organization: {
    type: Object,
    default: null
  },
  errors: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['close', 'save', 'error'])

const form = ref({
  id: null,
  name: "",
  comment: ""
})

const save = async () => {
  const dataToSend = { 
    name: form.value.name,
    comment: String(form.value.comment || "")
  }
  
  try {
    if (form.value.id) {
      await organizationsApi.update(form.value.id, dataToSend)
    } else {
      await organizationsApi.create(dataToSend)
    }
    
    emit('save')
  } catch (error) {
    emit('error', error)
  }
}

// Заполняем форму при изменении пропса organization
watch(() => props.organization, (organization) => {
  if (organization) {
    form.value = { ...organization }
  } else {
    form.value = { id: null, name: "", comment: "" }
  }
}, { immediate: true })
</script>

<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center px-4">
    <div class="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm transition-opacity" @click="emit('close')"></div>

    <div class="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 z-50">
      <h3 class="text-xl font-semibold text-black mb-4">
        {{ form.id ? 'Редактировать организацию' : 'Добавить организацию' }}
      </h3>

      <div v-if="errors.general" class="bg-red-100 text-red-800 p-3 rounded mb-4 text-sm">
        {{ errors.general }}
      </div>

      <div class="space-y-4">
        <UiInput 
          v-model="form.name"
          :error="errors.name"
          label="Название"
          placeholder="Введите название организации"
        />
        <UiTextarea 
          v-model="form.comment"
          label="Комментарий"
          placeholder="Комментарий к организации"
        />
      </div>

      <div class="mt-6 flex justify-end space-x-3">
        <UiButton 
          @click="emit('close')"
          class="px-4 py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-100 transition"
        >
          Отмена
        </UiButton>
        <UiButton 
          @click="save"
          class="px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700 transition"
        >
          Сохранить
        </UiButton>
      </div>
    </div>
  </div>
</template>
