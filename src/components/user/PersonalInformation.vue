<template>
    <form novalidate class="space-y-6" @submit="onSubmit">
        <div class="pt-2">
            <div>
                <h3 class="text-lg leading-6 font-medium text-gray-900">Personal Information</h3>
                <p class="my-4 text-sm text-gray-500">
                    If any of your personal details have changed please amend as
                    appropriate.
                </p>
                <p class="my-4 text-sm text-gray-500">
                    Please note that if you change your email address then, for
                    security reasons, you will be sent a new verification email which you will need to action
                    in order to gain full access to your account.
                </p>
                <p class="my-4 text-sm text-gray-500">
                    Once your email has been verified, please sign back in
                    using your <strong>new email</strong> and your <strong>current password</strong>.
                </p>
            </div>
            <div v-if="userFound">
                <div class="container mx-auto">
                    <div class="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-4">
                        <div class="sm:col-span-2">
                            <BaseInput
                                  v-model="first_name"
                                  type="string"
                                  :required="true"
                                  placeholder="first name"
                                  autocomplete="first name"
                                  label=" First name"
                                  name="first_name"
                                  :error="errors.first_name"
                            >
                            </BaseInput>
                        </div>

                        <div class="sm:col-span-2">
                            <BaseInput
                                  v-model="last_name"
                                  type="string"
                                  :required="true"
                                  placeholder="last name"
                                  autocomplete="last name"
                                  label="Last name"
                                  name="last_name"
                                  :error="errors.last_name"
                            >
                            </BaseInput>
                        </div>
                    </div>
                    <div class="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-4">
                        <div class="sm:col-span-2">
                            <BaseInput
                                  v-model="email"
                                  type="email"
                                  :required="true"
                                  placeholder="email address"
                                  autocomplete="email"
                                  label="Email address"
                                  name="email_address"
                                  :error="errors.email"
                            >
                            </BaseInput>
                        </div>
                    </div>

                </div>
                <div class="container mx-auto">
                    <div class="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-4">
                        <div class="mr-2">
                            <BaseButton
                                  v-if="isDirty"
                                  title="Save"
                                  :submitting="isSubmitting"
                                  :disabled="isSubmitting"
                            >
                            </BaseButton>
                        </div>
                        <div>
                            <BaseButton
                                  v-if="isDirty && !isSubmitting"
                                  title="Cancel"
                                  :submitting="isSubmitting"
                                  :disabled="isSubmitting"
                                  @click="onCancel"
                            >
                            </BaseButton>
                        </div>
                    </div>
                </div>
                <div v-if="updateMessages && !isDirty" class="mt-6 lg:col-span-1 md:col-span-1 sm:col-span-4">
                    <BaseInformationMessage>
                        {{ updateMessages }}
                    </BaseInformationMessage>
                </div>
            </div>
            <div v-if="generalError.title" class="mt-6 lg:col-span-1 md:col-span-1 sm:col-span-4">
                <BaseErrorMessage
                      v-if="generalError.title"
                      :error-description=generalError.description
                      :error-title=generalError.title>
                </BaseErrorMessage>
            </div>


        </div>
    </form>
</template>

<script setup>
/* Overview
-------------------------------------------------------------------------------
The AddressInformation component manages
- the presentation of the user address details via the AddressCard components
- the addition of new addresses for a user
- changing a user's address details
-------------------------------------------------------------------------------*/

/* Imports
-------------------------------------------------------------------------------*/
/* Vue
*/
import {ref, reactive, onBeforeMount} from "vue";
/* Vue Router
 */
import {useRoute} from "vue-router";
/* Components
*/
import BaseButton from "../ui/BaseButton.vue"
import BaseInput from "../ui/BaseInput.vue";
import BaseErrorMessage from "../ui/BaseErrorMessage.vue";
import BaseInformationMessage from "../ui/BaseInformationMessage.vue";
/* Services
load the User store to save any pre-existing addresses
load the Auth store as we need to retrieve the User ID of the current user
*/
import useAuthService from "../../services/auth/useAuthService";
import useUserService from "../../services/user/useUserService";
/* Stores
load the User store to save any pre-existing addresses
load the Auth store as we need to retrieve the User ID of the current user
 */
import {useAuthStore} from "../../stores/AuthStore";
import {useUserStore} from "../../stores/UserStore.js";
/* API
load the getUserAddresses service to retrieve any existing user addresses
 */
/* vee-validate
load the getUserAddresses service to retrieve any existing user addresses
 */
import {useField, useForm, useIsFormDirty, useIsFieldDirty} from 'vee-validate'
import {object, string} from 'yup'
/* Others
 */
import generalUtilities from "../../utils/GeneralUtilities.js";

const {testIfPromise} = generalUtilities()
/*-------------------------------------------------------------------------------*/
/* Emits
------------------------------------------------------------------------------- */
/*-------------------------------------------------------------------------------*/

