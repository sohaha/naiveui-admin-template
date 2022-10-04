import type { StorageLike, UseStorageOptions } from '@vueuse/core'
import { useStorage } from '@vueuse/core'

export const storageKey = (key: string) =>
  `${
    import.meta.env.VITE_APP_STORAGE_PREFIX
    || import.meta.env.VITE_APP_TITLE
    || 'zls'
  }:${key}`

export default <T>(
  key: string,
  initialValue: T,
  storage?: StorageLike,
  options?: UseStorageOptions<T>,
) => {
  return useStorage(storageKey(key), initialValue, storage, options)
}
