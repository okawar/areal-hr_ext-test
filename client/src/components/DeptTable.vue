<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

const departments = ref([]);
const organizations = ref([]);  // Для хранения списка организаций
const showModal = ref(false);
const errors = ref({});

const departmentForm = ref({
  id: null,
  name: "",
  organization_id: null, // По умолчанию пусто
});

const fetchDepartments = async () => {
  try {
    console.log("Запрашиваем отделы...");
    const response = await axios.get("http://localhost:3000/api/dept");
    console.log("Ответ с API:", response.data);
    departments.value = response.data.sort((a, b) => a.id - b.id);
  } catch (error) {
    console.error("Ошибка при загрузке отделов:", error);
  }
};

const fetchOrganizations = async () => {
  try {
    console.log("Запрашиваем организации...");
    const response = await axios.get("http://localhost:3000/api/orgs");  
    console.log("Ответ с API:", response.data);
    organizations.value = response.data;
  } catch (error) {
    console.error("Ошибка при загрузке организаций:", error);
  }
};

const openModal = (dept = null) => {
  if (dept) {
    departmentForm.value = { ...dept }; 
  } else {
    departmentForm.value = { id: null, name: "", organization_id: null }; 
  }
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
};

const saveDepartment = async () => {
  errors.value = {}; 


  const dataToSend = { ...departmentForm.value };
  if (!dataToSend.id) {
    delete dataToSend.id; 
  }

  try {
    console.log("Отправка данных:", dataToSend); 
    if (departmentForm.value.id) {
      await axios.put(`http://localhost:3000/api/dept/${departmentForm.value.id}`, dataToSend);
    } else {
      await axios.post("http://localhost:3000/api/dept", dataToSend);
    }
    closeModal();
    fetchDepartments(); 
  } catch (error) {
    if (error.response && error.response.data.error) {
      errors.value = { general: error.response.data.error };
    }
    if (error.response && error.response.data.details) {
      errors.value = error.response.data.details.reduce((acc, item) => {
        acc[item.path] = item.message;
        return acc;
      }, {});
    }
    console.error("Ошибка при сохранении должности:", error);
  }
};

const deleteDepartment = async (id) => {
  try {
    await axios.delete(`http://localhost:3000/api/dept/${id}`);
    fetchDepartments();
  } catch (error) {
    console.error("Ошибка при удалении отдела:", error);
  }
};

onMounted(() => {
  fetchDepartments();
  fetchOrganizations(); 
});
</script>

<template>
  <div>
    <h2>Список отделов</h2>
    <button @click="openModal()">Добавить отдел</button>

    <table border="1">
      <thead>
        <tr>
          <th>ID</th>
          <th>Название</th>
          <th>Комментарий</th>
          <th>Действия</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="dept in departments" :key="dept.id">
          <td>{{ dept.id }}</td>
          <td>{{ dept.name }}</td>
          <td>{{ dept.comment }}</td>
          <td>
            <button @click="openModal(dept)">Редактировать</button>
            <button @click="deleteDepartment(dept.id)">Удалить</button>
          </td>
        </tr>
      </tbody>
    </table>

    <div v-if="showModal" class="modal">
      <div class="modal-content">
        <h3>{{ departmentForm.id ? "Редактировать отдел" : "Добавить отдел" }}</h3>
        <label>Название:</label>
        <input v-model="departmentForm.name" type="text" />
        <p v-if="errors.name" class="error">{{ errors.name }}</p>

        <label>Организация:</label>
        <select v-model="departmentForm.organization_id">
          <option value="null">Не выбрана</option>
          <option v-for="org in organizations" :key="org.id" :value="org.id">
            {{ org.name }}
          </option>
        </select>
        <p v-if="errors.organization_id" class="error">{{ errors.organization_id }}</p>

        <label>Комментарий:</label>
        <textarea v-model="departmentForm.comment"></textarea>
        <p v-if="errors.comment" class="error">{{ errors.comment }}</p>



        <p v-if="errors.general" class="error">{{ errors.general }}</p>

        <button @click="saveDepartment">Сохранить</button>
        <button @click="closeModal">Отмена</button>
      </div>
    </div>
  </div>
</template>

<style>
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}
.modal-content {
  background: white;
  padding: 20px;
  border-radius: 5px;
}
.error {
  color: red;
}
</style>
