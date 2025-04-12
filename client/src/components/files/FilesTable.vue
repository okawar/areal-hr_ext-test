<script setup>
const props = defineProps({
  files: {
    type: Array,
    required: true
  },
  employees: {
    type: Array,
    required: true
  }
})

const emit = defineEmits(['edit', 'delete', 'refresh'])

const getEmployeeName = (employeeId) => {
  const employee = props.employees.find(e => e.id === employeeId)
  return employee 
    ? `${employee.last_name} ${employee.first_name} ${employee.middle_name}`
    : 'Не указан'
}

const handleDelete = async (id) => {
  try {
    await emit('delete', id)
    emit('refresh')
  } catch (error) {
    console.error("Ошибка при удалении файла:", error)
  }
}
</script>

<template>
  <div class="overflow-x-auto bg-white rounded-2xl shadow-md mt-6">
    <table class="min-w-full divide-y divide-gray-200">
      <thead class="bg-gray-100 text-gray-700 text-sm uppercase tracking-wider">
        <tr>
          <th class="px-6 py-4 text-left">ID</th>
          <th class="px-6 py-4 text-left">Сотрудник</th>
          <th class="px-6 py-4 text-left">Имя файла</th>
          <th class="px-6 py-4 text-left">Путь</th>
          <th class="px-6 py-4 text-left">Действия</th>
        </tr>
      </thead>
      <tbody class="divide-y divide-gray-100">
        <tr v-for="file in files" :key="file.id" class="hover:bg-gray-50 transition">
          <td class="px-6 py-4">{{ file.id }}</td>
          <td class="px-6 py-4">{{ getEmployeeName(file.employee_id) }}</td>
          <td class="px-6 py-4">{{ file.file_name }}</td>
          <td class="px-6 py-4">{{ file.file_path }}</td>
          <td class="px-6 py-4 space-x-2">
            <button 
              @click="$emit('edit', file)" 
              class="px-3 py-1 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition"
            >
              Редактировать
            </button>
            <button 
              @click="handleDelete(file.id)" 
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