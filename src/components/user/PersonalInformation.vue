<template>
    <form novalidate v-on:submit="onSubmit" class="space-y-6">
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
            <div class="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                <div class="sm:col-span-3">
                    <BaseInput
                          type="string"
                          :required="true"
                          placeholder="first name"
                          autocomplete="first name"
                          label=" First name"
                          name="first_name"
                          :error="errors.first_name"
                          v-model="first_name"
                    >
                    </BaseInput>
                </div>

                <div class="sm:col-span-3">
                    <BaseInput
                          type="string"
                          :required="true"
                          placeholder="last name"
                          autocomplete="last name"
                          label="Last name"
                          name="last_name"
                          :error="errors.last_name"
                          v-model="last_name"
                    >
                    </BaseInput>
                </div>

                <div class="sm:col-span-4">
                    <BaseInput
                          type="email"
                          :required="true"
                          placeholder="email address"
                          autocomplete="email"
                          label="Email address"
                          name="email_address"
                          :error="errors.email"
                          v-model="email"
                    >
                    </BaseInput>
                </div>
                <div>

                </div>
            </div>
            <div class="mt-6 flex items-center flex-wrap sm:flex-nowrap">
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
                          v-if="isDirty"
                          v-on:click="onCancel"
                          title="Cancel"
                          :submitting="isSubmitting"
                          :disabled="isSubmitting"
                    >
                    </BaseButton>
                </div>
            </div>
            <div class="mt-6 lg:col-span-1 md:col-span-1 sm:col-span-4" v-if="errors.general">
                <BaseErrorMessage>
                    {{ errors.general }}
                </BaseErrorMessage>
            </div>
            <div class="mt-6 lg:col-span-1 md:col-span-1 sm:col-span-4"  v-if="updateMessages && !isDirty">
                <BaseInformationMessage>
                    {{ updateMessages }}
                </BaseInformationMessage>
            </div>
        </div>
    </form>
</template>

<script setup>
/*
Vue
*/
import {ref} from "vue";
const updateMessages = ref('')
/*
Auth services
 */
import useAuthService from "../../services/auth/useAuthService";
const {updateUser} = useAuthService()
/*
Store
 */
import {useAuthStore} from "../../stores/AuthStore";
const authStore = useAuthStore()
/*
Validation
 */
import {useField, useForm, useIsFormDirty, useIsFieldDirty} from 'vee-validate'
import {object, string} from 'yup'
/*
Base Components
 */
import BaseButton from "../ui/BaseButton.vue"
import BaseInput from "../ui/BaseInput.vue";
import BaseErrorMessage from "../ui/BaseErrorMessage.vue";
import BaseInformationMessage from "../ui/BaseInformationMessage.vue";

import {hasRole} from "../../utils/RolesAndPermissions.js";
/*
Set up the vee-validate validation items
*/
/*
Set the field values to be used in the form from the store items
 */
const formValues = {
    first_name: authStore.user.first_name,
    last_name: authStore.user.last_name,
    email: authStore.user.email
}

/*
Define the validation schema
 */
const validationSchema = object({
    first_name: string().required('Please enter your first name'),
    last_name: string().required('Please enter your last name'),
    email: string().email('Invalid email format').required('An email address is required'),
})
/*
Implement the schema and initialise the fields
 */
const {handleSubmit, isSubmitting, setErrors, errors,resetForm} = useForm({
    validationSchema,
    initialValues: formValues
})
/*
Track whether the form is dirty and specifically, whether the email field is dirty
 */
const isDirty = useIsFormDirty()
const isEmailDirty = useIsFieldDirty('email')
/*
map the fields in vee-validate
 */
let {value: first_name, handleChange} = useField('first_name')
let {value: last_name} = useField('last_name')
let {value: email} = useField('email')

console.log(hasRole(['super admin']))
/*
Handle any submissions
 */
const onSubmit = handleSubmit(async (values,{resetForm}) => {

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
        await updateUser(values)
        isSubmitting.value = false
        updateMessages.value = 'Congratulations, your changes have been saved.'
        if (isEmailDirty.value===true) {
            updateMessages.value += ' We have sent you a verification mail to your new email address.'
            updateMessages.value += ' When you next log in please use your new email address and your existing password.'
            updateMessages.value += ' You will need to have verified your new email to regain full access to your account.'
        }
        resetForm({
            values:{
                first_name: authStore.user.first_name,
                last_name: authStore.user.last_name,
                email: authStore.user.email
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
const onCancel=()=>{
        resetForm()
        updateMessages.value = ''
}
</script>


<style scoped>

</style>