import type { StMenu } from '@/types/global'

export default <StMenu[]>[
  {
    type: 'divider',
  },
  {
    title: '系统管理',
    i18n: {
      en: 'System',
    },
    icon: 'i-bx:wrench',
    path: 'system',
    children: [
      {
        icon: 'i-bx:user',
        path: '/system/user',
      },
      {
        icon: 'i-bx-id-card',
        path: '/system/role',
      },
      {
        icon: 'i-bx-food-menu',
        path: '/system/menu',
      },
      {
        icon: 'i-bx-objects-horizontal-left',
        path: '/system/site',
      },
    ],
  },
] as StMenu[]
