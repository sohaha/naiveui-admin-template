import { NForm, NGrid, NSpin } from 'naive-ui'
import { computed, defineComponent, h, isRef, ref, toRef, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { formBtns, formItem } from './render'
import { props } from './utils'
import { useValues } from './values'

export default defineComponent({
  name: 'DataForm',
  props,
  emits: ['submit'],
  setup(props, { emit }) {
    const { grid, submitBtn, resetBtn, ...options } = props.options

    const { locale } = useI18n()
    const message = computed(() =>
      locale.value === 'zh' ? '必填项' : 'Required',
    )
    const model = ref<any>({})
    const rules = ref<any>({})
    const formProps: any = {
      ref: props.formRef,
      labelPlacement: 'left',
      size: 'small',
      ...options,
    }
    if (!isRef(formProps.ref))
      formProps.ref = ref(null)

    const items = ref()
    const formItems = toRef(props, 'items')
    const keys = computed(() => Object.keys(formItems.value))

    watch(() => keys.value, reRender)

    function reRender() {
      items.value = createItems()
    }

    const { rawValues, getValues, setValues, isNew } = useValues(model)

    function createItems() {
      const isGrid = typeof grid !== 'undefined'
      const items = keys.value.map((key: string) => {
        const v = formItems.value[key]
        if (typeof model.value[key] === 'undefined') {
          model.value[key]
            = typeof v.defaultValue !== 'undefined' ? v.defaultValue : null
        }
        if (v.validator)
          rules.value[key] = v.validator
        if (v.required && !v.validator) {
          const nRule = {
            trigger: ['input', 'blur', 'change'],
            required: true,
            message: message.value,
            validator: (_r: any, v: any) => {
              const valueOf = typeof v
              switch (valueOf) {
                case 'number':
                  return true
                case 'object':
                  return v
                    ? (Array.isArray(v) ? v : Object.keys(v)).length > 0
                    : false
                default:
                  return valueOf !== 'boolean' ? !!v : true
              }
            },
          }
          rules.value[key] = [nRule]
        }

        return formItem(key, v, model, isGrid, isNew, (n: any) => {
          model.value[key] = n
        })
      })

      if (submitBtn) {
        items.push(
          formBtns(
            {
              submit: [submitBtn, submit],
              reset: [resetBtn, reset],
            },
            isGrid,
          ),
        )
      }

      return isGrid
        ? h(
          NGrid,
          {
            responsive: 'screen',
            cols: 'xs:1 s:2 m:3 l:3 xl:4 2xl:4',
            xGap: 20,
            ...grid,
          },
          { default: () => items },
        )
        : items
    }
    items.value = createItems()

    function submit() {
      formProps.ref.value
        .validate()
        .then(() => {
          emit('submit', getValues())
        })
        .catch(() => {})
    }
    function reset() {
      formProps.ref.value.restoreValidation()
      setValues(rawValues.value)
    }

    watch(
      () => items.value,
      () => {
        const newModel: Record<string, any> = {}
        const newRules: Record<string, any> = {}
        for (const key of keys.value) {
          if (Object.prototype.hasOwnProperty.call(model.value, key))
            newModel[key] = model.value[key]

          if (Object.prototype.hasOwnProperty.call(rules.value, key))
            newRules[key] = rules.value[key]
        }
        model.value = newModel
        rules.value = newRules
      },
    )

    return {
      reRender,
      formProps,
      items,
      rules,
      getValues,
      setValues,
      model,
      submit,
      reset,
    }
  },
  render() {
    return h(
      NSpin,
      {
        show: this.loading,
      },
      {
        default: () => {
          return h(
            NForm,
            { ...this.formProps, rules: this.rules, model: this.model },
            {
              default: () => this.items,
            },
          )
        },
      },
    )
  },
})

