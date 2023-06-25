import type { VNode, VNodeChild } from 'vue'
import { isObject } from '@vueuse/core'
import { Comment, Fragment, createTextVNode } from 'vue'
import type { RouteRecord } from 'vue-router'
import type { StMenu } from '@/types/global'

export function openURL(url: string) {
  window.open(url, '', 'noopener=yes,noreferrer=yes')
}

export function getQuery(key: string, url?: string): string | null {
  if (!url)
    url = window.location.href

  const r = (new RegExp(`[?|&]${key}=` + '([^&;]+?)(&|#|;|$)').exec(url) || ['', ''])

  return decodeURIComponent(r[1].replace(/\+/g, '%20')) || null
}

export function random(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

export function flatten(
  vNodes: VNodeChild[],
  filterCommentNode = true,
  result: VNode[] = [],
): VNode[] {
  vNodes.forEach((vNode) => {
    if (vNode === null)
      return
    if (typeof vNode !== 'object') {
      if (typeof vNode === 'string' || typeof vNode === 'number')
        result.push(createTextVNode(String(vNode)))

      return
    }
    if (Array.isArray(vNode)) {
      flatten(vNode, filterCommentNode, result)
      return
    }
    if (vNode.type === Fragment) {
      if (vNode.children === null)
        return
      if (Array.isArray(vNode.children))
        flatten(vNode.children, filterCommentNode, result)

      // rawSlot
    }
    else if (vNode.type !== Comment) {
      result.push(vNode)
    }
  })
  return result
}

export function findRoute(routes: RouteRecord[], path: string, locale: string, t: (key: string) => string) {
  const r = routes.find((route) => {
    return route.path === path
  })

  let title = 'Unknown'
  let icon = 'i-bx:detail'
  if (r) {
    const meta = r.meta
    const rTitle = (meta?.title || '') as string
    if (meta?.icon)
      icon = meta.icon as string
    const i18n: undefined = meta?.i18n as any
    if (isObject(i18n) && locale)
      title = i18n[locale] as string || rTitle
    else if (rTitle)
      title = (i18n && t) ? t(rTitle) : rTitle
  }

  return [title, icon]
}

export function completionRouteTitle(menu: StMenu[], routes: RouteRecord[], locale: string, t: (key: string) => string) {
  return menu.map(({ children, path = '', title, icon, type = '' }) => {
    const item: any = { path, title, icon, type }
    if (children) {
      item.children = completionRouteTitle(children, routes, locale, t)
      item.path = ''
    }

    if (type === 'divider') {
      item.title = '分割线'
      item.icon = ''
    }
    else {
      const [rtitle, ricon] = findRoute(routes!, item.path, locale!, t!)
      if (!title)
        item.title = rtitle
      if (!icon)
        item.icon = ricon
    }

    return item
  })
}

export function fixAvatar(url: string) {
  if (url[0] === '/')
    url = (import.meta.env.VITE_APP_API_BASEURL as string) + url

  return url
}
