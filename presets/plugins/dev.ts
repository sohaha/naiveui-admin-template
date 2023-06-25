import { env } from '../shared/env'
import Inspect from 'vite-plugin-inspect'
import VueDevTools from "vite-plugin-vue-devtools";

export function DevPlugins() {
  return [
    Inspect({
      dev: env.VITE_DEV_INSPECT,
      enabled: !env.IS_PROD && env.VITE_DEV_INSPECT,
    }),
    // https://github.com/webfansplz/vite-plugin-vue-devtools
    !env.IS_PROD && VueDevTools(),
  ]
}
