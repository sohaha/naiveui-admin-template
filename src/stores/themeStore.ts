import type {
  CustomThemeCommonVars,
  GlobalThemeOverrides,
  ThemeCommonVars,
} from 'naive-ui'
import { darkTheme as dark } from 'naive-ui'
import type { BuiltInGlobalTheme } from 'naive-ui/es/themes/interface'

const { isDark } = useDarks()

const primaryColor = usePrefixStorage('primaryColor', '#1768AC')

export function updatePrimaryColor(color: string) {
  primaryColor.value = color
}

function addLight(color: string, amount: number) {
  const cc = parseInt(color, 16) + amount
  const c = cc > 255 ? 255 : cc
  return c.toString(16).length > 1 ? c.toString(16) : `0${c.toString(16)}`
}

function lighten(color: string, amount: number) {
  color = color.includes('#') ? color.substring(1, color.length) : color
  amount = Math.trunc((255 * amount) / 100)
  return `#${addLight(color.substring(0, 2), amount)}${addLight(
    color.substring(2, 4),
    amount,
  )}${addLight(color.substring(4, 6), amount)}`
}

export default defineStore('themeStore', {
  state() {
    return {
      primaryColor,
    }
  },
  getters: {
    darkTheme(): BuiltInGlobalTheme {
      return dark
    },
    getBaseTheme(): GlobalThemeOverrides {
      const appTheme = this.primaryColor || '#1768AC'
      const common: Partial<ThemeCommonVars & CustomThemeCommonVars> = {}
      common.borderRadius = '.5rem'

      if (isDark.value)
        common.baseColor = '#101014'
      else common.baseColor = '#f5f7f9'

      return {
        common: {
          ...common,
          primaryColor: appTheme,
          primaryColorHover: lighten(appTheme, 8),
          primaryColorPressed: lighten(appTheme, 6),
          primaryColorSuppl: lighten(appTheme, 9),
        },
        LoadingBar: {
          colorLoading: appTheme,
        },
      }
    },
  },
  actions: {},
  persist: {
    key: storageKey('theme'),
  },
})
