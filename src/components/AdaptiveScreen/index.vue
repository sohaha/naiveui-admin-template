<script setup lang="ts">
//     onMounted(async () => {
//       resize = useDebounceFn(async () => {
//         await initSize()
//         updateSize()
//         updateScale()
//       }, props.delay)

//       nextTick(() => {
//         window.addEventListener('resize', resize)
//       })
//     })

//     onDestroy(() => {
//       window.removeEventListener('resize', resize)
//     })

//     return {
//     }
//   },
// })

// import type { PropType } from 'vue'

// type IAutoScale =
//   | boolean
//   | {
//     x?: boolean
//     y?: boolean
//   }
const props = withDefaults(
  defineProps<{
    width?: string | number
    height?: string | number
    delay?: number
    boxStyle?: string
    contentStyle?: string
    fullScreen?: boolean
    autoScale?: boolean | {
      x?: boolean
      y?: boolean
    }
  }>(),
  {
    width: 1920,
    height: 1080,
    delay: 500,
    autoScale: true,
  },
)

function updateScale() {
  const currentWidth = document.body.clientWidth
  const currentHeight = document.body.clientHeight
  const realWidth = currentWidth || originalWidth.value
  const realHeight = currentHeight || originalHeight.value
  const widthScale = currentWidth / +realWidth
  const heightScale = currentHeight / +realHeight

  if (props.fullScreen) {
    screenWrapper.value!.style.transform = `scale(${widthScale},${heightScale})`
    return false
  }
  const scale = Math.min(widthScale, heightScale)
  handleAutoScale(scale)
}

function handleAutoScale(scale: number) {
  if (!props.autoScale)
    return
  const domWidth = screenWrapper.value!.clientWidth
  const domHeight = screenWrapper.value!.clientHeight
  const currentWidth = document.body.clientWidth
  const currentHeight = document.body.clientHeight
  screenWrapper.value!.style.transform = `scale(${scale},${scale})`
  let mx = Math.max((currentWidth - domWidth * scale) / 2, 0)
  let my = Math.max((currentHeight - domHeight * scale) / 2, 0)
  if (typeof props.autoScale === 'object') {
    // @ts-expect-error
    !this.autoScale.x && (mx = 0)
    // @ts-expect-error
    !this.autoScale.y && (my = 0)
  }
  screenWrapper.value!.style.margin = `${my}px ${mx}px`
  console.log('scale', scale)
}

function updateSize() {
  if (currentWidth.value && currentHeight.value) {
    screenWrapper.value!.style.width = `${currentWidth.value}px`
    screenWrapper.value!.style.height = `${currentHeight.value}px`
  }
  else {
    screenWrapper.value!.style.width = `${originalWidth.value}px`
    screenWrapper.value!.style.height = `${originalHeight.value}px`
  }
}

// export default defineComponent({
//   props: {
//     width: {
//       type: [String, Number] as PropType<string | number>,
//       default: 1920,
//     },
//     height: {
//       type: [String, Number] as PropType<string | number>,
//       default: 1080,
//     },
//     fullScreen: {
//       type: Boolean as PropType<boolean>,
//       default: false,
//     },
//     autoScale: {
//       type: [Object, Boolean] as PropType<IAutoScale>,
//       default: true,
//     },
//     delay: {
//       type: Number as PropType<number>,
//       default: 500,
//     },
//     boxStyle: {
//       type: Object,
//       default: () => ({}),
//     },
//     wrapperStyle: {
//       type: Object,
//       default: () => ({}),
//     },
//   },
//   setup(props) {
//     const { width, height } = useWindowSize()
//     const screenWrapper = ref<HTMLElement>()
//     const currentWidth = ref(0)
//     const currentHeight = ref(0)
//     const originalWidth = ref(0)
//     const originalHeight = ref(0)

//     useResizeObserver(screenWrapper, (entries) => {
//       const entry = entries[0]
//       const { width, height } = entry.contentRect
//       console.log(entry)

//     //   text.value = `width: ${width}, height: ${height}`
//     })

//     let resize

function initSize() {
  return new Promise<void>((resolve) => {
    nextTick(() => {
      if (props.width && props.height) {
        currentWidth.value = props.width as number
        currentHeight.value = props.height as number
      }
      else {
        currentWidth.value = screenWrapper.value!.clientWidth
        currentHeight.value = screenWrapper.value!.clientHeight
      }

      if (!originalHeight.value || !originalWidth.value) {
        originalWidth.value = window.screen.width
        originalHeight.value = window.screen.height
      }
      resolve()
    })
  })
}

const { width, height } = useWindowSize()
const screenWrapper = ref<HTMLElement>()
const currentWidth = ref(0)
const currentHeight = ref(0)
const originalWidth = ref(0)
const originalHeight = ref(0)

const resize = useDebounceFn(async () => {
  await initSize()
  updateSize()
  updateScale()
}, props.delay)

useResizeObserver(document.body, (entries) => {
  const entry = entries[0]
  const { width, height } = entry.contentRect
  console.log(entry)
  resize()
  //   text.value = `width: ${width}, height: ${height}`
})
</script>

<template>
  <section class="screen-box" :style="boxStyle">
    <div ref="screenWrapper" class="screen-wrapper" :style="contentStyle">
      <slot />
    </div>
  </section>
</template>

<style  scoped>
.screen-box {
  overflow: hidden;
  background-size: 100% 100%;
  /* background: #000; */
  width: 100vw;
  height: 100vh;
}

.screen-box .screen-wrapper {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 500ms;
  position: relative;
  overflow: hidden;
  z-index: 100;
  transform-origin: left top;
}
</style>
