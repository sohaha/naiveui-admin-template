<script lang="ts" setup>
const props = defineProps<{
  collapsed: boolean
}>()

const { t } = useLanguage()
const collapsed = useVModel(props, 'collapsed')
</script>

<template>
  <ACard>
    <div class="flex">
      <LayoutHeaderTabs>
        <template #prefix>
          <!-- <NTooltip>
            <template #trigger> -->
          <NButton text class="px-2" @click="collapsed = !collapsed">
            <NIcon
              size="20"
              :class="{ '!rotate-0': collapsed }"
              class="transition rotate-180 text-base i-bx:right-indent"
            />
          </NButton>
          <!-- </template>
            {{ collapsed ? t('expand') : t('collapsed') }}
          </NTooltip> -->
        </template>
        <template #suffix>
          <div
            class="flex items-center items-stretch justify-end space-x-0 pr-2"
          >
            <LayoutHeaderWindow />
            <LayoutHeaderTranslate />
            <LayoutHeaderFullscreen />
            <LayoutHeaderDark />
            <LayoutHeaderTips />
          </div>
        </template>
      </LayoutHeaderTabs>
    </div>
  </ACard>
</template>

<style scoped>
:deep(.n-tabs .n-tabs-nav .n-tabs-nav__suffix) {
  padding-left: 2px;
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
