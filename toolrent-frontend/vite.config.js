import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  },
  server: {
    host: true,           // escucha en 0.0.0.0 (útil en Docker)
    port: 5173,
    allowedHosts: [
      'localhost.byronobregon.com', // <-- el que te bloqueó
      'localhost',
      '127.0.0.1'
    ]
  }
})
