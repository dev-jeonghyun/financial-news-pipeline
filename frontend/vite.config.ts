import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/tickers': {
        target: 'http://34.22.108.245:8080',
        changeOrigin: true,
      },
      '/news': {
        target: 'http://34.22.108.245:8080',
        changeOrigin: true,
      },
      '/auth': {
        target: 'http://34.22.108.245:8080',
        changeOrigin: true,
      }
    }
  }
})