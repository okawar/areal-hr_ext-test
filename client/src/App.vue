<script setup>
import { ref } from 'vue';
import DepartmentsView from './components/departments/DepartmentsView.vue';
import OrganizationsView from './components/organizations/OrganizationsView.vue';
import PositionsView from './components/positions/PositionsView.vue';
import EmployeesView from './components/employees/EmployeesView.vue';
// import FilesView from './components/files/FilesView.vue';
import HrOperationsView from './components/hrOperations/HrOperationsView.vue';
import ChangeHistoryView from './components/changeHistory/ChangeHistoryView.vue';
import UsersView from './components/users/UsersView.vue';

const tabs = [
  {
    name: 'Отделы',
    component: DepartmentsView,
    color: 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200',
  },
  {
    name: 'Организации',
    component: OrganizationsView,
    color: 'bg-rose-100 text-rose-700 hover:bg-rose-200',
  },
  {
    name: 'Должности',
    component: PositionsView,
    color: 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200',
  },
  {
    name: 'Сотрудники',
    component: EmployeesView,
    color: 'bg-amber-100 text-amber-700 hover:bg-amber-200',
  },
  {
    name: 'Операции',
    component: HrOperationsView,
    color: 'bg-purple-100 text-purple-700 hover:bg-purple-200',
  },
  {
    name: 'История изменений',
    component: ChangeHistoryView,
    color: 'bg-slate-100 text-slate-700 hover:bg-slate-200',
  },
  {
    name: 'Пользователи',
    component: UsersView,
    color: 'bg-pink-100 text-pink-700 hover:bg-pink-200',
  },
];

const activeTab = ref(0);
</script>

<template>
  <div class="w-full p-4 min-h-screen bg-gray-50">
    <div class="flex flex-wrap gap-2 mb-6">
      <button
        v-for="(tab, index) in tabs"
        :key="index"
        @click="activeTab = index"
        class="px-5 py-3 text-sm font-semibold rounded-lg transition-all duration-200 flex items-center"
        :class="[
          tab.color,
          activeTab === index
            ? 'ring-2 ring-offset-2 ring-opacity-50 scale-105 shadow-md'
            : 'shadow-sm hover:shadow-md',
        ]"
        :style="{
          '--tw-ring-color': tab.color.replace('bg-', 'text-').replace('-100', '-500'),
          transform: activeTab === index ? 'translateY(-2px)' : 'none',
        }"
      >
        <span class="mr-2">{{ tab.name }}</span>
        <svg
          v-if="activeTab === index"
          xmlns="http://www.w3.org/2000/svg"
          class="h-4 w-4"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fill-rule="evenodd"
            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
            clip-rule="evenodd"
          />
        </svg>
      </button>
    </div>

    <div class="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300">
      <keep-alive>
        <component :is="tabs[activeTab].component" />
      </keep-alive>
    </div>
  </div>
</template>

<style>
button {
  transition: all 0.2s ease;
}

button:hover {
  transform: translateY(-1px);
}

.ring-indigo-500 {
  --tw-ring-color: #6366f1;
}
.ring-rose-500 {
  --tw-ring-color: #f43f5e;
}
.ring-emerald-500 {
  --tw-ring-color: #10b981;
}
.ring-amber-500 {
  --tw-ring-color: #f59e0b;
}
.ring-blue-500 {
  --tw-ring-color: #3b82f6;
}
.ring-purple-500 {
  --tw-ring-color: #8b5cf6;
}
.ring-slate-500 {
  --tw-ring-color: #64748b;
}
</style>
