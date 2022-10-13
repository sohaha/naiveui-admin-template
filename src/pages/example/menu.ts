import type { StMenu } from '@/types/global'

export const locales = {
  en: {
    readme: 'Readme',
  },
  zh: {
    readme: '说明文档',
  },
}

export default <StMenu[]>[
  {
    icon: 'i-bx:slideshow',
    i18n: {
      en: 'Example',
      zh: '示例页面',
    },
    path: '/example',
    children: [
      {
        show: true,
        path: '/example/readme',
      },
      {
        icon: 'i-bx:layout',
        i18n: {
          en: 'Layout',
          zh: '布局页面',
        },
        path: '/example/layout',
        children: [
          {
            icon: 'i-bx:dock-top',
            path: '/example/layout/basic',
          },
          {
            icon: 'i-bx:columns',
            path: '/example/layout/multi-column',
          },
          { icon: 'i-bx:list-ol', path: '/example/layout/table' },
          {
            icon: 'i-bx:table',
            path: '/example/layout/table-form',
            i18n: {
              en: 'FunctionTable',
              zh: '功能表格',
            },
            children: [
              { path: '/example/layout/table-form/1' },
              { path: '/example/layout/table-form/2' },
              { path: '/example/layout/table-form/3' },
            ],
          },
          {
            icon: 'i-bx:pencil',
            path: '/example/layout/form-basic',
          },
          {
            icon: 'i-bx:paint',
            path: '/example/layout/form-advanced',
          },
          {
            icon: 'i-bx:bxs-edit-alt',
            path: '/example/layout/form-dynamic',
          },
        ],
      },
      {
        icon: 'i-bx:bxs-customize',
        path: '/example/function',
        i18n: {
          en: 'Function',
          zh: '功能示例',
        },
        children: [
          {
            icon: 'i-bx:log-out',
            path: '/example/function/not-keep',
          },
          {
            icon: 'i-bx:clipboard',
            path: '/example/function/clipboard',
          },
          {
            icon: 'i-bx-world',
            path: '/example/function/locale',
          },
          {
            icon: 'i-bx:comment-dots',
            path: '/example/function/notice',
          },
          {
            icon: 'i-bx:bar-chart-alt-2',
            path: '/example/function/echart',
          },
          {
            path: '/example/function/fullscreen',
            icon: 'i-bx:fullscreen',
          },
          {
            icon: 'i-bx:bxs-file-md',
            path: '/example/function/markdown',
          },
        ],
      },
      {
        icon: 'i-bx:bxl-github',
        title: '外部链接',
        path: '',
        url: 'https://github.com/sohaha',
      },
    ],
  },
]
