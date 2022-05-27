<template>
    <div class="pt-8 sm:flex sm:items-center sm:justify-between">
        <h3 class="text-lg font-medium text-gray-900">Phone Details</h3>
        <div v-if="availablePhoneTypesCount!==0" class="mt-3 sm:mt-0 sm:ml-4" v-on:click="addPhone">
            <BaseButton title="Add A New Phone"
            />
        </div>
    </div>
    <div>
        <p class="my-4 text-sm text-gray-500">
            We will ask you to nominate one of your phone numbers to be your primary contact number.
        </p>
        <div class="m-4" v-if="phoneNumbersFound" v-for="userPhone in userStore.userPhones">
            <PhoneCard
                  :userPhone="userPhone"
                  v-on:refresh="onRefresh"
            >
            </PhoneCard>
        </div>
        <div class="m-4" v-if="addingPhone">
            <PhoneForm
                  v-on:refresh="onRefresh"
                  v-on:cancelled="onCancel"
            >
            </PhoneForm>
        </div>
    </div>
</template>

<script setup>
/*
Overview
-------------------------------------------------------------------------------
The PhoneInformation component manages
- the presentation of the user Phone details via the PhoneCard components
- the addition of new Phones for a user
- changing a user's Phone details
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
import PhoneForm from "../user/PhoneForm.vue"
import PhoneCard from "../user/PhoneCard.vue";
/*
Stores
load the User store to save any pre-existing Phones
load the Auth store as we need to retrieve the User ID of the current user
 */
import {useUserStore} from "../../stores/UserStore.js";
const userStore = useUserStore()

import {useAuthStore} from "../../stores/AuthStore";
const authStore = useAuthStore()
/*
API
load the getUserPhones service to retrieve any existing user Phones
 */
import useUserService from "../../services/user/useUserService.js";


const {getUserPhones} = useUserService()
const {getAvailablePhoneTypes} = useUserService()

/*
Variable declarations
-------------------------------------------------------------------------------
 */
let availablePhoneTypes = ref({})
let availablePhoneTypesCount = ref(0)
let phoneNumbersFound = ref(false)
let addingPhone = ref(false)
let userPhone = ref({})
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

const addPhone = () => {
    userPhone = {}
    addingPhone.value = true
}
/*
refreshPhones is run via the onMounted hook and also triggered by the v-on:refresh
event that can be emitted by the PhoneCard and PhoneDetails components to indicate
that a change to the user's Phones has taken place and the Phones in the userStore
should be updated and the PhoneCards refreshed with hose new details
 */
const refreshPhones = async () => {
    try {
        userStore.userPhones = await getUserPhones(userID)
        if (userStore.userPhones.length > 0) {
            phoneNumbersFound.value = true
        }
        addingPhone.value = false
    } catch (e) {
        /*
        TODO need some proper error handling here
         */
        console.log("processing error ", e)
        console.log(e)
    }
}
const findAvailablePhoneTypes = async () => {
    try {
        console.log(userID)
        availablePhoneTypes.value = await getAvailablePhoneTypes(userID)
        availablePhoneTypesCount.value = (Object.keys(availablePhoneTypes.value).length)
        console.log(availablePhoneTypes.value)
        console.log(availablePhoneTypesCount.value)
    } catch (e) {
        /*
        TODO need some proper error handling here
         */
        console.log("processing error ", e)
        console.log(e)
    }

}
const onCancel = () => {
    addingPhone.value = false
}
const onRefresh = async () => {
    await refreshPhones()
    await findAvailablePhoneTypes(userID)
    console.log(availablePhoneTypes.value)
    console.log(availablePhoneTypesCount.value)
}
/*
Lifecycle Hooks
-------------------------------------------------------------------------------
 */
onMounted(async () => {
    await refreshPhones()
    await findAvailablePhoneTypes()
})

</script>

<style scoped>

</style>