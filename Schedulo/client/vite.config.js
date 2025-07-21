import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
   server: {
    host: true, // or use '0.0.0.0' for all interfaces
    port: 5173,
    strictPort: true, // optional, defaults to 5173
  },
  plugins: [react()],
})
