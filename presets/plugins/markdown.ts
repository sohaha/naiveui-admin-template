import LinkAttributes from 'markdown-it-link-attributes'
import Prism from 'markdown-it-prism'
import Markdown from 'vite-plugin-md'
import { env } from './../shared/env'

export const markdownWrapperClasses = env.VITE_APP_MARKDOWN
  ? 'prose md:prose-lg lg:prose-lg dark:prose-invert text-left p-10 prose-slate prose-img:rounded-xl prose-headings:underline prose-a:text-blue-600'
  : ''

export default () => {
  return (
    env.VITE_APP_MARKDOWN
    && Markdown({
      // builders: [link()],
      wrapperClasses: markdownWrapperClasses,
      markdownItSetup(md) {
        md.use(Prism)
        md.use(LinkAttributes, {
          matcher: (link: string) => /^:\/\//.test(link),
          attrs: {
            target: '_blank',
            rel: 'noopener',
          },
        })
      },
    })
  )
}
