<script setup>
import { ref, onMounted } from 'vue';
import ChangeHistoryTable from './ChangeHistoryTable.vue';
import changeHistoryApi from '../../api/changeHistory';

const history = ref([]);

const fetchHistory = async () => {
  try {
    const response = await changeHistoryApi.getAll();
    history.value = response.data.sort((a, b) => a.id - b.id); 
    console.log("История изменений загружена:", history.value);
  } catch (error) {
    console.error("Ошибка при загрузке истории изменений:", error);
  }
};

onMounted(fetchHistory);
</script>

<template>
  <div class="p-6 bg-white min-h-screen text-gray-800">
    <h2 class="text-3xl font-semibold mb-6 text-black">История изменений</h2>
    
    <ChangeHistoryTable :history="history" />
  </div>
</template>