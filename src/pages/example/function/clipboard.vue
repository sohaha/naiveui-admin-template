<script lang="ts" setup>
const message = useMessage()

const arr = [
  '葬花吟花谢花飞花满天，红消香断有谁怜？',
  '游丝软系飘春榭，落絮轻沾扑绣帘。',
  '侬今葬花人笑痴，他年葬侬知是谁？',
  '试看春残花渐落，便是红颜老死时；',
]

const source = ref(arr[0])

const { copy, text, copied, isSupported } = useClipboard()

async function copyText() {
  await copy(source.value)
  if (copied.value)
    message.success('复制成功')
  else message.error('复制失败')
}

function replaceText() {
  source.value = arr[Math.floor(Math.random() * arr.length)]
}
</script>

<template>
  <Card>
    <div class="flex flex-col space-y-4">
      <div>
        <NAlert v-if="isSupported" title="支持操作剪切板" type="success" />
        <NAlert v-else title="不支持操作剪切板" type="error" />
      </div>
      <div>当前剪切板: {{ text }}</div>
      <div>
        <NInput v-model:value="source" class="mb-2" />
      </div>
      <div class="flex space-x-2">
        <NButton type="primary" @click="copyText">
          点击复制
        </NButton>
        <NButton @click="replaceText">
          点击更换文字
        </NButton>
      </div>
    </div>
  </Card>
</template>

<style scoped></style>

<route lang="yaml">
meta:
  i18n:
    en: Clipboard
    zh: 剪切板
</route>
