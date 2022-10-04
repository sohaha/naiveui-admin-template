<script lang="ts" setup></script>

<template>
  <Card title="一次性页面">
    <div class="space-y-4">
      <div class="tip-text ">
        当前页面切换了就会自动销毁
      </div>
      <NInput />
    </div>
  </Card>
</template>

<style scoped></style>

<route lang="yaml">
meta:
  multiWindow: false
  fullscreen: true
  i18n:
    en: Disposable
    zh: 单次页面
</route>

<i18n lang="yml"></i18n>
