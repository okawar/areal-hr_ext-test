<script setup>
import { ref, computed, onMounted } from 'vue'
import EmployeesTable from './EmployeesTable.vue'
import employeesApi from '../../api/employees'
import departmentsApi from '../../api/departments'
import positionsApi from '../../api/positions'
import EmployeesFormModal from './EmployeesFormModal.vue'

const employees = ref([])
const departments = ref([])
const positions = ref([])
const search = ref('')
const showModal = ref(false)
const currentEmployee = ref(null)

const fetchEmployees = async () => {
  try {
    const response = await employeesApi.fetchAll()
    employees.value = response.data.sort((a, b) => a.id - b.id)
  } catch (error) {
    console.error('Ошибка при загрузке сотрудников', error)
  }
}

const fetchDepartments = async () => {
  try {
    const response = await departmentsApi.fetchAll()
    departments.value = response.data
  } catch (error) {
    console.error('Ошибка при загрузке отделов', error)
  }
}

const fetchPositions = async () => {
  try {
    const response = await positionsApi.fetchAll()
    positions.value = response.data
  } catch (error) {
    console.error('Ошибка при загрузке должностей', error)
  }
}

const openModal = (employee = null) => {
  currentEmployee.value = employee
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
}

const handleSave = async () => {
  await fetchEmployees()
  closeModal()
}

const filteredEmployees = computed(() => {
  return employees.value.filter(emp =>
    `${emp.last_name} ${emp.first_name} ${emp.middle_name}`
      .toLowerCase()
      .includes(search.value.toLowerCase())
  )
})

onMounted(() => {
  fetchEmployees()
  fetchDepartments()
  fetchPositions()
})
</script>

<template>
  <div class="p-6 bg-gray-50 min-h-screen text-gray-800">
    <h1 class="text-3xl font-bold mb-6 text-black">Сотрудники</h1>

    <div class="mb-6 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
      <input
        type="text"
        v-model="search"
        class="w-full md:w-1/3 px-4 py-2 rounded-lg border border-gray-300 shadow-sm focus:ring-purple-600 focus:border-purple-600"
        placeholder="Поиск сотрудников..."
      />
      <button
        @click="openModal"
        class="w-full md:w-auto px-6 py-2 bg-purple-600 text-white rounded-xl shadow-md hover:bg-purple-700 transition duration-200"
      >
        Добавить сотрудника
      </button>
    </div>

    <EmployeesTable
      :employees="filteredEmployees"
      @edit="openModal"
      @delete="employeesApi.delete"
      @refresh="fetchEmployees"
    />

    <EmployeesFormModal
      v-if="showModal"
      :employee="currentEmployee"
      :departments="departments"
      :positions="positions"
      @close="closeModal"
      @save="handleSave"
    />
  </div>
</template>