import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  server: {

    historyApiFallback: true,
    host: true,
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:8081', // Spring Boot 서버 주소
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''), // '/api' 제거 후 요청
      }
    }
  },
  plugins: [react()],
})
