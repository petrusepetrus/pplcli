<template>
    <form novalidate v-on:submit="onSubmit" class="space-y-6">
        <div class="pt-8">
            <div>
                <h3 class="text-lg leading-6 font-medium text-gray-900">Personal Information</h3>
                <p class="mt-1 text-sm text-gray-500">Use a permanent address where you can receive
                    mail.</p>
            </div>
            {{ user }}
            <div class="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                <div class="sm:col-span-3">
                    <BaseInput
                          type="string"
                          :required="true"
                          placeholder="first name"
                          autocomplete="first name"
                          label=" First name"
                          name="first-name"
                          :error="errors.first_name"
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
                          name="email"
                          :error="errors.email"
                    >
                    </BaseInput>
                </div>
                <div>

                </div>
            </div>
            <div class="lg:col-span-1 md:col-span-1 sm:col-span-4">
                <BaseButton v-if="isDirty"
                      title="Save Changes"
                      :submitting="isSubmitting"
                      :disabled="isSubmitting"
                />
            </div>
            <BaseErrorMessage v-if="errors.general">
                {{ errors.general }}
            </BaseErrorMessage>
        </div>
    </form>
</template>

<script setup>
/*
Vue
*/
import {reactive, ref} from "vue";
/*
Auth services
 */
import useAuthService from "../../services/auth/useAuthService";
/*
Store
 */
import {useAuthStore} from "../../stores/AuthStore";
import {storeToRefs} from 'pinia'
/*
Validation
 */
import {useField, useForm, useIsFormDirty} from 'vee-validate'
import {object, string} from 'yup'

import BaseButton from "../ui/BaseButton.vue"
import BaseInput from "../ui/BaseInput.vue";
import BaseErrorMessage from "../ui/BaseErrorMessage.vue";

const {user}=useAuthStore()
const displayButton=ref(false)
/*
Set up the vee-validate validation items
 */
const formValues={
    firstName:user.first_name,
    lastName:user.last_name,
    email:user.email
}
const validationSchema = object({
    firstName:string().required('Please enter your first name'),
    lastName:string().required('Please enter your last name'),
    email: string().email('Invalid email format').required('An email address is required'),
})
const {handleSubmit, isSubmitting, setErrors, errors} = useForm({
    validationSchema,
    initialValues:formValues
})
const isDirty=useIsFormDirty()

const {value: firstName} = useField('firstName')
const {value: lastName} = useField('lastName')
const {value: email, handleChange} = useField('email')

const onSubmit = handleSubmit(async values => {
    /*
    attempt to login
    if successful
        the login process will have retrieved the user information from the back end
        and put this into the authStore. We then check to see if the user is authenticated and
        verified before we direct them to the dashboard If they are not already verified we route them
        to the verify email page
    otherwise
        output the error to the user
     */
    try {
        await login(values)
        if (authStore.isAuthenticated && authStore.isVerified) {
            router.push({name: "dashboard"})
        } else if (!authStore.isVerified) {
            router.push({name: 'verify-email'})
        }
    } catch (e) {
        console.log("processing error ", e)
        console.log(e)
        setErrors(e)
    }
    return {
        onSubmit,
        email,
        handleChange,
        errors
    }
})
</script>


<style scoped>

</style>