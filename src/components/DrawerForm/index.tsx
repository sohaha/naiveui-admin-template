import { NButton } from 'naive-ui'
import DataForm from '@/components/DataForm/index'
import { props } from '@/components/DataForm/utils'
import Drawer from '@/components/Drawer/index.vue'
export { useDataForm } from '@/components/DataForm/utils'

export default defineComponent({
  inheritAttrs: false,
  props: {
    ...props,
    show: Boolean,
    submitBtn: {
      type: String,
      default: '提 交',
    },
  },
  emits: ['submit', 'update:show'],
  setup(props, { slots, emit }) {
    const attrs = useAttrs()
    const showDrawer = useVModel(props, 'show')

    const { submitBtn, ...dprops } = props
    const options: any = {
      size: 'medium',
      class: 'px-8',
    }

    // if (!slots.default) {
    //     throw Error('slot cannot be empty')
    // }

    const loading = toRef(props, 'loading')
    const dopt = toRef(props, 'options')
    const formRef = ref<any>()

    return () =>
      h(
        Drawer,
        {
          ...attrs,
          'show': showDrawer.value,
          'onUpdate:show': (b: boolean) => {
            showDrawer.value = b
          },
        },
        {
          ...slots,
          default: () => {
            let s: any = DataForm
            let options: any = {
              ref: formRef,
              onSubmit(v: Object) {
                emit('submit', v)
              },
              options: { ...dopt.value, submitBtn: '' },
            }

            const defSlots = flatten(slots.default ? slots.default() : [])
            if (defSlots.length > 0) {
              s = defSlots[0]
            }
            else {
              options = {
                ...dprops,
                loading: loading.value,
                ref: formRef,
                ...options,
              }
            }
            return h(s, options)
          },
          footer: () =>
            h(
              'div',
              {
                class: 'flex justify-center justify-around space-x-4 w-full',
              },
              [
                h(
                  NButton,
                  {
                    ...options,
                    onClick() {
                      showDrawer.value = false
                    },
                  },
                  {
                    default: () => '取 消',
                  },
                ),
                h(
                  NButton,
                  {
                    ...options,
                    disabled: loading.value,
                    type: 'primary',
                    onClick(e: Event) {
                      e.preventDefault()
                      if (loading.value)
                        return
                      formRef.value.submit()
                    },
                  },
                  {
                    default: () => submitBtn,
                  },
                ),
              ],
            ),
        },
      )
  },
})
