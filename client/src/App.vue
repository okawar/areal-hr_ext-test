<template>
  <div class="w-full p-4">
    <div class="flex space-x-2 mb-4 border-b border-gray-300">
      <button
        v-for="(tab, index) in tabs"
        :key="index"
        @click="activeTab = index"
        class="px-4 py-2 text-sm font-medium rounded-t-xl focus:outline-none"
        :class="{
          'bg-white border border-b-0 shadow-sm text-blue-600': activeTab === index,
          'bg-gray-100 text-gray-600': activeTab !== index
        }"
      >
        {{ tab.name }}
      </button>
    </div>

    <div class="bg-white p-4 rounded-b-xl shadow-md">
      <component :is="tabs[activeTab].component" />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import DeptTable from './components/DeptTable.vue'
import OrgTable from './components/OrgTable.vue'
import PositionTable from './components/PosTable.vue'
import EmployeeTable from './components/EmpTable.vue'
import FileTable from './components/FileTable.vue'
import HrOpTable from './components/HrOpTable.vue'
import ChangeHistory from './components/ChangeHistoryTable.vue'

const tabs = [
  { name: 'Отделы', component: DeptTable },
  { name: 'Организации', component: OrgTable },
  { name: 'Должности', component: PositionTable },
  { name: 'Сотрудники', component: EmployeeTable },
  { name: 'Файлы', component: FileTable },
  { name: 'Операции', component: HrOpTable },
  { name: 'История изменений', component: ChangeHistory },
]

const activeTab = ref(0)
</script>

<style scoped>
table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
  font-size: 14px;
}

th, td {
  padding: 0.75rem;
  text-align: left;
  border-bottom: 1px solid #e5e7eb;
}

th {
  background-color: #f3f4f6;
  font-weight: 600;
  color: #374151;
}

tr:hover {
  background-color: #f9fafb;
}

button {
  transition: all 0.2s;
}
</style>
