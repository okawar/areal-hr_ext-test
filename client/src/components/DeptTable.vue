<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

const departments = ref([]);

const showModal = ref(false);

const errors = ref({}); 

const departmentForm = ref({
  id: null,
  name: "",
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



const openModal = (dept = null) => {
  if (dept) {
    departmentForm.value = { ...dept }; 
  } else {
    departmentForm.value = { id: null, name: "" }; 
  }
  showModal.value = true;
};


const closeModal = () => {
  showModal.value = false;
};


const saveDepartment = async () => {
  errors.value = {}; 
  try {
    if (departmentForm.value.id) {
      await axios.put(`http://localhost:3000/api/dept/${departmentForm.value.id}`, departmentForm.value);
    } else {
      await axios.post("http://localhost:3000/api/dept", departmentForm.value);
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

onMounted(fetchDepartments);
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
          <th>Действия</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="dept in departments" :key="dept.id">
          <td>{{ dept.id }}</td>
          <td>{{ dept.name }}</td>
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
</style>
