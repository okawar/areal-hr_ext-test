<script setup>
import { ref, computed, onMounted } from 'vue';
import HrOperationsTable from './HrOperationsTable.vue';
import HrOperationsFormModal from './HrOperationsFormModal.vue';
import hrOperationsApi from '../../api/hrOperations';
import employeesApi from '../../api/employees';
import departmentsApi from '../../api/departments';
import positionsApi from '../../api/positions';
import UiInput from '../../components/ui/UiInput.vue';
import UiButton from '../../components/ui/UiButton.vue';

const actionTypeDisplayMap = {
  hire: 'Прием на работу',
  dismissal: 'Увольнение',
  change_salary: 'Изменение зарплаты',
  change_department: 'Изменение отдела',
};

const operations = ref([]);
const employees = ref([]);
const departments = ref([]);
const positions = ref([]);
const search = ref('');
const showModal = ref(false);
const currentOperation = ref(null);
const errors = ref({});

const fetchOperations = async () => {
  try {
    const res = await hrOperationsApi.fetchAll();
    if (Array.isArray(res.data)) {
      operations.value = res.data
        .map((op) => ({
          ...op,
          action_type: actionTypeDisplayMap[op.action_type] || op.action_type,
        }))
        .sort((a, b) => a.id - b.id);
    } else {
      console.warn('Получены невалидные данные от API:', res.data);
      operations.value = [];
    }
  } catch (e) {
    console.error('Ошибка при загрузке операций:', e);
    operations.value = [];
  }
};

const fetchEmployees = async () => {
  try {
    const res = await employeesApi.fetchAll();
    employees.value = Array.isArray(res.data) ? res.data : [];
  } catch (e) {
    console.error('Ошибка при загрузке сотрудников:', e);
    employees.value = [];
  }
};

const fetchDepartments = async () => {
  try {
    const res = await departmentsApi.fetchAll();
    departments.value = Array.isArray(res.data) ? res.data : [];
  } catch (e) {
    console.error('Ошибка при загрузке отделов:', e);
    departments.value = [];
  }
};

const fetchPositions = async () => {
  try {
    const res = await positionsApi.fetchAll();
    positions.value = Array.isArray(res.data) ? res.data : [];
  } catch (e) {
    console.error('Ошибка при загрузке должностей:', e);
    positions.value = [];
  }
};

const openModal = (operation = null) => {
  errors.value = {};
  if (operation) {
    const backendActionType = Object.entries(actionTypeDisplayMap).find(
      ([key, value]) => value === operation.action_type
    )?.[0];

    currentOperation.value = {
      ...operation,
      action_type: backendActionType || operation.action_type,
    };
  } else {
    currentOperation.value = operation;
  }
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
  console.log('Error data:', error.response?.data);

  errors.value = {};

  if (error.response?.data?.details) {
    const details = error.response.data.details;

    if (Array.isArray(details)) {
      details.forEach((detail) => {
        if (detail && detail.path && detail.message) {
          errors.value[detail.path] = detail.message;
        }
      });
    } else if (typeof details === 'object') {
      Object.entries(details).forEach(([key, value]) => {
        errors.value[key] = value;
      });
    } else {
      errors.value.general = 'Произошла ошибка при обработке данных';
    }
  } else if (error.response?.data?.errors) {
    errors.value = error.response.data.errors;
  } else if (error.response?.data?.error) {
    errors.value = { general: error.response.data.error };
  } else if (error.message) {
    errors.value = { general: error.message };
  } else {
    errors.value = { general: 'Произошла ошибка при сохранении' };
  }
};

const filteredOperations = computed(() => {
  return operations.value.filter((op) => {
    const employee = employees.value.find((e) => e.id === op.employee_id);
    const employeeName = employee
      ? `${employee.last_name} ${employee.first_name}`.toLowerCase()
      : '';
    return (
      op.action_type.toLowerCase().includes(search.value.toLowerCase()) ||
      employeeName.includes(search.value.toLowerCase())
    );
  });
});

onMounted(() => {
  fetchOperations();
  fetchEmployees();
  fetchDepartments();
  fetchPositions();
});
</script>

<template>
  <div class="p-6 bg-gray-50 min-h-screen text-gray-800">
    <h1 class="text-3xl font-bold mb-6 text-black">HR Операции</h1>
    <div class="mb-6 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
      <UiInput
        v-model="search"
        class="w-full md:w-1/3"
        placeholder="Поиск по операциям или сотрудникам..."
      />
      <UiButton @click="openModal" class="w-full md:w-auto"> Добавить операцию </UiButton>
    </div>
    <HrOperationsTable
      :operations="filteredOperations"
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
