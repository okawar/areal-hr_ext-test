<script setup>
import { ref, watch, computed } from 'vue';
import departmentsApi from '../../api/departments';
import UiInput from '../ui/UiInput.vue';
import UiSelect from '../ui/UiSelect.vue';
import UiTextarea from '../ui/UiTextarea.vue';
import UiButton from '../ui/UiButton.vue';
import { validateRequiredFields } from '../../utils/validateRequiredFields';

const props = defineProps({
  department: Object,
  organizations: Array,
  allDepartments: Array,
});

const emit = defineEmits(['close', 'save']);

const form = ref({
  id: null,
  name: '',
  organization_id: null,
  parent_id: null,
  comment: '',
});

const errors = ref({});

const organizationOptions = computed(() => {
  return props.organizations.map((org) => ({
    value: org.id,
    label: org.name,
  }));
});

const parentDepartmentOptions = computed(() => {
  if (!props.allDepartments) return [];

  return props.allDepartments
    .filter((d) => !form.value.id || d.id !== form.value.id)
    .map((dept) => ({
      value: dept.id,
      label: dept.name,
    }));
});

watch(
  () => props.department,
  (dept) => {
    if (dept) {
      form.value = {
        id: dept.id,
        name: dept.name,
        organization_id: dept.organization?.id || dept.organization_id || null,
        parent_id: dept.parent_id || null,
        comment: dept.comment || '',
      };
    } else {
      resetForm();
    }
  },
  { immediate: true }
);

const resetForm = () => {
  form.value = {
    id: null,
    name: '',
    organization_id: null,
    parent_id: null,
    comment: '',
  };
};

const requiredFields = ['name', 'organization_id'];
const fieldLabels = {
  name: 'Название',
  organization_id: 'Организация',
};

const isSubmitting = ref(false);

const save = async () => {
  if (isSubmitting.value) return;

  const validationErrors = validateRequiredFields(form.value, requiredFields, fieldLabels);
  if (Object.keys(validationErrors).length > 0) {
    errors.value = validationErrors;
    return;
  }

  isSubmitting.value = true;
  errors.value = {};

  const payloadData = {
    name: form.value.name,
    organization_id: form.value.organization_id ? Number(form.value.organization_id) : null,
    parent_id: form.value.parent_id ? Number(form.value.parent_id) : null,
    comment: form.value.comment || '',
  };

  try {
    if (form.value.id) {
      await departmentsApi.update(form.value.id, payloadData);
    } else {
      await departmentsApi.create(payloadData);
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
    <div class="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 z-50">
      <h2 class="text-xl font-semibold text-black mb-4">
        {{ form.id ? 'Редактирование отдела' : 'Добавление отдела' }}
      </h2>

      <div v-if="errors.general" class="bg-red-100 text-red-800 p-3 rounded mb-4 text-sm">
        {{ errors.general }}
      </div>

      <div class="space-y-4">

        <p class="text-sm text-gray-500 mb-2">
          Поля, отмеченные <span class="text-red-500">*</span>, обязательны для заполнения.
        </p>

        <UiInput
          id="name"
          v-model="form.name"
          label="Название отдела *"
          placeholder="Введите название"
          :error="errors.name"
        />

        <UiSelect
          id="org"
          v-model="form.organization_id"
          label="Организация *"
          :options="organizationOptions"
          placeholder="Выберите организацию"
          :error="errors.organization_id"
          optionLabel="label"
          optionValue="value"
        />


        <UiSelect
          id="parent"
          v-model="form.parent_id"
          label="Родительский отдел"
          :options="parentDepartmentOptions"
          placeholder="Выберите родительский отдел"
          :error="errors.parent_id"
          optionLabel="label"
          optionValue="value"
        />

        <UiTextarea
          id="comment"
          v-model="form.comment"
          label="Комментарий"
          placeholder="Комментарий к отделу"
          :error="errors.comment"
        />
      </div>

      <div class="mt-6 flex justify-end space-x-3">
        <UiButton variant="secondary" @click="emit('close')">Отмена</UiButton>
        <UiButton @click="save">Сохранить</UiButton>
      </div>
    </div>
  </div>
</template>
