import ayyui from 'ayyui'
import 'ayyui/dist/style.css'
import type { App } from 'vue'
import zlog, { Level } from '@sohaha/zlog'

export default (app: App) => {
  if (import.meta.env.DEV)
    zlog.level = Level.Trace
  else
    zlog.level = Level.Warn

  app.use(ayyui as any)
}
