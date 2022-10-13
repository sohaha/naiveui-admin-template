<script lang="ts" setup>
const text = ref('This is example')

const html = ref('')
function htmlChanged(h: string) {
  console.log('html changed', html)
  html.value = h
}

function uploadImg(files: Array<File>, callBack: (urls: string[]) => void) {
  console.log('uploadImg', files)
  // 上传完成回调
  callBack(['https://avatars.githubusercontent.com/u/25154432?s=200&v=4'])
}
</script>

<template>
  <Card height>
    <div class="p2">
      文档：
      <NButton
        text
        tag="a"
        href="https://github.com/imzbf/md-editor-v3"
        target="_blank"
        type="primary"
        rel="noopener"
      >
        使用方式
      </NButton>
    </div>
    <MdEditor v-model="text" @html-changed="htmlChanged" @upload-img="uploadImg" />
    <div class="p2">
      {{ html }}
    </div>
  </Card>
</template>

<style scoped></style>

<route lang="json">
{ "meta": {"title": "Markdown" } }
</route>

