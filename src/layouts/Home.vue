<script lang="ts" setup>
import type { StyleValue } from 'vue'
import { useThemeVars } from 'naive-ui'
import Loading from '@/components/Layout/Loading'
const user = userStore()
const route = useRoute()

const state = stateStore()
const setting = settingStore()

const { isFullscreen } = useFullscreen()

const collapsed = usePrefixStorage('collapsed', state.isSmallScreen)
const collapsedWidth = computed(() => (state.isSmallScreen ? 0 : 70))
const siderHeight = computed(() => state.getPageContentHeight + state.pageHeaderHeight)
const contentRef = ref()

// TODO 监听内容区宽度
// const w = ref(0)
// const contentWidth = refDebounced (w, 200)
// watch(contentWidth, (v) => {
//   console.log('v', v)
// })
// useResizeObserver(contentRef, (entries) => {
//   const entry = entries[0]
//   const { width } = entry.contentRect
//   w.value = width
// })

watch(
  () => state.isSmallScreen,
  (val) => {
    collapsed.value = val
  },
)

const baseWidth = 188
const width = ref(baseWidth)

const layoutStyle = computed(() => {
  return {
    maxWidth: setting.getMaxWidth,
    margin: 'auto',
  } as StyleValue
})

const contentStyle = computed(() => {
  const maxWidth = route?.meta?.maxWidth || '100%'
  return {
    width: `min(${(typeof maxWidth === 'number' ? (maxWidth > 0 ? `${maxWidth}px` : setting.getMaxWidth) : maxWidth)}, 100%)`,
    margin: 'auto',
  } as StyleValue
})
</script>

<template>
  <NLayout class="h-screen " has-sider :style="layoutStyle">
    <NLayoutSider
      :inverted="setting.isMenuInverted"
      collapse-mode="width"
      :dev-position="state.isSmallScreen ? 'absolute' : 'static'"
      native-scrollbar
      :collapsed-width="collapsedWidth"
      :width="width"
      :collapsed="collapsed"
      dev-show-trigger="bar"
      class="z-3"
      @collapse="collapsed = true"
      @expand="collapsed = false"
    >
      <ACard
        class="m-3 mr-1"
        :style="`height: ${siderHeight}px`"
      >
        <div :style="`height: ${siderHeight - 52}px`">
          <NScrollbar>
            <LayoutMenu
              :inverted="setting.isMenuInverted"
              :collapsed="collapsed"
              @update:collapsed="collapsed = $event"
            />
          </NScrollbar>
        </div>
        <div>
          <NDivider class="!m-0" />
          <LayoutUser :collapsed="collapsed" />
        </div>
      </ACard>
    </NLayoutSider>
    <NLayoutContent ref="contentRef" :class="state.isSmallScreen ? 'w-screen' : ''" content-style="">
      <div class="h-full overflow-auto">
        <NScrollbar :style="`max-height:${state.windowHeight}px`">
          <div class="p-3 pb-0 sticky -top-4 z-10" :class="{ 'pl-2': !state.isSmallScreen }">
            <LayoutHeader
              v-motion-roll-top
              :collapsed="collapsed"
              @update:collapsed="collapsed = $event"
            />
          </div>
          <div
            id="main-window"

            :style="contentStyle"
            class="p-3 relative transition-width-1000"
            :class="{ 'overflow-auto': isFullscreen, 'bg-[var(--a-bg-color)]': isFullscreen, 'pl-2': !state.isSmallScreen }"
          >
            <Component :is="Loading" v-if="!user.isLogged" />
            <LayoutMultiWindow v-else :disabled-animation="route.fullPath === '/inlay/loading'" />
          </div>
          <NBackTop :right="20" :bottom="20" class="z-20" />
        </NScrollbar>
      </div>
    </NLayoutContent>
  </NLayout>
</template>

<style>
.n-layout,
.n-layout-sider {
  --n-color: hsla(0, 0, 0) !important;
  /* --n-color: hsla(var(--a-bg)) !important; */
  /* background-color: hsla(var(--a-bg)); */
}

.n-layout-sider__border {
  display: none;
}
.n-layout-sider .n-layout-toggle-bar{
  right: -1rem;
}
</style>
