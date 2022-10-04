const isDark = useDark()
const toggle = useToggle(isDark)

const toggleDark = () => {
  toggle()
}

export default () => {
  return { isDark, toggleDark }
}
