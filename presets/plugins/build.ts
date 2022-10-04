import { buildPlugin } from 'vite-plugin-build'

// https://github.com/samonxian/vite-plugin-build/blob/master/README.zh-CN.md
export function BuildPlugin() {
  return buildPlugin({
    // fileBuild: { emitDeclaration: true }
  })
}
