<script lang="ts" setup>
import { isObject } from '@vueuse/core'
import type { TabsInst } from 'naive-ui'
import { NIcon } from 'naive-ui'

const props = withDefaults(defineProps<{
  size?: number
}>(), { size: 20 })

const { t, locale } = useLanguage()
const multiWindow = multiWindowStore()
const tabsRef = ref<TabsInst>()
const route = useRoute()
const value = ref(route.fullPath)

watch(() => route.fullPath, resetBarPosition)

function resetBarPosition(v?: string) {
  setTimeout(() => {
    if (v)
      value.value = v
    tabsRef.value?.syncBarPosition()
  }, 100)
}

const tabs = computed(() => {
  const tabs = multiWindow.windowTab.map((w) => {
    const meta = w.meta || {}
    let { title } = meta
    const i18n: undefined = meta?.i18n as any
    if (i18n) {
      if (isObject(i18n))
        title = i18n[locale.value] || title
      else title = meta.i18n ? t(meta.title) : meta.title
    }

    return {
      fullPath: w.fullPath,
      name: title || w.name || 'Unknown',
    }
  })
  if (tabs.length === 0) {
    tabs.push({
      fullPath: '/',
      name: ' ',
    })
  }
  return tabs
})
watch(tabs, () => resetBarPosition())

const state = stateStore()
function renderTab(tab: any) {
  return h(
    'div',
    {
      class: 'relative px-2 group',
    },
    [
      h('div', { class: 'h-[21px]' }, tab.name),
      tabs.value.length > 1
        ? h(NIcon, {
          onClick: (even: any) => {
            even.stopPropagation()
            multiWindow.closeTab(tab.fullPath)
          },
          class: `absolute transition -right-2 inset-y-0 i-bx:x ${
              state.isSmallScreen
                ? 'hidden'
                : 'opacity-0 group-hover:opacity-50 hover:!opacity-100 hover:-right-3 hover:-top-[0.25rem] hover:text-red hover:text-[20px] pl-0 p-2'
            }`,
        })
        : null,
    ],
  )
}

const router = useRouter()
const updateTab = router.push
</script>

<template>
  <NTabs
    ref="tabsRef"
    type="bar"
    :value="value"
    @update:value="updateTab"
  >
    <NTab
      v-for="v in tabs"
      :key="v.fullPath"
      :name="v.fullPath"
      :tab="renderTab(v)"
    />
    <template #prefix>
      <slot name="prefix" />
    </template>
    <template #suffix>
      <slot name="suffix" />
    </template>
  </NTabs>
</template>

<style scoped>
:deep(.n-tabs-tab .n-tabs-tab__label) {
  letter-spacing: 0;
}
</style>
