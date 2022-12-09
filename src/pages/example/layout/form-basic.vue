<script lang="ts" setup>
import { NIcon, useMessage } from 'naive-ui'

const { config, setItems, setOptions, setValue } = useDataForm()

setOptions({
  labelWidth: 100,
})
setItems({
  name: {
    component: 'NInput',
    defaultValue: '佚名',
    required: true,
    labelRender: () =>
      h('span', [
        '姓名',
        renderTooltip(
          h(NIcon, {
            class: 'pl-1 i-bx:error-circle',
            size: 12,
          }),
          '这是一个提示',
        ),
      ]),
  },
  age: {
    component: 'NInputNumber',
    label: '年龄',
    validator: {
      required: true,
      validator(rule: Object, value: string) {
        console.log('值', value)

        if (value === null)
          // 同步验证
          return new Error('需要年龄')

        // 异步验证
        return new Promise((resolve, reject) => {
          if (Number(value) < 18)
            reject(Error('年龄应该超过十八岁'))
          else if (!/^\d*$/.test(value))
            reject(Error('年龄应该为整数'))
          else resolve()
        })
      },
      trigger: ['input', 'blur', 'change'],
    },
  },
  password: {
    component: 'NInput',
    label: '密码',
    props: {
      type: 'password',
    },
    validator: [
      {
        required: true,
        message: '请输入密码',
      },
    ],
  },
  birthday: {
    label: '生日',
    component: 'NDatePicker',
    props: {
      'type': 'datetime',
      'value-format': 'yyyy.MM.dd HH:mm:ss',
    },

  },
})

setTimeout(() => {
  // 延时设置生日
  setValue('birthday', +new Date())
}, 1000)

const message = useMessage()

function submit(values: any) {
  message.success('提交成功')
  console.log(values)
}
</script>

<template>
  <Card
    title="表单"
    subtitle="这是一个表单示例"
  >
    <DataForm
      v-bind="config"
      @submit="submit"
    />
  </Card>
</template>

<style scoped></style>

<route lang="json">
{
  "meta": {
    "i18n": {
      "en": "Form",
      "zh": "表单布局"
    }
  }
}
</route>

<i18n lang="json">
{}
</i18n>
