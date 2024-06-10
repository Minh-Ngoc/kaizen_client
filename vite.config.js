/* eslint-disable no-undef */
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import * as path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
  },
  resolve: {
      alias: {
      'app': path.resolve(__dirname, 'src/app'),
      '_redux': path.resolve(__dirname, 'src/_redux'),
      '_utils': path.resolve(__dirname, 'src/_utils'),
      '_constants': path.resolve(__dirname, 'src/_constants'),
      'assets': path.resolve(__dirname, 'src/assets'),
      'components': path.resolve(__dirname, 'src/components'),
      'config': path.resolve(__dirname, 'src/config'),
      'contexts': path.resolve(__dirname, 'src/contexts'),
      'layouts': path.resolve(__dirname, 'src/layouts'),
      'services': path.resolve(__dirname, 'src/services'),
      'theme': path.resolve(__dirname, 'src/theme'),
      'variables': path.resolve(__dirname, 'src/variables'),
      'views': path.resolve(__dirname, 'src/views'),
      'routesSidebar': path.resolve(__dirname, 'src/routesSidebar'),
      'routes': path.resolve(__dirname, 'src/routes'),
    },
  },
})
