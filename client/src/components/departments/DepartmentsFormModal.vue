<script setup>
import { ref, watch } from 'vue'
import departmentsApi from '../../api/departments'

const props = defineProps({
  department: {
    type: Object,
    default: null
  },
  organizations: {
    type: Array,
    required: true
  }
})

const emit = defineEmits(['close', 'save'])

const form = ref({
  id: null,
  name: '',
  organization_id: null,
  parent_id: null,
  comment: ''
})

const errors = ref({})

watch(() => props.department, (dept) => {
  if (dept) {
    form.value = { ...dept }
  } else {
    resetForm()
  }
}, { immediate: true })

const resetForm = () => {
  form.value = {
    id: null,
    name: '',
    organization_id: null,
    parent_id: null,
    comment: ''
  }
}

const save = async () => {
  errors.value = {}
  
  // Создаем объект только с полями, которые нужны для API
  const payloadData = {
    name: form.value.name,
    organization_id: form.value.organization_id || null,
    parent_id: form.value.parent_id || null,
    comment: form.value.comment || ''
  }
  
  try {
    if (form.value.id) {
      await departmentsApi.update(form.value.id, payloadData)
    } else {
      await departmentsApi.create(payloadData)
    }
    emit('save')
  } catch (e) {
    if (e.response && e.response.data && e.response.data.errors) {
      errors.value = e.response.data.errors
    } else if (e.response && e.response.data && e.response.data.error) {
      errors.value.general = e.response.data.error
    } else {
      errors.value.general = 'Произошла ошибка при сохранении.'
    }
  }
}
</script>

<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center px-4" style="margin-top: -80px;"> 
    <div class="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm transition-opacity" @click="emit('close')"></div>

    <div class="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 z-50">
      <h2 class="text-xl font-semibold text-black mb-4">
        {{ form.id ? 'Редактирование отдела' : 'Добавление отдела' }}
      </h2>

      <div v-if="errors.general" class="bg-red-100 text-red-800 p-3 rounded mb-4 text-sm">
        {{ errors.general }}
      </div>

      <div class="space-y-4">
        <div>
          <label for="name" class="block text-sm font-medium text-gray-700">Название отдела</label>
          <input
            type="text"
            id="name"
            v-model="form.name"
            class="mt-1 block w-full rounded-lg border border-gray-300 shadow-sm focus:ring-purple-600 focus:border-purple-600 sm:text-sm"
            :class="{ 'border-red-500': errors.name }"
            placeholder="Введите название отдела"
          />
          <p v-if="errors.name" class="text-sm text-red-600 mt-1">{{ errors.name }}</p>
        </div>

        <div>
          <label for="org" class="block text-sm font-medium text-gray-700">Организация</label>
          <select
            id="org"
            v-model="form.organization_id"
            class="mt-1 block w-full rounded-lg border border-gray-300 shadow-sm focus:ring-purple-600 focus:border-purple-600 sm:text-sm"
            :class="{ 'border-red-500': errors.organization_id }"
          >
            <option :value="null">Не указана</option>
            <option v-for="org in organizations" :key="org.id" :value="org.id">{{ org.name }}</option>
          </select>
          <p v-if="errors.organization_id" class="text-sm text-red-600 mt-1">{{ errors.organization_id }}</p>
        </div>

        <div>
          <label for="comment" class="block text-sm font-medium text-gray-700">Комментарий</label>
          <textarea
            id="comment"
            v-model="form.comment"
            rows="3"
            class="mt-1 block w-full rounded-lg border border-gray-300 shadow-sm focus:ring-purple-600 focus:border-purple-600 sm:text-sm"
            placeholder="Комментарий к отделу (необязательно)"
          ></textarea>
          <p v-if="errors.comment" class="text-sm text-red-600 mt-1">{{ errors.comment }}</p>
        </div>
      </div>

      <div class="mt-6 flex justify-end space-x-3">
        <button
          @click="emit('close')"
          class="px-4 py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-100 transition"
        >
          Отмена
        </button>
        <button
          @click="save"
          class="px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700 transition"
        >
          Сохранить
        </button>
      </div>
    </div>
  </div>
</template>