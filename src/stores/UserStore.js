import {defineStore} from "pinia";

const useUserStore = defineStore('UserStore', {
    state() {
        return {
            verified: false,
            user:{},
            userRoles:{},
            userPermissions:{},
            userAddresses: {},
            userPhones:{},
            userTypes:{}
        }
    },
    getters: {
        getUser(state) {
            return state.user
        },
        getUserAddresses(state) {
            return state.userAddresses
        },
        getUserPhones(state) {
            return state.userPhones
        },
        getUserAddressByID: (state) => {
            //let userAddressIndex=state.userAddresses.findIndex(userAddresses=>userAddresses.id===id)
            return userAddressId => state.userAddresses.find((userAddress) => userAddress.id === userAddressId)
        },
    },
    actions: {}
})
export {useUserStore}