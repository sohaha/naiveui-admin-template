export function useInfoDrawer() {
  const infoID = ref<number | string>(0)
  const show = ref(false)

  return {
    open(id: number | string) {
      infoID.value = id
      show.value = true
    },
    id: infoID,
    show,
  }
}
