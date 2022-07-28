import {createRouter, createWebHistory} from "vue-router"
import {useAuthStore} from "../stores/AuthStore";
import {storeToRefs} from 'pinia'
import {hasRole} from "../utils/RolesAndPermissions.js";


const routes = [
    {
        path: "/",
        name: "home",
        component: () => import("../views/Home.vue")
    },
    {
        path: "/login",
        name: "login",
        component: () => import("../views/auth/Login.vue"),
    },
    {
        path: "/register",
        name: "register",
        component: () => import("../views/auth/Register.vue"),
    },
    {
        path: "/forgot-password",
        name: "forgot-password",
        component: () => import("../views/auth/ForgotPassword.vue"),
    },
    {
        path: "/reset-password",
        name: "reset-password",
        component: () => import("../views/auth/ResetPassword.vue"),
    },
    {
        path: "/verify-email",
        name: "verify-email",
        component: () => import("../views/auth/VerifyEmail.vue"),
    },
    {
        path: "/user-dashboard",
        name: "user-dashboard",
        beforeEnter:[authenticationGuard,adminGuard],
        component: () => import("../views/user/UserDashboard.vue"),
    },
    {
        path: "/user-profile/:userID",
        name: "user-profile",
        beforeEnter:[authenticationGuard,adminGuard],
        component: () => import("../views/user/UserProfile.vue"),
        props:true
    },
    {
        path: "/users",
        name: "users",
        beforeEnter:[authenticationGuard,adminGuard],
        component: () => import("../views/user/UsersList.vue")
    },
    {
        path: "/admin-dashboard",
        name: "admin-dashboard",
        beforeEnter:[authenticationGuard,adminGuard],
        component: () => import("../views/admin/AdminDashboard.vue")
    }

]

const router = createRouter({
    history: createWebHistory(),
    routes,
    scrollBehavior(to, from, savedPosition) {
        if (savedPosition) {
            return savedPosition;
        } else {
            return {x: 0, y: 0};
        }
    },
})

//router.beforeEach(async(to)=>{
//    const authStore = useAuthStore()
//    const {authenticated:isAuthenticated}=storeToRefs(authStore)
//    if(!isAuthenticated && (!(to.name==='login' || to.name==='register'  || to.name==='forgot-password' || to.name==='reset-password'))){
//        return {name:'login'}
//    }
//})

function authenticationGuard(to,from,next){
    //console.log(to + ' ' + to + ' ' + next)
    const authStore = useAuthStore()
    const {authenticated}=storeToRefs(authStore)
    if(authenticated.value===true){
        console.log("true")
    }else{
        console.log(authenticated)
    }
    if(authenticated.value===true){
       console.log("is authenticated " + authenticated)
        next()
    }else{
        console.log("is not authenticated " + authenticated)
       next('/login')
    }
}
function adminGuard(to,from,next){
    if(hasRole(['admin','superadmin'])){
        next()
    }else{
        next('/login')
    }
}

export default router
