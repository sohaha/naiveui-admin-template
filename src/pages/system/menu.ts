import type { StMenu } from '@/types/global'

export default <StMenu[]>[
  {
    title: '系统管理',
    i18n: {
      en: 'System',
    },
    icon: 'i-bx:wrench',
    path: 'system',
    children: [
      {
        icon: 'i-bx:bxs-user-detail',
        path: '/system/user',
      },
      {
        path: '/system/role',
      },
    ],
  },

] as StMenu[]
