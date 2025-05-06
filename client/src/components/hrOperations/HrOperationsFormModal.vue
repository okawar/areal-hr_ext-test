<script setup>
import { ref, computed, watch } from 'vue';
import hrOperationsApi from '../../api/hrOperations';
import UiInput from '../ui/UiInput.vue';
import UiSelect from '../ui/UiSelect.vue';
import UiButton from '../ui/UiButton.vue';

const props = defineProps({
  operation: Object,
  operations: {
    type: Array, 
    default: () => []
  },
  employees: Array,
  departments: Array,
  positions: Array,
  errors: Object,
});

const emit = defineEmits(['close', 'save', 'error']);

const getEmployeeLastOperation = (employeeId) => {
  if (!employeeId || !props.operations || !props.operations.length) return null;
  
  const employeeOperations = props.operations
    .filter(op => op.employee_id === Number(employeeId))
    .sort((a, b) => new Date(b.operation_date) - new Date(a.operation_date));
  
  return employeeOperations.length ? employeeOperations[0] : null;
};

const availableActionTypes = computed(() => {
  if (!form.value.employee_id) return [];
  
  const lastOperation = getEmployeeLastOperation(form.value.employee_id);
  const isCurrentlyEmployed = !lastOperation || lastOperation.action_type !== 'Увольнение';
  
  if (!lastOperation || !isCurrentlyEmployed) {
    return ['Прием на работу'];
  }
  
  return ['Увольнение', 'Изменение зарплаты', 'Изменение отдела'];
});

const actionTypesMap = {
  'Прием на работу': 'hire',
  'Увольнение': 'dismissal',
  'Изменение зарплаты': 'salary_change',
  'Изменение отдела': 'change_department',
};

const actionTypeOptions = computed(() => {
  return availableActionTypes.value.map((type) => ({
    id: type,
    name: type,
  }));
});

const reverseActionTypesMap = Object.fromEntries(
  Object.entries(actionTypesMap).map(([k, v]) => [v, k])
);

const employeeFullName = (employee) => {
  if (!employee) return '';

  let name = `${employee.last_name} ${employee.first_name}`;
  if (employee.middle_name) {
    name += ` ${employee.middle_name}`;
  }
  return name;
};

const defaultForm = () => ({
  id: null,
  employee_id: null,
  department_id: null,
  position_id: null,
  action_type: '',
  salary: null,
  operation_date: new Date().toISOString().split('T')[0],
});

const form = ref(defaultForm());

watch(() => form.value.employee_id, () => {
  form.value.action_type = availableActionTypes.value.length > 0 ? availableActionTypes.value[0] : '';
});

const requiredFields = computed(() => {
  const fields = {
    employee_id: true,
    action_type: true,
    operation_date: true,
    department_id: false,
    position_id: false,
    salary: false,
  };

  if (form.value.action_type === 'Прием на работу') {
    fields.department_id = true;
    fields.position_id = true;
    fields.salary = true;
  } else if (form.value.action_type === 'Изменение отдела') {
    fields.department_id = true;
  } else if (form.value.action_type === 'Изменение зарплаты') {
    fields.salary = true;
  }

  return fields;
});

const validateForm = () => {
  const errors = {};
  let isValid = true;

  for (const [field, required] of Object.entries(requiredFields.value)) {
    if (required && !form.value[field]) {
      errors[field] = 'Это поле обязательно для заполнения';
      isValid = false;
    }
  }

  if (!isValid) {
    emit('error', {
      response: {
        data: {
          details: Object.entries(errors).map(([path, message]) => ({ path, message })),
        },
      },
    });
  }

  return isValid;
};

const isSubmitting = ref(false);

const toNullableNumber = (val) => {
  const num = Number(val);
  return !isNaN(num) && val !== '' ? num : null;
};

