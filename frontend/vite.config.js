import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],

  server: {
    historyApiFallback: true,
    
    proxy: {
      "/api/test": "http://localhost:4000",
      "/api/user": "http://localhost:4000",
      "/api/shipments": "http://localhost:4000",
      "/api/trucks": "http://localhost:4000",
      "/api/optimization": "http://localhost:4000",
      "/api/bookings": "http://localhost:4000",

    },
  },
})
