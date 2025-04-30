<script setup>

const props = defineProps({
  operations: {
    type: Array,
    required: true,
  },
  employees: {
    type: Array,
    required: true,
  },
  departments: {
    type: Array,
    required: true,
  },
  positions: {
    type: Array,
    required: true,
  },
});

const emit = defineEmits(['edit', 'delete', 'refresh']);

const getEmployeeName = (id) => {
  const employee = props.employees.find((e) => e.id === id);
  return employee ? `${employee.last_name} ${employee.first_name}` : 'Не указан';
};

// const getDepartmentName = (id) => {
//   const department = props.departments.find((d) => d.id === id);
//   return department ? department.name : '—';
// };

// const getPositionName = (id) => {
//   const position = props.positions.find((p) => p.id === id);
//   return position ? position.name : '—';
// };

const formatDate = (dateString) => {
  if (!dateString) return '—';
  const date = new Date(dateString);
  return date.toLocaleDateString('ru-RU');
};

// const formatSalary = (salary) => {
//   return salary ? salary.toLocaleString('ru-RU') : '—';
// };

// const handleDelete = async (id) => {
//   if (confirm('Удалить эту операцию?')) {
//     try {
//       await emit('delete', id);
//       emit('refresh');
//     } catch (e) {
//       console.error('Ошибка при удалении:', e);
//     }
//   }
// };
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
              Сотрудник
            </th>
            <th
              scope="col"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Тип операции
            </th>
            <th
              scope="col"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Дата
            </th>
            <!-- <th
              scope="col"
              class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Действия
            </th> -->
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="op in operations" :key="op.id" class="hover:bg-gray-50 transition-colors">
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
              {{ op.id }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm">
              {{ getEmployeeName(op.employee_id) }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm">
              {{ op.action_type }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm">
              {{ formatDate(op.operation_date) }}
            </td>
            <!-- <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <div class="flex justify-end space-x-2">
                <UiButton
                  @click="$emit('edit', op)"
                  class="px-3 py-1 bg-gray-100 text-gray-800 rounded-lg transition"
                >
                  Редактировать
                </UiButton>
                <UiButton
                  @click="handleDelete(op.id)"
                  class="px-3 py-1 bg-red-400 text-red-600 rounded-lg transition"
                >
                  Удалить
                </UiButton>
              </div>
            </td> -->
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
