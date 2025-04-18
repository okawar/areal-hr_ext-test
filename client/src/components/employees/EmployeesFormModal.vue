<script setup>
import { ref, watch } from 'vue';
import employeesApi from '../../api/employees';
import UiInput from '../ui/UiInput.vue';
import UiSelect from '../ui/UiSelect.vue';
import UiButton from '../ui/UiButton.vue';

const props = defineProps({
  employee: Object,
  departments: Array,
  positions: Array,
  errors: Object,
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
});

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
    department_id: null,
    position_id: null,
  };
};

const isSubmitting = ref(false);

const save = async () => {
  if (isSubmitting.value) return;

  isSubmitting.value = true;

  const dataToSend = { ...form.value };
  if (!dataToSend.id) delete dataToSend.id;

  try {
    if (form.value.id) {
      await employeesApi.update(form.value.id, dataToSend);
    } else {
      await employeesApi.create(dataToSend);
    }
    emit('save');
  } catch (e) {
    emit('error', e);
  }
};
</script>

<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center px-4">
    <div
      class="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm transition-opacity"
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

        <UiSelect
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
        />

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
      </div>

      <div class="mt-6 flex justify-end space-x-3">
        <UiButton variant="secondary" @click="emit('close')">Отмена</UiButton>
        <UiButton @click="save">Сохранить</UiButton>
      </div>
    </div>
  </div>
</template>
