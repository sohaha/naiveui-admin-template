<script lang="ts" setup>
import { isObject } from '@vueuse/core'
import type { MenuInst, MenuOption } from 'naive-ui'
import { mergeLocaleMessage } from '@/modules/i18n'
import exampleMenu, { locales } from '@/pages/example/menu'

const props = defineProps<{
  collapsed: boolean
  inverted: boolean
}>()

const menuInstRef = ref<MenuInst | null>(null)

const { locale, t } = useLanguage()
const { isDark } = useDarks()

const route = useRoute()
const router = useRouter()
const collapsed = useVModel(props, 'collapsed')
const isSmallScreen = useMediaQuery('(max-width: 440px)')
const { data } = useRequest(apiMenus)

function parse(d: any) {
  let title = d.title
  let icon = d.icon

  const [rtitle, ricon] = findRoute(d.path)
  if (!title)
    title = rtitle

  if (!icon)
    icon = ricon

  const data: { [key: string]: any } = {
    key: d.path || '',
    label: title,
    url: d.url,
    icon: renderIcon(icon || 'i-bx:detail'),
  }
  if (isObject(d.i18n)) {
    const i = d.i18n[locale.value]
    if (i)
      data.label = i
  }
  if (d.children && d.children.length > 0) {
    const children = []
    for (let i = 0; i < d.children.length; i++)
      children.push(parse(d.children[i]))

    data.children = children
  }
  return data
}

const routes = router.getRoutes()
function findRoute(path: string) {
  const r = routes.find((route) => {
    return route.path === path
  })

  let title = 'Unknown'
  let icon = 'i-bx:detail'
  if (r) {
    const meta = r.meta
    const rTitle = (meta?.title || '') as string
    if (meta?.icon)
      icon = meta.icon as string
    const i18n: undefined = meta?.i18n as any
    if (isObject(i18n))
      title = i18n[locale.value] as string || rTitle
    else if (rTitle)
      title = i18n ? t(rTitle) : rTitle
  }

  return [title, icon]
}

if (
  import.meta.env.DEV
  || import.meta.env.VITE_APP_MOCK_IN_PRODUCTION === 'true'
)
  mergeLocaleMessage(locales)

const menuOptions = computed<MenuOption[]>(() => {
  const menu: MenuOption[] = []
  if (data.value?.data)
    for (const d of data.value.data) menu.push(parse(d))

  if (
    import.meta.env.DEV
    || import.meta.env.VITE_APP_MOCK_IN_PRODUCTION === 'true'
  ) {
    if (isObject(exampleMenu))
      menu.push(parse(exampleMenu))
    else
      for (const d of exampleMenu as any) menu.push(parse(d))
  }

  return menu
})

const selectedKeys = ref()

function selectMenu(key: string, item: MenuOption) {
  const path = String(item?.key || '')
  if (isURL(path) || item?.url) {
    const newWindow = window.open((item?.url || path) as string)
    if (newWindow)
      newWindow.opener = null
    return
  }
  if (isSmallScreen.value)
    collapsed.value = true

  router.push(path)
}

watch(
  () => route.fullPath,
  (fullPath) => {
    selectedKeys.value = fullPath
    setTimeout(() => menuInstRef.value?.showOption(fullPath))
  },
  {
    immediate: true,
  },
)

const setting = settingStore()
const styleVal = computed(() =>
  props.inverted && !isDark.value ? 'background:#2e2e2e;' : '',
)
</script>

<template>
  <div :style="styleVal">
    <NMenu
      ref="menuInstRef"
      :inverted="inverted || setting.isMenuInverted"
      :collapsed="collapsed"
      :collapsed-width="64"
      :collapsed-icon-size="32"
      :icon-size="26"
      :options="menuOptions"
      :indent="setting.menu.indent"
      :root-indent="setting.menu.rootIndent"
      :value="selectedKeys"
      @update:value="selectMenu"
    />
    <NDivider class="!m-0" />
    <LayoutUser :collapsed="collapsed" />
  </div>
</template>

<style scoped></style>
