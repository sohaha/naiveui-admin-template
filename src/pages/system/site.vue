<script lang="ts" setup>
import { NDynamicInput, NInput } from 'naive-ui'

const data = ref([])
useRequest(apiSetting, {
  onSuccess: (ref) => {
    data.value = ref.data || []
  },
})

function onCreate() {
  return {
    open: false,
    key: '',
    value: '',
  }
}

const { run } = useRequest(apiSettingUpdate, {
  manual: true,
  onSuccess: () => {
    window.$message.success('更新成功')
    apiSite()
  },
  onError: (err) => {
    window.$message.error(err.message || '更新失败')
  },
})

function onSubmit() {
  run(data.value)
}
</script>

<template>
  <Card>
    <NForm>
      <NFormItem label="">
        <NDynamicInput v-model:value="data" :on-create="onCreate">
          <template #default="{ value }">
            <div class="flex space-x-2 w-full items-center ">
              <NSwitch
                v-model:value="value.open"
                :round="false"
                size="large"
              >
                <template #checked>
                  公开
                </template>
                <template #unchecked>
                  私有
                </template>
              </NSwitch>
              <NInput v-model:value="value.key" placeholder="参数名" class="flex-1" type="text" />
              <NInput v-model:value="value.value" placeholder="参数值" class="flex-1" type="text" />
            </div>
          </template>
        </NDynamicInput>
      </NFormItem>
      <NFormItem class="flex justify-center space-x-5 w-full">
        <NButton type="primary" @click="onSubmit">
          提 交
        </NButton>
      </NFormItem>
    </NForm>
  </Card>
</template>

<style scoped>
:deep(.n-button-group .n-button){
--n-border-radius:var(--g-border-radius) !important
}
</style>

<route lang="json">
{
  "meta": {
    "title": "站点设置"
  }
}
</route>
