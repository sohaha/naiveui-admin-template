import { loadEnv } from 'vite'

const { NODE_ENV } = process.env

// 是否是开发环境
export const isDevelopment = NODE_ENV === 'development'

// 是否是生产环境
export const IS_PROD = NODE_ENV === 'production'

const stringToBoolean = (v: string) => {
  return Boolean(v === 'true' || false)
}

// 获取环境变量
const useEnv = () => {
  const env = IS_PROD ? loadEnv('production', '.') : loadEnv('development', '.')

  const {
    VITE_APP_TITLE,
    VITE_APP_TYPE,
    VITE_APP_DISABLED_API_AUTO_IMPORT,
    VITE_APP_COMPRESSINON_ALGORITHM,
    VITE_APP_API_BASEURL,
  } = env

  return {
    IS_PROD,
    ...env,
    VITE_APP_TITLE,
    VITE_APP_TYPE,
    VITE_APP_COMPRESSINON_ALGORITHM,
    VITE_APP_API_BASEURL,
    VITE_DEV_INSPECT: stringToBoolean(env.VITE_DEV_INSPECT),
    VITE_DEV_PROXY: stringToBoolean(env.VITE_DEV_PROXY),
    VITE_DEV_SERVE_PORT: Number(env.VITE_DEV_SERVE_PORT) || 4000,
    VITE_BUILD_LEGACY: stringToBoolean(env.VITE_BUILD_LEGACY),
    VITE_APP_MARKDOWN: stringToBoolean(env.VITE_APP_MARKDOWN),
    VITE_APP_REMOVE_MENU: stringToBoolean(env.VITE_APP_REMOVE_MENU),
    VITE_APP_DISABLED_API_AUTO_IMPORT: stringToBoolean(
      VITE_APP_DISABLED_API_AUTO_IMPORT,
    ),
    VITE_APP_MOCK_IN_PRODUCTION: stringToBoolean(
      env.VITE_APP_MOCK_IN_PRODUCTION,
    ),
  }
}

export const env = useEnv()
