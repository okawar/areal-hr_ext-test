<script setup>
import { ref } from 'vue'
import DepartmentsView from './components/departments/DepartmentsView.vue'
import OrganizationsView from './components/organizations/OrganizationsView.vue'
import PositionsView from './components/positions/PositionsView.vue'
import EmployeesView from './components/employees/EmployeesView.vue'
import FilesView from './components/files/FilesView.vue'
import HrOperationsView from './components/hrOperations/HrOperationsView.vue'
import ChangeHistoryView from './components/changeHistory/ChangeHistoryView.vue'

const tabs = [
  { name: 'Отделы', component: DepartmentsView },
  { name: 'Организации', component: OrganizationsView },
  { name: 'Должности', component: PositionsView },
  { name: 'Сотрудники', component: EmployeesView },
  { name: 'Файлы', component: FilesView },
  { name: 'Операции', component: HrOperationsView },
  { name: 'История изменений', component: ChangeHistoryView },
]

const activeTab = ref(0)
</script>

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

    <div class="bg-white rounded-b-xl shadow-md">
      <keep-alive>
        <component :is="tabs[activeTab].component" />
      </keep-alive>
    </div>
  </div>
</template>