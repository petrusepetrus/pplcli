<template>
    <div class="pt-2 sm:flex sm:items-center sm:justify-between">
        <div class="sm:flex-auto">
            <h3 class="text-lg font-medium text-gray-900">Phone Details</h3>

        </div>
        <div class="mt-6 sm:mt-0 sm:ml-16 sm:flex-none">
            <BaseButton v-if="availablePhoneTypesCount!==0"
                        v-on:click="addPhone"
                        title="Add phone"
            />
        </div>
    </div>
    <p class="mt-2 text-sm text-gray-700">Please nominate one of your phone numbers to be your
        primary contact number.</p>

    <div class="-mx-4 mt-8 overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:-mx-6 md:mx-0 md:rounded-lg">
        <table class="min-w-full divide-y divide-gray-300">
            <thead class="bg-gray-50">
            <tr>
                <th scope="col" class="hidden py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6 lg:table-cell">Type</th>
                <th scope="col" class="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 lg:table-cell">
                    Country
                </th>
                <th scope="col" class="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 sm:table-cell">
                    Number
                </th>
                <th scope="col" class="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 lg:table-cell">Primary
                </th>
                <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"><span class="sr-only">Edit</span>
                </th>
                <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"><span class="sr-only">Delete</span>
                </th>
            </tr>
            </thead>
            <tbody class="divide-y divide-gray-200 bg-white">
            <tr v-for="userPhone in userStore.userPhones" :key="userPhone.id">
                <td class="w-full max-w-0 py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:w-auto sm:max-w-none sm:pl-6">
                    {{ userPhone.phone_type }}
                    <dl class="font-normal lg:hidden">
                        <dt class="sr-only sm:hidden">Number</dt>
                        <dd class="mt-1 truncate text-gray-500 sm:hidden">{{ userPhone.phone_number }}</dd>
                    </dl>
                </td>
                <td class="hidden px-3 py-4 text-sm text-gray-500 lg:table-cell">{{ userPhone.country }}</td>
                <td class="hidden px-3 py-4 text-sm text-gray-500 sm:table-cell">{{ userPhone.phone_number }}</td>

                <td class="px-3 py-4 text-sm text-gray-500" v-if="userPhone.preferred_contact_number===0"></td>
                <td class="px-3 py-4 text-sm text-gray-500" v-else>
                    <CheckCircleIcon class="h-5 w-5 text-green-400" aria-hidden="true"/>
                </td>
                <td class="py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                    <button class="text-indigo-600 hover:text-indigo-900"
                            v-on:click="changePhone(userPhone)"
                    >Edit
                    </button>
                </td>
                <td class="py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                    <button class="text-indigo-600 hover:text-indigo-900"
                            v-on:click="deletePhone(userPhone)"
                    >Delete
                    </button>
                </td>
            </tr>
            </tbody>
        </table>
    </div>
    <div class="mt-2">
        <BaseWarningMessage v-if="warningMessage.text"
                            :title="warningMessage.title"
        >
            {{ warningMessage.text }}
        </BaseWarningMessage>
    </div>
    <div>
        <div class="m-4" v-if="addingPhone">
            <PhoneForm
                  v-on:updated="onUpdated"
                  v-on:cancelled="onCancelled"
            >
            </PhoneForm>
        </div>
        <div class="m-4" v-if="changingPhone">
            <PhoneForm
                  v-on:cancelled="onCancelled"
                  v-on:updated="onUpdated"
                  v-bind:userPhone="userPhone"
                  :key="userPhone.id"
            >
            </PhoneForm>
        </div>
    </div>
</template>

<script setup>
/* ----------------------------------------------------------------------------
Overview

The PhoneList component manages
- the presentation of the user Phone details
- the addition of new Phones for a user
- changing or deleting a user's Phone details
-------------------------------------------------------------------------------
/*------------------------------------------------------------------------------
Imports
------------------------------------------------------------------------------*/
/*
Vue
*/
import {onMounted, reactive, ref} from 'vue'
/*
UI Components
 */
