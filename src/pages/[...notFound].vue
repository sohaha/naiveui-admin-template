<script setup lang="ts">
const router = useRouter()
const { t } = useLanguage()
</script>

<template>
  <Card height>
    <div class="flex items-center justify-around w-full h-full">
      <NResult
        status="404"
        title="404 资源不存在"
        description="生活总归带点荒谬"
      >
        <template #footer>
          <NButton class="m-auto" @click="router.back()">
            {{ t('button.back') }}
          </NButton>
        </template>
      </NResult>
    </div>
  </Card>
</template>

<style></style>

<route lang="yaml">
meta:
  multiWindow: false
  i18n:
    en: Not Found
    zh: 页面不存在
</route>
