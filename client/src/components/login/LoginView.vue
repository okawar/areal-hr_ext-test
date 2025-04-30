<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-50 p-4">
    <div class="w-full max-w-sm bg-white p-6 rounded-xl shadow-lg">
      <h2 class="text-2xl font-semibold text-center mb-6">Вход</h2>
      <form @submit.prevent="login" class="space-y-4">
        <div>
          <input
            v-model="loginData.login"
            type="text"
            placeholder="Логин"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
        </div>
        <div>
          <input
            v-model="loginData.password"
            type="password"
            placeholder="Пароль"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
        </div>
        <button
          type="submit"
          class="w-full py-2 text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-300"
        >
          Войти
        </button>
        <p v-if="error" class="text-red-500 text-sm text-center mt-2">{{ error }}</p>
      </form>
    </div>
  </div>
</template>

<script>
import loginApi from '../../api/login';

export default {
  data() {
    return {
      loginData: { login: '', password: '' },
      error: '',
    };
  },
  methods: {
    async login() {
      try {
        await loginApi.login(this.loginData);
        this.$router.push('/');
      } catch (err) {
        this.error = err.response?.data?.error || 'Ошибка входа';
      }
    },
  },
};
</script>

