<script setup>
import { ref, watch } from 'vue';
import filesApi from '../../api/files';
import UiSelect from '../ui/UiSelect.vue';
import UiTextarea from '../ui/UiTextarea.vue';
import UiButton from '../ui/UiButton.vue';

const props = defineProps({
  file: Object,
  employees: {
    type: Array,
    required: true,
  },
  errors: {
    type: Object,
    default: () => ({}),
  },
});

const emit = defineEmits(['close', 'save', 'error']);

const form = ref({
  id: null,
  employee_id: '',
  file_name: '',
  file: null,
  file_path: '',
  comment: '',
});

const handleFileUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    form.value.file_name = file.name;
    form.value.file_path = file.name;
    form.value.file = file;
  }
};

const isSubmitting = ref(false);

const save = async () => {
  if (isSubmitting.value) return;
  isSubmitting.value = true;

  try {
    if (form.value.id) {
      await filesApi.update(form.value.id, form.value);
    } else {
      if (!form.value.file) {
        throw new Error('Файл обязателен для загрузки');
      }
      await filesApi.create(form.value);
    }

    emit('save');
  } catch (error) {
    console.error('Ошибка при сохранении:', error);
    emit('error', error);
  } finally {
    isSubmitting.value = false;
  }
};


watch(
  () => props.file,
  (file) => {
    if (file) {
      form.value = {
        id: file.id,
        employee_id: file.employee_id,
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
          label="Сотрудник"
          :options="employees"
          option-value="id"
          :option-label="
            (employee) => `${employee.last_name} ${employee.first_name} ${employee.middle_name}`
          "
        />
        <div class="space-y-1">
          <label class="block text-sm font-medium text-gray-700">Файл</label>
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
              {{ form.file_name || form.file?.name || 'Файл не выбран' }}
            </span>
          </div>
          <p v-if="errors.file_name" class="mt-1 text-sm text-red-600">{{ errors.file_name }}</p>
          <p v-if="errors.file_path" class="mt-1 text-sm text-red-600">{{ errors.file_path }}</p>
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
