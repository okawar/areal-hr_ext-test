<script setup>
import { ref } from 'vue';

const props = defineProps({
  operations: {
    type: Array,
    required: true
  },
  employees: {
    type: Array,
    required: true
  },
  departments: {
    type: Array,
    required: true
  },
  positions: {
    type: Array,
    required: true
  }
});

const emit = defineEmits(['edit', 'delete', 'refresh']);

const getEmployeeName = (id) => {
  if (typeof id === 'string' && isNaN(parseInt(id))) {
    return id;
  }
  
  const numId = Number(id);
  const employee = props.employees.find(e => e.id === numId);
  return employee ? `${employee.last_name} ${employee.first_name}` : id;
};

const getDepartmentName = (id) => {
  if (typeof id === 'string' && isNaN(parseInt(id))) {
    return id;
  }
  
  const numId = Number(id);
  const department = props.departments.find(d => d.id === numId);
  return department ? department.name : id;
};

const getPositionName = (id) => {
  if (typeof id === 'string' && isNaN(parseInt(id))) {
    return id;
  }
  
  const numId = Number(id);
  const position = props.positions.find(p => p.id === numId);
  return position ? position.name : id;
};

const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('ru-RU');
};

const handleDelete = async (id) => {
  if (!confirm("Вы уверены, что хотите удалить эту операцию?")) return;
  
  try {
    await emit('delete', id);
    emit('refresh');
  } catch (error) {
    console.error("Ошибка при удалении операции:", error);
    alert("Не удалось удалить операцию");
  }
};
</script>

<template>
  <div class="overflow-x-auto bg-white rounded-2xl shadow-md">
    <table class="min-w-full divide-y divide-gray-200">
      <thead class="bg-gray-100 text-gray-700 text-sm uppercase tracking-wider">
        <tr>
          <th class="px-6 py-4 text-left">ID</th>
          <th class="px-6 py-4 text-left">Сотрудник</th>
          <th class="px-6 py-4 text-left">Тип операции</th>
          <th class="px-6 py-4 text-left">Отдел</th>
          <th class="px-6 py-4 text-left">Должность</th>
          <th class="px-6 py-4 text-left">Зарплата</th>
          <th class="px-6 py-4 text-left">Дата</th>
          <th class="px-6 py-4 text-left">Действия</th>
        </tr>
      </thead>
      <tbody class="divide-y divide-gray-100">
        <tr v-for="op in operations" :key="op.id" class="hover:bg-gray-50 transition">
          <td class="px-6 py-4">{{ op.id }}</td>
          <td class="px-6 py-4">{{ getEmployeeName(op.employee_id) }}</td>
          <td class="px-6 py-4">{{ op.action_type }}</td>
          <td class="px-6 py-4">{{ op.department_id ? getDepartmentName(op.department_id) : '-' }}</td>
          <td class="px-6 py-4">{{ op.position_id ? getPositionName(op.position_id) : '-' }}</td>
          <td class="px-6 py-4">{{ op.salary ? op.salary.toLocaleString('ru-RU') : '-' }}</td>
          <td class="px-6 py-4">{{ formatDate(op.operation_date) }}</td>
          <td class="px-6 py-4 space-x-2">
            <button 
              @click="$emit('edit', op)" 
              class="px-3 py-1 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition"
            >
              Редактировать
            </button>
            <button 
              @click="handleDelete(op.id)" 
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