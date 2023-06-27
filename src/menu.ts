import type { StMenu } from './types/global'
// import system from '@/pages/system/menu'
import sh from '@/pages/sh/menu'

export default <StMenu[]>[
  {
    icon: 'i-bx:home',
    path: '/',
  },
  ...sh,
  // ...system,
]
