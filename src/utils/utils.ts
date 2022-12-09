import type { VNode, VNodeChild } from 'vue'
import { Comment, Fragment, createTextVNode } from 'vue'

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
