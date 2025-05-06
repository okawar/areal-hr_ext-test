<script setup>
import { ref, computed, watch } from 'vue';
import filesApi from '../../api/files';
import UiSelect from '../ui/UiSelect.vue';
import UiTextarea from '../ui/UiTextarea.vue';
import UiButton from '../ui/UiButton.vue';
import { validateRequiredFields } from '../../utils/validateRequiredFields';

const props = defineProps({
  modelValue: Object,
  employees: {
    type: Array,
    required: true,
  },
  errors: {
    type: Object,
    default: () => ({}),
  },
});

const emit = defineEmits(['update:modelValue', 'close', 'save', 'error']);

const form = ref({
  id: null,
  employee_id: '',
  file_name: '',
  file_path: '',
  file: null,
  comment: '',
});

const validationErrors = ref({ employee_id: '' });
const isSubmitting = ref(false);

const updateFileForm = (file) => {
  if (file) {
    form.value = {
      id: file.id,
      employee_id: file.employee_id != null ? String(file.employee_id) : '',
      file_name: file.file_name,
      file_path: file.file_path,
      comment: file.comment || '',
      file: null,
    };
  } else {
    form.value = {
      id: null,
      employee_id: '',
      file_name: '',
      file_path: '',
      file: null,
      comment: '',
    };
  }
  validationErrors.value = { employee_id: '' };
};

watch(() => props.modelValue, (file) => {
  updateFileForm(file);
}, { immediate: true });

const handleFileUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    form.value.file_name = file.name;
    form.value.file_path = file.name;
    form.value.file = file;
  }
};

const requiredFields = ['employee_id'];
const fieldLabels = {
  employee_id: 'Сотрудник',
};



const save = async () => {
  if (isSubmitting.value) return;

  const validationErrors = validateRequiredFields(form.value, requiredFields, fieldLabels);
  if (Object.keys(validationErrors).length > 0) {
    errors.value = validationErrors;
    return;
  }

  
  isSubmitting.value = true;

  try {
    if (!form.value.id && !form.value.file) {
      throw new Error('Файл обязателен для загрузки');
    }

    const payload = {
      employee_id: Number(form.value.employee_id),
      comment: form.value.comment || '',
      file: form.value.file,
      file_name: form.value.file?.name || form.value.file_name || '',
    };

    if (form.value.id) {
      await filesApi.update(form.value.id, payload);
    } else {
      await filesApi.create(payload);
    }

    emit('save');
  } catch (error) {
    console.error('Ошибка при сохранении:', error);
    emit('error', error);
  } finally {
    isSubmitting.value = false;
  }
};

</script>

<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center px-4">
    <div class="fixed inset-0 bg-black-100 bg-opacity-40 backdrop-blur-sm transition-opacity" @click="emit('close')" />
    <div class="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 z-50">
      <h2 class="text-xl font-semibold text-black mb-4">
        {{ form.id ? 'Редактирование файла' : 'Добавление файла' }}
      </h2>

      <div v-if="errors.general" class="bg-red-100 text-red-800 p-3 rounded mb-4 text-sm">
        {{ errors.general }}
      </div>

      <div class="space-y-4">
        <UiSelect
          id="employee"
          v-model="form.employee_id"
          label="Сотрудник *"
          :options="employees"
          option-value="id"
          :option-label="e => `${e.last_name} ${e.first_name} ${e.middle_name}`"
          :error="validationErrors.employee_id"
        />

        <div class="space-y-1">
          <label class="block text-sm font-medium text-gray-700">Файл</label>
          <div class="mt-1 flex items-center">
            <label class="cursor-pointer">
              <span
                class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                📎 Выбрать файл
              </span>
              <input type="file" class="sr-only" @change="handleFileUpload" />
            </label>
            <span class="ml-4 text-sm text-gray-500 truncate max-w-xs">
              {{ form.file_name || form.file?.name || 'Файл не выбран' }}
            </span>
          </div>
        </div>

        <UiTextarea
          id="comment"
          v-model="form.comment"
          label="Комментарий"
          placeholder="Описание файла (необязательно)"
          :error="errors.comment"
        />
      </div>

      <div class="mt-6 flex justify-end space-x-3">
        <UiButton variant="secondary" @click="emit('close')">Отмена</UiButton>
        <UiButton
          @click="save"
          :disabled="!form.file && !form.id"
          :class="{ 'opacity-50 cursor-not-allowed': !form.file && !form.id }"
        >
          Сохранить
        </UiButton>
      </div>
    </div>
  </div>
</template>
