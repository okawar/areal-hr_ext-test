<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'

const departments = ref([])
const organizations = ref([])
const search = ref('')

const showModal = ref(false)
const departmentForm = ref({ id: null, name: '', organization_id: null })
const errors = ref({})

const fetchDepartments = async () => {
  try {
    const res = await axios.get('/api/dept')
    console.log('Ответ от API:', res.data)

    if (Array.isArray(res.data)) {
      departments.value = res.data.sort((a, b) => a.id - b.id)
    } else {
      console.warn('Получены невалидные данные от API:', res.data)
      departments.value = []
    }
  } catch (e) {
    console.error('Ошибка при загрузке отделов:', e)
    departments.value = []
  }
}


const fetchOrganizations = async () => {
  try {
    const res = await axios.get('/api/orgs')
    console.log(res.data)
    organizations.value = res.data
  } catch (e) {
    console.error('Ошибка при загрузке организаций:', e)
  }
}

const openModal = () => {
  departmentForm.value = { id: null, name: '', organization_id: null }
  errors.value = {}
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
}

const getOrganizationName = (id) => {
  const org = organizations.value.find(o => o.id === id)
  return org ? org.name : '—'
}

const saveDepartment = async () => {
  errors.value = {}
  try {
    if (departmentForm.value.id) {
      await axios.put(`/api/dept/${departmentForm.value.id}`, departmentForm.value)
    } else {
      const payload = { ...departmentForm.value }
      delete payload.id
      await axios.post('/api/dept', payload)
    }
    await fetchDepartments()
    closeModal()
  } catch (e) {
    if (e.response && e.response.data && e.response.data.errors) {
      errors.value = e.response.data.errors
    } else {
      errors.value.general = 'Произошла ошибка при сохранении.'
    }
  }
}


const deleteDepartment = async (id) => {
  if (confirm('Удалить этот отдел?')) {
    try {
      await axios.delete(`/api/dept/${id}`)
      await fetchDepartments()
    } catch (e) {
      console.error('Ошибка при удалении:', e)
    }
  }
}

const editDepartment = (department) => {
  departmentForm.value = { ...department }
  errors.value = {}
  showModal.value = true
}

const filteredDepartments = computed(() => {
  return departments.value.filter(dep =>
    dep.name.toLowerCase().includes(search.value.toLowerCase())
  )
})

onMounted(() => {
  fetchDepartments()
  fetchOrganizations()
})
</script>



<template>
  <div class="p-6 bg-gray-50 min-h-screen text-gray-800">
    <h1 class="text-3xl font-bold mb-6 text-black">Управление отделами</h1>

    <div class="mb-6 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
      <input
        type="text"
        v-model="search"
        class="w-full md:w-1/3 px-4 py-2 rounded-lg border border-gray-300 shadow-sm focus:ring-purple-600 focus:border-purple-600"
        placeholder="Поиск отделов..."
      />
      <button
        @click="openModal"
        class="w-full md:w-auto px-6 py-2 bg-purple-600 text-white rounded-xl shadow-md hover:bg-purple-700 transition duration-200"
      >
        Добавить отдел
      </button>
    </div>

    <div class="overflow-x-auto bg-white rounded-2xl shadow-md">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-100 text-gray-700 text-sm uppercase tracking-wider">
          <tr>
            <th class="px-6 py-4 text-left">ID</th>
            <th class="px-6 py-4 text-left">Название</th>
            <th class="px-6 py-4 text-left">Организация</th>
            <th class="px-6 py-4 text-left">Действия</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100">
          <tr v-for="department in filteredDepartments" :key="department.id" class="hover:bg-gray-50 transition">
            <td class="px-6 py-4">{{ department.id }}</td>
            <td class="px-6 py-4">{{ department.name }}</td>
            <td class="px-6 py-4">
              {{ getOrganizationName(department.organization_id) }}
            </td>
            <td class="px-6 py-4 space-x-2">
              <button
                @click="editDepartment(department)"
                class="text-sm px-3 py-1 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition"
              >
                Редактировать
              </button>
              <button
                @click="deleteDepartment(department.id)"
                class="text-sm px-3 py-1 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition"
              >
                Удалить
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div class="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm transition-opacity"></div>

      <div class="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 z-50">
        <h2 class="text-xl font-semibold text-black mb-4">
          {{ departmentForm.id ? 'Редактирование отдела' : 'Добавление отдела' }}
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
              v-model="departmentForm.name"
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
              v-model="departmentForm.organization_id"
              class="mt-1 block w-full rounded-lg border border-gray-300 shadow-sm focus:ring-purple-600 focus:border-purple-600 sm:text-sm"
            >
              <option :value="null">Не указана</option>
              <option v-for="org in organizations" :key="org.id" :value="org.id">{{ org.name }}</option>
            </select>
          </div>
        </div>

        <div class="mt-6 flex justify-end space-x-3">
          <button
            @click="closeModal"
            class="px-4 py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-100 transition"
          >
            Отмена
          </button>
          <button
            @click="saveDepartment"
            class="px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700 transition"
          >
            Сохранить
          </button>
        </div>
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

[enter-active],
[leave-active] {
  transition: all 0.3s ease;
}

.modal-enter-active {
  animation: fadeIn 0.3s ease-out forwards;
}
.modal-leave-active {
  animation: fadeOut 0.2s ease-in forwards;
}
</style>
