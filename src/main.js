import { createApp } from 'vue'
import {createPinia} from "pinia";
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import App from './App.vue'

import router from "./router";
import axios from 'axios'
import './index.css'
import hasRole from './directives/HasRoleDirective.js';

axios.defaults.baseURL='http://localhost:8000'
axios.defaults.withCredentials=true




const app=createApp(App)
const pinia=createPinia()
pinia.use(piniaPluginPersistedstate)
app.use(createPinia())
app.use(router)
app.directive('hasRole', hasRole);
app.mount('#app')
