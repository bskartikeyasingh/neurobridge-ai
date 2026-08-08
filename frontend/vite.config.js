import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    headers: {
      // This allows the main window to monitor and close the Firebase auth popup
      "Cross-Origin-Opener-Policy": "same-origin-allow-popups",
    },
  },
})