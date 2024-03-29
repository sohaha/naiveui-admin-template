<script lang="ts" setup>
import { isObject } from '@vueuse/core'
import type { MenuInst, MenuOption } from 'naive-ui'
import { NEllipsis } from 'naive-ui'
import exampleMenu, { locales } from '@/pages/example/menu'
import { mergeLocaleMessage } from '@/modules/i18n'

const props = defineProps<{
  collapsed: boolean
  inverted: boolean
}>()

const emit = defineEmits<{
  (e: 'update:collapsed', value: boolean): void
  (e: 'expanded', value: string[]): void
}>()

const menuInstRef = ref<MenuInst | null>(null)

const { locale, t } = useLanguage()
const { isDark } = useDarks()

const route = useRoute()
const router = useRouter()

const collapsed = useVModel(props, 'collapsed')
const isSmallScreen = useMediaQuery('(max-width: 440px)')

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
    ...d,
    icon: renderIcon(icon || 'i-bx:detail'),
  }
  if (isObject(d.i18n)) {
    const i = d.i18n[locale.value]
    if (i)
      data.label = i
  }
  const label = data.label
  data.label = () => h(NEllipsis, null, { default: () => label })
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
  const r = routes.find((route: any) => {
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
  || import.meta.env.VITE_APP_MOCK_IN_PRODUCTION === 'true' || import.meta.env.VITE_BUILD_DEMONSTRATE === 'true'
)
  mergeLocaleMessage(locales)

const user = userStore()
const menuOptions = computed<MenuOption[]>(() => {
  const menu: MenuOption[] = []
  for (const d of user.getMemu) menu.push(parse(d))
  for (const d of user.getAloneMenu) menu.push(parse(d))

  if (
    import.meta.env.DEV
  || import.meta.env.VITE_APP_MOCK_IN_PRODUCTION === 'true' || import.meta.env.VITE_BUILD_DEMONSTRATE === 'true'
  ) {
    if (menu.length > 0) {
      menu.push({
        type: 'divider',
      })
    }
    if (isObject(exampleMenu))
      menu.push(parse(exampleMenu))

    else for (const d of exampleMenu as any) menu.push(parse(d))
  }

  return menu
})

const hasMenu = computed(() => menuOptions.value.length > 0)

const selectedKeys = ref()

function selectMenu(key: string, item: MenuOption) {
  if (item.redirect) {
    router.push(item.redirect)
    return
  }
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
    const activate = (route?.meta?.activate || fullPath) as string
    selectedKeys.value = activate
    setTimeout(() => menuInstRef.value?.showOption(activate))
  },
  {
    immediate: true,
  },
)

const setting = settingStore()
const styleVal = computed(() =>
  (props.inverted && !isDark.value) ? 'background:#2e2e2e;' : '',
)

const loading = computed(() => !user.isLogged)
</script>

<template>
  <div :style="styleVal">
    <NMenu
      v-if="hasMenu && !loading"
      ref="menuInstRef"
      accordion
      :inverted="inverted || setting.isMenuInverted"
      :collapsed="collapsed"
      :collapsed-width="56"
      :collapsed-icon-size="36"
      :icon-size="30"
      :options="menuOptions"
      :indent="setting.menu.indent"
      :root-indent="setting.menu.rootIndent"
      :value="selectedKeys"
      @update:value="selectMenu"
    />
  </div>
</template>

<style scoped></style>
