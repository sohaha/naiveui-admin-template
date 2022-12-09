import { NSpin } from 'naive-ui'
import { h } from 'vue'
import Card from '@/components/Card'

export default defineComponent({
  setup(_props) {
    // const { t } = useI18n()
    return () => h(NSpin,
      {
        size: 'small',
        rotate: false,
      },
      {
        default: () => h(Card, {
          height: true,
        }, ''),
        // description: () => h('span', t('loading_page')),
        // icon: () => h(NIcon, { class: 'i-bx:dots-horizontal' }),
      })
  },
})
