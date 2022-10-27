export function useForm() {
  const form = useDataForm()
  const { setItems, setOptions } = form

  setOptions({
    labelWidth: 80,
    labelPlacement: 'top',
  })

  setItems({
    name: {
      label: '用户名',
      component: 'NInput',
      required: true,
    },
    passwd: {
      label: '密码',
      component: 'NInput',
      required: true,
      props: {
        type: 'password',
      },
    },
  })

  const showDrawer = ref(false)
  const drawerAction = ref('')

  function submitForm(data: any) {
    console.log(data)
  }

  return { ...form, showDrawer, drawerAction, submitForm }
}
