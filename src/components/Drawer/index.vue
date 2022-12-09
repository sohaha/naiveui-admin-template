<script lang="ts">
import { NCard, NDrawer, NDrawerContent, NModal, NScrollbar, NSpin } from 'naive-ui'
import { props } from './utils'

export default defineComponent({
  inheritAttrs: false,
  props: {
    ...props,
    bodyStyle: String,
  },
  setup(props, { slots }) {
    const attrs = useAttrs()
    const state = stateStore()
    const isCenter = computed(() => props.placement === 'center')

    const drawerProps = computed<{ [key: string]: any }>(() => {
      let centerProps = {

      }
      if (isCenter.value) {
        centerProps = {
          placement: 'top',
          preset: 'card',
          closable: props.closable,
          segmented: true,
          size: 'small',
          contentStyle: 'height:100%;overflow:auto;padding:0;',
          transformOrigin: 'center',
          style: `width:${state.isSmallScreen ? '320px' : props.width};height:${props.height};${props.bodyStyle}`,
          title: props.title,
        }
      }

      return {
        // to: '#global-drawer-target',
        placement: props.placement,
        defaultHeight: props.height,
        defaultWidth: props.width,
        nativeScrollbar: true,
        maskClosable: false,
        ...attrs,
        ...(state.isSmallScreen ? { width: '320px', resizable: false } : {}),
        ...centerProps,
      }
    })

    const showDrawer = useVModel(props, 'show')

    const children: Record<string, any> = {
      default: () =>
        h(
          NSpin,
          {
            show: props.loading,
            class: `h-full ${isCenter.value ? ' is-center' : ''}`,
          },
          {
            default: () => {
              const s = (slots.default ? slots.default() : [])
              if (isCenter.value) {
                return h(NScrollbar, {
                  class: 'h-full px-[var(--n-padding-left)]',
                  style: {
                    maxHeight: '100%',
                  },
                }, {
                  default: () => h('div', { class: 'py-[var(--n-padding-left)]' }, s),
                })
              }
              return s
            },
          },
        ),
    }
    if (slots.footer)
      children.footer = slots.footer

    const childrenSlots = {
      default: () => {
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
    }

    return () => {
      return h(
        isCenter.value ? NModal : NDrawer,
        {
          show: showDrawer.value,
          ...(drawerProps.value as any),
        }, isCenter.value ? children : childrenSlots,
      )
    }
  },
})
</script>

<style scoped>
.is-center :deep(.n-spin-content){
  height: 100%;
}
</style>
