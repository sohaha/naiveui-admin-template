<script lang="ts" setup>
import { NIcon } from 'naive-ui'

const { t } = useLanguage()
const window = multiWindowStore()
const state = stateStore()
const route = useRoute()
const router = useRouter()

let toggleFullscreen = () => {}
const disabledFullscreen = ref(false)
const isSupportedFullscreen = ref(false)
onMounted(() => {
  const { toggle, isFullscreen, isSupported } = useWindowFullscreen(true)
  isSupportedFullscreen.value = isSupported.value
  toggleFullscreen = () => {
    if (!isFullscreen.value)
      state.setPageHeaderHeight(0)

    toggle()
  }
  watch(isFullscreen, (v) => {
    disabledFullscreen.value = v
    if (!v)
      state.setPageHeaderHeight(undefined)
  })
})

function menuSelect(key: string) {
  switch (key) {
    case 'close_other':
      window.closeTabForOther()
      break
    case 'close':
      window.closeTab(route.fullPath)
      break
    case 'refresh':
      if (window.currentWindow) {
        window.currentWindow.refresh()
        // router.push('/load')
        return
      }
      router.push('/load')
      break
    case 'toggleFullscreen':
      toggleFullscreen()
      break
  }
}

const disabledClose = computed(() => {
  return window.windowTab.length === 1
})

const menuOptions = computed(() => [
  {
    label: t('refresh'),
    key: 'refresh',
    icon() {
      return h(NIcon, {
        class: 'i-bx:rotate-left',
      })
    },
  },
  {
    label: t('fullscreen'),
    key: 'toggleFullscreen',
    disabled: disabledFullscreen.value || !isSupportedFullscreen.value,
    icon() {
      return h(NIcon, {
        class: 'i-bx:fullscreen',
      })
    },
  },
  {
    key: 'header-divider',
    type: 'divider',
  },
  {
    label: t('close'),
    key: 'close',
    disabled: disabledClose.value,
    icon() {
      return h(NIcon, {
        class: 'i-bx:x',
      })
    },
  },
  {
    label: t('close_other'),
    key: 'close_other',
    disabled: disabledClose.value,
    icon() {
      return h(NIcon, {
        class: 'i-bx:minus',
      })
    },
  },
])
</script>

<template>
  <NDropdown
    trigger="hover"
    placement="bottom"
    :options="menuOptions"
    @select="menuSelect"
  >
    <NButton class="px-2" text>
      <NIcon size="20" class="i-bx:windows" />
    </NButton>
  </NDropdown>
</template>

<i18n lang="yml">
en:
  refresh: Refresh
  close: Close
  close_other: Close other
  fullscreen: Local screen
zh:
  close: 关闭当前
  close_other: 关闭其他
  refresh: 刷新当前
  fullscreen: 局部全屏
</i18n>
