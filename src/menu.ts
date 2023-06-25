import type { StMenu } from './types/global'
import system from '@/pages/system/menu'
import model from '@/pages/model/menu'

export default <StMenu[]>[
  {
    icon: 'i-bx:home',
    path: '/',
  },
  ...model,
  ...system,
]
