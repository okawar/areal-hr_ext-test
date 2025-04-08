<script setup>
const props = defineProps({
  organizations: {
    type: Array,
    required: true
  }
});

const emit = defineEmits(['edit', 'delete', 'refresh']);

const handleDelete = async (id) => {
  try {
    await emit('delete', id);
    emit('refresh');
  } catch (error) {
    console.error("Ошибка при удалении организации:", error);
  }
};
</script>

<template>
  <div class="overflow-x-auto bg-white rounded-2xl shadow-md mt-6">
    <table class="min-w-full divide-y divide-gray-200">
      <thead class="bg-gray-100 text-gray-700 text-sm uppercase tracking-wider">
        <tr>
          <th class="px-6 py-4 text-left">ID</th>
          <th class="px-6 py-4 text-left">Название</th>
          <th class="px-6 py-4 text-left">Комментарий</th>
          <th class="px-6 py-4 text-left">Действия</th>
        </tr>
      </thead>
      <tbody class="divide-y divide-gray-100">
        <tr v-for="org in organizations" :key="org.id" class="hover:bg-gray-50 transition">
          <td class="px-6 py-4">{{ org.id }}</td>
          <td class="px-6 py-4">{{ org.name }}</td>
          <td class="px-6 py-4">{{ org.comment }}</td>
          <td class="px-6 py-4 space-x-2">
            <button 
              @click="$emit('edit', org)" 
              class="px-3 py-1 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition"
            >
              Редактировать
            </button>
            <button 
              @click="handleDelete(org.id)" 
              class="px-3 py-1 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition"
            >
              Удалить
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>