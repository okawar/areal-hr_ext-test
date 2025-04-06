<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

const positions = ref([]);
const showModal = ref(false);
const errors = ref({});

const positionForm = ref({
  id: null,
  name: "",
});

const fetchPositions = async () => {
  try {
    const response = await axios.get("http://localhost:3000/api/pos");
    positions.value = response.data.sort((a, b) => a.id - b.id);
  } catch (error) {
    console.error("Ошибка при загрузке должностей:", error);
  }
};

const openModal = (pos = null) => {
  errors.value = {};

  if (pos) {
    positionForm.value = { ...pos };
  } else {
    positionForm.value = { id: null, name: "" };
  }
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
};

const savePosition = async () => {
  errors.value = {};

  const dataToSend = { ...positionForm.value };
  if (!dataToSend.id) {
    delete dataToSend.id;
  }

  try {
    const config = {
      headers: {
        'Content-Type': 'application/json; charset=UTF-8'
      }
    };

    if (positionForm.value.id) {
      await axios.put(`http://localhost:3000/api/pos/${positionForm.value.id}`, dataToSend, config);
    } else {
      await axios.post("http://localhost:3000/api/pos", dataToSend, config);
    }
    closeModal();
    fetchPositions();
  } catch (error) {
    console.error("Ошибка при сохранении должности:", error.response);

    if (error.response && error.response.data) {
      if (error.response.data.error) {
        errors.value = { general: error.response.data.error };
      }
      if (error.response.data.details) {
        errors.value = error.response.data.details.reduce((acc, item) => {
          acc[item.path] = item.message;
          return acc;
        }, {});
      }
    }
  }
};

const deletePosition = async (id) => {
  try {
    await axios.delete(`http://localhost:3000/api/pos/${id}`);
    fetchPositions();
  } catch (error) {
    console.error("Ошибка при удалении должности:", error);
  }
};

onMounted(fetchPositions);
</script>

<template>
  <div class="p-6 bg-gray-50 min-h-screen text-gray-800">
    <h1 class="text-3xl font-bold mb-6 text-black">Управление должностями</h1>

    <div class="mb-6 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
      <button
        @click="openModal"
        class="w-full md:w-auto px-6 py-2 bg-purple-600 text-white rounded-xl shadow-md hover:bg-purple-700 transition duration-200"
      >
        Добавить должность
      </button>
    </div>

    <div class="overflow-x-auto bg-white rounded-2xl shadow-md">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-100 text-gray-700 text-sm uppercase tracking-wider">
          <tr>
            <th class="px-6 py-4 text-left">ID</th>
            <th class="px-6 py-4 text-left">Название</th>
            <th class="px-6 py-4 text-left">Действия</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100">
          <tr v-for="pos in positions" :key="pos.id" class="hover:bg-gray-50 transition">
            <td class="px-6 py-4">{{ pos.id }}</td>
            <td class="px-6 py-4">{{ pos.name }}</td>
            <td class="px-6 py-4 space-x-2">
              <button
                @click="openModal(pos)"
                class="text-sm px-3 py-1 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition"
              >
                Редактировать
              </button>
              <button
                @click="deletePosition(pos.id)"
                class="text-sm px-3 py-1 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition"
              >
                Удалить
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div class="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm transition-opacity"></div>

      <div class="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 z-50">
        <h2 class="text-xl font-semibold text-black mb-4">
          {{ positionForm.id ? 'Редактирование должности' : 'Добавление должности' }}
        </h2>

        <div v-if="errors.general" class="bg-red-100 text-red-800 p-3 rounded mb-4 text-sm">
          {{ errors.general }}
        </div>

        <div class="space-y-4">
          <div>
            <label for="name" class="block text-sm font-medium text-gray-700">Название должности</label>
            <input
              type="text"
              id="name"
              v-model="positionForm.name"
              class="mt-1 block w-full rounded-lg border border-gray-300 shadow-sm focus:ring-purple-600 focus:border-purple-600 sm:text-sm"
              :class="{ 'border-red-500': errors.name }"
              placeholder="Введите название должности"
            />
            <p v-if="errors.name" class="text-sm text-red-600 mt-1">{{ errors.name }}</p>
          </div>
        </div>

        <div class="mt-6 flex justify-end space-x-3">
          <button
            @click="closeModal"
            class="px-4 py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-100 transition"
          >
            Отмена
          </button>
          <button
            @click="savePosition"
            class="px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700 transition"
          >
            Сохранить
          </button>
        </div>
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

[enter-active],
[leave-active] {
  transition: all 0.3s ease;
}

.modal-enter-active {
  animation: fadeIn 0.3s ease-out forwards;
}
.modal-leave-active {
  animation: fadeOut 0.2s ease-in forwards;
}
</style>
