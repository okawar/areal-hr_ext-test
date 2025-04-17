<script setup>
import { ref, computed, watch } from 'vue'
import hrOperationsApi from '../../api/hrOperations'
import UiInput from '../ui/UiInput.vue'
import UiSelect from '../ui/UiSelect.vue'
import UiButton from '../ui/UiButton.vue'

const props = defineProps({
  operation: Object,
  employees: Array,
  departments: Array,
  positions: Array,
  errors: Object
})

const emit = defineEmits(['close', 'save', 'error'])

const actionTypes = [
  "Прием на работу",
  "Увольнение",
  "Изменение зарплаты",
  "Изменение отдела"
]

const actionTypesMap = {
  "Прием на работу": "hire",
  "Увольнение": "dismissal",
  "Изменение зарплаты": "change_salary",
  "Изменение отдела": "change_department"
}

const form = ref({
  id: null,
  employee_id: null,
  department_id: null,
  position_id: null,
  action_type: "",
  salary: null,
  operation_date: new Date().toISOString().split('T')[0]
})

const requiredFields = computed(() => {
  const fields = {
    employee_id: true,
    action_type: true,
    operation_date: true,
    department_id: false,
    position_id: false,
    salary: false
  }

  if (form.value.action_type === "Прием на работу") {
    fields.department_id = true
    fields.position_id = true
    fields.salary = true
  } else if (form.value.action_type === "Изменение отдела") {
    fields.department_id = true
  } else if (form.value.action_type === "Изменение зарплаты") {
    fields.salary = true
  }

  return fields
})

const validateForm = () => {
  const errors = {}
  let isValid = true

  Object.entries(requiredFields.value).forEach(([field, isRequired]) => {
    if (isRequired && !form.value[field]) {
      errors[field] = 'Это поле обязательно для заполнения'
      isValid = false
    }
  })

  if (!isValid) {
    emit('error', { response: { data: { details: Object.entries(errors).map(([path, message]) => ({ path, message })) } } })
  }

  return isValid
}

const save = async () => {
  if (!validateForm()) return

  const toNullableNumber = (val) => {
    return val !== null && val !== '' ? Number(val) : null
  }

  const dataToSend = {
    employee_id: Number(form.value.employee_id),
    action_type: actionTypesMap[form.value.action_type] || form.value.action_type,
    operation_date: form.value.operation_date,
    department_id: toNullableNumber(form.value.department_id),
    position_id: toNullableNumber(form.value.position_id),
    salary: toNullableNumber(form.value.salary)
  }



  try {
    if (form.value.id) {
      await hrOperationsApi.update(form.value.id, dataToSend)
    } else {
      await hrOperationsApi.create(dataToSend)
    }
    emit('save')
  } catch (e) {
    emit('error', e)
  }
}

watch(() => props.operation, (operation) => {
  if (operation) {
    form.value = { ...operation }
  } else {
    form.value = {
      id: null,
      employee_id: null,
      department_id: null,
      position_id: null,
      action_type: "",
      salary: null,
      operation_date: new Date().toISOString().split('T')[0]
    }
  }
}, { immediate: true })
</script>

<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center px-4">
    <div class="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm transition-opacity" @click="emit('close')" />
    <div class="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 z-50 max-h-[90vh] overflow-y-auto">
      <h2 class="text-xl font-semibold text-black mb-4">
        {{ form.id ? 'Редактирование операции' : 'Добавление операции' }}
      </h2>

      <div v-if="errors && errors.general" class="bg-red-100 text-red-800 p-3 rounded mb-4 text-sm">
        {{ errors.general }}
      </div>

      <div class="space-y-4">
        <UiSelect
          v-model="form.employee_id"
          label="Сотрудник *"
          :options="employees || []"
          option-label="last_name"
          option-value="id"
          :error="errors && errors.employee_id"
        >
          <template #option="{ option }">
            {{ option.last_name }} {{ option.first_name }}
          </template>
        </UiSelect>

        <UiSelect
          v-model="form.action_type"
          label="Тип операции *"
          :options="actionTypes"
          :error="errors && errors.action_type"
        />

        <UiSelect
          v-if="['Прием на работу', 'Изменение отдела'].includes(form.action_type)"
          v-model="form.department_id"
          label="Отдел *"
          :options="departments || []"
          option-label="name"
          option-value="id"
          :error="errors && errors.department_id"
        />

        <UiSelect
          v-if="['Прием на работу'].includes(form.action_type)"
          v-model="form.position_id"
          label="Должность *"
          :options="positions || []"
          option-label="name"
          option-value="id"
          :error="errors && errors.position_id"
        />

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