import { viteMockServe } from 'vite-plugin-mock'
import { env } from '../shared/env'

// https://github.com/anncwb/vite-plugin-mock
export function MockPlugin() {
  const prodEnabled = env.VITE_APP_MOCK_IN_PRODUCTION

  return viteMockServe({
    ignore: /^_/,
    mockPath: 'mock',
    supportTs: true,
    prodEnabled,
    injectCode: `
            import { setupProdMockServer } from './mockProdServer';
            setupProdMockServer();
        `,
  })
}
