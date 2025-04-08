<script setup>
import { ref, watch } from 'vue'
import employeesApi from '../../api/employees'

const props = defineProps({
  employee: {
    type: Object,
    default: null
  },
  departments: {
    type: Array,
    required: true
  },
  positions: {
    type: Array,
    required: true
  }
})

const emit = defineEmits(['close', 'save'])

const form = ref({
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

const errors = ref({})

watch(() => props.employee, (emp) => {
  if (emp) {
    form.value = { ...emp }
  } else {
    resetForm()
  }
}, { immediate: true })

const resetForm = () => {
  form.value = {
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
}

const save = async () => {
  errors.value = {}
  const dataToSend = { ...form.value }
  if (!dataToSend.id) delete dataToSend.id

  try {
    if (form.value.id) {
      await employeesApi.update(form.value.id, dataToSend)
    } else {
      await employeesApi.create(dataToSend)
    }
    emit('save')
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
</script>

<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center px-4">
    <div class="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm transition-opacity" @click="emit('close')"></div>

    <div class="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-6 z-50 overflow-y-auto max-h-[90vh]">
      <h2 class="text-xl font-semibold text-black mb-4">
        {{ form.id ? 'Редактирование сотрудника' : 'Добавление сотрудника' }}
      </h2>

      <div v-if="errors.general" class="bg-red-100 text-red-800 p-3 rounded mb-4 text-sm">
        {{ errors.general }}
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700">Фамилия</label>
          <input v-model="form.last_name" type="text" class="input" />
          <p v-if="errors.last_name" class="text-sm text-red-600 mt-1">{{ errors.last_name }}</p>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700">Имя</label>
          <input v-model="form.first_name" type="text" class="input" />
          <p v-if="errors.first_name" class="text-sm text-red-600 mt-1">{{ errors.first_name }}</p>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700">Отчество</label>
          <input v-model="form.middle_name" type="text" class="input" />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700">Дата рождения</label>
          <input v-model="form.birth_date" type="date" class="input" />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700">Отдел</label>
          <select v-model="form.department_id" class="input">
            <option :value="null" disabled>Выберите отдел</option>
            <option v-for="dept in departments" :key="dept.id" :value="dept.id">
              {{ dept.name }}
            </option>
          </select>
          <p v-if="errors.department_id" class="text-sm text-red-600 mt-1">{{ errors.department_id }}</p>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700">Должность</label>
          <select v-model="form.position_id" class="input">
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
            <input v-model="form.passport_series" placeholder="Серия" class="input w-1/3" />
            <input v-model="form.passport_number" placeholder="Номер" class="input w-2/3" />
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700">Дата выдачи</label>
          <input v-model="form.passport_issue_date" type="date" class="input" />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700">Кем выдан</label>
          <input v-model="form.passport_issued_by" type="text" class="input" />
        </div>

        <div class="col-span-2">
          <label class="block text-sm font-medium text-gray-700">Адрес</label>
          <div class="grid grid-cols-2 gap-2">
            <input v-model="form.region" placeholder="Регион" class="input" />
            <input v-model="form.locality" placeholder="Город / населённый пункт" class="input" />
            <input v-model="form.street" placeholder="Улица" class="input" />
            <input v-model="form.house" placeholder="Дом" class="input" />
            <input v-model="form.building" placeholder="Корпус" class="input" />
            <input v-model="form.apartment" placeholder="Квартира" class="input" />
          </div>
        </div>
      </div>

      <div class="mt-6 flex justify-end space-x-3">
        <button @click="emit('close')" class="px-4 py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-100 transition">Отмена</button>
        <button @click="save" class="px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700 transition">Сохранить</button>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>