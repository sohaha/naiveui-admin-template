import type { App } from 'vue'
import directives from './directives'
import handler from './handler'
import i18n from './i18n'
import pinia from './pinia'
import router from './router'
import other from './other'

export default (app: App) => {
  pinia(app)
  router(app)
  handler(app)
  directives(app)
  i18n(app)
  other(app)
}
