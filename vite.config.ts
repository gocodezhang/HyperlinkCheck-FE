import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { viteSingleFile } from 'vite-plugin-singlefile'

const outDir = '../dist'
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react({
    jsxRuntime: 'automatic',
  }), viteSingleFile({useRecommendedBuildConfig: true})],
  root: './client/src',
  build: {
    outDir: outDir,
    emptyOutDir: true,
    rollupOptions: {
      input: './client/src/index.html',
      output: {
        format: 'iife'
      }
    }
  
  }
})
