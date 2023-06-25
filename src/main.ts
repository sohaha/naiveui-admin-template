import 'uno.css'
import './styles/main.css'
import App from './App.vue'
import modules from './modules'

const app = createApp(App)
modules(app)
app.mount('#app')
