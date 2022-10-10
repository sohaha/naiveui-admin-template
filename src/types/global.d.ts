import type { FormInst } from 'naive-ui'
import type { Ref } from 'vue'
import type { Router } from 'vue-router'

import type { DialogApiInjection } from 'naive-ui/lib/dialog/src/DialogProvider'
import type { MessageApiInjection } from 'naive-ui/lib/message/src/MessageProvider'
import type { NotificationApiInjection } from 'naive-ui/lib/notification/src/NotificationProvider'

declare global {
  interface Window {
    $state: any
    $loading: any
    $router: Router
    $getLocale: any
    $dialog: DialogApiInjection
    $message: MessageApiInjection
    $notification: NotificationApiInjection
  }
}

export { }

export interface InstApi {
  code: number
  msg: string
  data: any
}

export interface StMenu {
  path : string
  i18n?: boolean | {[key: string]: string}
  show?: boolean
  title?: string
  icon ?: string
  url ?: string
  children?: StMenu[]
}

export type RefFormInst = Ref<(HTMLElement & FormInst) | null>
