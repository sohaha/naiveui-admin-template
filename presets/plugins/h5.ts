import path from 'path'
import { env } from '../shared/env'

const toRem = `(function flexible (window, document) {
  var docEl = document.documentElement
  var dpr = window.devicePixelRatio || 1

  // adjust body font size
  function setBodyFontSize () {
    if (document.body) {
      document.body.style.fontSize = (12 * dpr) + 'px'
    }
    else {
      document.addEventListener('DOMContentLoaded', setBodyFontSize)
    }
  }
  setBodyFontSize();

  // set 1rem = viewWidth / 10
  function setRemUnit () {
    var rem = 56
 if(docEl.clientWidth<1125){
   rem = docEl.clientWidth / 10
 }
    docEl.style.fontSize = rem + 'px'
  }

  setRemUnit()

  // reset rem unit on page resize
  window.addEventListener('resize', setRemUnit)
  window.addEventListener('pageshow', function (e) {
    if (e.persisted) {
      setRemUnit()
    }
  })

  // detect 0.5px supports
  if (dpr >= 2) {
    var fakeBody = document.createElement('body')
    var testElement = document.createElement('div')
    testElement.style.border = '.5px solid transparent'
    fakeBody.appendChild(testElement)
    docEl.appendChild(fakeBody)
    if (testElement.offsetHeight === 1) {
      docEl.classList.add('hairlines')
    }
    docEl.removeChild(fakeBody)
  }
}(window, document))`

export default function H5Plugins() {
  const isH5 = env.VITE_APP_TYPE === 'h5'
  if (isH5)
    return [H5ToRem()]

  return []
}

function H5ToRem() {
  const h5 = {
    name: 'h5',
    transform(code: string, id: string) {
      if (path.relative(path.resolve('src'), id) === 'main.ts')
        return `${code};${toRem}`

      return code
    },
  }

  return h5
}
