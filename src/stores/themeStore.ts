import type {
  CustomThemeCommonVars,
  GlobalThemeOverrides,
  ThemeCommonVars,
} from 'naive-ui'
import { darkTheme as dark } from 'naive-ui'
import type { BuiltInGlobalTheme } from 'naive-ui/es/themes/interface'
import type { DataTableThemeVars } from 'naive-ui/lib/data-table/styles'

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
      style: 'block',
    }
  },
  getters: {
    darkTheme(): BuiltInGlobalTheme {
      return dark
    },
    getBaseTheme(): GlobalThemeOverrides {
      const setting = settingStore()
      let appTheme = setting.theme.PrimaryColor || '#1768AC'
      const common: Partial<ThemeCommonVars & CustomThemeCommonVars> = {}
      common.borderRadius = '.5rem'

      const dataTable: Partial<DataTableThemeVars> = {}

      if (this.style === 'block')
        common.borderRadius = '0'

      if (isDark.value) {
        common.baseColor = '#101014'
        dataTable.thColor = '#18181c'
        appTheme = lighten(appTheme, 9)
      }
      else {
        dataTable.thColor = '#fff'
        common.baseColor = '#f5f7f9'
      }

      return {
        common: {
          ...common,
          primaryColor: appTheme,
          primaryColorHover: lighten(appTheme, 8),
          primaryColorPressed: lighten(appTheme, 6),
          primaryColorSuppl: lighten(appTheme, 9),
        },
        DataTable: dataTable,
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
