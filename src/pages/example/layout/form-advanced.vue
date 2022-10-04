<script lang="ts" setup>
const { validate, config, setOptions, setItems, reset } = useDataForm()

setItems({
  name: {
    label: '姓名',
    component: 'NInput',
    defaultValue: '佚名',
    placeholder: '输入提示',
    required: true,
  },
  password: {
    label: '密码',
    component: 'NInput',
    props: {
      type: 'password',
    },
    required: true,
  },
})

setOptions({
  submitBtn: '',
  labelPlacement: 'top',
})

const {
  validate: validate2,
  config: config2,
  reset: reset2,
  setOptions: setOptions2,
  setItems: setItems2,
} = useDataForm()

setItems2({
  sex: {
    label: '性别',
    component: 'NRadioButtonGroup',
    defaultValue: '0',
    options: [
      { value: '0', label: '保密' },
      { value: '1', label: '男' },
      { value: '2', label: '女' },
    ],
  },
  age: {
    label: '年龄',
    component: 'NInputNumber',
    required: true,
  },
  remark: {
    label: '备注',
    component: 'NInput',
    props: {
      type: 'textarea',
      autosize: {
        minRows: 3,
      },
    },
  },
  other: {
    label: '其他信息',
    component: 'NDynamicInput',
    defaultValue: [
      { key: '省份', value: 'Demo' },
      { key: '地址', value: 'Demo' },
    ],
    props: {
      preset: 'pair',
    },
  },
})

setOptions2({
  submitBtn: '',
  labelPlacement: 'top',
})

function resetForm() {
  reset()
  reset2()
}

function submit() {
  Promise.all([validate(), validate2()])
    .then(([v1, v2]: any) => {
      const v = { ...v1, ...v2 }
      console.log('值:', v)
    })
    .catch((err) => {
      console.log(err)
    })
}
</script>

<template>
  <CardRows>
    <Card title="基础信息">
      <DataForm v-bind="config" />
    </Card>

    <Card title="扩展信息">
      <DataForm v-bind="config2" />
    </Card>

    <Card size="small" class="inset-x-0 w-auto bottom-0 sticky z-1 border">
      <div class="flex justify-center space-x-4">
        <NButton @click="resetForm">
          重 置
        </NButton>
        <NButton type="primary" @click="submit">
          验 证
        </NButton>
      </div>
    </Card>
  </CardRows>
</template>

<route lang="json">
{
  "meta": {
    "title": "高级表单"
  }
}
</route>
