<template>
    <div class="pt-2 sm:flex sm:items-center sm:justify-between">
        <div class="sm:flex-auto">
            <h3 class="text-lg font-medium text-gray-900">Address Details</h3>

        </div>
        <div class="mt-6 sm:mt-0 sm:ml-16 sm:flex-none">
            <BaseButton v-if="availableAddressTypesCount!==0"
                        v-on:click="addAddress"
                        title="Add Address"
            />
        </div>
    </div>
    <p class="my-4 text-sm text-gray-500">
        We will ask you to nominate one of your addresses to be your primary correspondence address which
        should be an address where you can receive mail.
    </p>
    <div class="-mx-4 mt-8 overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:-mx-6 md:mx-0 md:rounded-lg">
        <table class="min-w-full divide-y divide-gray-300">
            <thead class="bg-gray-50">
            <tr>
                <th scope="col"
                    class="hidden py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6 lg:table-cell">
                    Type
                </th>
                <th scope="col" class="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 lg:table-cell">
                    Address
                </th>
                <th scope="col" class="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 sm:table-cell">

                </th>
                <th scope="col" class="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 lg:table-cell">
                    Town
                </th>
                <th scope="col" class="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 lg:table-cell">
                    Post Code
                </th>
                <th scope="col" class="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 lg:table-cell">
                    Country
                </th>
                <th scope="col" class="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 lg:table-cell">
                    Primary
                </th>
                <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"><span class="sr-only">Edit</span>
                </th>
                <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"><span class="sr-only">Delete</span>
                </th>
            </tr>
            </thead>
            <tbody class="divide-y divide-gray-200 bg-white">
            <tr v-for="userAddress in userStore.userAddresses" :key="userAddress.id">
                <td class="w-full max-w-0 py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:w-auto sm:max-w-none sm:pl-6">
                    {{ userAddress.address_type }}
                    <dl class="font-normal lg:hidden">
                        <dt class="sr-only sm:hidden">Address</dt>
                        <dd class="mt-1 truncate text-gray-500 sm:hidden">{{ userAddress.address_line_1 }}</dd>
                    </dl>
                    <dl class="font-normal lg:hidden">
                        <dt class="sr-only sm:hidden">Address</dt>
                        <dd class="mt-1 truncate text-gray-500 sm:hidden">{{ userAddress.address_line_2 }}</dd>
                    </dl>
                    <dl class="font-normal lg:hidden">
                        <dt class="sr-only sm:hidden">Address</dt>
                        <dd class="mt-1 truncate text-gray-500 sm:hidden">{{ userAddress.town }}</dd>
                    </dl>
                    <dl class="font-normal lg:hidden">
                        <dt class="sr-only sm:hidden">Country</dt>
                        <dd class="mt-1 truncate text-gray-500 sm:hidden">{{ userAddress.country }}</dd>
                    </dl>
                    <dl class="font-normal lg:hidden">
                        <dt class="sr-only sm:hidden">Post Code</dt>
                        <dd class="mt-1 truncate text-gray-500 sm:hidden">{{ userAddress.post_code }}</dd>
                    </dl>
                </td>
                <td class="hidden px-3 py-4 text-sm text-gray-500 lg:table-cell">{{ userAddress.address_line_1 }}</td>
                <td class="hidden px-3 py-4 text-sm text-gray-500 lg:table-cell">{{ userAddress.address_line_2 }}</td>
                <td class="hidden px-3 py-4 text-sm text-gray-500 sm:table-cell">{{ userAddress.town }}</td>
                <td class="hidden px-3 py-4 text-sm text-gray-500 sm:table-cell">{{ userAddress.post_code }}</td>
                <td class="hidden px-3 py-4 text-sm text-gray-500 sm:table-cell">{{ userAddress.country }}</td>
                <td class="px-3 py-4 text-sm text-gray-500" v-if="userAddress.preferred_contact_address===0"></td>
                <td class="px-3 py-4 text-sm text-gray-500" v-else>
                    <CheckCircleIcon class="h-5 w-5 text-green-400" aria-hidden="true"/>
                </td>
                <td class="py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                    <button class="text-indigo-600 hover:text-indigo-900"
                            v-on:click="changeAddress(userAddress)"
                    >Edit
                    </button>
                </td>
                <td class="py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                    <button class="text-indigo-600 hover:text-indigo-900"
                            v-on:click="deleteAddress(userAddress)"
                    >Delete
                    </button>
                </td>
            </tr>
            </tbody>
        </table>
    </div>
    <div>
        <div class="m-4" v-if="addingAddress">
            <AddressForm
                  v-on:refresh="onRefresh"
                  v-on:cancelled="onCancelled"
            >
            </AddressForm>
        </div>
        <div class="m-4" v-if="changingAddress">
            <AddressForm
                  v-on:cancelled="onCancelled"
                  v-on:updated="onUpdated"
                  v-bind:userAddress="userAddress"
                  :key="userAddress.id"
            >
            </AddressForm>
        </div>
    </div>
    <div class="mt-6 lg:col-span-1 md:col-span-1 sm:col-span-4" v-if="warningMessage.text">
        <BaseWarningMessage
              :title="warningMessage.title"
        >
            {{ warningMessage.text }}
        </BaseWarningMessage>
    </div>
    <div class="mt-6 lg:col-span-1 md:col-span-1 sm:col-span-4" v-if="errorMessage.text">
        <BaseErrorMessage>
            :title="errorMessage.title"
            {{ errorMessage.text }}
        </BaseErrorMessage>
    </div>
