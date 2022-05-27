import {createRouter, createWebHistory} from "vue-router"
import {useAuthStore} from "../stores/AuthStore";
import {storeToRefs} from 'pinia'



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
        component: () => import("../views/user/UserDashboard.vue"),
    },
    {
        path: "/user-profile",
        name: "user-profile",
        component: () => import("../views/user/UserProfile.vue")
    },
    {
        path: "/users",
        name: "users",
        component: () => import("../views/user/UsersList.vue")
    },
    {
        path: "/admin-dashboard",
        name: "admin-dashboard",
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

router.beforeEach(async(to,from)=>{
    const authStore = useAuthStore()
    const {authenticated:isAuthenticated}=storeToRefs(authStore)
    if(!authStore.isAuthenticated && (!(to.name==='login' || to.name==='register'  || to.name==='forgot-password' || to.name==='reset-password'))){
        return {name:'login'}
    }
})

export default router
