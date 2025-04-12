<script setup>
import { ref, watch } from 'vue'
import filesApi from '../../api/files'

const props = defineProps({
  file: {
    type: Object,
    default: null
  },
  employees: {
    type: Array,
    required: true
  },
  errors: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['close', 'save', 'error'])

const form = ref({
  id: null,
  employee_id: "",
  file_name: "",
  file: null,
  file_path: "",
  comment: ""
})

const handleFileUpload = (event) => {
  const file = event.target.files[0]
  if (file) {
    form.value.file_name = file.name
    form.value.file = file
  }
}

const save = async () => {
  try {
    if (form.value.id) {
      const payload = {
        employee_id: form.value.employee_id,
        comment: form.value.comment
      }
      
      if (form.value.file) {
        payload.file_name = form.value.file.name
        const formData = new FormData()
        formData.append("employee_id", form.value.employee_id)
        formData.append("comment", form.value.comment)
        formData.append("file", form.value.file)
        await filesApi.update(form.value.id, formData)
      } else {
        payload.file_name = form.value.file_name
        payload.file_path = form.value.file_path
        await filesApi.update(form.value.id, payload)
      }
    } else {
      if (!form.value.file) {
        throw new Error("Файл обязателен для загрузки")
      }
      
      const formData = new FormData()
      formData.append("employee_id", form.value.employee_id)
      formData.append("comment", form.value.comment)
      formData.append("file", form.value.file)
      await filesApi.create(formData)
    }
    
    emit('save')
  } catch (error) {
    emit('error', error)
  }
}

watch(() => props.file, (file) => {
  if (file) {
    form.value = { 
      id: file.id,
      employee_id: file.employee_id,
      file_name: file.file_name,
      file_path: file.file_path, 
      comment: file.comment || "",
      file: null 
    }
  } else {
    form.value = { 
      id: null,
      employee_id: "",
      file_name: "",
      file_path: "",
      file: null,
      comment: ""
    }
  }
}, { immediate: true })
</script>

<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center px-4">
    <div class="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm transition-opacity" @click="emit('close')"></div>

    <div class="relative bg-white rounded-xl shadow-xl max-w-md w-full mx-auto z-50 overflow-hidden">
      <div class="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
        <h2 class="text-lg font-semibold text-white">
          {{ form.id ? 'Редактирование файла' : 'Добавление файла' }}
        </h2>
      </div>

      <div class="p-6">
        <div v-if="errors.general" class="mb-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm">
          {{ errors.general }}
        </div>

        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Сотрудник</label>
            <select
              v-model="form.employee_id"
              class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              :class="{ 'border-red-300': errors.employee_id }"
            >
              <option value="">Выберите сотрудника</option>
              <option 
                v-for="employee in employees" 
                :key="employee.id" 
                :value="employee.id"
              >
                {{ employee.last_name }} {{ employee.first_name }} {{ employee.middle_name }}
              </option>
            </select>
            <p v-if="errors.employee_id" class="mt-1 text-sm text-red-600">{{ errors.employee_id }}</p>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Файл</label>
            <div class="mt-1 flex items-center">
              <label class="cursor-pointer">
                <span class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  Выбрать файл
                </span>
                <input 
                  type="file" 
                  class="sr-only" 
                  @change="handleFileUpload"
                >
              </label>
              <span class="ml-4 text-sm text-gray-500 truncate max-w-xs">
                {{ form.file_name || form.file?.name || "Файл не выбран" }}
              </span>
            </div>
            <p v-if="errors.file_name" class="mt-1 text-sm text-red-600">{{ errors.file_name }}</p>
            <p v-if="errors.file_path" class="mt-1 text-sm text-red-600">{{ errors.file_path }}</p>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Комментарий</label>
            <textarea
              v-model="form.comment"
              rows="3"
              class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Описание файла (необязательно)"
            ></textarea>
          </div>
        </div>
      </div>

      <div class="bg-gray-50 px-6 py-4 flex justify-end space-x-3">
        <button
          @click="emit('close')"
          class="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Отмена
        </button>
        <button
          @click="save"
          class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          :disabled="!form.file && !form.id"
          :class="{ 'opacity-50 cursor-not-allowed': !form.file && !form.id }"
        >
          Сохранить
        </button>
      </div>
    </div>
  </div>
</template>