import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 8001, // This forces React to run on port 8001 to match your Django settings
  }
})