<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

const positions = ref([]);

const showModal = ref(false);

const positionForm = ref({
  id: null,
  name: "",
});

const fetchPositions = async () => {
  try {
    console.log("Запрашиваем должности...");
    const response = await axios.get("http://localhost:3000/api/pos");
    console.log("Ответ с API:", response.data);
    positions.value = response.data;
  } catch (error) {
    console.error("Ошибка при загрузке должностей:", error);
  }
};

const openModal = (pos = null) => {
  if (pos) {
    positionForm.value = { ...pos }; 
  } else {
    positionForm.value = { id: null, name: "" }; 
  }
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
};

const savePosition = async () => {
  try {
    if (positionForm.value.id) {
      await axios.put(`http://localhost:3000/api/pos/${positionForm.value.id}`, positionForm.value);
    } else {
      await axios.post("http://localhost:3000/api/pos", positionForm.value);
    }
    closeModal();
    fetchPositions(); 
  } catch (error) {
    console.error("Ошибка при сохранении должности:", error);
  }
};

const deletePosition = async (id) => {
  try {
    await axios.delete(`http://localhost:3000/api/pos/${id}`);
    fetchPositions();
  } catch (error) {
    console.error("Ошибка при удалении должности:", error);
  }
};

onMounted(fetchPositions);
</script>

<template>
  <div>
    <h2>Список должностей</h2>
    <button @click="openModal()">Добавить должность</button>

    <table border="1">
      <thead>
        <tr>
          <th>ID</th>
          <th>Название</th>
          <th>Действия</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="pos in positions" :key="pos.id">
          <td>{{ pos.id }}</td>
          <td>{{ pos.name }}</td>
          <td>
            <button @click="openModal(pos)">Редактировать</button>
            <button @click="deletePosition(pos.id)">Удалить</button>
          </td>
        </tr>
      </tbody>
    </table>

    <div v-if="showModal" class="modal">
      <div class="modal-content">
        <h3>{{ positionForm.id ? "Редактировать должность" : "Добавить должность" }}</h3>
        <label>Название:</label>
        <input v-model="positionForm.name" type="text" />

        <button @click="savePosition">Сохранить</button>
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
