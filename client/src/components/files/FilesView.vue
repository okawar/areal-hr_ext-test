<script setup>
import { ref, onMounted } from 'vue'
import FilesTable from './FilesTable.vue'
import filesApi from '../../api/files'
import employeesApi from '../../api/employees'
import FilesFormModal from './FilesFormModal.vue'

const files = ref([])
const employees = ref([])
const showModal = ref(false)
const currentFile = ref(null)
const errors = ref({})

const fetchFiles = async () => {
  try {
    const response = await filesApi.fetchAll()
    files.value = response.data.sort((a, b) => a.id - b.id)
  } catch (error) {
    console.error("Ошибка при загрузке файлов:", error)
  }
}

const fetchEmployees = async () => {
  try {
    const response = await employeesApi.fetchAll()
    employees.value = response.data
  } catch (error) {
    console.error("Ошибка при загрузке сотрудников:", error)
  }
}

const openModal = (file = null) => {
  errors.value = {}
  currentFile.value = file
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
}

const handleSave = async () => {
  await fetchFiles()
  closeModal()
}

const handleError = (error) => {
  if (error.response) {
    if (error.response.data.error) {
      errors.value = { general: error.response.data.error }
    }
    if (error.response.data.details) {
      errors.value = error.response.data.details.reduce((acc, item) => {
        acc[item.path] = item.message
        return acc
      }, {})
    }
  } else {
    errors.value = { general: "Ошибка соединения с сервером" }
  }
}

onMounted(() => {
  fetchFiles()
  fetchEmployees()
})
</script>

<template>
  <div class="p-6 bg-gray-50 min-h-screen text-gray-800">
    <h2 class="text-3xl font-semibold mb-6 text-black">Список файлов</h2>
    <button 
      @click="openModal()" 
      class="w-full md:w-auto px-6 py-2 bg-purple-600 text-white rounded-xl shadow-md hover:bg-purple-700 transition duration-200"
    >
      Добавить файл
    </button>

    <FilesTable
      :files="files"
      :employees="employees"
      @edit="openModal"
      @delete="filesApi.delete"
      @refresh="fetchFiles"
    />

    <FilesFormModal
      v-if="showModal"
      :file="currentFile"
      :employees="employees"
      :errors="errors"
      @close="closeModal"
      @save="handleSave"
      @error="handleError"
    />
  </div>
</template>