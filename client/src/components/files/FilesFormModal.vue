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
  name: "",
  file_path: "",
  comment: ""
})

const handleFileUpload = (event) => {
  const file = event.target.files[0]
  if (file) {
    form.value.name = file.name
    form.value.file_path = `/uploads/${file.name}`
  }
}

const save = async () => {
  try {
    const dataToSend = { 
      employee_id: form.value.employee_id,
      name: form.value.name,
      file_path: form.value.file_path,
      comment: form.value.comment
    }
    
    if (form.value.id) {
      await filesApi.update(form.value.id, dataToSend)
    } else {
      await filesApi.create(dataToSend)
    }
    
    emit('save')
  } catch (error) {
    emit('error', error)
  }
}

// Заполняем форму при изменении пропса file
watch(() => props.file, (file) => {
  if (file) {
    form.value = { 
      id: file.id,
      employee_id: file.employee_id,
      name: file.name,
      file_path: file.file_path,
      comment: file.comment || ""
    }
  } else {
    form.value = { 
      id: null,
      employee_id: "",
      name: "",
      file_path: "",
      comment: ""
    }
  }
}, { immediate: true })
</script>

<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center px-4">
    <div class="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm transition-opacity" @click="emit('close')"></div>

    <div class="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 z-50">
      <h3 class="text-xl font-semibold text-black mb-4">
        {{ form.id ? 'Редактировать файл' : 'Добавить файл' }}
      </h3>

      <div v-if="errors.general" class="bg-red-100 text-red-800 p-3 rounded mb-4 text-sm">
        {{ errors.general }}
      </div>

      <div class="space-y-4">
        <div>
          <label for="employee_id" class="block text-sm font-medium text-gray-700">Сотрудник</label>
          <select
            v-model="form.employee_id"
            id="employee_id"
            class="mt-1 block w-full rounded-lg border border-gray-300 shadow-sm focus:ring-purple-600 focus:border-purple-600 sm:text-sm"
            :class="{ 'border-red-500': errors.employee_id }"
          >
            <option value="">Выберите сотрудника</option>
            <option v-for="employee in employees" :key="employee.id" :value="employee.id">
              {{ employee.last_name }} {{ employee.first_name }} {{ employee.middle_name }} (ID: {{ employee.id }})
            </option>
          </select>
          <p v-if="errors.employee_id" class="text-sm text-red-600 mt-1">{{ errors.employee_id }}</p>
        </div>

        <div>
          <label for="file" class="block text-sm font-medium text-gray-700">Файл</label>
          <input
            type="file"
            id="file"
            @change="handleFileUpload"
            class="mt-1 block w-full rounded-lg border border-gray-300 shadow-sm focus:ring-purple-600 focus:border-purple-600 sm:text-sm"
            :class="{ 'border-red-500': errors.name || errors.file_path }"
          />
          <p v-if="errors.name" class="text-sm text-red-600 mt-1">{{ errors.name }}</p>
          <p v-if="errors.file_path" class="text-sm text-red-600 mt-1">{{ errors.file_path }}</p>
        </div>

        <div v-if="form.name">
          <p class="text-sm text-gray-600">Выбранный файл: {{ form.name }}</p>
        </div>

        <div>
          <label for="comment" class="block text-sm font-medium text-gray-700">Комментарий</label>
          <textarea
            v-model="form.comment"
            id="comment"
            rows="3"
            class="mt-1 block w-full rounded-lg border border-gray-300 shadow-sm focus:ring-purple-600 focus:border-purple-600 sm:text-sm"
            placeholder="Комментарий к файлу"
          ></textarea>
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

<style scoped>
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes fadeOut {
  from {
    opacity: 1;
    transform: scale(1);
  }
  to {
    opacity: 0;
    transform: scale(0.95);
  }
}

.modal-enter-active {
  animation: fadeIn 0.3s ease-out forwards;
}
.modal-leave-active {
  animation: fadeOut 0.2s ease-in forwards;
}
</style>