/* Variable Declaration and Initialisation
------------------------------------------------------------------------------- */
const route = useRoute();
const userID = route.params.userID
const updateMessages = ref('')
const {updateCurrentAuthenticatedUser} = useAuthService()
const {getUser, updateUserProfile} = useUserService()
const authStore = useAuthStore()
const userStore = useUserStore()
const generalError = reactive({})
let userFound=ref(false)

/* vee-validate form values */
const formValues = {
    first_name: userStore.user.first_name,
    last_name: userStore.user.last_name,
    email: userStore.user.email
}
/* vee-validate schema */
const validationSchema = object({
    first_name: string().required('Please enter your first name'),
    last_name: string().required('Please enter your last name'),
    email: string().email('Invalid email format').required('An email address is required'),
})
/* Implement the schema and initialise the fields  */
const {handleSubmit, isSubmitting, setErrors, errors, resetForm} = useForm({
    validationSchema,
    initialValues: formValues
})
/* Track whether the form is dirty and specifically, whether the email field is dirty  */
const isDirty = useIsFormDirty()
const isEmailDirty = useIsFieldDirty('email')
/* map the fields in vee-validate  */
let {value: first_name, handleChange} = useField('first_name')
let {value: last_name} = useField('last_name')
let {value: email} = useField('email')
/*-------------------------------------------------------------------------------*/

/* Functions
------------------------------------------------------------------------------- */
/*  handleSubmit
We have submitted a change to the user profile information so update the fields
as appropriate
 */
/*-------------------------------------------------------------------------------*/
const onSubmit = handleSubmit(async (values, {resetForm}) => {
    /*
    attempt to update the user
    if successful
        the update user process will change the relevant details for the user in the back end
        it will also populate the authStore with the new user details
        if the user's email has been changed the back end will send a verification email
    otherwise
        output the error to the user
    */
    try {
        console.log(Number(userID) + " " + Number(authStore.user.id))

        if (Number(userID) === Number(authStore.user.id)) {
            console.log("same user")
            await updateCurrentAuthenticatedUser(values)
            userStore.user = authStore.user
        } else {
            console.log("different user")
            await updateUserProfile(values, userID)
        }
        isSubmitting.value = false
        updateMessages.value = 'Congratulations, your changes have been saved.'
        if (isEmailDirty.value === true) {
            updateMessages.value += ' We have sent you a verification mail to your new email address.'
            updateMessages.value += ' When you next log in please use your new email address and your existing password.'
            updateMessages.value += ' You will need to have verified your new email to regain full access to your account.'
        }
        await getUserToBeEdited(userID)
        resetForm({
            values: {
                first_name: userStore.user.first_name,
                last_name: userStore.user.last_name,
                email: userStore.user.email
            },
        })
    } catch (e) {
        console.log("processing error ", e)
        setErrors(e)
    }
    return {
        onSubmit,
        first_name,
        last_name,
        email,
        handleChange,
        errors
    }
})
const getUserToBeEdited = (async (userID) => {
    try {
        let response = await getUser(userID)
        userFound.value=true
        const userStore = useUserStore()
        userStore.user.id = response.data.id
        userStore.user.first_name = response.data.first_name
        userStore.user.last_name = response.data.last_name
        userStore.user.name = response.data.name
        userStore.user.email = response.data.email
        userStore.user.avatar = response.data.avatar
        userStore.user.email_verified_at = response.data.email_verified_at
        userStore.verified = !!response.data.email_verified_at;
        userStore.userRoles = response.data.roles
        userStore.userPermissions = response.data.permissions
        resetForm({
            values: {
                first_name: userStore.user.first_name,
                last_name: userStore.user.last_name,
                email: userStore.user.email
            },
        })
    } catch (e) {
        console.log("we broke it")
        userFound.value=false
        if (testIfPromise(e)) {
            e.then((value) => {
                /*
                The error handler throws a promise.reject so we need to resolve the promise
                to access the error information
                 */
                generalError.title = value.title
                generalError.description = value.description
                //error.description=e
            })
        } else {
            generalError.title = e
        }

    }
})
const onCancel = () => {
    resetForm()
    updateMessages.value = ''
}
/* Lifecycle Hooks
---------------------------------------------------------------------------------*/

/*-------------------------------------------------------------------------------*/
onBeforeMount(async () => {
    console.log(userID)
    try {
        await getUserToBeEdited(userID)
        console.log("Im free")
    } catch (e) {
        userFound.value=false
        console.log("Rubbish")
        if (testIfPromise(e)) {
            e.then((value) => {
                /*
                The error handler throws a promise.reject so we need to resolve the promise
                to access the error information
                 */
                generalError.title = value.title
                generalError.description = value.description
                //error.description=e
            })
        } else {
            generalError.title = e
        }
    }
})
</script>


<style scoped>

</style>