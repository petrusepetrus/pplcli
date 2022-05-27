<template>
    <div class="bg-white px-4 py-5 border rounded-lg border-gray-200 sm:px-6">

        <div class="-ml-4 -mt-2 flex items-center justify-between flex-wrap sm:flex-nowrap">
            <div class="ml-4 mt-2">
                <h4 class="text-md leading-6 font-medium text-gray-900">{{ userPhone.phone_type }}</h4>
            </div>


        </div>
        <div>
            <p class="mt-1 text-sm text-gray-900">{{ userPhone.phone_number }}</p>
            <p class="mt-1 text-sm text-gray-900">{{ userPhone.country }}</p>
            <BaseInformationMessage v-if="userPhone.preferred_contact_number"
                                    title="This is your preferred contact number"
            >

            </BaseInformationMessage>

        </div>
        <div class="mt-2 flex items-center flex-wrap sm:flex-nowrap">
            <div class="mr-2">
                <BaseButton
                      v-on:click="onChange"
                      title="Change"
                >
                </BaseButton>
            </div>
            <div>
                <BaseButton
                      v-on:click="onDelete"
                      title="Delete"
                      :submitting="isSubmitting"
                      :disabled="isSubmitting"
                >
                </BaseButton>
            </div>
        </div>
        <div class="m-4" v-if="changingPhone">
            <UserPhoneForm
                  v-on:cancelled="onCancelled"
                  v-on:updated="onUpdated"
                  v-bind:userPhone="userPhone"
            >
            </UserPhoneForm>
        </div>
    </div>
</template>

<script setup>
/*
Overview
-------------------------------------------------------------------------------
The AddressCard component manages
- the presentation of the user address details
- initiating a change to a set of address details
- deleting a set of address details
-------------------------------------------------------------------------------
*/

/*
Imports
-------------------------------------------------------------------------------
Vue
 */
import {ref} from 'vue'
/*
Components
 */
import BaseButton from "../ui/BaseButton.vue";
import UserPhoneForm from "./PhoneForm.vue"
import BaseInformationMessage from "../ui/BaseInformationMessage.vue";
/*
Services
 */
import useUserService from "../../services/user/useUserService";
const {deleteUserPhone} =useUserService()
/*
Stores
load the User store to save any pre-existing addresses
load the Auth store as we need to retrieve the User ID of the current user
 */
import {useAuthStore} from "../../stores/AuthStore";

const authStore = useAuthStore()
/*
Props
-------------------------------------------------------------------------------
 */
const props = defineProps({
    userPhone: {}
})
/*
Emits
-------------------------------------------------------------------------------
 */
const emit=defineEmits(['refresh','change','updated'])
/*
Variable Declaration and Initialisation
-------------------------------------------------------------------------------
 */
/*
Refs
 */
let isSubmitting=ref(false)
let changingPhone=ref(false)
/*
Functions
-------------------------------------------------------------------------------
 onDelete is triggered by clicking the delete button and causes the address
 details to be deleted for the user. Once the address has been successfuly deleted
 the 'refresh' event is emitted which triggers a refresh of the user address
 in the userStore and the UserAddressCards
 */
const onDelete = async () => {
    try {
        isSubmitting.value=true
        await deleteUserPhone(authStore.user.id,props.userPhone.id)
        isSubmitting.value=false
        emit('refresh')
    } catch (e) {
        isSubmitting.value=false
        console.log("processing error ", e)
    }
}
/*
 onChange is triggered by clicking the change button. The address details to be changed are passed back to
 the AddressInformation parent component
 */
const onChange = async () => {
    console.log("changing ", props.userPhone)
    changingPhone.value=true
}

const onCancelled = async () => {
    console.log("changing ", props.userPhone)
    changingPhone.value=false
}

const onUpdated=async()=>{
    emit('refresh')
    changingPhone.value=false
}
</script>
<style scoped>

</style>