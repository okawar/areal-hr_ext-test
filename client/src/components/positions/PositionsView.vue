<script setup>
import { ref, onMounted } from 'vue';
import PositionsTable from './PositionsTable.vue';
import PositionsFormModal from './PositionsFormModal.vue';
import positionsApi from '../../api/positions';

const positions = ref([]);
const showModal = ref(false);
const currentPosition = ref(null);
const errors = ref({});

const fetchPositions = async () => {
  try {
    const response = await positionsApi.fetchAll();
    positions.value = response.data.sort((a, b) => a.id - b.id);
  } catch (error) {
    console.error("Ошибка при загрузке должностей:", error);
  }
};

const openModal = (pos = null) => {
  errors.value = {};
  currentPosition.value = pos;
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
};

const handleSave = async () => {
  await fetchPositions();
  closeModal();
};

const handleError = (error) => {
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
  } else {
    errors.value = { general: "Ошибка соединения с сервером" };
  }
};

onMounted(fetchPositions);
</script>

<template>
  <div class="p-6 bg-gray-50 min-h-screen text-gray-800">
    <h1 class="text-3xl font-bold mb-6 text-black">Управление должностями</h1>

    <div class="mb-6 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
      <button
        @click="openModal()"
        class="w-full md:w-auto px-6 py-2 bg-purple-600 text-white rounded-xl shadow-md hover:bg-purple-700 transition duration-200"
      >
        Добавить должность
      </button>
    </div>

    <PositionsTable
      :positions="positions"
      @edit="openModal"
      @delete="positionsApi.delete"
      @refresh="fetchPositions"
    />

    <PositionsFormModal
      v-if="showModal"
      :position="currentPosition"
      :errors="errors"
      @close="closeModal"
      @save="handleSave"
      @error="handleError"
    />
  </div>
</template>