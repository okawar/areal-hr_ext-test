<script setup>
import { ref, onMounted } from 'vue';
import UiButton from '../ui/UiButton.vue';
import UiInput from '../ui/UiInput.vue';
import OrganizationsTable from './OrganizationsTable.vue';
import OrganizationsFormModal from './OrganizationsFormModal.vue';
import organizationsApi from '../../api/organizations';

const organizations = ref([]);
const showModal = ref(false);
const currentOrganization = ref(null);
const errors = ref({});

const fetchOrganizations = async () => {
  try {
    const response = await organizationsApi.fetchAll();
    organizations.value = response.data.sort((a, b) => a.id - b.id);
  } catch (error) {
    console.error('Ошибка при загрузке организаций:', error);
  }
};

const openModal = (org = null) => {
  errors.value = {};
  currentOrganization.value = org;
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
};

const handleSave = async () => {
  await fetchOrganizations();
  closeModal();
};

const handleError = (error) => {
  if (error.response) {
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
    errors.value = { general: 'Ошибка соединения с сервером' };
  }
};

onMounted(fetchOrganizations);
</script>

<template>
  <div class="p-6 bg-gray-50 min-h-screen text-gray-800">
    <h1 class="text-3xl font-bold mb-6 text-black">Управление организациями</h1>

    <div class="mb-6 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
      <UiInput v-model="search" class="w-full md:w-1/3" placeholder="Поиск отделов..." />
      <UiButton @click="openModal" class="w-full md:w-auto"> Добавить организацию </UiButton>
    </div>

    <OrganizationsTable
      :organizations="organizations"
      @edit="openModal"
      @delete="organizationsApi.delete"
      @refresh="fetchOrganizations"
    />

    <OrganizationsFormModal
      v-if="showModal"
      :organization="currentOrganization"
      :errors="errors"
      @close="closeModal"
      @save="handleSave"
      @error="handleError"
    />
  </div>
</template>
