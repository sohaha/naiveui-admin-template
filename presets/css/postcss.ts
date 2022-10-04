import { env } from './../shared/env'

export const PostcssConfig = () => {
  const plugins = []

  const isH5 = env.VITE_APP_TYPE === 'h5'
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const pxtorem = require('postcss-pxtorem')({
    rootValue({ file }: any) {
      return file.includes('vant') ? 37.5 : 75
    },
    propList: ['*', '!*px'],
    selectorBlackList: [/px$/, 'loading-group', 'sk-cube-grid'],
    replace: true,
    mediaQuery: false,
    minPixelValue: 0,
  })

  if (isH5)
    plugins.push(pxtorem)

  return {
    plugins,
  }
}
