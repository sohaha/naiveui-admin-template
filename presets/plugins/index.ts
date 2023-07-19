import { resolve } from 'path'
import I18n from '@intlify/unplugin-vue-i18n/vite'
import htmlMinimize from '@sergeymakinen/vite-plugin-html-minimize'
import Vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import { AyyComponentResolver } from 'ayyui'
import Unocss from 'unocss/vite'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import Compression from 'vite-plugin-compression'
import Pages from 'vite-plugin-pages'
import ViteRestart from 'vite-plugin-restart'
import Layouts from 'vite-plugin-vue-meta-layouts'
import { visualizer } from 'rollup-plugin-visualizer'
// import Markdown, { markdownWrapperClasses } from './markdown'

import {
  AntDesignVueResolver,
  ArcoResolver,
  DevUiResolver,
  ElementPlusResolver,
  HeadlessUiResolver,
  IduxResolver,
  InklineResolver,
  LayuiVueResolver,
  NaiveUiResolver,
  PrimeVueResolver,
  QuasarResolver,
  TDesignResolver,
  VantResolver,
  VarletUIResolver,
  ViewUiResolver, VueUseComponentsResolver, Vuetify3Resolver,
} from 'unplugin-vue-components/resolvers'
import type { ComponentResolver } from 'unplugin-vue-components/types'
import { env } from '../shared/env'
import { AutoImportResolvers, normalizeResolvers } from '../shared/resolvers'
import { ESLintPlugin } from './eslint'
import H5Plugins from './h5'
import { GenerateTitle } from './html'
import { LegacyPlugin } from './legacy'
import { MockPlugin } from './mock'
import { DevPlugins } from './dev'
import { RemovelogPlugin } from './removelog'
import { PWAPlugin } from './pwa'

export default () => {
  return [
    GenerateTitle(),
    Vue({
      include: [/\.vue$/, /\.md$/],
    }),
    ...DevPlugins(),
    visualizer({ open: false }),
    Pages({
      extensions: ['vue', 'tsx'],
      importMode(filepath) {
        if (filepath === '/src/pages/reload.vue' || filepath.includes('pre'))
          return 'sync'

        return 'async'
      },
      exclude: (() => {
        const exclude = ['**/components/**', '**/layouts/**']

        if (env.IS_PROD && !env.VITE_APP_MOCK_IN_PRODUCTION)
          exclude.push('**/example/**')

        return exclude
      })(),
    }),
    Layouts({
      defaultLayout: 'Home',
    }),
    PWAPlugin(),
    Unocss(),
    MockPlugin(),
    Components({
      dirs: ['src/components'],
      extensions: ['vue', 'md', 'tsx'],
      // include: [/\.md$/, /\.vue$/, /\.tsx$/],
      dts: resolve(__dirname, '../../src/types/components.d.ts'),
      directoryAsNamespace: true,
      types: [
        {
          from: 'vue-router',
          names: ['RouterLink', 'RouterView'],
        },
      ],
      importPathTransform(path) {
        return path.replace(/.tsx$/, '')
      },
      resolvers: normalizeResolvers({
        onlyExist: [
          [VantResolver(), 'vant'],
          [QuasarResolver(), 'quasar'],
          [DevUiResolver(), 'vue-devui'],
          [NaiveUiResolver(), 'naive-ui'],
          [Vuetify3Resolver(), 'vuetify'],
          [PrimeVueResolver(), 'primevue'],
          [ViewUiResolver(), 'view-design'],
          [LayuiVueResolver(), 'layui-vue'],
          [VarletUIResolver(), '@varlet/ui'],
          [IduxResolver(), '@idux/components'],
          [TDesignResolver(), 'tdesign-vue-next'],
          [InklineResolver(), '@inkline/inkline'],
          [ElementPlusResolver(), 'element-plus'],
          [HeadlessUiResolver(), '@headlessui/vue'],
          [ArcoResolver(), '@arco-design/web-vue'],
          [AntDesignVueResolver(), 'ant-design-vue'],
          [VueUseComponentsResolver(), '@vueuse/components'],
        ],
        include: [AyyComponentResolver()],
      }) as ComponentResolver[],
    }),
    !env.VITE_APP_DISABLED_API_AUTO_IMPORT
    && AutoImport({
      dirs: [
        !env.VITE_APP_DISABLED_API_AUTO_IMPORT && 'src/stores',
        !env.VITE_APP_DISABLED_API_AUTO_IMPORT && 'src/composables',
        !env.VITE_APP_DISABLED_API_AUTO_IMPORT && 'src/apis',
        !env.VITE_APP_DISABLED_API_AUTO_IMPORT && 'src/utils',
      ],
      dts: resolve(__dirname, '../../src/types/auto-imports.d.ts'),
      imports: normalizeResolvers({
        onlyExist: [
          [
            {
              'naive-ui': ['useMessage'],
            } as any,
            'naive-ui',
          ],
        ],
        include: [
          'vue',
          'pinia',
          'vue-i18n',
          'vue-router',
          '@vueuse/core',
          {
            'vue-use-api': ['useRequest'],
          },
          {
            "@sohaha/zlog": ['log', 'field']
          }
        ],
      }) as any,
      resolvers: AutoImportResolvers,
      eslintrc: {
        enabled: true,
        globalsPropValue: true,
        filepath: 'presets/eslint/.eslintrc-auto-import.json',
      },
    }),
    I18n({
      runtimeOnly: true,
      compositionOnly: true,
      include: [resolve(__dirname, '../../locales/**')],
    }),
    ViteRestart({
      restart: ['.env*', 'presets/plugins/index.[jt]s', 'presets/shared/**/*', 'src/utils/*.[jt]s', 'src/composables/*.[jt]s'],
    }),
    vueJsx(),
    ESLintPlugin(),
    LegacyPlugin(),
    RemovelogPlugin(),
    Compression({
      // @ts-expect-error
      algorithm: env.VITE_APP_COMPRESSINON_ALGORITHM,
      disable: !env.VITE_APP_COMPRESSINON_ALGORITHM,
    }),
    htmlMinimize({
      filter: /\.x?html?$/,
    }),
    ...H5Plugins(),
  ]
}
