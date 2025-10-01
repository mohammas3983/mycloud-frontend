import { defineConfig } from 'vite'
import path from "path"
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  // ✅ این بخش بسیار مهم است
  // نام ریپازیتوری خود را اینجا وارد کنید
  base: "/mycloud-frontend/", 
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})