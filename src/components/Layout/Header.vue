<script lang="ts" setup>
import LayoutHeaderWindow from './Header/Window.vue'
import LayoutHeaderTranslate from './Header/Translate.vue'
import LayoutHeaderFullscreen from './Header/Fullscreen.vue'
import LayoutHeaderDark from './Header/Dark.vue'
import LayoutHeaderTips from './Header/Tips.vue'
const props = defineProps<{
  collapsed: boolean
}>()

const collapsed = useVModel(props, 'collapsed')
const state = stateStore()
const setting = settingStore()
const toolbar = computed(() => setting.toolbar || [])
const toolbarComponents: Record<string, any> = {
  // window: LayoutHeaderWindow,
  translate: LayoutHeaderTranslate,
  fullscreen: LayoutHeaderFullscreen,
  dark: LayoutHeaderDark,
  // tips: LayoutHeaderTips,
}
function renderTools(size = 20) {
  const tools: any[] = [
    h(LayoutHeaderWindow, { size }),
    ...toolbar.value.map((tool) => {
      if (!toolbarComponents[tool])
        return null

      return h(toolbarComponents[tool], { size })
    }),
    h(LayoutHeaderTips, { size }),
  ]

  return h('div', { class: 'flex items-center items-stretch justify-end space-x-0' }, tools)
}

const dropdownOptions = [
  {
    key: 'header',
    type: 'render',
    render: () => renderTools(24),
  },
]
</script>

<template>
  <ACard>
    <div class="flex h-[42px] items-center pr-2">
      <LayoutHeaderTabs>
        <template #prefix>
          <NButton text class="px-3" @click="collapsed = !collapsed">
            <NIcon
              size="24"
              :class="{ '!rotate-0': collapsed }"
              class="transition rotate-180 text-base i-bx:right-indent"
            />
          </NButton>
        </template>
        <template #suffix>
          <Component :is="renderTools()" v-if="!state.isSmallScreen" />
          <div v-else>
            <NDropdown
              trigger="click"
              placement="bottom-end"
              :options="dropdownOptions"
            >
              <NIcon
                size="24"
                :class="{ '!rotate-0': collapsed }"
                class="transition rotate-180 text-base i-bx-dots-vertical"
              />
            </NDropdown>
          </div>
        </template>
      </LayoutHeaderTabs>
    </div>
  </ACard>
</template>

<style scoped>
 :deep(.n-tabs .n-tabs-nav .n-tabs-nav__suffix) {
  padding-left: 0.5rem;
}

:deep(.n-tabs .n-tabs-nav .n-tabs-nav__prefix) {
  padding-right: 0;
}

:deep(.n-tabs .n-tabs-tab-pad) {
  width: 0.75rem;
}
</style>

<i18n lang="yml">
en:
  collapsed: Collapsed menu
  expand: Expand menu

zh:
  collapsed: 收起导航菜单
  expand: 展开导航菜单
</i18n>
