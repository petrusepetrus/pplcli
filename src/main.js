import {createApp, watch} from 'vue'
import {createPinia} from "pinia";
import App from './App.vue'

import router from "./router";
import axios from 'axios'
import './index.css'
import hasRole from './directives/HasRoleDirective.js';
import {useAuthStore} from "./stores/AuthStore.js";

axios.defaults.baseURL='http://localhost:8000'
axios.defaults.withCredentials=true




const app=createApp(App)
const pinia=createPinia()
app.use(createPinia())
/*
See if we have any persisted auth credentials in local storage and if so
rehydrate the authStore
 */
const authStore=useAuthStore()

//localStorage.removeItem('authStore')

if(localStorage.getItem('authStore')){
    console.log("user retrieved")
    console.dir(JSON.parse(localStorage.getItem('authStore')))
    const returnedState=JSON.parse(localStorage.getItem('authStore'))
    console.log(returnedState)
    //authStore.$state=returnedState.events.target
    authStore.authenticated=returnedState.authenticated
    authStore.verified=returnedState.verified
    authStore.user=returnedState.user
    authStore.userRoles=returnedState.userRoles
    authStore.permissions=returnedState.userPermissions
    console.log(authStore.$state)
}
/*
Subscribe to the authStore and watch for changes to the sto)re state
If a change occurs, store the new state to local storage to rehydrate
the store when necessary
 */
authStore.$subscribe((mutation,state)=>{
    console.log("user changed")
    console.log(mutation.type)
    console.log(mutation.storeId)
    console.dir(state)
    localStorage.setItem('authStore', JSON.stringify(state))
    console.log("we stored")
    const returnedState=JSON.parse(localStorage.getItem('authStore'))
    console.log(returnedState)

},{ detached:true })

app.use(router)
app.directive('hasRole', hasRole);
app.mount('#app')
