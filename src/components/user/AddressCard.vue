<template>
    <div class="bg-white px-4 py-5 border rounded-lg border-gray-200 sm:px-6">

        <div class="-ml-4 -mt-2 flex items-center justify-between flex-wrap sm:flex-nowrap">
            <div class="ml-4 mt-2">
                <h4 class="text-md leading-6 font-medium text-gray-900">{{ userAddress.address_type }}</h4>
            </div>


        </div>
        <div>
            <p class="mt-1 text-sm text-gray-900">{{ userAddress.address_line_1 }}</p>
            <p class="mt-1 text-sm text-gray-900">{{ userAddress.address_line_2 }}</p>
            <p class="mt-1 text-sm text-gray-900">{{ userAddress.town }}</p>
            <p class="mt-1 text-sm text-gray-900">{{ userAddress.region }}</p>
            <p class="mt-1 text-sm text-gray-900">{{ userAddress.postal_code }}</p>
            <p class="mt-1 text-sm text-gray-900">{{ userAddress.country }}</p>
            <BaseInformationMessage
                  v-if="userAddress.preferred_contact_address"
                  title="This is your preferred contact address"
            >

            </BaseInformationMessage>

        </div>
        <div class="mt-2 flex items-center flex-wrap sm:flex-nowrap">
            <div class="mr-2">
                <BaseButton
                      title="Change"
                      @click="onChange"
                >
                </BaseButton>
            </div>
            <div>
                <BaseButton
                      title="Delete"
                      :submitting="isSubmitting"
                      :disabled="isSubmitting"
                      @click="onDelete"
                >
                </BaseButton>
            </div>
        </div>
        <div v-if="changingAddress" class="m-4">
            <UserAddressForm
                  :user-address="userAddress"
                  @cancelled="onCancelled"
                  @updated="onUpdated"
            >
            </UserAddressForm>
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
/*-------------------------------------------------------------------------------
Imports
-------------------------------------------------------------------------------*/
/* Vue  */
import {ref} from 'vue'
/* Vue Router */
import {useRoute} from "vue-router";
/* Components */
import BaseButton from "../ui/BaseButton.vue";
import UserAddressForm from "./AddressForm.vue"
import BaseInformationMessage from "../ui/BaseInformationMessage.vue";
/* Services  */
import useUserService from "../../services/user/useUserService";
const {deleteUserAddress} = useUserService()
/* Stores
load the User store to save any pre-existing addresses
/*
Props
-------------------------------------------------------------------------------
 */
const props = defineProps({
    userAddress: {}
})
/*
Emits
-------------------------------------------------------------------------------
 */
const emit = defineEmits(['refresh', 'change', 'updated'])
/*
Variable Declaration and Initialisation
-------------------------------------------------------------------------------
 */
/*
retrieve the User ID for the user in question
 */
const route = useRoute();
const userID=route.params.userID
/*
Refs
 */
let isSubmitting = ref(false)
let changingAddress = ref(false)
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
        isSubmitting.value = true
        await deleteUserAddress(userID, props.userAddress.id)
        isSubmitting.value = false
        emit('refresh')
    } catch (e) {
        isSubmitting.value = false
        console.log("processing error ", e)
    }
}
/*
 onChange is triggered by clicking the change button. The address details to be changed are passed back to
 the AddressInformation parent component
 */
const onChange = async () => {
    console.log("changing ", props.userAddress)
    changingAddress.value = true
}

const onCancelled = async () => {
    console.log("changing ", props.userAddress)
    changingAddress.value = false
}

const onUpdated = async () => {

    emit('refresh')
    changingAddress.value = false
}

</script>

<style scoped>

</style>