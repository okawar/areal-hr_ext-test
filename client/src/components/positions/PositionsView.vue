<script setup>
import { ref, computed, onMounted } from 'vue';
import PositionsTable from './PositionsTable.vue';
import PositionsFormModal from './PositionsFormModal.vue';
import positionsApi from '../../api/positions';
import UiInput from '../../components/ui/UiInput.vue';
import UiButton from '../../components/ui/UiButton.vue';

const positions = ref([]);
const search = ref('');
const showModal = ref(false);
const currentPosition = ref(null);
const errors = ref({});

const fetchPositions = async () => {
  try {
    const res = await positionsApi.fetchAll();
    if (Array.isArray(res.data)) {
      positions.value = res.data.sort((a, b) => a.id - b.id);
    } else {
      console.warn('Получены невалидные данные от API:', res.data);
      positions.value = [];
    }
  } catch (e) {
    console.error('Ошибка при загрузке должностей:', e);
    positions.value = [];
  }
};

const openModal = (position = null) => {
  errors.value = {};
  currentPosition.value = position;
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
  if (error.response?.data?.errors) {
    errors.value = error.response.data.errors;
  } else if (error.response?.data?.error) {
    errors.value.general = error.response.data.error;
  } else {
    errors.value.general = 'Произошла ошибка при сохранении';
  }
};

const filteredPositions = computed(() => {
  return positions.value.filter((pos) =>
    pos.name.toLowerCase().includes(search.value.toLowerCase())
  );
});

onMounted(() => {
  fetchPositions();
});
</script>

<template>
  <div class="p-6 bg-gray-50 min-h-screen text-gray-800">
    <h1 class="text-3xl font-bold mb-6 text-black">Управление должностями</h1>

    <div class="mb-6 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
      <UiInput v-model="search" class="w-full md:w-1/3" placeholder="Поиск должностей..." />
      <UiButton @click="openModal" class="w-full md:w-auto"> Добавить должность </UiButton>
    </div>

    <PositionsTable
      :positions="filteredPositions"
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
