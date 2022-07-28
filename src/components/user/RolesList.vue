<template>
    <div class="pt-2 sm:flex sm:items-center sm:justify-between">
        <div class="sm:flex-auto">
            <h3 class="text-lg font-medium text-gray-900">Roles</h3>

        </div>
    </div>
    <p class="my-4 text-sm text-gray-500">
        Please select all relevant roles from the options available.
    </p>
    <div v-if="processForm">
        <form novalidate class="space-y-6 " @submit="onSubmit">
            <fieldset>
                <div v-for="userType in userStore.userTypes" :key="userType.id" class="mt-4 space-y-4">
                    <div class="relative flex items-start">
                        <BaseCheckbox
                              :id="'userType' + userType.id"
                              :label=userType.user_type
                              :label-description=userType.user_type_description
                              :model-value="userType.user_type_status==='Active'"
                              :name="'userType' + userType.id"
                              @change="onChange($event)"
                        >
                        </BaseCheckbox>
                    </div>
                </div>
            </fieldset>
        </form>
        <div class="mt-2 flex items-center flex-wrap sm:flex-nowrap">
            <div class="mr-2">
                <BaseButton
                      v-if="isDirty"
                      title="Save"
                      :submitting="isSubmitting"
                      :disabled="isSubmitting"
                      @click="onSubmit"
                />
            </div>
            <div class="mr-2">
                <BaseButton
                      v-if="isDirty"
                      title="Cancel"
                      :disabled="isSubmitting"
                      @click="onCancelled"
                />
            </div>
        </div>
    </div>
    <div v-if="generalError.title" class="mt-6 lg:col-span-1 md:col-span-1 sm:col-span-4">
        <BaseErrorMessage
              v-if="generalError.title"
              :error-description=generalError.description
              :error-title=generalError.title>
        </BaseErrorMessage>
    </div>
    <div v-if="warningMessage.warningTitle" class="mt-6 lg:col-span-1 md:col-span-1 sm:col-span-4">
        <BaseWarningMessage
              :warning-title="warningMessage.warningTitle"
        >
            {{ warningMessage.text }}
        </BaseWarningMessage>
    </div>

</template>

<script setup>
/* 
-------------------------------------------------------------------------------
Overview
-------------------------------------------------------------------------------
The UserType information component manages
- the presentation of the user's UserType details
- the addition of new UserTypes for a user
- changing or deleting a user's UserType details
----------------------------------------------------------------------------*/
/* 
-------------------------------------------------------------------------------
Imports
-----------------------------------------------------------------------------*/
/* Vue  */
import {onMounted, ref, reactive, onBeforeMount} from 'vue'
/* Vue Router */
import {useRoute} from "vue-router";
/* Components  */
import BaseButton from "../ui/BaseButton.vue";
import BaseWarningMessage from "../ui/BaseWarningMessage.vue";
import BaseCheckbox from "../ui/BaseCheckbox.vue";
import BaseErrorMessage from "../ui/BaseErrorMessage.vue";
/* Stores
load the User store to save any pre-existing UserTypes
 */
import {useUserStore} from "../../stores/UserStore.js";

const userStore = useUserStore()
/* Services
load the User services to manage user UserType CRUD
 */
import useUserService from "../../services/user/useUserService.js";
import useErrorService from "../../services/errors/useErrorServices.js";

