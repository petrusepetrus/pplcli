import {defineStore} from "pinia";

const useUserStore = defineStore('UserStore', {
    state() {
        return {
            userAddresses: {},
            userPhones:{},
        }
    },
    getters: {
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
    actions: {},
    persist: true,
})
export {useUserStore}