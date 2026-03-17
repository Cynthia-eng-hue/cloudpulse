import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'


// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id: string) {

          if (id.includes('node_modules')) {
            if (id.includes('echarts')) return 'vendor-charts';
            if (id.includes('antd') || id.includes('design')) return 'vendor-ui';
            if (id.includes('antv')) return 'vendor-topology';
            return 'vendor';
          }
        }
      }
    },
    chunkSizeWarningLimit: 1000,
  }
})

