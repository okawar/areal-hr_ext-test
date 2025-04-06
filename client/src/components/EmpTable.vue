<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'

const employees = ref([])
const departments = ref([])
const positions = ref([])
const search = ref('')
const showModal = ref(false)
const errors = ref({})

const employeeForm = ref({
  id: null,
  last_name: '',
  first_name: '',
  middle_name: '',
  birth_date: '',
  passport_series: '',
  passport_number: '',
  passport_issue_date: '',
  passport_issued_by: '',
  region: '',
  locality: '',
  street: '',
  house: '',
  building: '',
  apartment: '',
  department_id: null,
  position_id: null
})

const fetchEmployees = async () => {
  try {
    const response = await axios.get('/api/emp')
    employees.value = response.data.sort((a, b) => a.id - b.id)
  } catch (error) {
    console.error('Ошибка при загрузке сотрудников', error)
  }
}

const fetchDepartments = async () => {
  try {
    const response = await axios.get('/api/dept')
    departments.value = response.data
  } catch (error) {
    console.error('Ошибка при загрузке отделов', error)
  }
}

const fetchPositions = async () => {
  try {
    const response = await axios.get('/api/pos')
    positions.value = response.data
  } catch (error) {
    console.error('Ошибка при загрузке должностей', error)
  }
}

const openModal = (emp = null) => {
  errors.value = {}
  employeeForm.value = emp ? { ...emp } : {
    id: null,
    last_name: '',
    first_name: '',
    middle_name: '',
    birth_date: '',
    passport_series: '',
    passport_number: '',
    passport_issue_date: '',
    passport_issued_by: '',
    region: '',
    locality: '',
    street: '',
    house: '',
    building: '',
    apartment: '',
    department_id: null,
    position_id: null
  }
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
}

const saveEmployee = async () => {
  errors.value = {}
  const dataToSend = { ...employeeForm.value }
  if (!dataToSend.id) delete dataToSend.id

  try {
    if (employeeForm.value.id) {
      await axios.put(`/api/emp/${employeeForm.value.id}`, dataToSend)
    } else {
      await axios.post('/api/emp', dataToSend)
    }
    await fetchEmployees()
    closeModal()
  } catch (error) {
    if (error.response && error.response.data) {
      if (error.response.data.error) {
        errors.value.general = error.response.data.error
      }
      if (error.response.data.details) {
        errors.value = error.response.data.details.reduce((acc, item) => {
          acc[item.path] = item.message
          return acc
        }, {})
      }
    }
  }
}

const deleteEmployee = async (id) => {
  if (confirm('Удалить этого сотрудника?')) {
    try {
      await axios.delete(`/api/emp/${id}`)
      await fetchEmployees()
    } catch (error) {
      console.error('Ошибка при удалении сотрудника:', error)
    }
  }
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

    <div class="overflow-x-auto bg-white rounded-2xl shadow-md">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-100 text-gray-700 text-sm uppercase tracking-wider">
          <tr>
            <th class="px-6 py-4 text-left">ID</th>
            <th class="px-6 py-4 text-left">ФИО</th>
            <th class="px-6 py-4 text-left">Отдел</th>
            <th class="px-6 py-4 text-left">Должность</th>
            <th class="px-6 py-4 text-left">Паспорт</th>
            <th class="px-6 py-4 text-left">Действия</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100">
          <tr v-for="emp in filteredEmployees" :key="emp.id" class="hover:bg-gray-50 transition">
            <td class="px-6 py-4">{{ emp.id }}</td>
            <td class="px-6 py-4">{{ emp.last_name }} {{ emp.first_name }} {{ emp.middle_name }}</td>
            <td class="px-6 py-4">{{ emp.department_name }}</td>
            <td class="px-6 py-4">{{ emp.position_name }}</td>
            <td class="px-6 py-4">{{ emp.passport_series }} {{ emp.passport_number }}</td>
            <td class="px-6 py-4 space-x-2">
              <button
                @click="openModal(emp)"
                class="text-sm px-3 py-1 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition"
              >Редактировать</button>
              <button
                @click="deleteEmployee(emp.id)"
                class="text-sm px-3 py-1 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition"
              >Удалить</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div class="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm transition-opacity"></div>

      <div class="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-6 z-50 overflow-y-auto max-h-[90vh]">
        <h2 class="text-xl font-semibold text-black mb-4">
          {{ employeeForm.id ? 'Редактирование сотрудника' : 'Добавление сотрудника' }}
        </h2>

        <div v-if="errors.general" class="bg-red-100 text-red-800 p-3 rounded mb-4 text-sm">
          {{ errors.general }}
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700">Фамилия</label>
            <input v-model="employeeForm.last_name" type="text" class="input" />
            <p v-if="errors.last_name" class="text-sm text-red-600 mt-1">{{ errors.last_name }}</p>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">Имя</label>
            <input v-model="employeeForm.first_name" type="text" class="input" />
            <p v-if="errors.first_name" class="text-sm text-red-600 mt-1">{{ errors.first_name }}</p>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">Отчество</label>
            <input v-model="employeeForm.middle_name" type="text" class="input" />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">Дата рождения</label>
            <input v-model="employeeForm.birth_date" type="date" class="input" />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">Отдел</label>
            <select v-model="employeeForm.department_id" class="input">
              <option :value="null" disabled>Выберите отдел</option>
              <option v-for="dept in departments" :key="dept.id" :value="dept.id">
                {{ dept.name }}
              </option>
            </select>
            <p v-if="errors.department_id" class="text-sm text-red-600 mt-1">{{ errors.department_id }}</p>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">Должность</label>
            <select v-model="employeeForm.position_id" class="input">
              <option :value="null" disabled>Выберите должность</option>
              <option v-for="pos in positions" :key="pos.id" :value="pos.id">
                {{ pos.name }}
              </option>
            </select>
            <p v-if="errors.position_id" class="text-sm text-red-600 mt-1">{{ errors.position_id }}</p>
          </div>

          <div class="col-span-2">
            <label class="block text-sm font-medium text-gray-700">Паспорт</label>
            <div class="flex gap-2">
              <input v-model="employeeForm.passport_series" placeholder="Серия" class="input w-1/3" />
              <input v-model="employeeForm.passport_number" placeholder="Номер" class="input w-2/3" />
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">Дата выдачи</label>
            <input v-model="employeeForm.passport_issue_date" type="date" class="input" />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">Кем выдан</label>
            <input v-model="employeeForm.passport_issued_by" type="text" class="input" />
          </div>

          <div class="col-span-2">
            <label class="block text-sm font-medium text-gray-700">Адрес</label>
            <div class="grid grid-cols-2 gap-2">
              <input v-model="employeeForm.region" placeholder="Регион" class="input" />
              <input v-model="employeeForm.locality" placeholder="Город / населённый пункт" class="input" />
              <input v-model="employeeForm.street" placeholder="Улица" class="input" />
              <input v-model="employeeForm.house" placeholder="Дом" class="input" />
              <input v-model="employeeForm.building" placeholder="Корпус" class="input" />
              <input v-model="employeeForm.apartment" placeholder="Квартира" class="input" />
            </div>
          </div>
        </div>

        <div class="mt-6 flex justify-end space-x-3">
          <button @click="closeModal" class="px-4 py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-100 transition">Отмена</button>
          <button @click="saveEmployee" class="px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700 transition">Сохранить</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* .input {
  @apply mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm;
} */
</style>