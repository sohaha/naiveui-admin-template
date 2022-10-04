import 'ayyui/dist/style.css'
import 'uno.css'
import './styles/main.css'

import ayyui from 'ayyui'
import App from './App.vue'

const loading = document.querySelector('#loading') as HTMLElement
if (loading) {
  const title: any = loading.querySelector('.sub-title') as HTMLElement
  title.innerText = '请稍作等待，马上加载完毕'
}

const app = createApp(App)
app.use(ayyui)
app.mount('#app')
