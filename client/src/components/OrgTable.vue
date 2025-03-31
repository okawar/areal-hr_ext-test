<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

const organizations = ref([]);

const showModal = ref(false);

const orgForm = ref({
  id: null,
  name: "",
  comment: ""
});

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

const openModal = (org = null) => {
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
  try {
    if (orgForm.value.id) {
      await axios.put(`http://localhost:3000/api/orgs/${orgForm.value.id}`, orgForm.value);
    } else {
      await axios.post("http://localhost:3000/api/orgs", orgForm.value);
    }
    closeModal();
    fetchOrganizations(); 
  } catch (error) {
    console.error("Ошибка при сохранении организации:", error);
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
  <div>
    <h2>Список организаций</h2>
    <button @click="openModal()">Добавить организацию</button>

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
        <tr v-for="org in organizations" :key="org.id">
          <td>{{ org.id }}</td>
          <td>{{ org.name }}</td>
          <td>{{ org.comment }}</td>
          <td>
            <button @click="openModal(org)">Редактировать</button>
            <button @click="deleteOrganization(org.id)">Удалить</button>
          </td>
        </tr>
      </tbody>
    </table>

    <div v-if="showModal" class="modal">
      <div class="modal-content">
        <h3>{{ orgForm.id ? "Редактировать организацию" : "Добавить организацию" }}</h3>
        <label>Название:</label>
        <input v-model="orgForm.name" type="text" />

        <label>Комментарий:</label>
        <input v-model="orgForm.comment" type="text" />

        <button @click="saveOrganization">Сохранить</button>
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
