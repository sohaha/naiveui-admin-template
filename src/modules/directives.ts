import type { App, ObjectDirective } from 'vue'

export default (app: App<Element>) => {
  app.directive('throttled', throttle())
  app.directive('permission', permission())
}

function permission(): ObjectDirective<any, any> {
  return {
    created: (el: HTMLElement, binding: any) => {
      const user = userStore()
      const value = binding.value || []
      const display = el.style.display
      watch(() => user.getPermission, (permission) => {
        let hasPer = false
        if (Array.isArray(value))
          hasPer = value.every(v => permission.includes(v))
        else
          hasPer = permission.includes(value)

        if (!hasPer)
          el.style.display = 'none'
        else
          el.style.display = display
      }, { immediate: true })
    },
  }
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
