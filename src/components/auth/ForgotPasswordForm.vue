<template>
    <div class="min-h-full flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div class="sm:mx-auto sm:w-full sm:max-w-md">
            <img class="mx-auto h-12 w-auto" src="principle group 330 130 transparent.png"
                 alt="Workflow"/>
            <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">Forgot your password</h2>
            <p class="mt-4 text-center text-sm text-gray-600">
                Please enter the email address to send the password reset link to
            </p>
            <p class="mt-4 text-center text-sm text-gray-600">
                Or, if you've remembered your password
                {{ ' ' }}
                <router-link class="font-medium text-indigo-600 hover:text-indigo-500"
                             to="/login">sign in to your account
                </router-link>
            </p>
        </div>
        <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
            <div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                <form v-on:submit.prevent="onSubmit" class="space-y-6" novalidate>
                    <div class="mt-1">
                        <BaseInput
                              type="email"
                              :required="true"
                              placeholder="email address"
                              autocomplete="email"
                              label="Email"
                              name="email"
                              v-model="email"
                              :error="errors.email"
                              >
                        </BaseInput>
                    </div>
                    <div>
                        <BaseButton
                        title="Send Reset Password Link"
                        :submitting="isSubmitting"
                        :disabled="isSubmitting"
                        />
                    </div>
                    <BaseInformationMessage v-if="informationMessage">
                        {{ informationMessage.general}}
                    </BaseInformationMessage>
                    <BaseErrorMessage v-if="errors.general">
                        {{errors.general}}
                    </BaseErrorMessage>
                </form>
            </div>
        </div>
    </div>
</template>

<script setup>
/*
Vue
 */
import {reactive,ref} from "vue";
/*
Auth services
 */
import useAuthService from "../../services/auth/useAuthService";
/*
Validation
 */
import {useField, useForm} from 'vee-validate'
import {object, string} from 'yup'
/*
Base Components
 */
import BaseInput from "../ui/BaseInput.vue";
import BaseInformationMessage from "../ui/BaseInformationMessage.vue";
import BaseErrorMessage from "../ui/BaseErrorMessage.vue";
import BaseButton from "../ui/BaseButton.vue";

const {sendResetEmail} = useAuthService()
const form = reactive({
    email: '',
})
const informationMessage=ref({})
/*
Set up the vee-validate validation items
 */
const validationSchema = object({
    email: string().email('Invalid email format').required('An email address is required'),
})
const {handleSubmit, isSubmitting,  setErrors, errors,myMessage} = useForm({
    validationSchema
})
const {value: email, handleChange} = useField('email')
/*
On form submission
 */
const onSubmit = handleSubmit(async values => {
    /*
    attempt to send the reset password email
    if successful
        generate a success message for the user
    otherwise
        output the error to the user
     */
    try{
        await sendResetEmail(values)
        let tmpMessage={}
        tmpMessage.general = 'We have emailed your password reset link.'
        informationMessage.value=tmpMessage
    }catch(e){
        console.log("processing error ", e)
        console.log(e)
        setErrors(e)
    }
    return {
        onSubmit,
        email,
        handleChange,
        errors,
        informationMessage
    }
})


</script>

<style scoped>

</style>