// import hljs from 'highlight.js'
// import 'highlight.js/styles/tokyo-night-dark.css'

import type { ToolbarNames } from 'md-editor-v3'
import MdEditor from 'md-editor-v3'
import 'md-editor-v3/lib/style.css'
import './style.css'

type MdEditorPropsType = InstanceType<typeof MdEditor>['$props']

MdEditor.config({
  editorExtensions: {
    // highlight: {
    //   instance: hljs,
    // },
  },
})

export default defineComponent({
  name: 'ZMdEditor',
  emits: ['update:value', 'htmlChanged', 'uploadImg'],
  setup(_: any, { emit }) {
    const state = stateStore()
    const { locale } = useLanguage()
    const { isDark } = useDarks()
    const attrs = useAttrs()
    const editorProps = computed((): MdEditorPropsType => {
      let toolbarsExclude: ToolbarNames[] = ['unorderedList', 'orderedList', 'github', 'mermaid', 'katex', 'prettier', 'pageFullscreen', 'fullscreen', 'codeRow', 'sub', 'sup', 'save']
      if (state.isSmallScreen)
        toolbarsExclude = [...toolbarsExclude, 'image', 'code', 'bold', 'underline', 'italic', 'strikeThrough', 'quote', 'title', '-']

      return {
        noPrettier: false,
        // preview: false,
        toolbarsExclude,
        theme: isDark.value ? 'dark' : 'light',
        language: locale.value === 'zh' ? 'zh-CN' : 'en-US',
        onHtmlChanged: (html: string) => {
          emit('htmlChanged', html)
        },
        onUploadImg: (files: Array<File>, callBack: (urls: string[]) => void) => {
          emit('uploadImg', files, callBack)
        },
        ...attrs,
      }
    })

    return () => h(MdEditor, editorProps.value)
  },
})
