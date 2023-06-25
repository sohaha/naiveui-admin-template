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
    VITE_BUILD_BASE,
  } = env

  return {
    IS_PROD,
    ...env,
    VITE_APP_TITLE,
    VITE_APP_TYPE,
    VITE_APP_COMPRESSINON_ALGORITHM,
    VITE_APP_API_BASEURL,
    VITE_BUILD_BASE: (() => (!!VITE_BUILD_BASE && VITE_BUILD_BASE.substring(VITE_BUILD_BASE.length - 1) !== '/') ? `${VITE_BUILD_BASE}/` : VITE_BUILD_BASE)(),
    VITE_DEV_INSPECT: stringToBoolean(env.VITE_DEV_INSPECT),
    VITE_APP_API_BASEURL_DYNAMIC: stringToBoolean(env.VITE_APP_API_BASEURL_DYNAMIC),
    VITE_DEV_PROXY: stringToBoolean(env.VITE_DEV_PROXY),
    VITE_DEV_SERVE_PORT: Number(env.VITE_DEV_SERVE_PORT) || 4000,
    VITE_BUILD_LEGACY: stringToBoolean(env.VITE_BUILD_LEGACY),
    VITE_BUILD_PWA: stringToBoolean(env.VITE_BUILD_PWA),
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

export const browserslist = [
  '> 1%, last 1 version, ie >= 11',
  'safari >= 10',
  'Android > 28',
  'Chrome >= 60',
  'Safari >= 10.1',
  'iOS >= 10.3',
  'Firefox >= 54',
  'Edge >= 15',
]

export const LegacBrowserslist = ['Android > 28']
