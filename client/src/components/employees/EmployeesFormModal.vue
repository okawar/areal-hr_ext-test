<script setup>
import { ref, watch } from 'vue';
import { VueMaskDirective } from 'v-mask';
import employeesApi from '../../api/employees';
import UiInput from '../ui/UiInput.vue';
import UiButton from '../ui/UiButton.vue';
import { validateRequiredFields } from '../../utils/validateRequiredFields';

const vMask = VueMaskDirective;

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
const errors = ref({});

const requiredFields = [
  'last_name',
  'first_name',
  'birth_date',
  'passport_series',
  'passport_number',
  'passport_issue_date',
  'passport_issued_by',
  'region',
  'locality',
  'street',
  'house',
];

const fieldLabels = {
  last_name: 'Фамилия',
  first_name: 'Имя',
  middle_name: 'Отчество',
  birth_date: 'Дата рождения',
  passport_series: 'Серия паспорта',
  passport_number: 'Номер паспорта',
  passport_issue_date: 'Дата выдачи паспорта',
  passport_issued_by: 'Кем выдан паспорт',
  region: 'Регион',
  locality: 'Город / населённый пункт',
  street: 'Улица',
  house: 'Дом',
  building: 'Корпус',
  apartment: 'Квартира',
};

const save = async () => {
  if (isSubmitting.value) return;

  const validationErrors = validateRequiredFields(form.value, requiredFields, fieldLabels);
  if (Object.keys(validationErrors).length > 0) {
    errors.value = validationErrors;
    return;
  }

  if (form.value.passport_series.length !== 4 || !/^\d{4}$/.test(form.value.passport_series)) {
    errors.value.passport_series = 'Серия паспорта должна содержать ровно 4 цифры';
    return;
  }

  if (form.value.passport_number.length !== 6 || !/^\d{6}$/.test(form.value.passport_number)) {
    errors.value.passport_number = 'Номер паспорта должен содержать ровно 6 цифры';
    return;
  }

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
      await employeesApi.update(form.value.id, payloadData);
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

      <p class="text-sm text-gray-500 mb-2">
        Поля, отмеченные <span class="text-red-500">*</span>, обязательны для заполнения.
      </p>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <UiInput
          v-model="form.last_name"
          label="Фамилия *"
          placeholder="Введите фамилию"
          :error="errors.last_name"
          required
        />
        <UiInput
          v-model="form.first_name"
          label="Имя *"
          placeholder="Введите имя"
          :error="errors.first_name"
          required
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
          label="Дата рождения *"
          :error="errors.birth_date"
          required
        />

        <div class="col-span-2 space-y-2">
          <label class="block text-sm font-medium text-gray-700">Паспортные данные</label>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-2">
            <UiInput
              v-model="form.passport_series"
              v-mask="'####'"
              placeholder="Серия (4 цифры) *"
              :error="errors.passport_series"
              required
            />
            <UiInput
              v-model="form.passport_number"
              v-mask="'######'"
              placeholder="Номер (6 цифр) *"
              :error="errors.passport_number"
              required
            />
            <UiInput
              v-model="form.passport_issue_date"
              type="date"
              placeholder="Дата выдачи *"
              :error="errors.passport_issue_date"
              required
            />
          </div>
          <UiInput
            v-model="form.passport_issued_by"
            placeholder="Кем выдан *"
            :error="errors.passport_issued_by"
            required
          />
        </div>

        <div class="col-span-2 space-y-2">
          <label class="block text-sm font-medium text-gray-700">Адрес</label>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
            <UiInput v-model="form.region" placeholder="Регион *" :error="errors.region" required />
            <UiInput
              v-model="form.locality"
              placeholder="Город / населённый пункт *"
              :error="errors.locality"
              required
            />
            <UiInput v-model="form.street" placeholder="Улица *" :error="errors.street" required />
            <UiInput v-model="form.house" placeholder="Дом *" :error="errors.house" required />
            <UiInput v-model="form.building" placeholder="Корпус" :error="errors.building" />
            <UiInput v-model="form.apartment" placeholder="Квартира" :error="errors.apartment" />
          </div>
        </div>
      </div>

      <div class="mt-6 flex justify-end space-x-3">
        <UiButton variant="secondary" @click="emit('close')">Отмена</UiButton>
        <UiButton @click="save" :disabled="isSubmitting">Сохранить</UiButton>
      </div>
    </div>
  </div>
</template>