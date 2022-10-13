import type { StMenu } from './types/global'
import system from '@/pages/system/menu'

export default <StMenu[]>[
  {
    icon: 'i-bx:home',
    path: '/',
  },
  ...system,
]
