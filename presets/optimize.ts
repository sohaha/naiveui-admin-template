import type { DepOptimizationOptions } from 'vite'
import { normalizeResolvers } from './shared/resolvers'

export default function (): DepOptimizationOptions {
  return {
    include: normalizeResolvers({
      onlyExist: [
        ['axios', 'axios'],
        ['vue-use-api', 'vue-use-api'],
        ['@vueuse/core', '@vueuse/core'],
        ['naive-ui', 'naive-ui'],
        ['vant/es', 'vant'],
        ['vant/es/config-provider/style/index', 'vant'],
      ],
      include: ['vue', 'vue-router', 'ayyui'],
    }) as string[],
    exclude: [],
  }
}
