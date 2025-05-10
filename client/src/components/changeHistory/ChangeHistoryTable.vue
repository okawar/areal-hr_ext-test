<script setup>
const props = defineProps({
  history: {
    type: Array,
    required: true,
  },
  users: {
    type: Array,
    required: true,
  },
});



const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleString('ru-RU');
};

const getAction = (changedFields) => {
  if (!changedFields || typeof changedFields !== 'object') return 'неизвестно';

  const action = changedFields.action;
  if (action === 'create') return 'создание';
  if (action === 'update') return 'обновление';
  if (action === 'delete') return 'удаление';
  
  return 'неизвестно';
};

const getUserFullName = (userId) => {
  const user = props.users.find((u) => u.id === userId);
  if (!user) return 'Неизвестный пользователь';

  return `${user.last_name || ''} ${user.first_name || ''} ${user.middle_name || ''}`.trim();
};

const getFormattedChanges = (changedFields) => {
  if (!changedFields || typeof changedFields !== 'object') return 'Нет изменений';

  const action = changedFields.action;

  if (action === 'create') {
    return 'Объект успешно создан.';
  }
  if (action === 'delete') {
    return 'Объект успешно удалён.';
  }

  const ignoredFields = ['created_at', 'updated_at', 'action'];

  const meaningfulChanges = Object.entries(changedFields)
    .filter(([key]) => !ignoredFields.includes(key));

  if (meaningfulChanges.length === 0) {
    return 'Обновление без изменений.';
  }

  const formatted = meaningfulChanges.map(([field, { old, new: newValue }]) => {
    return `Поле "${field}" изменилось: "${old ?? '—'}" ➔ "${newValue ?? '—'}"`;
  });

  return formatted.join('\n');
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
          <td class="py-2 px-4 border-b whitespace-pre-line">
            {{ getFormattedChanges(item.changed_fields) }}
          </td>
          <td class="px-6 py-4">{{ getUserFullName(item.change_by) }}</td>
          <td class="px-6 py-4">{{ formatDate(item.change_time) }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
