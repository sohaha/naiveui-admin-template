import legacy from '@vitejs/plugin-legacy'
import { env } from '../shared/env'

// https://github.com/vitejs/vite/tree/main/packages/plugin-legacy
export function LegacyPlugin() {
  return env.IS_PROD && env.VITE_BUILD_LEGACY
    ? legacy({
      targets: ['ie >= 11'],
      additionalLegacyPolyfills: ['regenerator-runtime/runtime'],
    })
    : ''
}
