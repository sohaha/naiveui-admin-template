import {
  GridComponent,
  LegendComponent,
  TitleComponent,
  TooltipComponent,
} from 'echarts/components'

import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import type { PropType } from 'vue'
import Chart, { THEME_KEY } from 'vue-echarts'

use([
  CanvasRenderer,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
])

export default defineComponent({
  name: 'VEchart',
  props: {
    option: {
      type: Object as PropType<import('echarts/types/dist/shared').ECBasicOption>,
      required: true,
    },
  },
  setup({ option }) {
    const attrs = useAttrs()
    const { isDark } = useDarks()
    const theme = computed(() => {
      return isDark.value ? 'dark' : ''
    })

    provide(THEME_KEY, theme)

    return () => h(Chart, { autoresize: true, option, ...attrs })
  },
})
