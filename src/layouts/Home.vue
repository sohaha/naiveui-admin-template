<script lang="ts" setup>
const collapsed = usePrefixStorage('collapsed', false)
const state = stateStore()
const setting = settingStore()
const collapsedWidth = computed(() => (state.isSmallScreen ? 0 : 80))

const { isFullscreen } = useFullscreen()
watch(
  () => state.isSmallScreen,
  (val) => {
    collapsed.value = val
  },
)

const width = 180
</script>

<template>
  <NLayout class="h-screen bg-[var(--a-bg-color)]" has-sider>
    <NLayoutSider
      :inverted="setting.isMenuInverted"
      collapse-mode="width"
      :dev-position="state.isSmallScreen ? 'absolute' : 'static'"
      :native-scrollbar="false"
      :collapsed-width="collapsedWidth"
      :width="width"
      :collapsed="collapsed"
      class="z-3"
      :class="{
        'py-4 pl-4': !state.isSmallScreen,
      }"
      @collapse="collapsed = true"
      @expand="collapsed = false"
    >
      <ACard
        :class="{
          'my-4': state.isSmallScreen,
        }"
      >
        <LayoutMenu
          :inverted="setting.isMenuInverted"
          :collapsed="collapsed"
          @update:collapsed="collapsed = $event"
        />
      </ACard>
    </NLayoutSider>
    <NLayoutContent content-style="">
      <div class="h-full overflow-auto">
        <NScrollbar style="max-height: 100vh">
          <div class="p-4 pb-0 sticky -top-[1.25rem] z-2">
            <LayoutHeader
              class=""
              :collapsed="collapsed"
              @update:collapsed="collapsed = $event"
            />
          </div>
          <div
            id="main-window"
            class="p-4 pt-4 relative "
            :class="{ 'overflow-auto': isFullscreen, 'bg-[var(--a-bg-color)]': isFullscreen }"
          >
            <LayoutMultiWindow />
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