const {errorMessageHandler}=useErrorService()
const {getUserTypes, getUserUserTypes,updateUserTypes} = useUserService()
/*
/* Validation */
/*
-------------------------------------------------------------------------------
Variable declarations
------------------------------------------------------------------------------ */
let warningMessage = reactive({})
let flgActiveUserTypesFound = ref(false)    /*flags whether user has any pre-existing UserTypes */
const isDirty = ref(false)                  /*flags whether the form is dirty */
const isSubmitting = ref(false)               /*flags user has saved changes*/
let processForm=ref(false)
let generalError=reactive({})
/*
-------------------------------------------------------------------------------
Initialisation
-------------------------------------------------------------------------------
/* retrieve the userID from the URL parameters for the user in question  */
const route = useRoute();
let userID = reactive()
userID = route.params.userID
loadUserTypes()
/*
-------------------------------------------------------------------------------
Functions
-------------------------------------------------------------------------------*/
const onSubmit=async()=>{
    for (let i = 0; i < userStore.userTypes.length; i++) {
        isSubmitting.value=true
        let userTypeIndex = userStore.userTypes[i].id
        let userTypeCheckbox = document.getElementById('userType' + userTypeIndex)

        let storeStatus=userStore.userTypes[i].user_type_status
        console.log(i + " " + storeStatus + " " + userTypeCheckbox.checked)
        if(storeStatus==='Undefined' && userTypeCheckbox.checked===true){
            userStore.userTypes[i].user_type_status='Active'
        }else if(storeStatus==='Active' && userTypeCheckbox.checked!==true){
            userStore.userTypes[i].user_type_status='Inactive'
        }else if(storeStatus==='Inactive'  && userTypeCheckbox.checked===true){
            userStore.userTypes[i].user_type_status='Active'
        }
    }
    await updateUserTypes(userStore.userTypes,userID)
    isSubmitting.value=false
    isDirty.value=false
}
const onChange = () => {
    /*
    The user is presented with a list of all available userTypes and those userTypes
    that the user is already subscribed to, the relevant status is set ('Active' or 'Inactive')
    If the user doesn't subscribe to a particular userType then this is set to 'Inactive' to make processing
    of the status easier when it comes to update. 
    These userTypes are held in the userStore and provide the baseline for the userType state at the point of entry.
    When a change is made to the userTypes via the form the state of userTypes on the form are compared to the baseline
    state in the userStore. If there is a difference then the form is flagged as dirty and the 'Save/Cancel'buttons
    revealed. Conversely, if the form is clean, they are removed from the DOM.
     */

    /*
    Enumerate the userTypes in the store - which will be a list of all available userTypes with the relevant status set
        We use the unique userType index to label each userType form field with an id of the form userTypennn where nnn is the index number
        We compare the userType in the userStore with the equivalent userType field in the DOM to see if there is a change in its Status
        All we really want to know is whether or not the store says active and the checkbox is now unchecked or if the store says false and now
        the form is now checked
     */
    flgActiveUserTypesFound.value = false
    for (let i = 0; i < userStore.userTypes.length; i++) {
        let userTypeIndex = userStore.userTypes[i].id
        let userTypeCheckbox = document.getElementById('userType' + userTypeIndex)
        if(userTypeCheckbox.checked === true){
            flgActiveUserTypesFound.value = true
        }
        //console.log("store value for " + userStore.userTypes[i].id + " is " + userStore.userTypes[i].user_type_status + " " + "test dom is " + userTypeIndex + " " + userTypeCheckbox.name + " " + userTypeCheckbox.checked)
        if ((userStore.userTypes[i].user_type_status === "Active" && userTypeCheckbox.checked === false) ||
              (userStore.userTypes[i].user_type_status !== "Active" && userTypeCheckbox.checked === true)) {
            isDirty.value = true
            break
        } else {
            isDirty.value = false
        }
    }
    if (!flgActiveUserTypesFound.value) {
        warningMessage.warningTitle = "Warning - no active user types defined"
        warningMessage.text = "Please select all of the relevant roles from the options available"
    }else{
        warningMessage.warningTitle = ""
        warningMessage.text = ""
    }
    //console.log("form is dirty " + isDirty.value)
}
async function loadUserTypes () {
    /*
    loadUserTypes is run via the onMounted hook and also triggered by the v-on:refresh
    event that can be emitted by the UserTypeCard and UserTypeDetails components to indicate
    that a change to the user's UserTypes has taken place and the UserTypes in the userStore
    should be updated and the UserTypeCards refreshed with hose new details
     */
    try {
        flgActiveUserTypesFound.value = false               /* presume that there are no userTypes attached to the user in question */
        userStore.userTypes = await getUserTypes()          /* get a list of all the userTypes that are available in the system */
        let userUserTypes = await getUserUserTypes(userID)  /* get a list of the userTypes actually attached to this user along with their status */
        console.log(userUserTypes)
        processForm.value=true
        /*
        The userStore will now hold a list of all the available userTypes in the system
        We now Iterate the list of the userTypes actually attached to the user
        For each one found in the userStore,
            we attach the userTypeStatus to the list of all userTypes in the userStore
            flag if at least one Active userType is attached to the user
            Active statuses will appear as checked in the option boxes
         */
        for (let i = 0; i < userUserTypes.length; i++) {
            console.log(userUserTypes[i])
            let myIndex = (userStore.userTypes.findIndex(({user_type}) => user_type === userUserTypes[i].user_type))
            console.log(myIndex)
            if (myIndex!==null) {
                console.log(myIndex)
                userStore.userTypes[myIndex].user_type_status = userUserTypes[i].user_type_status
                if (userStore.userTypes[myIndex].user_type_status === "Active") {
                    flgActiveUserTypesFound.value = true
                }
            }
        }
        /*
        We then reiterate the userTypes in the userStore and for any that are not alreay attached to the user, we flag them as 'Undefined'
        This will enable us to work out if there has been any real change of state for a given userType at the time of update
         */
        for (let i = 0; i < userStore.userTypes.length; i++) {
            //console.log(userStore.userTypes[i].id + " " + userStore.userTypes[i].user_type + " " + userStore.userTypes[i].user_type_status)
            if (typeof (userStore.userTypes[i].user_type_status) == 'undefined') {
                userStore.userTypes[i].user_type_status = "Undefined"
            }

        }
        /* if we haven't found any active userTypes attached to the user
                set a warning message for the user
         */
        if (!flgActiveUserTypesFound.value) {
            warningMessage.warningTitle = "Warning - no active user types defined"
            warningMessage.text = "Please select all of the relevant roles from the options available"
        }else{
            warningMessage.warningTitle = ""
            warningMessage.text = ""
        }
    } catch (e) {
        processForm.value=false
        errorMessageHandler(e,generalError)
    }
}
const onCancelled = async () => {
    /*
    Restore the form checkboxes to their original state based upon what
    is in the userTypes in the userStore
    The reset the form to clean
     */
    for (let i = 0; i < userStore.userTypes.length; i++) {
        let userTypeCheckbox = document.getElementById('userType' + userStore.userTypes[i].id)
        if(userStore.userTypes[i].user_type_status==='Active'){
            userTypeCheckbox.checked=true
        }else{
            userTypeCheckbox.checked=false
        }
    }
    isDirty.value=false
}
/*
-------------------------------------------------------------------------------
Lifecycle Hooks
-------------------------------------------------------------------------------*/

</script>

<style scoped>

</style>