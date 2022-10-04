import type { Plugin } from 'vite'
import { env } from '../shared/env'

export const GenerateTitle = (): Plugin => {
  let title: string
  return {
    name: 'vite-plugin-env-to-generate-title',
    configResolved(config) {
      title = config.env.VITE_APP_TITLE
    },
    transformIndexHtml(html) {
      let appendBody = ''

      if (env.VITE_BUILD_LEGACY)
        appendBody = '<script defer src="/browser.js"></script>'
      else
        appendBody = '<script defer src="/browser.js" data-version="true"></script>'

      html = html.replace('</body>', `  ${appendBody}\n</body>`)
      return html.replace(/<title>(.*?)<\/title>/, `<title>${title}</title>`)
    },
  }
}
