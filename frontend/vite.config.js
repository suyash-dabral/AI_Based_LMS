import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    // You can also specify the host if needed
    // host: '0.0.0.0', // to make the server accessible from other devices on the network
    // Additional server options can be added here
    strictPort: true, // this will fail if port 3000 is already in use instead of automatically using another port
  },
})