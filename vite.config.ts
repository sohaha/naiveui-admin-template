import { resolve } from 'path'
import { defineConfig } from 'vite'
import { BuildConfig } from './presets/build'
import Css from './presets/css'
import OptimizeDepsConfig from './presets/optimize'
import Plugins from './presets/plugins'
import { ServerConfig } from './presets/server'

export default defineConfig({
  resolve: {
    alias: {
      '@/': `${resolve(__dirname, 'src')}/`,
      '~/': `${resolve(__dirname, 'src')}/`,
      '#/': `${resolve(__dirname, 'src/types')}/`,
    },
  },
  plugins: [Plugins()],
  css: Css(),
  optimizeDeps: OptimizeDepsConfig(),
  server: ServerConfig(),
  build: BuildConfig(),
})
