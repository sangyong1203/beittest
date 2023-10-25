
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import "vue3-toastify/dist/index.css"
import print from "vue3-print-nb"

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(ElementPlus)
app.use(print)

app.mount('#app')
