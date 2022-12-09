<script setup lang="ts">
const { setItems, setOptions, config: formConfig, setLoading } = useDataForm()

setOptions({
  labelWidth: 80,
})

setItems({
  name: {
    label: '用户名',
    component: 'NInput',
    required: true,
  },
  passwd: {
    label: '密码',
    component: 'NInput',
    required: true,
    props: {
      type: 'password',
    },
  },
})

const showDrawer = ref(false)

function submitForm(data: any) {
  console.log(data)

  setLoading(true)
  setTimeout(() => {
    setLoading(false)
  }, 2000)
}

const placement = ref('center')
</script>

<template>
  <Card class="flex">
    抽屉方向：
    <NRadioGroup v-model:value="placement" size="small">
      <NRadioButton
        v-for="(v, l) in { center: '居中', left: '左边', top: '上边', bottom: '下边', right: '右边' }"
        :key="l"
        :label="v"
        :value="l"
      />
    </NRadioGroup>
    <div class="mt-4">
      <NButton v-throttled:1000 type="success" size="small" @click="showDrawer = !showDrawer">
        <NIcon class="i-bx-windows" /> 点击显示
      </NButton>
    </div>
  </Card>

  <DrawerForm
    v-model:show="showDrawer"
    :close-on-esc="false"
    :closable="true"
    height="320px"
    :placement="placement as any"
    v-bind="formConfig"
    title="表单名称"
    @submit="submitForm"
  />
</template>

<style scoped>

</style>

<route lang="json">
{
  "meta": {
    "title": "弹窗表单"
  }
}
</route>
