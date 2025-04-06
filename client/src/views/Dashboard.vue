<template>
    <div class="p-6">
      <h1 class="text-2xl font-bold mb-4">Добро пожаловать в систему!</h1>
      <p class="text-gray-700">Вы успешно вошли как <strong>{{ user?.role }}</strong>.</p>
  
      <button
        @click="logout"
        class="mt-6 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
      >
        Выйти
      </button>
    </div>
  </template>
  
  <script setup>
  import { onMounted, ref } from 'vue'
  import { useRouter } from 'vue-router'
  
  const router = useRouter()
  const user = ref(null)
  
  const fetchUser = async () => {
    try {
      const res = await fetch('http://localhost:3000/api/auth/me', {
        credentials: 'include',
      })
      if (res.ok) {
        user.value = await res.json()
      } else {
        router.push('/login')
      }
    } catch (err) {
      router.push('/login')
    }
  }
  
  const logout = async () => {
    await fetch('http://localhost:3000/api/auth/logout', {
      method: 'POST',
      credentials: 'include',
    })
    router.push('/login')
  }
  
  onMounted(fetchUser)
  </script>
  