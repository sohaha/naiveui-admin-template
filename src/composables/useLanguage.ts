import { locale } from '@/modules/i18n'

export const language = computed(() => {
  return locale.value === 'zh' ? '中文' : 'English'
})

export const toggleLocale = (lang?: string) => {
  if (lang) {
    locale.value = lang
    return
  }
  locale.value = locale.value === 'zh' ? 'en' : 'zh'
}

export default () => {
  const { t } = useI18n()

  return { t, locale, toggleLocale, language }
}
