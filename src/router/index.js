import {createRouter, createWebHistory} from "vue-router"

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
        path: "/dashboard",
        name: "dashboard",
        component: () => import("../views/user/Dashboard.vue"),
    },
    {
        path: "/user-profile",
        name: "user-profile",
        component: () => import("../views/user/Profile.vue")
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

export default router
