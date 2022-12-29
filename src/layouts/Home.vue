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

const layoutRef = ref()
const themeVars = useThemeVars()
const borderRadius = useCssVar('--n-border-radius', layoutRef)
watch(themeVars, (r) => {
  borderRadius.value = r.borderRadius
}, { immediate: true })
</script>

<template>
  <NLayout ref="layoutRef" class="h-screen " has-sider :style="layoutStyle">
    <NLayoutSider
      :inverted="setting.isMenuInverted"
      collapse-mode="width"
      :dev-position="state.isSmallScreen ? 'absolute' : 'static'"
      :native-scrollbar="false"
      :collapsed-width="collapsedWidth"
      :width="width"
      :collapsed="collapsed"
      class="z-3"
      @collapse="collapsed = true"
      @expand="collapsed = false"
    >
      <ACard
        v-motion-roll-left class="m-3 mr-1"
      >
        <div>
          <LayoutMenu
            :inverted="setting.isMenuInverted"
            :collapsed="collapsed"
            @update:collapsed="collapsed = $event"
          />
        </div>
      </ACard>
    </NLayoutSider>
    <NLayoutContent ref="contentRef" :class="state.isSmallScreen ? 'pl-2' : ''" content-style="">
      <div class="h-full overflow-auto">
        <NScrollbar style="max-height: 100vh">
          <div class="p-3 pl-2 pb-0 sticky -top-4 z-10">
            <LayoutHeader
              v-motion-roll-top
              :collapsed="collapsed"
              @update:collapsed="collapsed = $event"
            />
          </div>
          <div
            id="main-window"
            :style="contentStyle"
            class="p-3 pl-2 relative transition-width-1000"
            :class="{ 'overflow-auto': isFullscreen, 'bg-[var(--a-bg-color)]': isFullscreen }"
          >
            <Component :is="Loading" v-if="!user.isLogged" />
            <LayoutMultiWindow v-else :disabled-animation="route.fullPath === '/load'" />
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

/* .layout-sider {
  box-shadow: 2px 0 8px 0 rgba(0, 0, 0, 0.068);
  position: relative;
  z-index: 13;
  height: 100vh;
  transition: width 0.2s ease-in-out, max-width 0.2s ease-in-out;
  will-change: auto;
} */

.n-layout-sider .n-layout-toggle-button {
  top: 26px;
  /* border-radius: 0 50% 50% 0; */
  /* transform: translateX(60%) translateY(-50%) translateZ(0); */
}
</style>
