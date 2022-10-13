
/// <reference types="vite/client" />
/// <reference types="vite-plugin-pages/client" />
/// <reference types="vite-plugin-use-modules/client" />
/// <reference types="unplugin-vue-macros/macros-global" />
/// <reference types="vite-plugin-vue-meta-layouts/client" />
/// <reference types="@intlify/vite-plugin-vue-i18n/client" />

declare module '*.vue' {
	import type { DefineComponent } from 'vue'
	const component: DefineComponent<{}, {}, any>
	export default component
}

declare module '*.md' {
	import { ComponentOptions } from 'vue'
	const Component: ComponentOptions
	export default Component
}


interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string
  readonly VITE_DEV_PROXY: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