import BaseButton from "../ui/BaseButton.vue";
import PhoneForm from "../user/PhoneForm.vue"
import {CheckCircleIcon} from "@heroicons/vue/solid";
import BaseWarningMessage from "../ui/BaseWarningMessage.vue";
/*
Stores
 */
import {useUserStore} from "../../stores/UserStore.js";
import {useAuthStore} from "../../stores/AuthStore";
/*
API
 */
import useUserService from "../../services/user/useUserService.js";
/*-----------------------------------------------------------------------------
Variable Declaration and Initialisation
-------------------------------------------------------------------------------*/
/*
Stores
*/
const userStore = useUserStore()
const authStore = useAuthStore()
/*
Services
*/
const {getUserPhones,deleteUserPhone} = useUserService()
const {getAvailablePhoneTypes} = useUserService()
/*
Refs
*/
let availablePhoneTypes = ref({})
let availablePhoneTypesCount = ref(0)
let addingPhone = ref(false)
let changingPhone = ref(false)
let userPhone = ref({})
let warningMessage = reactive({})

/*
Initialise the userID we are dealing with
TODO
we should accept this as a prop to make the component reusable
*/
const userID = authStore.user.id

/*-----------------------------------------------------------------------------
Functions
-------------------------------------------------------------------------------*/
/*
delete the phone
 */
const deletePhone = async (userPhoneToDelete) => {
    try {
        await deleteUserPhone(authStore.user.id,userPhoneToDelete.id)
        await refreshPhones()
        await findAvailablePhoneTypes()
    } catch (e) {
        console.log("processing error ", e)
    }
}
/*
add a phone
set the userPhone prop to be received by the PhoneForm component to empty
this signifies we are adding a new phone
 */
const addPhone = () => {
    userPhone = {}
    addingPhone.value = true
}

/*
change a phone
set the userPhone prop to be received by the PhoneForm component to the relevant phone
this signifies we are changing an existing phone
 */
const changePhone=(userPhoneToChange)=>{
    userPhone.value=userPhoneToChange
    changingPhone.value=true
}

/*
refreshPhones is run via the onMounted hook and also triggered by the v-on:refresh
event that emitted by the PhoneForm components to indicate
that a change to the user's Phones has taken place and the Phones in the userStore
should be updated
 */
const refreshPhones = async () => {
    try {
        userStore.userPhones = await getUserPhones(userID)

        let preferredNumberFound = false
        warningMessage.title=""
        warningMessage.text=""
        for (let i = 0; i < userStore.userPhones.length; i++) {
            if (userStore.userPhones[i].preferred_contact_number === 1) {
                preferredNumberFound = true
            }
        }
        if (!preferredNumberFound) {
            warningMessage.title = "Warning - your have no primary contact number selected"
            warningMessage.text = `Without a primary contact number you may miss urgent updates on class cancellations or other
            time sensitive items. We would recommend selecting a mobile phone for this purpose`
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

/*
find the available phone types for a user based on which phone types they have
already assigned from the available phone types and thereby limiting the select
to only those that they have not already used
 */
const findAvailablePhoneTypes = async () => {
    try {
        availablePhoneTypes.value = await getAvailablePhoneTypes(userID)
        availablePhoneTypesCount.value = (Object.keys(availablePhoneTypes.value).length)
    } catch (e) {
        /*
        TODO need some proper error handling here
         */
        console.log("processing error ", e)
        console.log(e)
    }

}

/*
triggered by PhoneForm component to indicate user cancelled the add
or change so toggle the flags off to remove the PhoneForm component
 */
const onCancelled = () => {
    addingPhone.value = false
    changingPhone.value=false
}

/*
triggered by PhoneForm component to indicate user completed the add
or change so toggle the flags off to remove the PhoneForm component
and refresh the phone list and the available phone types
 */
const onUpdated=async ()=>{
    addingPhone.value = false
    changingPhone.value=false
    await refreshPhones()
    await findAvailablePhoneTypes(userID)
}


/*-----------------------------------------------------------------------------
Lifecycle Hooks
-------------------------------------------------------------------------------*/
onMounted(async () => {
    await refreshPhones()
    await findAvailablePhoneTypes()
})

</script>

<style scoped>

</style>