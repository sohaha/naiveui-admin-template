import type { App, ObjectDirective } from 'vue'

export default (app: App<Element>) => {
  app.directive('throttled', throttle())
}

function throttle(): ObjectDirective<any, any> {
  return {
    created: (el: HTMLElement, binding: any) => {
      let throttleTime = +binding.arg
      if (!throttleTime)
        throttleTime = 350

      ; (binding.value || 'click').split(',').forEach((name: string) => {
        if (!name)
          return
        let cbFun: any
        el.addEventListener(name, (event) => {
          if (!cbFun) {
            cbFun = setTimeout(() => {
              cbFun = null
            }, throttleTime)
          }
          else {
            event && event.stopImmediatePropagation()
          }
        }, true)
      })
    },
  }
}
