import { env } from './shared/env'

export function ServerConfig() {
  // 开发服务器选项 https://cn.vitejs.dev/config/#server-options
  return {
    open: false,
    port: env.VITE_DEV_SERVE_PORT || 4000,
    overlay: true,
    proxy: {
      '/proxy': {
        target: env.VITE_APP_API_BASEURL,
        changeOrigin: env.VITE_DEV_PROXY,
        rewrite: (path: string) => path.replace(/\/proxy/, ''),
      },
    },
    fs: {
      strict: true,
    },
  }
}