const save = async () => {
  if (isSubmitting.value) return;
  if (!validateForm()) return;

  isSubmitting.value = true;

  const dataToSend = {
    employee_id: Number(form.value.employee_id),
    action_type: actionTypesMap[form.value.action_type],
    operation_date: form.value.operation_date,
  };

  if (['Прием на работу', 'Изменение отдела'].includes(form.value.action_type)) {
    dataToSend.department_id = toNullableNumber(form.value.department_id);
    dataToSend.position_id = toNullableNumber(form.value.position_id);
  }

  if (['Прием на работу'].includes(form.value.action_type)) {
    dataToSend.position_id = toNullableNumber(form.value.position_id);
  }

  if (['Прием на работу', 'Изменение зарплаты'].includes(form.value.action_type)) {
    dataToSend.salary = toNullableNumber(form.value.salary);
  }

  try {
    if (form.value.id) {
      await hrOperationsApi.update(form.value.id, dataToSend);
    } else {
      await hrOperationsApi.create(dataToSend);
    }
    emit('save');
  } catch (e) {
    emit('error', e);
  } finally {
    isSubmitting.value = false;
  }
};

watch(
  () => props.operation,
  (operation) => {
    if (operation) {
      form.value = {
        ...operation,
        action_type: reverseActionTypesMap[operation.action_type] || '',
      };
    } else {
      form.value = defaultForm();
    }
  },
  { immediate: true }
);
</script>

<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center px-4">
    <div
      class="fixed inset-0 bg-black-100 bg-opacity-40 backdrop-blur-sm transition-opacity"
      @click="emit('close')"
    />
    <div
      class="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 z-50 max-h-[90vh] overflow-y-auto"
    >
      <h2 class="text-xl font-semibold text-black mb-4">
        {{ form.id ? 'Редактирование операции' : 'Добавление операции' }}
      </h2>

      <div v-if="errors && errors.general" class="bg-red-100 text-red-800 p-3 rounded mb-4 text-sm">
        {{ errors.general }}
      </div>

      <div class="space-y-4">

        <p class="text-sm text-gray-500 mb-2">
          Поля, отмеченные <span class="text-red-500">*</span>, обязательны для заполнения.
        </p>

        <UiSelect
          v-model="form.employee_id"
          label="Сотрудник *"
          :options="employees || []"
          option-label="last_name"
          option-value="id"
          :error="errors && errors.employee_id"
          required
        >
          <template #option="{ option }">
            {{ employeeFullName(option) }}
          </template>
          <template #selected-option="{ option }">
            {{ employeeFullName(option) }}
          </template>
          
        </UiSelect>

        <UiSelect
          v-model="form.action_type"
          label="Тип операции *"
          :options="actionTypeOptions"
          option-label="name"
          option-value="id"
          :error="errors && errors.action_type"
          required
        >
        </UiSelect>

        <UiSelect
          v-if="['Прием на работу', 'Изменение отдела'].includes(form.action_type)"
          v-model="form.department_id"
          label="Отдел *"
          :options="departments || []"
          option-label="name"
          option-value="id"
          :error="errors && errors.department_id"
        >
        </UiSelect>

        <UiSelect
          v-if="['Прием на работу', 'Изменение отдела'].includes(form.action_type)"
          v-model="form.position_id"
          label="Должность *"
          :options="positions || []"
          option-label="name"
          option-value="id"
          :error="errors && errors.position_id"
        >
        </UiSelect>

        <UiInput
          v-if="['Прием на работу', 'Изменение зарплаты'].includes(form.action_type)"
          v-model="form.salary"
          type="number"
          label="Зарплата *"
          placeholder="Введите сумму"
          :error="errors && errors.salary"
        />

        <UiInput
          v-model="form.operation_date"
          type="date"
          label="Дата операции *"
          :error="errors && errors.operation_date"
        />
      </div>

      <div class="mt-6 flex justify-end space-x-3">
        <UiButton variant="secondary" @click="emit('close')">Отмена</UiButton>
        <UiButton @click="save">Сохранить</UiButton>
      </div>
    </div>
  </div>
</template>