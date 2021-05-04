import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import eslintPlugin from 'vite-plugin-eslint';
import * as path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: [
      {
        find: '@',
        replacement: path.resolve(__dirname, 'src')
      }
    ]
  },
  plugins: [vue(), eslintPlugin({ fix: true })],
  server: {
    port: 8080,
    proxy: {
      "^/api": {
        target: "http://localhost:7071",
        changeOrigin: true,
      },
    },
    // proxy: {
    //     // string shorthand
    //     '/foo': 'http://localhost:4567/foo',
    //     // with options
    //     '/api': {
    //       target: 'http://jsonplaceholder.typicode.com',
    //       changeOrigin: true,
    //       rewrite: (path) => path.replace(/^\/api/, '')
    //     },
    //     // with RegEx
    //     '^/fallback/.*': {
    //       target: 'http://jsonplaceholder.typicode.com',
    //       changeOrigin: true,
    //       rewrite: (path) => path.replace(/^\/fallback/, '')
    //     }
    //   }
  }
})
