// @ts-nocheck
import { createProdMockServer } from 'vite-plugin-mock/es/createProdMockServer'

const mocks: any[] = []
const mockContext = import.meta.glob('../mock/*.ts', { eager: true })

Object.keys(mockContext).forEach((v) => {
  const items = mockContext[v] as any
  if (items?.default)
    mocks.push(...items.default)
})

export function setupProdMockServer() {
  createProdMockServer(mocks)
}
