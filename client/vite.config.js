import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'


export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return{
    plugins: [vue(), tailwindcss()],
    envDir: '../',
    server: {
      proxy: {
        '/api': {
          target: env.VITE_APP_URL,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, '/api'),
        },
      },
      port: env.VITE_APP_PORT,
    },
  }

})