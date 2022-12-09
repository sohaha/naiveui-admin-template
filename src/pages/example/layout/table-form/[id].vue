<script lang="ts" setup>
import { useForm } from './form'

const { params } = useRoute()

const multiWindow = multiWindowStore()

multiWindow.currentWindow!.rename(`详情 ID:${params.id}`)

const { config: formConfig, reset, setOptions, validate } = useForm()

setOptions({
  submitBtn: '',
  labelPlacement: 'top',
})

async function submit() {
  try {
    console.log(await validate())
  }
  catch (err: unknown) {
    console.log('验证失败', err)
  }
}
</script>

<template>
  <CardRows>
    <Card title="详情页面">
      <DataForm v-bind="formConfig" />
    </Card>
    <Card size="small" class="inset-x-0 w-auto bottom-0 sticky z-1 border">
      <div class="flex justify-center space-x-4">
        <NButton secondary @click="reset">
          重 置
        </NButton>
        <NButton type="primary" @click="submit">
          验 证
        </NButton>
      </div>
    </Card>
  </CardRows>
</template>

<style scoped>

</style>

<route lang="json">
{
  "meta": {
    "i18n": {
      "en": "Details",
      "zh": "详情页面"
    }
  }
}
</route>

<i18n lang="json">
{}
</i18n>
