<script setup>
import { ref, onMounted } from 'vue';
import HrOperationsTable from './HrOperationsTable.vue';
import HrOperationsFormModal from './HrOperationsFormModal.vue';
import hrOperationsApi from '../../api/hrOperations';
import employeesApi from '../../api/employees';
import departmentsApi from '../../api/departments';
import positionsApi from '../../api/positions';

const operations = ref([]);
const employees = ref([]);
const departments = ref([]);
const positions = ref([]);
const showModal = ref(false);
const currentOperation = ref(null);
const errors = ref({});

const fetchOperations = async () => {
  try {
    const response = await hrOperationsApi.fetchAll();
    operations.value = response.data.sort((a, b) => a.id - b.id);
  } catch (error) {
    console.error("Ошибка при загрузке операций:", error);
  }
};

const fetchEmployees = async () => {
  try {
    const response = await employeesApi.fetchAll();
    employees.value = response.data;
  } catch (error) {
    console.error("Ошибка при загрузке сотрудников:", error);
  }
};

const fetchDepartments = async () => {
  try {
    const response = await departmentsApi.fetchAll();
    departments.value = response.data;
  } catch (error) {
    console.error("Ошибка при загрузке отделов:", error);
  }
};

const fetchPositions = async () => {
  try {
    const response = await positionsApi.fetchAll();
    positions.value = response.data;
  } catch (error) {
    console.error("Ошибка при загрузке должностей:", error);
  }
};

const openModal = (operation = null) => {
  errors.value = {};
  currentOperation.value = operation;
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
};

const handleSave = async () => {
  await fetchOperations();
  closeModal();
};

const handleError = (error) => {
  if (error.response) {
    if (error.response.data.error) {
      errors.value = { general: error.response.data.error };
    }
    if (error.response.data.details) {
      errors.value = error.response.data.details.reduce((acc, item) => {
        acc[item.path] = item.message;
        return acc;
      }, {});
    }
  } else {
    errors.value = { general: "Ошибка соединения с сервером" };
  }
};

onMounted(() => {
  fetchOperations();
  fetchEmployees();
  fetchDepartments();
  fetchPositions();
});
</script>

<template>
  <div class="p-6 bg-gray-50 min-h-screen text-gray-800">
    <h2 class="text-3xl font-semibold mb-6 text-black">HR Операции</h2>
    <button 
      @click="openModal()" 
      class="w-full md:w-auto px-6 py-2 bg-purple-600 text-white rounded-xl shadow-md hover:bg-purple-700 transition duration-200 mb-6"
    >
      Добавить операцию
    </button>

    <HrOperationsTable
      :operations="operations"
      :employees="employees"
      :departments="departments"
      :positions="positions"
      @edit="openModal"
      @delete="hrOperationsApi.delete"
      @refresh="fetchOperations"
    />

    <HrOperationsFormModal
      v-if="showModal"
      :operation="currentOperation"
      :employees="employees"
      :departments="departments"
      :positions="positions"
      :errors="errors"
      @close="closeModal"
      @save="handleSave"
      @error="handleError"
    />
  </div>
</template>