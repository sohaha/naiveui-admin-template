import { resolve } from 'path'
import { UserConfig, defineConfig } from 'vite'
import { BuildConfig } from './presets/build'
import Css from './presets/css'
import OptimizeDepsConfig from './presets/optimize'
import Plugins from './presets/plugins'
import { ServerConfig } from './presets/server'
import { env } from './presets/shared/env'

const defaultConfig = {
  base: (env.IS_PROD && env.VITE_BUILD_BASE) ? `${env.VITE_BUILD_BASE}` : '/',
  define: {
    __VUE_OPTIONS_API__: false,
    // __VUE_PROD_DEVTOOLS__: true,
  },
  resolve: {
    alias: {
      // 'vue': 'vue/dist/vue.esm-bundler.js',
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
  rollupOptions: {
    output: {
      globals: {
        vue: 'Vue',
      }
    }
  }
}

const otherConfig: UserConfig = {
  ...defaultConfig, build: {
    ...defaultConfig.build,
    cssCodeSplit: true,
    outDir: 'dist-other',
    lib: {
      formats: ['umd'],
      entry: ["demo"].map(v => `src/other/${v}.vue`),
      name: 'otherComponent',
      fileName: (format) => `other.${format}.js`
    },
    rollupOptions: {
      external: ['vue'],
      output: {
        globals: {
          vue: 'Vue',
        }
      }
    }
  }
}

export default (conf: UserConfig) => {
  const config = conf.mode === 'other' ? otherConfig : defaultConfig
  return defineConfig(config);
};
