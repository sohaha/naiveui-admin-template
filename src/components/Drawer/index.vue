<script lang="ts">
import { NDrawer, NDrawerContent, NSpin } from 'naive-ui'
import type { PropType } from 'vue'

export default defineComponent({
  inheritAttrs: false,
  props: {
    show: Boolean,
    loading: Boolean,
    title: {
      type: String,
      default: '',
    },
    placement: {
      type: String as PropType<'right' | 'left' | 'top' | 'bottom'>,
      default: 'right',
    },
    closable: Boolean,
  },
  setup(props, { slots }) {
    const attrs = useAttrs()
    const state = stateStore()
    const drawerProps = computed(() => {
      return {
        // to: '#global-drawer-target',
        placement: props.placement,
        width: state.isSmallScreen ? 320 : '50vw',
        nativeScrollbar: true,
        maskClosable: false,
        ...attrs,
      } as unknown
    })

    const showDrawer = useVModel(props, 'show')
    return () =>
      h(
        NDrawer,
        {
          show: showDrawer.value,
          ...(drawerProps.value as any),
        },
        {
          default: () => {
            const children: Record<string, any> = {
              default: () =>
                h(
                  NSpin,
                  {
                    show: props.loading,
                  },
                  {
                    default: () => (slots.default ? slots.default() : []),
                  },
                ),
            }
            if (slots.footer)
              children.footer = slots.footer

            return h(
              NDrawerContent,
              {
                nativeScrollbar: false,
                closable: props.closable,
                title: props.title,
              },
              children,
            )
          },
        },
      )
  },
})
</script>
