export function isURL(path: string) {
  return /^(http(s)?:\/\/)/.test(path)
}
