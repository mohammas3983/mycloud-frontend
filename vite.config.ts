import { defineConfig } from 'vite'
import path from "path"
import react from '@vitejs/plugin-react-swc'

export default defineConfig({
  // base: "/mycloud-frontend/", // <-- حذف شد
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})