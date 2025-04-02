<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

const positions = ref([]);
const showModal = ref(false);
const errors = ref({}); 

const positionForm = ref({
  id: null,
  name: "",
});

const fetchPositions = async () => {
  try {
    const response = await axios.get("http://localhost:3000/api/pos");
    positions.value = response.data.sort((a, b) => a.id - b.id);
  } catch (error) {
    console.error("Ошибка при загрузке должностей:", error);
  }
};

const openModal = (pos = null) => {
  errors.value = {}; 

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
  errors.value = {}; 

  const dataToSend = { ...positionForm.value };
  if (!dataToSend.id) {
    delete dataToSend.id;
  }

  try {
    const config = {
      headers: {
        'Content-Type': 'application/json; charset=UTF-8'
      }
    };

    if (positionForm.value.id) {
      await axios.put(`http://localhost:3000/api/pos/${positionForm.value.id}`, dataToSend, config);
    } else {
      await axios.post("http://localhost:3000/api/pos", dataToSend, config);
    }
    closeModal();
    fetchPositions();
  } catch (error) {
    console.error("Ошибка при сохранении должности:", error.response);

    if (error.response && error.response.data) {
      if (error.response.data.error) {
        errors.value = { general: error.response.data.error };
      }
      if (error.response.data.details) {
        errors.value = error.response.data.details.reduce((acc, item) => {
          acc[item.path] = item.message;
          return acc;
        }, {});
      }
    }
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
        <p v-if="errors.name" class="error">{{ errors.name }}</p>

        <p v-if="errors.general" class="error">{{ errors.general }}</p>

        <button @click="savePosition">Сохранить</button>
        <button @click="closeModal">Отмена</button>
      </div>
    </div>
  </div>
</template>

<style>
.error {
  color: red;
  font-size: 14px;
}
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
