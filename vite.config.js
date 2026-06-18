import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => ({
  base: mode === 'production' ? '/skan/' : '/',
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://gateway.scan-interfax.ru',
        changeOrigin: true,
        secure: false,
      },
    },
  },
}))
