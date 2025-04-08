<script setup>
defineProps({
  employees: {
    type: Array,
    required: true
  }
})

const emit = defineEmits(['edit', 'delete', 'refresh'])

const handleDelete = async (id) => {
  if (confirm('Удалить этого сотрудника?')) {
    try {
      await emit('delete', id)
      emit('refresh')
    } catch (error) {
      console.error('Ошибка при удалении сотрудника:', error)
    }
  }
}
</script>

<template>
  <div class="overflow-x-auto bg-white rounded-2xl shadow-md">
    <table class="min-w-full divide-y divide-gray-200">
      <thead class="bg-gray-100 text-gray-700 text-sm uppercase tracking-wider">
        <tr>
          <th class="px-6 py-4 text-left">ID</th>
          <th class="px-6 py-4 text-left">ФИО</th>
          <th class="px-6 py-4 text-left">Отдел</th>
          <th class="px-6 py-4 text-left">Должность</th>
          <th class="px-6 py-4 text-left">Паспорт</th>
          <th class="px-6 py-4 text-left">Действия</th>
        </tr>
      </thead>
      <tbody class="divide-y divide-gray-100">
        <tr v-for="emp in employees" :key="emp.id" class="hover:bg-gray-50 transition">
          <td class="px-6 py-4">{{ emp.id }}</td>
          <td class="px-6 py-4">{{ emp.last_name }} {{ emp.first_name }} {{ emp.middle_name }}</td>
          <td class="px-6 py-4">{{ emp.department_name }}</td>
          <td class="px-6 py-4">{{ emp.position_name }}</td>
          <td class="px-6 py-4">{{ emp.passport_series }} {{ emp.passport_number }}</td>
          <td class="px-6 py-4 space-x-2">
            <button
              @click="$emit('edit', emp)"
              class="text-sm px-3 py-1 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition"
            >Редактировать</button>
            <button
              @click="handleDelete(emp.id)"
              class="text-sm px-3 py-1 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition"
            >Удалить</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>