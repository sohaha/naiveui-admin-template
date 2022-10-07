<script lang="ts" setup>
const { config, setOptions, setItems, getValues, setValues, setItem }
  = useDataForm()

setTimeout(() => {
  // 延迟设置值
  setValues({
    ...getValues(),
    slider: 10,
    name: '新名字',
  })
  console.log('延迟设置值')
}, 3000)

// 设置表单
setItems({
  name: {
    label: '姓名',
    component: 'NInput',
    defaultValue: '佚名',
    placeholder: '输入提示',
    required: true,
  },
  cascader: {
    label: 'NCascader',
    component: 'NCascader',
    placeholder: '点击选择',
    required: true,
    options: [
      {
        label: '33',
        value: 33,
        children: [
          {
            label: '11',
            value: 11,
          },
          {
            label: '22',
            value: 22,
          },
        ],
      },
      {
        label: 'a11',
        value: 'a11',
      },
    ],
  },
  inputNumber: {
    label: 'NInputNumber',
    component: 'NInputNumber',
    required: true,
    validator: [
      {
        trigger: ['input', 'blur', 'change'],
        validator(_r, value) {
          if (!value)
            return Error('必须大于 0')
        },
      },
    ],
  },
  switch: {
    label: 'NSwitch',
    component: 'NSwitch',
    defaultValue: 1,
    props: {
      checkedValue: 1,
      uncheckedValue: 2,
      round: false,
    },
    slots: {
      checked: () => h('div', {}, '开启'),
      unchecked: () => '关闭',
    },
  },
  timePicker: {
    required: true,
    label: 'NTimePicker',
    component: 'NTimePicker',
    defaultValue: 50,
    props: {},
  },
  slider: {
    required: true,
    label: 'NSlider',
    component: 'NSlider',
    defaultValue: 50,
    props: {},
  },
  datePicker: {
    label: 'NDatePicker',
    component: 'NDatePicker',
    validator: [
      {
        required: true,
        trigger: ['change'],
        message: '请选择时间',
        validator(_r, v): boolean {
          if (!v)
            return false

          return true
        },
      },
    ],
    props: {
      format: 'yyyy/MM/dd || HH:mm',
      clearable: true,
    },
  },
  radioGroup: {
    required: true,
    label: 'NRadioGroup',
    component: 'NRadioGroup',
    options: [
      {
        label: '选项一',
        value: 0,
      },
      {
        label: '选项二',
        value: 1,
      },
    ],
  },
  radioButtonGroup: {
    required: true,
    label: 'NRadioButtonGroup',
    component: 'NRadioButtonGroup',
    defaultValue: 1,
    options: [
      {
        label: '选项一',
        value: 0,
      },
      {
        label: '选项二',
        value: 1,
      },
    ],
  },
  checkboxGroup: {
    label: 'NCheckboxGroup',
    component: 'NCheckboxGroup',
    defaultValue: [1],
    options: [
      {
        label: '选项一',
        value: 0,
      },
      {
        label: '选项二',
        value: 1,
      },
    ],
  },
  select: {
    label: 'NSelect',
    component: 'NSelect',
    defaultValue: ['9', '1', '3'],
    options: [
      {
        label: '普通',
        value: '0',
      },
      {
        label: '紧急',
        value: '1',
      },
      {
        label: '禁止',
        value: '9',
        disabled: true,
      },
    ],
    props: {
      clearable: true,
      multiple: true,
    },
  },
  dynamicInput: {
    required: true,
    label: 'NDynamicInput',
    component: 'NDynamicInput',
    props: {
      preset: 'pair',
    },
  },
})

// 表单属性
setOptions({
  labelPlacement: 'top',
  labelWidth: '130',
  grid: {
    xGap: 10,
  },
})

function submit(v: Object) {
  console.log('验证通过', v)
}

function add() {
  const key = String(+new Date())
  setItem(key, {
    label: key,
    required: true,
    component: 'NInput',
  })
}
</script>

<template>
  <CardRows>
    <Card>
      <DataForm v-bind="config" @submit="submit" />
    </Card>
    <Card>
      <NButton @click="add">
        添加输入框
      </NButton>
    </Card>
  </CardRows>
</template>

<route lang="json">
{
  "meta": {
    "title": "动态表单",
    "i18n": {
      "en":"DynamicForm"
    }
  }
}
</route>
