<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

const operations = ref([]);
const employees = ref([]);
const departments = ref([]);
const positions = ref([]);
const showModal = ref(false);
const errors = ref({});
const operationForm = ref({
  id: null,
  employee_id: "",
  department_id: "",
  position_id: "",
  action_type: "",
  salary: "",
  operation_date: ""
});

// Типы HR операций
const actionTypes = [
  "Прием на работу",
  "Увольнение",
  "Изменение зарплаты",
  "Изменение отдела",
];

const fetchOperations = async () => {
  try {
    const response = await axios.get("http://localhost:3000/api/hrOp");
    operations.value = response.data.sort((a, b) => a.id - b.id);
  } catch (error) {
    console.error("Ошибка при загрузке операций:", error);
  }
};

const fetchEmployees = async () => {
  try {
    const response = await axios.get("http://localhost:3000/api/emp");
    employees.value = response.data;
  } catch (error) {
    console.error("Ошибка при загрузке сотрудников:", error);
  }
};

const fetchDepartments = async () => {
  try {
    const response = await axios.get("http://localhost:3000/api/dept");
    departments.value = response.data;
  } catch (error) {
    console.error("Ошибка при загрузке отделов:", error);
  }
};

const fetchPositions = async () => {
  try {
    const response = await axios.get("http://localhost:3000/api/pos");
    positions.value = response.data;
  } catch (error) {
    console.error("Ошибка при загрузке должностей:", error);
  }
};

const openModal = (operation = null) => {
  errors.value = {};
  if (operation) {
    operationForm.value = { ...operation };
  } else {
    operationForm.value = { 
      id: null, 
      employee_id: "", 
      department_id: "", 
      position_id: "", 
      action_type: "", 
      salary: "", 
      operation_date: new Date().toISOString().split('T')[0] 
    };
  }
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
};

const validateForm = () => {
  errors.value = {};
  let isValid = true;

  Object.entries(requiredFields.value).forEach(([field, isRequired]) => {
    if (isRequired && !operationForm.value[field]) {
      errors.value[field] = 'Это поле обязательно для заполнения';
      isValid = false;
    }
  });

  return isValid;
};


const saveOperation = async () => {
if (!validateForm()) return;
  
  const backendActionType = actionTypesMap[operationForm.value.action_type] || operationForm.value.action_type;
  
  const dataToSend = { 
    employee_id: Number(operationForm.value.employee_id),
    department_id: operationForm.value.department_id ? Number(operationForm.value.department_id) : null,
    position_id: operationForm.value.position_id ? Number(operationForm.value.position_id) : null,
    action_type: backendActionType,
    salary: operationForm.value.salary ? Number(operationForm.value.salary) : null,
    operation_date: operationForm.value.operation_date
  };
  
  try {
    if (operationForm.value.id) {
      await axios.put(`http://localhost:3000/api/hrOp/${operationForm.value.id}`, dataToSend);
    } else {
      await axios.post("http://localhost:3000/api/hrOp", dataToSend);
    }
    
    closeModal();
    fetchOperations();
  } catch (error) {
    console.error("Ошибка при сохранении:", error);
    
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
  }
};

const deleteOperation = async (id) => {
  if (!confirm("Вы уверены, что хотите удалить эту операцию?")) return;
  
  try {
    await axios.delete(`http://localhost:3000/api/hrOp/${id}`);
    fetchOperations();
  } catch (error) {
    console.error("Ошибка при удалении операции:", error);
    alert("Не удалось удалить операцию");
  }
};

const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('ru-RU');
};

const getEmployeeName = (id) => {
  if (typeof id === 'string' && isNaN(parseInt(id))) {
    return id;
  }
  
  const numId = Number(id);
  const employee = employees.value.find(e => e.id === numId);
  return employee ? `${employee.last_name} ${employee.first_name}` : id;
};

const getDepartmentName = (id) => {
  if (typeof id === 'string' && isNaN(parseInt(id))) {
    return id;
  }
  
  const numId = Number(id);
  const department = departments.value.find(d => d.id === numId);
  return department ? department.name : id;
};

