import { NCard } from 'naive-ui'
import { h } from 'vue'

export default defineComponent({
  name: 'ZCard',
  props: {
    height: {
      type: [Boolean, Number, String],
      default: false,
    },
    contentClass: {
      type: String,
      default: '',
    },
    contentStyle: {
      type: String,
      default: '',
    },
    padding: {
      type: [Number, String],
      default: '',
    },
  },
  setup(props: { height: any; padding: Number | String;contentStyle: string }, ctx: any) {
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

    const contentStyle = computed(() => {
      return `${(props.padding !== '' && `padding:${props.padding};`) + props.contentStyle};overflow: auto;`
    })

    return () => {
      const slots: { [key: string]: Function } = {}
      return h(
        NCard,
        { ...ctx.attrs, contentStyle: contentStyle.value, style: cardStyle.value },
        { ...slots, ...ctx.slots },
      )
    }
  },
})
