<script setup>
import { ref, computed, onMounted } from 'vue'
import DepartmentsTable from './DepartmentsTable.vue'
import departmentsApi from '../../api/departments'
import organizationsApi from '../../api/organizations'
import DepartmentsFormModal from './DepartmentsFormModal.vue'
import UiInput from '../../components/ui/UiInput.vue'
import UiButton from '../../components/ui/UiButton.vue'

const departments = ref([])
const organizations = ref([])
const search = ref('')
const showModal = ref(false)
const currentDepartment = ref(null)

const fetchDepartments = async () => {
  try {
    const res = await departmentsApi.fetchAll()
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
    const res = await organizationsApi.fetchAll()
    organizations.value = res.data
  } catch (e) {
    console.error('Ошибка при загрузке организаций:', e)
  }
}

const openModal = (department = null) => {
  currentDepartment.value = department
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
}

const handleSave = async () => {
  await fetchDepartments()
  closeModal()
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
      <UiInput
        v-model="search"
        class="w-full md:w-1/3"
        placeholder="Поиск отделов..."
      />
      <UiButton @click="openModal" class="w-full md:w-auto">
        Добавить отдел
      </UiButton>
    </div>

    <DepartmentsTable
      :departments="filteredDepartments"
      :organizations="organizations"
      @edit="openModal"
      @delete="departmentsApi.delete"
      @refresh="fetchDepartments"
    />

    <DepartmentsFormModal
      v-if="showModal"
      :department="currentDepartment"
      :organizations="organizations"
      @close="closeModal"
      @save="handleSave"
    />
  </div>
</template>

