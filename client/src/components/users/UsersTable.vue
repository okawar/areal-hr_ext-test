<script setup>
import UiButton from '../ui/UiButton.vue';

const props = defineProps({
  users: {
    type: Array,
    required: true,
  },
});

const emit = defineEmits(['edit', 'delete', 'refresh']);

const formatRole = (role) => {
  const roles = {
    admin: 'Администратор',
    hr_manager: 'Менеджер',
  };
  return roles[role] || role;
};

const handleDelete = async (id) => {
    try {
      await emit('delete', id);
      emit('refresh');
    } catch (e) {
      console.error('Ошибка при удалении:', e);
    }
};
</script>

<template>
  <div class="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
    <div class="overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-100 text-gray-700 text-sm uppercase tracking-wider">
          <tr>
            <th
              scope="col"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              ID
            </th>
            <th
              scope="col"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              ФИО
            </th>
            <th
              scope="col"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Логин
            </th>
            <th
              scope="col"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Роль
            </th>
            <th
              scope="col"
              class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Действия
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="user in users" :key="user.id" class="hover:bg-gray-50 transition-colors">
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
              {{ user.id }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              {{ user.last_name }} {{ user.first_name }} {{ user.middle_name || '' }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              {{ user.login }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm">
              <span
                class="inline-flex items-center px-2.5 py-0.5 rounded-full font-medium"
                :class="{
                  'bg-blue-100 text-blue-800': user.role === 'admin',
                  'bg-green-100 text-green-800': user.role === 'hr_manager',
                }"
              >
                {{ formatRole(user.role) }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <div class="flex justify-end space-x-2">
                <UiButton
                  @click="$emit('edit', user)"
                  class="px-3 py-1 bg-gray-100 text-gray-800 rounded-lg transition"
                >
                  Редактировать
                </UiButton>
                <UiButton
                  @click="handleDelete(user.id)"
                  class="px-3 py-1 bg-red-600 text-red-600 rounded-lg transition"
                >
                  Удалить
                </UiButton>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
