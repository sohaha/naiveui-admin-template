import type { App } from 'vue'
import { createI18n } from 'vue-i18n'

import localMessages from '@intlify/unplugin-vue-i18n/messages'

export const locale = usePrefixStorage(
  'locale',
  import.meta.env.VITE_APP_LOCALE || 'zh',
)

export const messages = localMessages

export const i18n = createI18n({
  legacy: false,
  silentFallbackWarn: true,
  silentTranslationWarn: true,
  locale: locale.value as string,
  fallbackLocale: 'en',
})
watch(locale, (locale) => {
  i18n.global.locale.value = locale
})
Object.keys(messages).forEach((k) => {
  i18n.global.setLocaleMessage(k, messages[k])
})

export function globalt(key: string) {
  return i18n.global.t(key) || ''
}

export function mergeLocaleMessage(locales: any) {
  Object.keys(locales).forEach((locale) => {
    const t: any = {}
    Object.keys(locales[locale]).forEach((k) => {
      t[k] = () => {
        return locales[locale][k]
      }
    })
    i18n.global.mergeLocaleMessage(locale, t)
  })
}

export default (app: App) => {
  app.use(i18n)
}
