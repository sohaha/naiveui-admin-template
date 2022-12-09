import ayyui from 'ayyui'
import 'ayyui/dist/style.css'
import type { App } from 'vue'

export default (app: App) => {
  app.use(ayyui as any)
}
