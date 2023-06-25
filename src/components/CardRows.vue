<script lang="ts">
import Card from './Card'

export default {
  name: 'ZCardRows',
  props: {
    height: {
      type: [Boolean, Number, String],
      default: false,
    },
  },
  setup(props: any, ctx: any) {
    const state = stateStore()
    const cardStyle = computed(() => {
      const h = props.height
      let height
      if (!h) {
        height = 'auto'
      }
      else if (h === true) {
        height = `${state.getPageContentHeight}px`
      }
      else if (typeof h === 'string') {
        height = h
      }
      else if (typeof h === 'number') {
        if (h > 0)
          height = `${h}px`
        else height = `${state.getPageContentHeight + h}px`
      }
      else {
        height = h
      }

      return { height }
    })
    return () => {
      const s = ctx.slots?.default()
      if (!s)
        return h('div')

      const slots = flatten(s).map((v: any) => {
        if (v?.type?.name?.indexOf('Z') === 0)
          return v

        return h(
          Card as any,
          {},
          {
            default: () => v,
          },
        )
      })
      return h('div', { class: 'space-y-3', style: cardStyle.value }, [...slots])
    }
  },
}
</script>
