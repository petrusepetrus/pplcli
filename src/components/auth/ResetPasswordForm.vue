<template>
    <div class="min-h-full flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div class="sm:mx-auto sm:w-full sm:max-w-md">
            <img class="mx-auto h-12 w-auto" src="principle group 330 130 transparent.png"
                 alt="Workflow"/>
            <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">Reset Your Password</h2>
            <p class="mt-2 text-center text-sm text-gray-600">
                Or, if you've remembered your password
                {{ ' ' }}
                <router-link class="font-medium text-indigo-600 hover:text-indigo-500"
                             to="/login">sign in to your account
                </router-link>
            </p>
        </div>
        <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
            <div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                <form novalidate v-on:submit.prevent="onSubmit" class="space-y-6">
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
                    <div class="mt-1">
                        <BaseInput

                              type="password"
                              :required="true"
                              placeholder="password"
                              autocomplete="password"
                              label="Password"
                              name="password"
                              v-model="password"
                              :error="errors.password"
                        >
                        </BaseInput>
                    </div>
                    <div class="mt-1">
                        <BaseInput

                              type="password"
                              :required="true"
                              placeholder="password"
                              autocomplete="password"
                              label="Confirm Password"
                              name="password_confirmation"
                              v-model="password_confirmation"
                              :error="errors.password_confirmation"
                        >
                        </BaseInput>
                    </div>
                    <div class="mt-1">
                        <BaseInput
                              type="hidden"
                              :required="true"
                              nodi
                              placeholder="token"
                              autocomplete="token"
                              label=""
                              name="token"
                              v-model="token"
                              :error="errors.token"
                        >
                        </BaseInput>
                    </div>
                    <div class="flex items-center justify-between">
                        <div class="flex items-center">
                            <input id="remember-me" name="remember-me" type="checkbox"
                                   class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"/>
                            <label for="remember-me" class="ml-2 block text-sm text-gray-900"> Remember me </label>
                        </div>

                        <div class="text-sm">
                            <router-link class="font-medium text-indigo-600 hover:text-indigo-500"
                                         to="/forgot-password">Forgot your password
                            </router-link>
                        </div>
                    </div>

                    <div>
                        <BaseButton
                              title="Reset Password"
                              :submitting="isSubmitting"
                              :disabled="isSubmitting"
                        />
                    </div>
                    <BaseErrorMessage v-if="errors.general">
                        {{errors.general }}
                    </BaseErrorMessage>
                    <BaseInformationMessage v-if="informationMessage.general">
                        {{informationMessage.general }}
                    </BaseInformationMessage>
                </form>
            </div>
        </div>
    </div>
</template>
<script setup>
import {reactive} from "vue";
import {useRoute} from 'vue-router'
import useAuthService from "../../services/auth/useAuthService";
import BaseInput from "../ui/BaseInput.vue";
import {useField, useForm} from 'vee-validate'
import {object, string} from 'yup'
import BaseErrorMessage from "../ui/BaseErrorMessage.vue";
import BaseInformationMessage from "../ui/BaseInformationMessage.vue";
import BaseButton from "../ui/BaseButton.vue";

const {resetPassword} = useAuthService()
const route = useRoute()

const form = reactive({
    email: '',
    password: '',
    password_confirmation: '',
    token: '',
})

/*
Set up the validation schema
 */
const validationSchema = object({
    password: string().required('Please enter your password'),
    password_confirmation: string().required('Please enter your password'),
    email: string().email('Invalid email format').required('An email address is required'),
    token:string().required('token must be present')
})
const {handleSubmit, isSubmitting, setErrors, errors} = useForm({
    validationSchema
})
const {value: email, handleChange} = useField('email')
const {value: password} = useField('password')
const {value: password_confirmation} = useField('password_confirmation')
const{value:token}=useField('token')
const informationMessage=reactive({})
/*
Initialise the hidden token field to the token value set by Laravel and passed
back in the /reset-password query parameters
 */
token.value=route.query.token
/*
On submit call the resetPassword endpoint
 */
const onSubmit = handleSubmit(async form => {
    try{
        const resetMessage={}
        await resetPassword(form)
        informationMessage.general='Your password has been reset.'
    }catch(e){
        console.log("processing error ", e)
        console.log(e)
        setErrors(e)
    }
    return {
        onSubmit,
        email,
        password,
        password_confirmation,
        handleChange,
        informationMessage
    }
})

</script>