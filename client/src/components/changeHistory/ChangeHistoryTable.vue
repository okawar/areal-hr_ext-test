<script setup>
import { ref } from 'vue';

const props = defineProps({
  history: {
    type: Array,
    required: true
  }
});

const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleString('ru-RU');
};

const getChangedData = (changedFields) => {
  if (!changedFields) return null;
  
  const fields = {...changedFields};
  
  delete fields.action;
  
  return fields;
};

const getAction = (changedFields) => {
  if (!changedFields) return 'неизвестно';
  
  if (changedFields.action === 'create') {
    return 'создание';
  } else if (changedFields.action === 'update') {
    return 'обновление';
  } else if (changedFields.action === 'delete') {
    return 'удаление';
  }
  
  return changedFields.action || 'неизвестно';
};
</script>

<template>
  <div class="overflow-x-auto bg-white rounded-2xl shadow-md">
    <table class="min-w-full divide-y divide-gray-200">
      <thead class="bg-gray-100 text-gray-700 text-sm uppercase tracking-wider">
        <tr>
          <th class="px-6 py-4 text-left">ID</th>
          <th class="px-6 py-4 text-left">Тип объекта</th>
          <th class="px-6 py-4 text-left">ID объекта</th>
          <th class="px-6 py-4 text-left">Действие</th>
          <th class="px-6 py-4 text-left">Измененные данные</th>
          <th class="px-6 py-4 text-left">Пользователь</th>
          <th class="px-6 py-4 text-left">Дата изменения</th>
        </tr>
      </thead>
      <tbody class="divide-y divide-gray-100">
        <tr v-for="item in history" :key="item.id" class="hover:bg-gray-50 transition">
          <td class="px-6 py-4">{{ item.id }}</td>
          <td class="px-6 py-4">{{ item.object_type }}</td>
          <td class="px-6 py-4">{{ item.object_id }}</td>
          <td class="px-6 py-4">{{ getAction(item.changed_fields) }}</td>
          <td class="px-6 py-4">
            <pre class="whitespace-pre-wrap text-sm">{{ 
              JSON.stringify(getChangedData(item.changed_fields), null, 2) || '-' 
            }}</pre>
          </td>
          <td class="px-6 py-4">{{ item.change_by }}</td>
          <td class="px-6 py-4">{{ formatDate(item.change_time) }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>