<script setup>
import UiButton from '../ui/UiButton.vue';
import filesApi from '../../api/files';

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

const formatDate = (date) => {
  return date ? new Date(date).toLocaleDateString('ru-RU') : '—';
};

const getAddress = (emp) => {
  const parts = [
    emp.region,
    emp.locality,
    emp.street,
    emp.house,
    emp.building ? `корп. ${emp.building}` : '',
    emp.apartment ? `кв. ${emp.apartment}` : '',
  ].filter(Boolean);
  return parts.length ? parts.join(', ') : '—';
};

const getPassportData = (emp) => {
  const parts = [
    `${emp.passport_series} ${emp.passport_number}`,
    formatDate(emp.passport_issue_date),
    emp.passport_issued_by,
  ].filter(Boolean);
  return parts.length ? parts.join(', ') : '—';
};

const handleDownloadFile = async (file) => {
  try {
    if (file.isDownloading) return;
    file.isDownloading = true;

    const response = await filesApi.download(file.id);

    const blob = new Blob([response.data], { type: response.headers['content-type'] || 'application/octet-stream' });
    const url = window.URL.createObjectURL(blob);

    let fileName = file.file_name || 'file';
    const contentDisposition = response.headers['content-disposition'];
    if (contentDisposition) {
      const match = contentDisposition.match(/filename\*=UTF-8''(.+)|filename="(.+)"/);
      if (match && match[1]) {
        fileName = decodeURIComponent(match[1]);
      } else if (match && match[2]) {
        fileName = match[2];
      }
    }

    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;

    document.body.appendChild(link);
    link.click();

    setTimeout(() => {
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      file.isDownloading = false;
    }, 100);
  } catch (error) {
    console.error('Ошибка при скачивании файла:', error);
    alert('Не удалось скачать файл.');
    file.isDownloading = false;
  }
};

const isDeleted = (emp) => !!emp.deleted_at;
const isNotHired = (emp) => (emp.salary === null && emp.department_id === null && emp.position_id === null);
</script>

<template>
  <div class="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
    <div class="overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-100 text-gray-700 text-sm uppercase tracking-wider">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ФИО</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Дата рождения</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Паспортные данные</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Адрес</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Отдел</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Должность</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Зарплата</th>
            <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Действия</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <template v-for="emp in employees" :key="emp.id">
            <tr :class="{ 'bg-red-50 text-red-600': isDeleted(emp), 'hover:bg-gray-50': !isDeleted(emp) }" class="transition-colors">
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">{{ emp.id }}</td>
              <td class="px-6 py-4 text-sm">
                {{ getFullName(emp) }}
                <span v-if="isDeleted(emp)" class="ml-2 text-xs font-medium text-red-600">(Уволен)</span>
                <span v-if="isNotHired(emp)" class="ml-2 text-xs font-medium text-red-600">(Не нанят)</span>
              </td>
              <td class="px-6 py-4 text-sm">{{ formatDate(emp.birth_date) }}</td>
              <td class="px-6 py-4 text-sm">{{ getPassportData(emp) }}</td>
              <td class="px-6 py-4 text-sm">{{ getAddress(emp) }}</td>
              <td class="px-6 py-4 text-sm">{{ emp.department_name || '—' }}</td>
              <td class="px-6 py-4 text-sm">{{ emp.position_name || '—' }}</td>
              <td class="px-6 py-4 text-sm">{{ emp.salary || '—' }}</td>
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
              <td colspan="7" class="px-6 py-2 text-sm flex items-center">
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
                  <UiButton
                    @click="handleDownloadFile(file)"
                    class="px-2 py-1 bg-blue-500 text-blue-50 rounded-lg text-xs transition"
                  >
                    Скачать
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