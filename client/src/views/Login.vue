<template>
    <div class="flex items-center justify-center h-screen bg-gray-100">
      <div class="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
        <h2 class="text-2xl font-semibold mb-6 text-center">Вход в систему</h2>
        <form @submit.prevent="login">
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700">Логин</label>
            <input
              v-model="loginData.login"
              type="text"
              class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300"
              required
            />
          </div>
          <div class="mb-6">
            <label class="block text-sm font-medium text-gray-700">Пароль</label>
            <input
              v-model="loginData.password"
              type="password"
              class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300"
              required
            />
          </div>
          <button
            type="submit"
            class="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition"
          >
            Войти
          </button>
          <p v-if="error" class="mt-4 text-red-500 text-sm text-center">{{ error }}</p>
        </form>
      </div>
    </div>
  </template>
  
  <script setup>
  import { reactive, ref } from 'vue'
  import { useRouter } from 'vue-router'
  
  const router = useRouter()
  
  const loginData = reactive({
    login: '',
    password: '',
  })
  
  const error = ref(null)
  
  const login = async () => {
    error.value = null
    try {
      const response = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData),
      })
  
      if (!response.ok) {
        const resData = await response.json()
        error.value = resData.message || 'Ошибка входа'
        return
      }
  
      router.push('/dashboard')
    } catch (err) {
      error.value = 'Сервер недоступен'
    }
  }
  </script>
  