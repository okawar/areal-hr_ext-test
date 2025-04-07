<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

const changeHistory = ref([]);
const error = ref(null);

const fetchChangeHistory = async () => {
  try {
    const response = await axios.get("http://localhost:3000/api/changeHistory");
    changeHistory.value = response.data.sort((a, b) => a.id - b.id);
  } catch (err) {
    error.value = "Не удалось загрузить историю изменений";
    console.error(err);
  }
};

onMounted(fetchChangeHistory);
</script>

<template>
  <div class="p-6 bg-gray-50 min-h-screen text-gray-800">
    <h1 class="text-3xl font-bold mb-6 text-black">История изменений</h1>

    <div v-if="error" class="bg-red-100 text-red-800 p-4 rounded mb-6">
      {{ error }}
    </div>

    <div class="overflow-x-auto bg-white rounded-2xl shadow-md">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-100 text-gray-700 text-sm uppercase tracking-wider">
          <tr>
            <th class="px-6 py-4 text-left">ID</th>
            <th class="px-6 py-4 text-left">Кто изменил</th>
            <th class="px-6 py-4 text-left">Тип объекта</th>
            <th class="px-6 py-4 text-left">ID объекта</th>
            <th class="px-6 py-4 text-left">Дата изменения</th>
            <th class="px-6 py-4 text-left">Изменения</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100">
          <tr
            v-for="entry in changeHistory"
            :key="entry.id"
            class="hover:bg-gray-50 transition"
          >
            <td class="px-6 py-4">{{ entry.id }}</td>
            <td class="px-6 py-4">{{ entry.change_by }}</td>
            <td class="px-6 py-4">{{ entry.object_type }}</td>
            <td class="px-6 py-4">{{ entry.object_id }}</td>
            <td class="px-6 py-4">{{ new Date(entry.change_time).toLocaleString() }}</td>
            <td class="px-6 py-4 whitespace-pre-wrap text-sm text-gray-700">
              <pre class="bg-gray-50 p-2 rounded border border-gray-200 text-xs overflow-x-auto">
{{ JSON.stringify(entry.changed_fields, null, 2) }}
              </pre>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
