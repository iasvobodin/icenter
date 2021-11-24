import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import eslintPlugin from 'vite-plugin-eslint'
import { resolve } from 'path'
import tsconfigPaths from 'vite-tsconfig-paths'

// https://vitejs.dev/config/!!! 
export default defineConfig({
  build: {
    manifest: true,
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  plugins: [
    vue(),
    tsconfigPaths(),
    // , eslintPlugin({ fix: true })
  ],
  server: {
    port: 8080,
    proxy: {
      '^/api': {
        target: 'http://localhost:7071',
        changeOrigin: true,
      },
    },
  },
})
