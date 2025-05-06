<script setup>
import { ref, watch, computed } from 'vue';
import usersApi from '../../api/users';
import UiInput from '../ui/UiInput.vue';
import UiSelect from '../ui/UiSelect.vue';
import UiButton from '../ui/UiButton.vue';

const props = defineProps({
  user: Object,
});

const emit = defineEmits(['close', 'save']);

const form = ref({
  id: null,
  last_name: '',
  first_name: '',
  middle_name: '',
  login: '',
  password: '',
  role: '',
});

const errors = ref({});

const roleOptions = computed(() => {
  return [
    { value: 'admin', label: 'Администратор' },
    { value: 'hr_manager', label: 'Менеджер' },
  ];
});

watch(
  () => props.user,
  (user) => {
    if (user) {
      form.value = {
        id: user.id,
        last_name: user.last_name || '',
        first_name: user.first_name || '',
        middle_name: user.middle_name || '',
        login: user.login || '',
        password: '',
        role: user.role || 'user',
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
    last_name: '',
    first_name: '',
    middle_name: '',
    login: '',
    password: '',
    role: 'user',
  };
};

const isSubmitting = ref(false);

const save = async () => {
  if (isSubmitting.value) return;

  isSubmitting.value = true;
  errors.value = {};

  const payloadData = {
    last_name: form.value.last_name,
    first_name: form.value.first_name,
    middle_name: form.value.middle_name || '',
    login: form.value.login,
    role: form.value.role,
  };

  if (form.value.password || !form.value.id) {
    payloadData.password = form.value.password;
  }

  try {
    if (form.value.id) {
      await usersApi.update(form.value.id, payloadData);
    } else {
      await usersApi.create(payloadData);
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
        {{ form.id ? 'Редактирование пользователя' : 'Добавление пользователя' }}
      </h2>

      <div v-if="errors.general" class="bg-red-100 text-red-800 p-3 rounded mb-4 text-sm">
        {{ errors.general }}
      </div>

      <div class="space-y-4">

      <p class="text-sm text-gray-500 mb-2">
          Поля, отмеченные <span class="text-red-500">*</span>, обязательны для заполнения.
      </p>


      <UiInput
          id="last_name"
          v-model="form.last_name"
          label="Фамилия *"
          placeholder="Введите фамилию"
          :error="errors.last_name"
          required
        />

        <UiInput
          id="first_name"
          v-model="form.first_name"
          label="Имя *"
          placeholder="Введите имя"
          :error="errors.first_name"
          required
        />

        <UiInput
          id="middle_name"
          v-model="form.middle_name"
          label="Отчество"
          placeholder="Введите отчество (при наличии)"
          :error="errors.middle_name"
        />

        <UiInput
          id="login"
          v-model="form.login"
          label="Логин *"
          placeholder="Введите логин"
          :error="errors.login"
          required
        />

        <UiInput
          id="password"
          v-model="form.password"
          label="Пароль"
          type="password"
          :placeholder="form.id ? 'Оставьте пустым, чтобы не менять' : 'Введите пароль'"
          :error="errors.password"
          :required="!form.id"
        />

        <UiSelect
          id="role"
          v-model="form.role"
          label="Роль пользователя *"
          :options="roleOptions"
          placeholder="Выберите роль"
          :error="errors.role"
          optionLabel="label"
          optionValue="value"
          required
        />
      </div>

      <div class="mt-6 flex justify-end space-x-3">
        <UiButton variant="secondary" @click="emit('close')">Отмена</UiButton>
        <UiButton @click="save">Сохранить</UiButton>
      </div>
    </div>
  </div>
</template>
