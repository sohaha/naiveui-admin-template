import eslintPlugin from 'vite-plugin-eslint'

export function ESLintPlugin() {
  return eslintPlugin({
    fix: true,
    cache: true,
    failOnError: false,
    include: ['src/**/*.js', 'src/**/*.vue', 'src/**/*.ts'],
  })
}
