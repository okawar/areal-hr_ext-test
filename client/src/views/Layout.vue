<script setup>
import { useRoute, useRouter } from 'vue-router';
import { ref, computed, onMounted, watch } from 'vue';
import apiClient from '../api/index';

const route = useRoute();
const router = useRouter();
const user = ref(null);
const authChecked = ref(false);

const checkAuthAndRedirect = async () => {
  try {
    const res = await apiClient.get('/api/auth/me');
    user.value = res.data.user;

    if (route.path === '/' || route.path === '/login') {
      router.replace('/departments');
    }
  } catch (e) {
    if (route.path !== '/login') {
      router.replace('/login');
    }
  } finally {
    authChecked.value = true;
  }
};

onMounted(() => {
  checkAuthAndRedirect();
});

watch(
  () => route.path,
  (newPath) => {
    if (!authChecked.value) return;
    if (!user.value && newPath !== '/login') {
      router.replace('/login');
    } else if (user.value && (newPath === '/login' || newPath === '/')) {
      router.replace('/departments');
    }
  }
);

watch(
  () => user.value,
  (newUser) => {
    if (newUser && (route.path === '/login' || route.path === '/')) {
      router.replace('/departments');
    } else if (!newUser && route.path !== '/login') {
      router.replace('/login');
    }
  }
);

const logout = async () => {
  try {
    await apiClient.post('/api/auth/logout');
  } catch (_) {}
  user.value = null;
  router.push('/login');
};

const tabs = computed(() => {
  const baseTabs = [
    { name: 'Отделы', path: '/departments', color: 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200' },
    { name: 'Организации', path: '/organizations', color: 'bg-rose-100 text-rose-700 hover:bg-rose-200' },
    { name: 'Должности', path: '/positions', color: 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200' },
    { name: 'Сотрудники', path: '/employees', color: 'bg-amber-100 text-amber-700 hover:bg-amber-200' },
    { name: 'Операции', path: '/operations', color: 'bg-purple-100 text-purple-700 hover:bg-purple-200' },
    { name: 'История', path: '/history', color: 'bg-slate-100 text-slate-700 hover:bg-slate-200' },
  ];
  if (user.value?.role === 'admin') {
    baseTabs.push({
      name: 'Пользователи',
      path: '/users',
      color: 'bg-pink-100 text-pink-700 hover:bg-pink-200',
    });
  }
  return baseTabs;
});

const isActive = (path) => route.path === path;
</script>

<template>
  <div class="w-full p-4 min-h-screen bg-gray-50 relative">
    <div
      v-if="user"
      class="absolute top-4 right-4 bg-white border rounded-lg shadow-sm px-4 py-2 text-sm text-gray-700 flex items-center gap-2"
    >
      <svg class="w-5 h-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
          d="M5.121 17.804A9 9 0 1112 21v-2a7 7 0 10-7-7h2a5 5 0 115 5v2a7 7 0 01-6.879-5.196z" />
      </svg>
      <div>
        <div class="font-semibold">{{ user.name }}</div>
        <div class="text-xs text-gray-500">
          {{ user.role === 'admin' ? 'Администратор' : 'Менеджер по персоналу' }}
        </div>
      </div>
    </div>

    <div class="flex flex-wrap gap-2 mb-6">
      <router-link
        v-for="tab in tabs"
        :key="tab.path"
        :to="tab.path"
        class="px-5 py-3 text-sm font-semibold rounded-lg transition-all duration-200 flex items-center"
        :class="[
          tab.color,
          isActive(tab.path)
            ? 'ring-2 ring-offset-2 ring-opacity-50 scale-105 shadow-md'
            : 'shadow-sm hover:shadow-md',
        ]"
        :style="{
          '--tw-ring-color': tab.color.replace('bg-', 'text-').replace('-100', '-500'),
          transform: isActive(tab.path) ? 'translateY(-2px)' : 'none',
        }"
      >
        <span class="mr-2">{{ tab.name }}</span>
      </router-link>
    </div>

    <div v-if="user" class="mt-6">
      <button
        @click="logout"
        class="px-5 py-3 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg transition-all duration-200"
      >
        Выйти
      </button>
    </div>

    <div class="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 p-4">
      <router-view />
    </div>
  </div>
</template>
