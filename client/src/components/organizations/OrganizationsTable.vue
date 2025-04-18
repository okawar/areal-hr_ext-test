<script setup>
import UiButton from '../ui/UiButton.vue';

const props = defineProps({
  organizations: {
    type: Array,
    required: true,
  },
});

const emit = defineEmits(['edit', 'delete', 'refresh']);

const handleDelete = async (id) => {
  if (confirm('Удалить эту организацию?')) {
    try {
      await emit('delete', id);
      emit('refresh');
    } catch (error) {
      console.error('Ошибка при удалении организации:', error);
    }
  }
};
</script>

<template>
  <div class="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
    <table class="min-w-full divide-y divide-gray-200">
      <thead class="bg-gray-100 text-gray-700 text-sm uppercase tracking-wider">
        <tr>
          <th
            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
          >
            ID
          </th>
          <th
            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
          >
            Название
          </th>
          <th
            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
          >
            Комментарий
          </th>
          <th
            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
          >
            Действия
          </th>
        </tr>
      </thead>
      <tbody class="bg-white divide-y divide-gray-200">
        <tr v-for="org in organizations" :key="org.id" class="hover:bg-gray-50 transition">
          <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
            {{ org.id }}
          </td>
          <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
            {{ org.name }}
          </td>
          <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
            {{ org.comment }}
          </td>
          <td class="px-6 py-4 space-x-2">
            <UiButton
              @click="$emit('edit', org)"
              class="x-3 py-1 bg-gray-100 text-gray-800 rounded-lg transition"
            >
              Редактировать
            </UiButton>
            <UiButton
              @click="handleDelete(org.id)"
              class="px-3 py-1 bg-red-400 text-red-500 rounded-lg transition"
            >
              Удалить
            </UiButton>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
