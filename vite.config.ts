import path from 'node:path'

import tailwindcss from '@tailwindcss/vite'
import { tanstackRouter } from '@tanstack/router-plugin/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tanstackRouter({
      target: 'react',
      autoCodeSplitting: true,
      routesDirectory: './src/app/routes',
      generatedRouteTree: './src/app/routeTree.gen.ts',
    }),
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: [
      { find: '@app', replacement: path.resolve(import.meta.dirname, './src/app') },
      { find: '@core', replacement: path.resolve(import.meta.dirname, './src/core') },
      { find: '@modules', replacement: path.resolve(import.meta.dirname, './src/modules') },
      { find: '@shared', replacement: path.resolve(import.meta.dirname, './src/shared') },
      { find: '@mocks', replacement: path.resolve(import.meta.dirname, './src/mocks') },
      { find: '@', replacement: path.resolve(import.meta.dirname, './src') },
    ],
  },
})