const getPositionName = (id) => {
  if (typeof id === 'string' && isNaN(parseInt(id))) {
    return id;
  }
  
  const numId = Number(id);
  const position = positions.value.find(p => p.id === numId);
  return position ? position.name : id;
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

    <div class="overflow-x-auto bg-white rounded-2xl shadow-md">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-100 text-gray-700 text-sm uppercase tracking-wider">
          <tr>
            <th class="px-6 py-4 text-left">ID</th>
            <th class="px-6 py-4 text-left">Сотрудник</th>
            <th class="px-6 py-4 text-left">Тип операции</th>
            <th class="px-6 py-4 text-left">Отдел</th>
            <th class="px-6 py-4 text-left">Должность</th>
            <th class="px-6 py-4 text-left">Зарплата</th>
            <th class="px-6 py-4 text-left">Дата</th>
            <th class="px-6 py-4 text-left">Действия</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100">
          <tr v-for="op in operations" :key="op.id" class="hover:bg-gray-50 transition">
            <td class="px-6 py-4">{{ op.id }}</td>
            <td class="px-6 py-4">{{ getEmployeeName(op.employee_id) }}</td>
            <td class="px-6 py-4">{{ op.action_type }}</td>
            <td class="px-6 py-4">{{ op.department_id ? getDepartmentName(op.department_id) : '-' }}</td>
            <td class="px-6 py-4">{{ op.position_id ? getPositionName(op.position_id) : '-' }}</td>
            <td class="px-6 py-4">{{ op.salary ? op.salary.toLocaleString('ru-RU') : '-' }}</td>
            <td class="px-6 py-4">{{ formatDate(op.operation_date) }}</td>
            <td class="px-6 py-4 space-x-2">
              <button 
                @click="openModal(op)" 
                class="px-3 py-1 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition"
              >
                Редактировать
              </button>
              <button 
                @click="deleteOperation(op.id)" 
                class="px-3 py-1 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition"
              >
                Удалить
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Модальное окно для добавления/редактирования -->
    <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div class="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm transition-opacity"></div>

      <div class="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 z-50 max-h-[90vh] overflow-y-auto">
        <h3 class="text-xl font-semibold text-black mb-4">
          {{ operationForm.id ? 'Редактировать операцию' : 'Добавить операцию' }}
        </h3>

        <div v-if="errors.general" class="bg-red-100 text-red-800 p-3 rounded mb-4 text-sm">
          {{ errors.general }}
        </div>

        <div class="space-y-4">
          <div>
            <label for="employee_id" class="block text-sm font-medium text-gray-700">Сотрудник *</label>
            <select
              v-model="operationForm.employee_id"
              id="employee_id"
              class="mt-1 block w-full rounded-lg border border-gray-300 shadow-sm focus:ring-purple-600 focus:border-purple-600 sm:text-sm"
              :class="{ 'border-red-500': errors.employee_id }"
              required
            >
              <option value="">Выберите сотрудника</option>
              <option v-for="employee in employees" :key="employee.id" :value="employee.id">
                {{ employee.last_name }} {{ employee.first_name }}
              </option>
            </select>
            <p v-if="errors.employee_id" class="text-sm text-red-600 mt-1">{{ errors.employee_id }}</p>
          </div>

          <div>
            <label for="action_type" class="block text-sm font-medium text-gray-700">Тип операции *</label>
            <select
              v-model="operationForm.action_type"
              id="action_type"
              class="mt-1 block w-full rounded-lg border border-gray-300 shadow-sm focus:ring-purple-600 focus:border-purple-600 sm:text-sm"
              :class="{ 'border-red-500': errors.action_type }"
              required
            >
              <option value="">Выберите тип операции</option>
              <option v-for="type in actionTypes" :key="type" :value="type">
                {{ type }}
              </option>
            </select>
            <p v-if="errors.action_type" class="text-sm text-red-600 mt-1">{{ errors.action_type }}</p>
          </div>

          <div v-if="['Прием на работу', 'Изменение отдела'].includes(operationForm.action_type)">
            <label for="department_id" class="block text-sm font-medium text-gray-700">Отдел *</label>
            <select
              v-model="operationForm.department_id"
              id="department_id"
              class="mt-1 block w-full rounded-lg border border-gray-300 shadow-sm focus:ring-purple-600 focus:border-purple-600 sm:text-sm"
              :class="{ 'border-red-500': errors.department_id }"
            >
              <option value="">Выберите отдел</option>
              <option v-for="department in departments" :key="department.id" :value="department.id">
                {{ department.name }}
              </option>
            </select>
            <p v-if="errors.department_id" class="text-sm text-red-600 mt-1">{{ errors.department_id }}</p>
          </div>

          <div v-if="['Прием на работу', 'Изменение должности'].includes(operationForm.action_type)">
            <label for="position_id" class="block text-sm font-medium text-gray-700">Должность *</label>
            <select
              v-model="operationForm.position_id"
              id="position_id"
              class="mt-1 block w-full rounded-lg border border-gray-300 shadow-sm focus:ring-purple-600 focus:border-purple-600 sm:text-sm"
              :class="{ 'border-red-500': errors.position_id }"
            >
              <option value="">Выберите должность</option>
              <option v-for="position in positions" :key="position.id" :value="position.id">
                {{ position.name }}
              </option>
            </select>
            <p v-if="errors.position_id" class="text-sm text-red-600 mt-1">{{ errors.position_id }}</p>
          </div>

          <div v-if="['Прием на работу', 'Изменение зарплаты'].includes(operationForm.action_type)">
            <label for="salary" class="block text-sm font-medium text-gray-700">Зарплата *</label>
            <input
              v-model="operationForm.salary"
              type="number"
              id="salary"
              class="mt-1 block w-full rounded-lg border border-gray-300 shadow-sm focus:ring-purple-600 focus:border-purple-600 sm:text-sm"
              :class="{ 'border-red-500': errors.salary }"
              placeholder="Введите сумму"
            />
            <p v-if="errors.salary" class="text-sm text-red-600 mt-1">{{ errors.salary }}</p>
          </div>

          <div>
            <label for="operation_date" class="block text-sm font-medium text-gray-700">Дата операции *</label>
            <input
              v-model="operationForm.operation_date"
              type="date"
              id="operation_date"
              class="mt-1 block w-full rounded-lg border border-gray-300 shadow-sm focus:ring-purple-600 focus:border-purple-600 sm:text-sm"
              :class="{ 'border-red-500': errors.operation_date }"
              required
            />
            <p v-if="errors.operation_date" class="text-sm text-red-600 mt-1">{{ errors.operation_date }}</p>
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
            @click="saveOperation"
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