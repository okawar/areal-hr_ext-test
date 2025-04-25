<script setup>
import { ref, computed, onMounted } from 'vue';
import UsersTable from './UsersTable.vue';
import usersApi from '../../api/users';
import UsersFormModal from './UsersFormModal.vue';
import UiInput from '../ui/UiInput.vue';
import UiButton from '../ui/UiButton.vue';

const users = ref([]);
const search = ref('');
const showModal = ref(false);
const currentUser = ref(null);

const fetchUsers = async () => {
  try {
    const res = await usersApi.fetchAll();
    if (Array.isArray(res.data)) {
      users.value = res.data.sort((a, b) => a.id - b.id);
    } else {
      console.warn('Получены невалидные данные от API:', res.data);
      users.value = [];
    }
  } catch (e) {
    console.error('Ошибка при загрузке пользователей:', e);
    users.value = [];
  }
};

const openModal = (user = null) => {
  currentUser.value = user;
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
};

const handleSave = async () => {
  await fetchUsers();
  closeModal();
};

const filteredUsers = computed(() => {
  if (!search.value) return users.value;

  const searchLower = search.value.toLowerCase();
  return users.value.filter(
    (user) =>
      user.last_name.toLowerCase().includes(searchLower) ||
      user.first_name.toLowerCase().includes(searchLower) ||
      user.middle_name?.toLowerCase().includes(searchLower) ||
      user.login.toLowerCase().includes(searchLower)
  );
});

onMounted(() => {
  fetchUsers();
});
</script>

<template>
  <div class="p-6 bg-gray-50 min-h-screen text-gray-800">
    <h1 class="text-3xl font-bold mb-6 text-black">Управление пользователями</h1>

    <div class="mb-6 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
      <UiInput v-model="search" class="w-full md:w-1/3" placeholder="Поиск пользователей..." />
      <UiButton @click="openModal" class="w-full md:w-auto"> Добавить пользователя </UiButton>
    </div>

    <UsersTable
      :users="filteredUsers"
      @edit="openModal"
      @delete="usersApi.delete"
      @refresh="fetchUsers"
    />

    <UsersFormModal v-if="showModal" :user="currentUser" @close="closeModal" @save="handleSave" />
  </div>
</template>
