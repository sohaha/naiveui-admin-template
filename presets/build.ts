import type { BuildOptions } from 'vite'

export function BuildConfig(): BuildOptions {
  return {
    chunkSizeWarningLimit: 1500,
    minify: 'terser',
    rollupOptions: {
      output: {
        manualChunks(id: string) {
          if (id.includes('node_modules')) {
            switch (true) {
              case id.includes('echarts/'):
                return 'echarts'
              case id.includes('ui'):
              case id.includes('vue'):
                return 'vendor'
              default:
              // return id
              //   .toString()
              //   .split('node_modules/')[1]
              //   .split('/')[0]
              //   .toString()
            }
          }
        },
      },
    },
  }
}
