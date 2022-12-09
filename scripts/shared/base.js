const showExt = (type) => {
  const isTs = type === 'api' || type === 'store' || type === 'module'
  const ext = isTs ? 'ts' : 'vue'
  return ext
}

const moduleTypes = [
  'api',
  'page',
  'store',
  'layout',
  'module',
  'component',
  'composable',
]

const showDir = (type) => {
  if (type === 'api')
    return 'apis'

  return `${type}s`
}

module.exports = {
  showExt,
  showDir,
  moduleTypes,
}
