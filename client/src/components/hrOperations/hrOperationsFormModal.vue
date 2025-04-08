<script setup>
import { ref, computed, watch } from 'vue';
import hrOperationsApi from '../../api/hrOperations';

const props = defineProps({
  operation: {
    type: Object,
    default: null
  },
  employees: {
    type: Array,
    required: true
  },
  departments: {
    type: Array,
    required: true
  },
  positions: {
    type: Array,
    required: true
  },
  errors: {
    type: Object,
    default: () => ({})
  }
});

const emit = defineEmits(['close', 'save', 'error']);

const actionTypes = [
  "Прием на работу",
  "Увольнение",
  "Изменение зарплаты",
  "Изменение отдела",
];

const actionTypesMap = {
  "Прием на работу": "hire",
  "Увольнение": "fire",
  "Изменение зарплаты": "change_salary",
  "Изменение отдела": "change_department"
};

const form = ref({
  id: null,
  employee_id: "",
  department_id: "",
  position_id: "",
  action_type: "",
  salary: "",
  operation_date: new Date().toISOString().split('T')[0]
});

const requiredFields = computed(() => {
  const baseRequired = {
    employee_id: true,
    action_type: true,
    operation_date: true,
    department_id: false,
    position_id: false,
    salary: false
  };

  if (form.value.action_type === "Прием на работу") {
    baseRequired.department_id = true;
    baseRequired.position_id = true;
    baseRequired.salary = true;
  } else if (form.value.action_type === "Изменение отдела") {
    baseRequired.department_id = true;
  } else if (form.value.action_type === "Изменение зарплаты") {
    baseRequired.salary = true;
  }

  return baseRequired;
});

const validateForm = () => {
  const errors = {};
  let isValid = true;

  Object.entries(requiredFields.value).forEach(([field, isRequired]) => {
    if (isRequired && !form.value[field]) {
      errors[field] = 'Это поле обязательно для заполнения';
      isValid = false;
    }
  });

  if (!isValid) {
    emit('error', { response: { data: { details: Object.entries(errors).map(([path, message]) => ({ path, message })) } } });
  }

  return isValid;
};

const save = async () => {
  if (!validateForm()) return;
  
  const backendActionType = actionTypesMap[form.value.action_type] || form.value.action_type;
  
  const dataToSend = { 
    employee_id: Number(form.value.employee_id),
    department_id: form.value.department_id ? Number(form.value.department_id) : null,
    position_id: form.value.position_id ? Number(form.value.position_id) : null,
    action_type: backendActionType,
    salary: form.value.salary ? Number(form.value.salary) : null,
    operation_date: form.value.operation_date
  };
  
  try {
    if (form.value.id) {
      await hrOperationsApi.update(form.value.id, dataToSend);
    } else {
      await hrOperationsApi.create(dataToSend);
    }
    
    emit('save');
  } catch (error) {
    emit('error', error);
  }
};

watch(() => props.operation, (operation) => {
  if (operation) {
    form.value = { ...operation };
  } else {
    form.value = { 
      id: null, 
      employee_id: "", 
      department_id: "", 
      position_id: "", 
      action_type: "", 
      salary: "", 
      operation_date: new Date().toISOString().split('T')[0] 
    };
  }
}, { immediate: true });
</script>

<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center px-4">
    <div class="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm transition-opacity" @click="emit('close')"></div>

    <div class="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 z-50 max-h-[90vh] overflow-y-auto">
      <h3 class="text-xl font-semibold text-black mb-4">
        {{ form.id ? 'Редактировать операцию' : 'Добавить операцию' }}
      </h3>

      <div v-if="errors.general" class="bg-red-100 text-red-800 p-3 rounded mb-4 text-sm">
        {{ errors.general }}
      </div>

      <div class="space-y-4">
        <div>
          <label for="employee_id" class="block text-sm font-medium text-gray-700">Сотрудник *</label>
          <select
            v-model="form.employee_id"
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
            v-model="form.action_type"
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

        <div v-if="['Прием на работу', 'Изменение отдела'].includes(form.action_type)">
          <label for="department_id" class="block text-sm font-medium text-gray-700">Отдел *</label>
          <select
            v-model="form.department_id"
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

        <div v-if="['Прием на работу', 'Изменение должности'].includes(form.action_type)">
          <label for="position_id" class="block text-sm font-medium text-gray-700">Должность *</label>
          <select
            v-model="form.position_id"
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

        <div v-if="['Прием на работу', 'Изменение зарплаты'].includes(form.action_type)">
          <label for="salary" class="block text-sm font-medium text-gray-700">Зарплата *</label>
          <input
            v-model="form.salary"
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
            v-model="form.operation_date"
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