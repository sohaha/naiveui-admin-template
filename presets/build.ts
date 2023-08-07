import type { BuildOptions } from 'vite'
import { env } from './shared/env'

export function BuildConfig(): BuildOptions {
  return {
    outDir: env.VITE_BUILD_OUT_DIR,
    chunkSizeWarningLimit: 1500,
    minify: 'terser',
    rollupOptions: {
      output: {
        chunkFileNames: 'js/[name]-[hash].js',
        entryFileNames: 'js/[name]-[hash].js',
        assetFileNames: '[ext]/[name]-[hash].[ext]',
        manualChunks(id: string) {
          if (id.includes('node_modules')) {
            switch (true) {
              case id.includes('echarts/'):
                return 'echarts'
              case id.includes('pinia'):
              case id.includes('vue-use-api'):
              case id.includes('vue/'):
              case id.includes('vue-router/'):
                return 'lib'
              default:
              // return id.toString().split("node_modules/")[1].split("/")[0].toString();
            }
          }
        },
      },
    },
  }
}
