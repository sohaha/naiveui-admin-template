<script lang="ts">
import Card from './Card'

export default {
  name: 'ZCardCols',
  setup(_: any, ctx: any) {
    return () => {
      const s = ctx.slots?.default()
      if (!s)
        return h('div')

      const slots = flatten(s).map((v: any) => {
        if (v?.type?.name?.indexOf('Z') === 0 || v?.type?.name === 'TransitionGroup')
          return v

        return h(
          Card as any,
          {

          },
          {
            default: () => v,
          },
        )
      })
      return h('div', { class: 'grid-row auto-cols-min' }, [...slots])
    }
  },
}
</script>
