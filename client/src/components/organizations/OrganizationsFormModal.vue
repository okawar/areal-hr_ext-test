<script setup>
import { ref, watch } from 'vue';
import organizationsApi from '../../api/organizations';

const props = defineProps({
  organization: {
    type: Object,
    default: null
  },
  errors: {
    type: Object,
    default: () => ({})
  }
});

const emit = defineEmits(['close', 'save', 'error']);

const form = ref({
  id: null,
  name: "",
  comment: ""
});

const save = async () => {
  const dataToSend = { 
    name: form.value.name,
    comment: String(form.value.comment || "")
  };
  
  try {
    if (form.value.id) {
      await organizationsApi.update(form.value.id, dataToSend);
    } else {
      await organizationsApi.create(dataToSend);
    }
    
    emit('save');
  } catch (error) {
    emit('error', error);
  }
};

// Заполняем форму при изменении пропса organization
watch(() => props.organization, (organization) => {
  if (organization) {
    form.value = { ...organization };
  } else {
    form.value = { id: null, name: "", comment: "" };
  }
}, { immediate: true });
</script>

<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center px-4">
    <div class="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm transition-opacity" @click="emit('close')"></div>

    <div class="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 z-50">
      <h3 class="text-xl font-semibold text-black mb-4">
        {{ form.id ? 'Редактировать организацию' : 'Добавить организацию' }}
      </h3>

      <div v-if="errors.general" class="bg-red-100 text-red-800 p-3 rounded mb-4 text-sm">
        {{ errors.general }}
      </div>

      <div class="space-y-4">
        <div>
          <label for="name" class="block text-sm font-medium text-gray-700">Название</label>
          <input
            v-model="form.name"
            type="text"
            id="name"
            class="mt-1 block w-full rounded-lg border border-gray-300 shadow-sm focus:ring-purple-600 focus:border-purple-600 sm:text-sm"
            :class="{ 'border-red-500': errors.name }"
            placeholder="Введите название организации"
          />
          <p v-if="errors.name" class="text-sm text-red-600 mt-1">{{ errors.name }}</p>
        </div>

        <div>
          <label for="comment" class="block text-sm font-medium text-gray-700">Комментарий</label>
          <input
            v-model="form.comment"
            type="text"
            id="comment"
            class="mt-1 block w-full rounded-lg border border-gray-300 shadow-sm focus:ring-purple-600 focus:border-purple-600 sm:text-sm"
            placeholder="Комментарий к организации"
          />
        </div>
      </div>

      <div class="mt-6 flex justify-end space-x-3">
        <button 
          @click="emit('close')"
          class="px-4 py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-100 transition"
        >
          Отмена
        </button>
        <button 
          @click="save"
          class="px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700 transition"
        >
          Сохранить
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes fadeOut {
  from {
    opacity: 1;
    transform: scale(1);
  }
  to {
    opacity: 0;
    transform: scale(0.95);
  }
}

.modal-enter-active {
  animation: fadeIn 0.3s ease-out forwards;
}
.modal-leave-active {
  animation: fadeOut 0.2s ease-in forwards;
}
</style>