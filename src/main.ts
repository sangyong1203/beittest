
import { createApp } from 'vue'

import "./assets/styles/main.scss"
import App from './App.vue'
import router from './router'

import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from "@element-plus/icons-vue"

import "vue3-toastify/dist/index.css"

import print from "vue3-print-nb"

// import "v-calendar/dist/style.css"
// import VCalendar from "v-calendar"

import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

const app = createApp(App)
// app.use(VCalendar, {})
app.use(print)
app.use(pinia)
app.use(router)
app.use(ElementPlus)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}

app.mount('#app')
