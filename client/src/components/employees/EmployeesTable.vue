<script setup>
import UiButton from '../ui/UiButton.vue';

const props = defineProps({
  employees: {
    type: Array,
    required: true,
  },
  files: {
    type: Array,
    required: true,
  },
});

const emit = defineEmits([
  'edit-employee',
  'delete-employee',
  'edit-file',
  'delete-file',
  'add-file',
]);

const getFullName = (emp) => {
  return `${emp.last_name} ${emp.first_name}${emp.middle_name ? ' ' + emp.middle_name : ''}`;
};

const getEmployeeFiles = (employeeId) => {
  return props.files.filter((file) => file.employee_id === employeeId);
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
              Отдел
            </th>
            <th
              scope="col"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Должность
            </th>
            <th
              scope="col"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Паспорт
            </th>
            <th
              scope="col"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Зарплата
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
          <template v-for="emp in employees" :key="emp.id">
            <tr class="hover:bg-gray-50 transition-colors">
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {{ emp.id }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ getFullName(emp) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm">
                {{ emp.department_name || '—' }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm">
                {{ emp.position_name || '—' }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm">
                {{ emp.passport_series }} {{ emp.passport_number }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm">
                {{ emp.salary || '—' }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div class="flex justify-end space-x-2">
                  <UiButton
                    @click="$emit('add-file', emp.id)"
                    class="px-3 py-1 bg-green-100 text-green-800 rounded-lg transition"
                  >
                    Прикрепить файл
                  </UiButton>
                  <UiButton
                    @click="$emit('edit-employee', emp)"
                    class="px-3 py-1 bg-gray-100 text-gray-800 rounded-lg transition"
                  >
                    Редактировать
                  </UiButton>
                  <UiButton
                    @click="$emit('delete-employee', emp.id)"
                    class="px-3 py-1 bg-red-500 text-red-600 rounded-lg transition"
                  >
                    Удалить
                  </UiButton>
                </div>
              </td>
            </tr>

            <tr
              v-for="file in getEmployeeFiles(emp.id)"
              :key="`file-${file.id}`"
              class="bg-gray-50"
            >
              <td class="px-6 py-2 text-sm text-gray-500"></td>
              <td colspan="4" class="px-6 py-2 text-sm flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-4 w-4 mr-2 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <span class="font-medium">{{ file.file_name }}</span>
                <span class="text-gray-500 ml-2">{{ file.comment || '' }}</span>
              </td>
              <td class="px-6 py-2 text-right">
                <div class="flex justify-end space-x-2">
                  <UiButton
                    @click="$emit('edit-file', file)"
                    class="px-2 py-1 bg-gray-100 text-gray-700 rounded-lg text-xs transition"
                  >
                    Редактировать
                  </UiButton>
                  <UiButton
                    @click="$emit('delete-file', file.id)"
                    class="px-2 py-1 bg-red-500 text-red-600 rounded-lg text-xs transition"
                  >
                    Удалить
                  </UiButton>
                </div>
              </td>
            </tr>
          </template>
        </tbody>
      </table>
    </div>
  </div>
</template>
