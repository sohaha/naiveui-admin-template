import 'uno.css'
import './styles/main.css'

import App from './App.vue'
import model from './modules'

const loading = document.querySelector('#loading') as HTMLElement
if (loading) {
  const title: any = loading.querySelector('.sub-title') as HTMLElement
  title.innerText = '请稍作等待，马上加载完毕'
}

const app = createApp(App)
model(app)
app.mount('#app')
