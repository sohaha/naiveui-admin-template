export function useForm() {
  const form = useDataForm()
  const { setItems } = form

  setItems({
    name: {
      label: '数据 1',
      component: 'NInput',
      required: true,
    },
  })

  const showDrawer = ref(false)
  const drawerAction = ref('')

  function submitForm(data: any) {
    console.log(data)
  }

  return { ...form, showDrawer, drawerAction, submitForm }
}
