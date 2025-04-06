<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

const organizations = ref([]);
const showModal = ref(false);
const errors = ref({});
const orgForm = ref({
  id: null,
  name: "",
  comment: ""
});

const fetchOrganizations = async () => {
  try {
    const response = await axios.get("http://localhost:3000/api/orgs");
    console.log(response.data)
    organizations.value = response.data.sort((a, b) => a.id - b.id);
    
  } catch (error) {
    console.error("Ошибка при загрузке организаций:", error);
  }
};

const openModal = (org = null) => {
  errors.value = {};
  if (org) {
    orgForm.value = { ...org }; 
  } else {
    orgForm.value = { id: null, name: "", comment: "" }; 
  }
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
};

const saveOrganization = async () => {
  errors.value = {}; // Сброс ошибок
  
  const dataToSend = { 
    name: orgForm.value.name,
    comment: String(orgForm.value.comment || "")
  };
  
  try {
    if (orgForm.value.id) {
      await axios.put(`http://localhost:3000/api/orgs/${orgForm.value.id}`, dataToSend);
    } else {
      await axios.post("http://localhost:3000/api/orgs", dataToSend);
    }
    
    closeModal();
    fetchOrganizations();
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

const deleteOrganization = async (id) => {
  try {
    await axios.delete(`http://localhost:3000/api/orgs/${id}`);
    fetchOrganizations();
  } catch (error) {
    console.error("Ошибка при удалении организации:", error);
  }
};

onMounted(fetchOrganizations);
</script>

<template>
  <div class="p-6 bg-gray-50 min-h-screen text-gray-800">
    <h2 class="text-3xl font-semibold mb-6 text-black">Список организаций</h2>
    <button 
      @click="openModal()" 
      class="w-full md:w-auto px-6 py-2 bg-purple-600 text-white rounded-xl shadow-md hover:bg-purple-700 transition duration-200"
    >
      Добавить организацию
    </button>

    <div class="overflow-x-auto bg-white rounded-2xl shadow-md mt-6">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-100 text-gray-700 text-sm uppercase tracking-wider">
          <tr>
            <th class="px-6 py-4 text-left">ID</th>
            <th class="px-6 py-4 text-left">Название</th>
            <th class="px-6 py-4 text-left">Комментарий</th>
            <th class="px-6 py-4 text-left">Действия</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100">
          <tr v-for="org in organizations" :key="org.id" class="hover:bg-gray-50 transition">
            <td class="px-6 py-4">{{ org.id }}</td>
            <td class="px-6 py-4">{{ org.name }}</td>
            <td class="px-6 py-4">{{ org.comment }}</td>
            <td class="px-6 py-4 space-x-2">
              <button 
                @click="openModal(org)" 
                class="px-3 py-1 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition"
              >
                Редактировать
              </button>
              <button 
                @click="deleteOrganization(org.id)" 
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
          {{ orgForm.id ? 'Редактировать организацию' : 'Добавить организацию' }}
        </h3>

        <div v-if="errors.general" class="bg-red-100 text-red-800 p-3 rounded mb-4 text-sm">
          {{ errors.general }}
        </div>

        <div class="space-y-4">
          <div>
            <label for="name" class="block text-sm font-medium text-gray-700">Название</label>
            <input
              v-model="orgForm.name"
              type="text"
              id="name"
              class="mt-1 block w-full rounded-lg border border-gray-300 shadow-sm focus:ring-purple-600 focus:border-purple-600 sm:text-sm"
              :class="{ 'border-red-500': errors.name }"
              placeholder="Введите название организации"
            />
            <p v-if="errors.name" class="text-sm text-red-600 mt-1">{{ errors.name }}</p>
          </div>

          <div>
            <label for="comment" class="block text-sm font-medium text-gray-700">Комментарий</label>
            <input
              v-model="orgForm.comment"
              type="text"
              id="comment"
              class="mt-1 block w-full rounded-lg border border-gray-300 shadow-sm focus:ring-purple-600 focus:border-purple-600 sm:text-sm"
              placeholder="Комментарий к организации"
            />
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
            @click="saveOrganization"
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
