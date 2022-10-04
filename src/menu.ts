import type { StMenu } from './types/global'
import system from '@/pages/system/menu'

export default [
  {
    icon: 'i-bx:home',
    path: '/',
  },
  ...system,
] as StMenu[]
