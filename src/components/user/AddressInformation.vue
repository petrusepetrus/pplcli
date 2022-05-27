<template>
    <div class="pt-8 sm:flex sm:items-center sm:justify-between">
        <h3 class="text-lg font-medium text-gray-900">Address Details</h3>
        <div v-if="availableAddressTypesCount!==0" class="mt-3 sm:mt-0 sm:ml-4" v-on:click="addAddress">
            <BaseButton title="Add A New Address"
            />
        </div>
    </div>
    <div>
        <p class="my-4 text-sm text-gray-500">
            We will ask you to nominate one of your addresses to be your primary correspondence address.
        </p>
        <p class="my-4 text-sm text-gray-500">
            Please make sure that your primary correspondence addresses is a permanent address
            where you can receive mail.
        </p>
        <div class="m-4" v-if="addressesFound" v-for="userAddress in userStore.userAddresses">
            <UserAddressCard
                  :userAddress="userAddress"
                  v-on:refresh="onRefresh"
            >
            </UserAddressCard>
        </div>
        <div class="m-4" v-if="addingAddress">
            <UserAddressForm
                  v-on:refresh="onRefresh"
                  v-on:cancelled="onCancel"
            >
            </UserAddressForm>
        </div>
    </div>
</template>

<script setup>
/*
Overview
-------------------------------------------------------------------------------
The AddressInformation component manages
- the presentation of the user address details via the AddressCard components
- the addition of new addresses for a user
- changing a user's address details
-------------------------------------------------------------------------------
/*
Imports
-------------------------------------------------------------------------------
Vue
 */
import {onMounted, ref} from 'vue'
/*
UI Components
 */
import BaseButton from "../ui/BaseButton.vue";
import UserAddressForm from "./AddressForm.vue";
import UserAddressCard from "./AddressCard.vue";
/*
Stores
load the User store to save any pre-existing addresses
load the Auth store as we need to retrieve the User ID of the current user
 */
import {useUserStore} from "../../stores/UserStore.js";

const userStore = useUserStore()

import {useAuthStore} from "../../stores/AuthStore";

const authStore = useAuthStore()
/*
API
load the getUserAddresses service to retrieve any existing user addresses
 */
import useUserService from "../../services/user/useUserService.js";


const {getUserAddresses} = useUserService()
const {getAvailableAddressTypes} = useUserService()

/*
Variable declarations
-------------------------------------------------------------------------------
 */
let availableAddressTypes = ref({})
let availableAddressTypesCount = ref(0)
let addressesFound = ref(false)
let addingAddress = ref(false)
let userAddress = ref({})
/*
Initialisation
-------------------------------------------------------------------------------
/*
retrieve the User ID for the user in question
 */
const userID = authStore.user.id
/*
Functions
-------------------------------------------------------------------------------
 */

const addAddress = () => {
    userAddress = {}
    addingAddress.value = true
}
/*
refreshAddresses is run via the onMounted hook and also triggered by the v-on:refresh
event that can be emitted by the AddressCard and AddressDetails components to indicate
that a change to the user's addresses has taken place and the addresses in the userStore
should be updated and the AddressCards refreshed with hose new details
 */
const refreshAddresses = async () => {
    try {
        userStore.userAddresses = await getUserAddresses(userID)
        if (userStore.userAddresses.length > 0) {
            addressesFound.value = true
        }
        addingAddress.value = false
    } catch (e) {
        /*
        TODO need some proper error handling here
         */
        console.log("processing error ", e)
        console.log(e)
    }
}
const findAvailableAddressTypes = async () => {
    try {
        console.log(userID)
        availableAddressTypes.value = await getAvailableAddressTypes(userID)
        availableAddressTypesCount.value = (Object.keys(availableAddressTypes.value).length)
        console.log(availableAddressTypes.value)
        console.log(availableAddressTypesCount.value)
    } catch (e) {
        /*
        TODO need some proper error handling here
         */
        console.log("processing error ", e)
        console.log(e)
    }

}
const onCancel = () => {
    addingAddress.value = false
}
const onRefresh = async () => {
    await refreshAddresses()
    await findAvailableAddressTypes(userID)
    console.log(availableAddressTypes.value)
    console.log(availableAddressTypesCount.value)
}
/*
Lifecycle Hooks
-------------------------------------------------------------------------------
 */
onMounted(async () => {
    await refreshAddresses()
    await findAvailableAddressTypes()
})

</script>

<style scoped>

</style>