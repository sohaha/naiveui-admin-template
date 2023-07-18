import ayyui from 'ayyui'
import 'ayyui/dist/style.css'
import type { App } from 'vue'
import { Level } from '@sohaha/zlog'

export default (app: App) => {
  if (import.meta.env.DEV)
    log.level = Level.Trace
  else
    log.level = Level.Warn

  app.use(ayyui as any)
}
