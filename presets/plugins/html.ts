import type { Plugin } from 'vite'
import { env } from '../shared/env'

export const GenerateTitle = (): Plugin => {
  // let title: string
  let base: string
  return {
    name: 'vite-plugin-env-to-generate-title',
    configResolved(_config) {
      // title = config.env.VITE_APP_TITLE
      base = (env.IS_PROD && env.VITE_BUILD_BASE) ? `${env.VITE_BUILD_BASE}` : '/'
    },
    transformIndexHtml(html) {
      let appendBody = ''
      // https://polyfill.io/v3/polyfill.js?features=Object.fromEntries,es5,es6,es7&flags=gated
      if (env.VITE_BUILD_LEGACY)
        appendBody = `<script defer src="${base}browser.js"></script>`
      else
        appendBody = `<script defer src="${base}browser.js" data-version="true"></script>`

      html = html.replace('</body>', `  ${appendBody}\n</body>`)
      // html = html.replace(/<title>(.*?)<\/title>/, `<title>${title}</title>`)
      return html
    },
  }
}
