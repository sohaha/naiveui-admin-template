export function useValues(model: any) {
  const rawValues = ref<Record<string, any>>({})
  const isNew = ref(false)
  function getValues() {
    return { ...model.value }
  }
  function setValues(v: Record<string, any>) {
    if (!v || !Object.keys(v).length)
      isNew.value = true

    else
      isNew.value = false

    rawValues.value = model.value = v
  }

  onMounted(() => {
    rawValues.value = getValues()
  })

  return {
    isNew,
    getValues,
    rawValues,
    setValues,
  }
}