</template>

<script setup>
/*
Overview
-------------------------------------------------------------------------------
The AddressInformation component manages
- the presentation of the user Address details via the AddressCard components
- the addition of new Address for a user
- changing a user's Address details
-------------------------------------------------------------------------------
/*
Imports
-------------------------------------------------------------------------------
Vue
 */
import {onMounted, ref, reactive} from 'vue'
/*
UI Components
 */
import BaseButton from "../ui/BaseButton.vue";
import AddressForm from "../user/AddressForm.vue"
import BaseErrorMessage from "../ui/BaseErrorMessage.vue";
import BaseWarningMessage from "../ui/BaseWarningMessage.vue";
import {CheckCircleIcon} from "@heroicons/vue/solid";
/*
Stores
load the User store to save any pre-existing Addresss
load the Auth store as we need to retrieve the User ID of the current user
 */
import {useUserStore} from "../../stores/UserStore.js";

const userStore = useUserStore()

import {useAuthStore} from "../../stores/AuthStore";

const authStore = useAuthStore()
/*
API
load the getuserAddresss service to retrieve any existing user Addresss
 */
import useUserService from "../../services/user/useUserService.js";


const {getUserAddresses, deleteUserAddress} = useUserService()
const {getAvailableAddressTypes} = useUserService()

/*
Variable declarations
-------------------------------------------------------------------------------
 */
let availableAddressTypes = ref({})
let availableAddressTypesCount = ref(0)
let warningMessage = reactive({})
let errorMessage=reactive({})

let addingAddress = ref(false)
let changingAddress = ref(false)
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
 onDelete is triggered by clicking the delete button and causes the address
 details to be deleted for the user. Once the address has been successfuly deleted
 the 'refresh' event is emitted which triggers a refresh of the user address
 in the userStore and the UserAddressCards
 */
const deleteAddress = async (userAddressToDelete) => {
    try {
        await deleteUserAddress(authStore.user.id, userAddressToDelete.id)
        await refreshAddresses()
        await findAvailableAddressTypes()
    } catch (e) {
        console.log("processing error ", e)
    }
}
const addAddress = () => {
    userAddress = {}
    addingAddress.value = true
}

const changeAddress = (userAddressToChange) => {
    console.log("changing", userAddressToChange)
    userAddress.value = userAddressToChange
    console.log(userAddress.value)
    changingAddress.value = true
}
/*
refreshAddresss is run via the onMounted hook and also triggered by the v-on:refresh
event that can be emitted by the AddressCard and AddressDetails components to indicate
that a change to the user's Addresss has taken place and the Addresss in the userStore
should be updated and the AddressCards refreshed with hose new details
 */
const refreshAddresses = async () => {
    try {
        userStore.userAddresses = await getUserAddresses(userID)
        let preferredAddressFound = false
        warningMessage.title=""
        warningMessage.text=""
        for (let i = 0; i < userStore.userAddresses.length; i++) {
            if (userStore.userAddresses[i].preferred_contact_address === 1) {
                preferredAddressFound = true
            }
        }
        if (!preferredAddressFound) {
            warningMessage.title = "Warning - your have no primary contact address selected"
            warningMessage.text = "Without a primary address selected you will not receive any mail or be able to enrol on any courses"
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
        availableAddressTypes.value = await getAvailableAddressTypes(userID)
        availableAddressTypesCount.value = (Object.keys(availableAddressTypes.value).length)
    } catch (e) {
        /*
        TODO need some proper error handling here
         */
        console.log("processing error ", e)
        console.log(e)
    }

}
const onCancelled = () => {
    addingAddress.value = false
    changingAddress.value = false
}

const onUpdated = async () => {
    addingAddress.value = false
    changingAddress.value = false
    await refreshAddresses()
    await findAvailableAddressTypes(userID)
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
    await findAvailableAddressTypes(userID)
})

</script>

<style scoped>

</style>