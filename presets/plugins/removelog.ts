import Removelog from 'vite-plugin-removelog'
import { env } from '../shared/env'

export function RemovelogPlugin() {
  return (env.IS_PROD && !env.VITE_APP_MOCK_IN_PRODUCTION)
    ? Removelog()
    : ''
}
