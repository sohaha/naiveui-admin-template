import type { NForm } from 'naive-ui'
import type { PropType } from 'vue'
import type { DynamicFormProps, FormItemProps } from './render'

export function useDataForm(o?: DynamicFormProps) {
  const formRef = ref<typeof NForm | null>(null)
  const loading = ref(false)
  const options = ref<DynamicFormProps>({
    requireMarkPlacement: 'left',
    submitBtn: '提 交',
    resetBtn: '重 置',
    ...(o || {}),
  })
  const items = ref<Record<string, FormItemProps>>({})
  const config = computed(() => {
    return {
      options: options.value,
      items: items.value,
      loading: loading.value,
      formRef,
    }
  })

  function getValues() {
    return { ...(formRef.value?.$parent.$parent?.getValues() || {}) }
  }
  function setValues(values: { [key: string]: any }) {
    const newValues: { [key: string]: any } = {}
    Object.keys(items.value).forEach((key) => {
      if (typeof values[key] !== 'undefined')
        newValues[key] = values[key]
    })
    nextTick(() => {
      formRef.value?.$parent.$parent?.setValues(newValues)
    })
  }
  return {
    config,
    setLoading(l: boolean) {
      loading.value = l
    },
    setOptions(o: DynamicFormProps) {
      options.value = { ...options.value, ...o }
    },
    setItems(i: Record<string, FormItemProps>) {
      items.value = i
    },
    setItem(key: string, f: FormItemProps | Object) {
      if (items.value[key]) {
        const { props } = items.value[key]
        const { props: newProps } = f as any
        f = { ...items.value[key], ...f, props: { ...props, ...newProps } }
      }
      items.value[key] = f as FormItemProps
      formRef.value?.$parent?.$parent?.reRender()
    },
    getValues,
    setValue: (key: string, value: any) => {
      setValues({ ...getValues(), [key]: value })
    },
    setValues,
    reset() {
      formRef.value?.$parent?.$parent?.reset()
    },
    validate() {
      return new Promise((resolve, reject) => {
        formRef.value
          ?.validate()
          .then(() => {
            resolve(getValues())
          })
          .catch((err: any) => {
            reject(err)
          })
      })
    },
    formRef,
  }
}

export const props = {
  items: {
    type: Object as PropType<Record<string, FormItemProps>>,
    require: true,
    default() {
      return []
    },
  },
  loading: Boolean,
  formRef: Object,
  options: {
    type: Object as PropType<DynamicFormProps>,
    default: () => ({}),
  },
}
