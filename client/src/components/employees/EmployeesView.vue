<script setup>
import { ref, computed, onMounted } from 'vue';
import EmployeesTable from './EmployeesTable.vue';
import EmployeesFormModal from './EmployeesFormModal.vue';
import FilesFormModal from './FilesFormModal.vue';
import employeesApi from '../../api/employees';
import departmentsApi from '../../api/departments';
import positionsApi from '../../api/positions';
import filesApi from '../../api/files';
import UiInput from '../../components/ui/UiInput.vue';
import UiButton from '../../components/ui/UiButton.vue';

const employees = ref([]);
const departments = ref([]);
const positions = ref([]);
const files = ref([]);
const search = ref('');
const showEmployeeModal = ref(false);
const showFileModal = ref(false);
const currentEmployee = ref(null);
const currentFile = ref(null);
const employeeErrors = ref({});
const fileErrors = ref({});

const fetchEmployees = async () => {
  try {
    const res = await employeesApi.fetchAll();
    if (Array.isArray(res.data)) {
      employees.value = res.data.sort((a, b) => a.id - b.id);
    } else {
      console.warn('Получены невалидные данные от API:', res.data);
      employees.value = [];
    }
  } catch (e) {
    console.error('Ошибка при загрузке сотрудников:', e);
    employees.value = [];
  }
};

const fetchDepartments = async () => {
  try {
    const res = await departmentsApi.fetchAll();
    departments.value = res.data;
  } catch (e) {
    console.error('Ошибка при загрузке отделов:', e);
  }
};

const fetchPositions = async () => {
  try {
    const res = await positionsApi.fetchAll();
    positions.value = res.data;
  } catch (e) {
    console.error('Ошибка при загрузке должностей:', e);
  }
};

const fetchFiles = async () => {
  try {
    const response = await filesApi.fetchAll();
    files.value = response.data.sort((a, b) => a.id - b.id);
  } catch (error) {
    console.error('Ошибка при загрузке файлов:', error);
  }
};

const openEmployeeModal = (employee = null) => {
  employeeErrors.value = {};
  currentEmployee.value = employee;
  showEmployeeModal.value = true;
};

const closeEmployeeModal = () => {
  showEmployeeModal.value = false;
};

const openFileModal = (file = null, employeeId = null) => {
  fileErrors.value = {};
  currentFile.value = file;

  if (employeeId && !file) {
    currentFile.value = {
      employee_id: employeeId,
    };
  }

  showFileModal.value = true;
};

const closeFileModal = () => {
  showFileModal.value = false;
};

const handleEmployeeSave = async () => {
  await fetchEmployees();
  closeEmployeeModal();
};

const handleFileSave = async () => {
  await fetchFiles();
  closeFileModal();
};

const handleEmployeeError = (error) => {
  if (error.response?.data?.errors) {
    employeeErrors.value = error.response.data.errors;
  } else if (error.response?.data?.error) {
    employeeErrors.value.general = error.response.data.error;
  } else {
    employeeErrors.value.general = 'Произошла ошибка при сохранении';
  }
};

const handleFileError = (error) => {
  if (error.response) {
    if (error.response.data.error) {
      fileErrors.value = { general: error.response.data.error };
    }
    if (Array.isArray(error.response.data.details)) {
      fileErrors.value = error.response.data.details.reduce((acc, item) => {
        acc[item.path] = item.message;
        return acc;
      }, {});
    } else {
      console.log('Details is not an array:', error.response.data.details);
      fileErrors.value = { general: 'Неизвестная ошибка в details' };
    }
  } else {
    fileErrors.value = { general: 'Ошибка соединения с сервером' };
  }
};


const filteredEmployees = computed(() => {
  return employees.value.filter((emp) =>
     `${emp.last_name} ${emp.first_name} ${emp.middle_name || ''}`
      .toLowerCase()
      .includes(search.value.toLowerCase())
  );
});

const handleDeleteEmployee = async (id) => {
  if (confirm('Удалить этого сотрудника?')) {
    try {
      await employeesApi.delete(id);
      await fetchEmployees();
    } catch (e) {
      console.error('Ошибка при удалении:', e);
    }
  }
};

const handleDeleteFile = async (id) => {
  if (confirm('Удалить этот файл?')) {
    try {
      await filesApi.delete(id);
      await fetchFiles();
    } catch (error) {
      console.error('Ошибка при удалении файла:', error);
    }
  }
};

onMounted(() => {
  fetchEmployees();
  fetchDepartments();
  fetchPositions();
  fetchFiles();
});
</script>

<template>
  <div class="p-6 bg-gray-50 min-h-screen text-gray-800">
    <h1 class="text-3xl font-bold mb-6 text-black">Управление сотрудниками</h1>

    <div class="mb-6 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
      <UiInput v-model="search" class="w-full md:w-1/3" placeholder="Поиск сотрудников..." />
      <UiButton @click="openEmployeeModal" class="w-full md:w-auto"> Добавить сотрудника </UiButton>
    </div>

    <EmployeesTable
      :employees="filteredEmployees"
      :files="files"
      @edit-employee="openEmployeeModal"
      @delete-employee="handleDeleteEmployee"
      @edit-file="openFileModal"
      @delete-file="handleDeleteFile"
      @add-file="openFileModal(null, $event)"
    />

    <EmployeesFormModal
      v-if="showEmployeeModal"
      :employee="currentEmployee"
      :departments="departments"
      :positions="positions"
      :errors="employeeErrors"
      @close="closeEmployeeModal"
      @save="handleEmployeeSave"
      @error="handleEmployeeError"
    />

    <FilesFormModal
      v-if="showFileModal"
      :file="currentFile"
      :employees="employees"
      :errors="fileErrors"
      @close="closeFileModal"
      @save="handleFileSave"
      @error="handleFileError"
    />
  </div>
</template>
