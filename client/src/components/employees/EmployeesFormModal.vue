<script setup>
import { ref, watch } from 'vue';
import employeesApi from '../../api/employees';
import filesApi from '../../api/files'; 
import UiInput from '../ui/UiInput.vue';
import UiSelect from '../ui/UiSelect.vue';
import UiButton from '../ui/UiButton.vue';

const props = defineProps({
  employee: {
    type: Object,
    default: () => null,
  },
  departments: {
    type: Array,
    default: () => [],
  },
  positions: {
    type: Array,
    default: () => [],
  },
  errors: {
    type: Object,
    default: () => ({}),
  },
});

const emit = defineEmits(['close', 'save', 'error']);

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
  position_id: null,
  salary: '', 
  file_name: '',
  file_path: '',
  file: null, 
});

const handleFileUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    form.value.file_name = file.name;
    form.value.file_path = file.name;
    form.value.file = file;
  }
};

watch(
  () => props.employee,
  (emp) => {
    if (emp) {
      form.value = { ...emp };
    } else {
      resetForm();
    }
  },
  { immediate: true }
);

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
  };
};

const isSubmitting = ref(false);

const errors = ref({})

  const save = async () => {
  if (isSubmitting.value) return;

  isSubmitting.value = true;
  errors.value = {};

  const payloadData = {
        last_name: form.value.last_name,
        first_name: form.value.first_name,
        middle_name: form.value.middle_name || '',
        birth_date: form.value.birth_date,
        passport_series: form.value.passport_series,
        passport_number: form.value.passport_number,
        passport_issue_date: form.value.passport_issue_date,
        passport_issued_by: form.value.passport_issued_by,
        region: form.value.region,
        locality: form.value.locality,
        street: form.value.street,
        house: form.value.house,
        building: form.value.building || '',
        apartment: form.value.apartment || '',
  };

  try {
    if (form.value.id) {
      await employeesApi.update(payloadData);
    } else {
      await employeesApi.create(payloadData);
    }
    emit('save');
  } catch (e) {
    if (e.response?.data?.errors) {
      errors.value = e.response.data.errors;
    } else if (e.response?.data?.error) {
      errors.value.general = e.response.data.error;
    } else {
      errors.value.general = 'Произошла ошибка при сохранении.';
    }
  } finally {
    isSubmitting.value = false;
  }
}; 
</script>

<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center px-4">
    <div
      class="fixed inset-0 bg-black-100 bg-opacity-40 backdrop-blur-sm transition-opacity"
      @click="emit('close')"
    />
    <div
      class="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-6 z-50 overflow-y-auto max-h-[90vh]"
    >
      <h2 class="text-xl font-semibold text-black mb-4">
        {{ form.id ? 'Редактирование сотрудника' : 'Добавление сотрудника' }}
      </h2>

      <div v-if="errors.general" class="bg-red-100 text-red-800 p-3 rounded mb-4 text-sm">
        {{ errors.general }}
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <UiInput
          v-model="form.last_name"
          label="Фамилия"
          placeholder="Введите фамилию"
          :error="errors.last_name"
        />
        <UiInput
          v-model="form.first_name"
          label="Имя"
          placeholder="Введите имя"
          :error="errors.first_name"
        />
        <UiInput
          v-model="form.middle_name"
          label="Отчество"
          placeholder="Введите отчество"
          :error="errors.middle_name"
        />
        <UiInput
          v-model="form.birth_date"
          type="date"
          label="Дата рождения"
          :error="errors.birth_date"
        />
        <!-- <UiSelect
          v-model="form.department_id"
          label="Отдел"
          :options="departments"
          :error="errors.department_id"
          option-label="name"
          option-value="id"
        />
        <UiSelect
          v-model="form.position_id"
          label="Должность"
          :options="positions"
          :error="errors.position_id"
          option-label="name"
          option-value="id"
        /> -->
        <div class="col-span-2 space-y-2">
          <label class="block text-sm font-medium text-gray-700">Паспортные данные</label>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-2">
            <UiInput
              v-model="form.passport_series"
              placeholder="Серия"
              :error="errors.passport_series"
            />
            <UiInput
              v-model="form.passport_number"
              placeholder="Номер"
              :error="errors.passport_number"
            />
            <UiInput
              v-model="form.passport_issue_date"
              type="date"
              placeholder="Дата выдачи"
              :error="errors.passport_issue_date"
            />
          </div>
          <UiInput
            v-model="form.passport_issued_by"
            placeholder="Кем выдан"
            :error="errors.passport_issued_by"
          />
        </div>

        <div class="col-span-2 space-y-2">
          <label class="block text-sm font-medium text-gray-700">Адрес</label>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
            <UiInput v-model="form.region" placeholder="Регион" :error="errors.region" />
            <UiInput
              v-model="form.locality"
              placeholder="Город / населённый пункт"
              :error="errors.locality"
            />
            <UiInput v-model="form.street" placeholder="Улица" :error="errors.street" />
            <UiInput v-model="form.house" placeholder="Дом" :error="errors.house" />
            <UiInput v-model="form.building" placeholder="Корпус" :error="errors.building" />
            <UiInput v-model="form.apartment" placeholder="Квартира" :error="errors.apartment" />
          </div>
        </div>

        <!-- <UiInput
          v-model="form.salary"
          label="Зарплата"
          placeholder="Введите зарплату"
          type="number"
          :error="errors.salary"
        /> -->

        <!-- <div class="space-y-1">
          <label class="block text-sm font-medium text-gray-700">Скан паспорта</label>
          <div class="mt-1 flex items-center">
            <label class="cursor-pointer">
              <span
                class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  />
                </svg>
                Выбрать файл
              </span>
              <input type="file" class="sr-only" @change="handleFileUpload" />
            </label>
            <span class="ml-4 text-sm text-gray-500 truncate max-w-xs">
              {{ form.file_name || 'Файл не выбран' }}
            </span>
          </div>
          <p v-if="errors.file_name" class="mt-1 text-sm text-red-600">{{ errors.file_name }}</p>
        </div> -->
      </div>

      <div class="mt-6 flex justify-end space-x-3">
        <UiButton variant="secondary" @click="emit('close')">Отмена</UiButton>
        <UiButton @click="save">Сохранить</UiButton>
      </div>
    </div>
  </div>
</template>