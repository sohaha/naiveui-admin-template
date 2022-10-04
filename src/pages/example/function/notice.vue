<script lang="ts" setup>
// 啰嗦的写法，方便参考
function run(a: string) {
  switch (a) {
    case 'message':
      return (type: string) => {
        switch (type) {
          case 'success':
            window.$message.success(type)
            break
          case 'info':
            window.$message.info(type)
            break
          case 'warning':
            window.$message.warning(type)
            break
          case 'error':
            window.$message.error(type)
            break
          case 'loading':
            window.$message.loading(type)
            break
        }
      }
    case 'dialog':
      return (type: string) => {
        const opt = {
          title: type,
          content: '你确定？',
          maskClosable: false,
          positiveText: '确定',
        }
        switch (type) {
          case 'success':
            window.$dialog.success(opt)
            break
          case 'info':
            window.$dialog.info(opt)
            break
          case 'warning':
            window.$dialog.warning(opt)
            break
          case 'error':
            window.$dialog.error(opt)
            break
        }
      }
    case 'notification':
      return (type: string) => {
        const opt = {
          content: type,
          duration: 3000,
        }
        switch (type) {
          case 'success':
            window.$notification.success(opt)
            break
          case 'info':
            window.$notification.info(opt)
            break
          case 'warning':
            window.$notification.warning(opt)
            break
          case 'error':
            window.$notification.error(opt)
            break
        }
      }
  }
  return () => {
    // 未知类型
  }
}

function open(u: string) {
  openURL(u)
}
</script>

<template>
  <div class="space-y-4">
    <Card
      v-for="(u, v) in {
        message: 'https://www.naiveui.com/zh-CN/light/components/notification',
        notification: 'https://www.naiveui.com/zh-CN/light/components/message',
        dialog: 'https://www.naiveui.com/zh-CN/light/components/dialog',
      }"
      :key="v"
      :title="v"
    >
      <div class="pb-2">
        <NButton dashed size="small" @click="open(u)">
          <template #icon>
            <NIcon class="i-bx:link" />
          </template>
          文档
        </NButton>
      </div>
      <div class="space-x-2 space-y-2">
        <NButton
          v-for="t in ['success', 'info', 'warning', 'error']"
          :key="t"
          :type="t as any"
          @click="run(v)(t)"
        >
          {{ t }}
        </NButton>
        <NButton v-if="v === 'message'" @click="run(v)('loading')">
          loading
        </NButton>
      </div>
    </Card>
  </div>
</template>

<style scoped></style>

<route lang="json">
{
  "meta": {
    "i18n": { "en": "Notice", "zh": "通知" }
  }
}
</route>
