<script setup lang="ts">
import { useDialog, useLoadingBar, useMessage, useNotification } from 'naive-ui'
const { t } = useI18n()
window.$router = useRouter()
window.$getLocale = t
window.$state = stateStore()
window.$loading = useLoadingBar()
window.$dialog = useDialog()
window.$message = useMessage()
window.$notification = useNotification()
</script>

<template>
  <div />
</template>
