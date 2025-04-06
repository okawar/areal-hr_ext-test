<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

const files = ref([]);
const employees = ref([]); // Для выбора сотрудника
const showModal = ref(false);
const errors = ref({});
const fileForm = ref({
  id: null,
  employee_id: "",
  last_name: "",
  first_name: "",
  middle_name: "",
  name: "",
  file_path: "",
});

const fetchFiles = async () => {
  try {
    const response = await axios.get("http://localhost:3000/api/file");
    console.log(response.data)
    files.value = response.data.sort((a, b) => a.id - b.id);
  } catch (error) {
    console.error("Ошибка при загрузке файлов:", error);
  }
};

const fetchEmployees = async () => {
  try {
    const response = await axios.get("http://localhost:3000/api/emp");
    employees.value = response.data;
    console.log(response.data)
  } catch (error) {
    console.error("Ошибка при загрузке сотрудников:", error);
  }
};

const openModal = (file = null) => {
  errors.value = {};
  if (file) {
    fileForm.value = { ...file };
  } else {
    fileForm.value = { id: null, employee_id: "", last_name: "", first_name: "", middle_name: "", name: "", file_path: ""};
  }
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
};

const saveFile = async () => {
  errors.value = {};
  
  const dataToSend = { 
    employee_id: fileForm.value.employee_id,
    last_name: fileForm.value.last_name,
    first_name: fileForm.value.first_name,
    middle_name_name: fileForm.value.middle_name,
    name: fileForm.value.file_name,
    file_path: fileForm.value.file_path,
  };
  
  try {
    if (fileForm.value.id) {
      await axios.put(`http://localhost:3000/api/file/${fileForm.value.id}`, dataToSend);
    } else {
      await axios.post("http://localhost:3000/api/file", dataToSend);
    }
    
    closeModal();
    fetchFiles();
  } catch (error) {
    console.error("Ошибка при сохранении:", error);
    
    if (error.response) {
      if (error.response.data.error) {
        errors.value = { general: error.response.data.error };
      }
      if (error.response.data.details) {
        errors.value = error.response.data.details.reduce((acc, item) => {
          acc[item.path] = item.message;
          return acc;
        }, {});
      }
    } else {
      errors.value = { general: "Ошибка соединения с сервером" };
    }
  }
};

const deleteFile = async (id) => {
  try {
    await axios.delete(`http://localhost:3000/api/file/${id}`);
    fetchFiles();
  } catch (error) {
    console.error("Ошибка при удалении файла:", error);
  }
};

const handleFileUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    fileForm.value.name = file.name;
    fileForm.value.file_path = `/uploads/${file.name}`;
  }
};

onMounted(() => {
  fetchFiles();
  fetchEmployees();
});
</script>

<template>
  <div class="p-6 bg-gray-50 min-h-screen text-gray-800">
    <h2 class="text-3xl font-semibold mb-6 text-black">Список файлов</h2>
    <button 
      @click="openModal()" 
      class="w-full md:w-auto px-6 py-2 bg-purple-600 text-white rounded-xl shadow-md hover:bg-purple-700 transition duration-200"
    >
      Добавить файл
    </button>

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
            <td class="px-6 py-4"> {{ file.employee_id }} {{ file.last_name }}</td>
            <td class="px-6 py-4">{{ file.name }}</td>
            <td class="px-6 py-4">{{ file.file_path }}</td>
            <td class="px-6 py-4 space-x-2">
              <button 
                @click="openModal(file)" 
                class="px-3 py-1 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition"
              >
                Редактировать
              </button>
              <button 
                @click="deleteFile(file.id)" 
                class="px-3 py-1 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition"
              >
                Удалить
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div class="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm transition-opacity"></div>

      <div class="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 z-50">
        <h3 class="text-xl font-semibold text-black mb-4">
          {{ fileForm.id ? 'Редактировать файл' : 'Добавить файл' }}
        </h3>

        <div v-if="errors.general" class="bg-red-100 text-red-800 p-3 rounded mb-4 text-sm">
          {{ errors.general }}
        </div>

        <div class="space-y-4">
          <div>
            <label for="employee_id" class="block text-sm font-medium text-gray-700">Сотрудник</label>
            <select
              v-model="fileForm.employee_id"
              id="employee_id"
              class="mt-1 block w-full rounded-lg border border-gray-300 shadow-sm focus:ring-purple-600 focus:border-purple-600 sm:text-sm"
              :class="{ 'border-red-500': errors.employee_id }"
            >
              <option value="">Выберите сотрудника</option>
              <option v-for="employee in employees" :key="employee.id" :value="employee.id">
                {{ employee.last_name }} {{ employee.first_name }} {{ employee.middle_name }} (ID: {{ employee.id }})
              </option>
            </select>
            <p v-if="errors.employee_id" class="text-sm text-red-600 mt-1">{{ errors.employee_id }}</p>

          </div>

          <div>
            <label for="file" class="block text-sm font-medium text-gray-700">Файл</label>
            <input
              type="file"
              id="file"
              @change="handleFileUpload"
              class="mt-1 block w-full rounded-lg border border-gray-300 shadow-sm focus:ring-purple-600 focus:border-purple-600 sm:text-sm"
              :class="{ 'border-red-500': errors.file_name || errors.file_path }"
            />
            <p v-if="errors.file_name" class="text-sm text-red-600 mt-1">{{ errors.file_name }}</p>
            <p v-if="errors.file_path" class="text-sm text-red-600 mt-1">{{ errors.file_path }}</p>
          </div>

          <div v-if="fileForm.file_name">
            <p class="text-sm text-gray-600">Выбранный файл: {{ fileForm.file_name }}</p>
            <input
              v-model="fileForm.file_name"
              type="hidden"
            />
            <input
              v-model="fileForm.file_path"
              type="hidden"
            />
          </div>

          <div>
            <label for="comment" class="block text-sm font-medium text-gray-700">Комментарий</label>
            <textarea
              v-model="fileForm.comment"
              id="comment"
              rows="3"
              class="mt-1 block w-full rounded-lg border border-gray-300 shadow-sm focus:ring-purple-600 focus:border-purple-600 sm:text-sm"
              placeholder="Комментарий к файлу"
            ></textarea>
          </div>
        </div>

        <div class="mt-6 flex justify-end space-x-3">
          <button 
            @click="closeModal"
            class="px-4 py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-100 transition"
          >
            Отмена
          </button>
          <button 
            @click="saveFile"
            class="px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700 transition"
          >
            Сохранить
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes fadeOut {
  from {
    opacity: 1;
    transform: scale(1);
  }
  to {
    opacity: 0;
    transform: scale(0.95);
  }
}

[enter-active],
[leave-active] {
  transition: all 0.3s ease;
}

.modal-enter-active {
  animation: fadeIn 0.3s ease-out forwards;
}
.modal-leave-active {
  animation: fadeOut 0.2s ease-in forwards;
}
</style>