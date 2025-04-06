<template>
    <div class="flex justify-center items-center min-h-screen">
      <div class="w-96 p-6 bg-white rounded-xl shadow-md">
        <h2 class="text-2xl font-bold mb-6 text-center">Регистрация</h2>
        <form @submit.prevent="register" class="space-y-4">
          <div>
            <label for="login" class="block text-sm font-medium text-gray-700">Логин</label>
            <input
              v-model="login"
              id="login"
              type="text"
              class="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          <div>
            <label for="password" class="block text-sm font-medium text-gray-700">Пароль</label>
            <input
              v-model="password"
              id="password"
              type="password"
              class="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          <div>
            <label for="confirmPassword" class="block text-sm font-medium text-gray-700">Подтвердите пароль</label>
            <input
              v-model="confirmPassword"
              id="confirmPassword"
              type="password"
              class="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          <button type="submit" class="w-full bg-blue-600 text-white py-2 rounded-md">Зарегистрироваться</button>
          <p class="text-sm text-center mt-4">
            Уже есть аккаунт? <router-link to="/login" class="text-blue-500">Войти</router-link>
          </p>
        </form>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'
  import axios from 'axios'
  
  const login = ref('')
  const password = ref('')
  const confirmPassword = ref('')
  const router = useRouter()
  
  const registerUser = async () => {
    try {
      const response = await axios.post('/api/auth/register', {
        login: login.value,
        password: password.value,
        confirmPassword: confirmPassword.value
      })
      router.push('/login') // Перенаправляем на страницу входа
    } catch (error) {
      console.error('Ошибка при регистрации', error)
    }
  }
  
  const register = () => {
    registerUser()
  }
  </script>
  
  <style scoped>
  </style>
  