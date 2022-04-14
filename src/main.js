import { createApp } from 'vue'
import {createPinia} from "pinia";
import App from './App.vue'
import router from "./router";
import axios from 'axios'
import './index.css'

axios.defaults.baseURL='http://localhost:8000'
axios.defaults.withCredentials=true


const app=createApp(App)
const pinia=createPinia()
console.log(pinia)
app.use(router).use(createPinia())

app.mount('#app')
