import { defineConfig, esmExternalRequirePlugin } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
})

esmExternalRequirePlugin
