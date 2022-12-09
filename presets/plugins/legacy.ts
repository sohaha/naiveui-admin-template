import legacy from '@vitejs/plugin-legacy'
import { LegacBrowserslist, browserslist, env } from '../shared/env'

// https://github.com/vitejs/vite/tree/main/packages/plugin-legacy
export function LegacyPlugin() {
  if (!env.IS_PROD)
    return null

  return env.IS_PROD && env.VITE_BUILD_LEGACY
    ? legacy({
      polyfills: true,
      targets: browserslist,
      modernPolyfills: true,
      additionalLegacyPolyfills: ['regenerator-runtime/runtime'],
    })
    : legacy({
      ignoreBrowserslistConfig: true,
      targets: LegacBrowserslist,
      polyfills: false,
      modernPolyfills: true,
      renderLegacyChunks: false,
    })
}
