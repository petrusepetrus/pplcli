import {defineStore} from "pinia";

const useAuthStore = defineStore('AuthStore', {
    state() {
        return {
            authenticated: false,
            verified: false,
            user: {},
            userRoles:{},
            userPermissions:{}
        }
    },
    getters: {
        isAuthenticated(state) {
            return state.authenticated
        },
        isVerified(state) {
            return state.verified
        },
        getUser(state) {
            return state.user
        },
        getUserRoles:(state)=>{
            return state.userRoles
        },
        getUserPermissions:(state)=>{
            return state.userPermissions
        },
    },
    actions: {}
})
export {useAuthStore}