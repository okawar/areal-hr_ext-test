<script setup>
import { ref, onMounted } from 'vue';
import ChangeHistoryTable from './ChangeHistoryTable.vue';
import changeHistoryApi from '../../api/changeHistory';
import usersApi from '../../api/users';

const history = ref([]);
const users = ref([]);

const fetchHistory = async () => {
  try {
    const response = await changeHistoryApi.getAll();
    history.value = response.data.sort((a, b) => a.id - b.id);
  } catch (error) {
    console.error('Ошибка при загрузке истории изменений:', error);
  }
};

const fetchUsers = async () => {
  try {
    const res = await usersApi.fetchAll();
    users.value = Array.isArray(res.data) ? res.data.sort((a, b) => a.id - b.id) : [];
  } catch (e) {
    console.error('Ошибка при загрузке пользователей:', e);
    users.value = [];
  }
};

onMounted(() => {
  fetchHistory();
  fetchUsers();
});
</script>

<template>
  <div class="p-6 bg-white min-h-screen text-gray-800">
    <h2 class="text-3xl font-semibold mb-6 text-black">История изменений</h2>
    <ChangeHistoryTable :history="history" :users="users" />
  </div>
</template>
