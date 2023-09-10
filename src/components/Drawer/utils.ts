import type { PropType } from 'vue'

export const props = {
  show: Boolean,
  loading: Boolean,
  closable: Boolean,
  title: {
    type: String,
    default: '',
  },
  placement: {
    type: String as PropType<'right' | 'left' | 'top' | 'bottom' | 'center' | ''>,
    default: '',
  },
  width: {
    type: String,
    default: '50vw',
  },
  height: {
    type: String,
    default: '60vh',
  },
}
