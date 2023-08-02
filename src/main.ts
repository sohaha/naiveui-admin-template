import 'uno.css'
import './styles/main.css'
import * as Vue from 'vue'
import App from './App.vue'
import modules from './modules'

window.Vue = Vue

const app = createApp(App)
modules(app)
app.mount('#app')
