import type { FormInst } from 'naive-ui'
import type { Ref } from 'vue'
import type { Router } from 'vue-router'

import type { Components } from 'src/components/DataForm/render.ts'
import type { TableColumn as column } from 'naive-ui/lib/data-table/src/interface'
import type { DialogApiInjection } from 'naive-ui/lib/dialog/src/DialogProvider'
import type { MessageApiInjection } from 'naive-ui/lib/message/src/MessageProvider'
import type { NotificationApiInjection } from 'naive-ui/lib/notification/src/NotificationProvider'

declare global {
  interface Window {
    Vue: any
    $state: any
    $loading: any
    $router: Router
    $getLocale: any
    $dialog: DialogApiInjection
    $message: MessageApiInjection
    $notification: NotificationApiInjection
  }
  type mapAny = { [key: string]: any }
}

export { }

export interface InstApi {
  code: number
  msg?: string
  data?: any
}

export interface StMenu {
  type?: string
  path: string
  i18n?: boolean | { [key: string]: string }
  show?: boolean
  title?: string
  icon?: string
  url?: string
  redirect?: string
  children?: StMenu[]
}

export type RefFormInst = Ref<(HTMLElement & FormInst) | null>


export type TableColumn = column & {
  editableUpdate?: function(any, any, number): void;
}
