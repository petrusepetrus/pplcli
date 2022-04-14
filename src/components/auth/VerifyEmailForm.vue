<template>
    <div class="min-h-full flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div class="sm:mx-auto sm:w-full sm:max-w-md">
            <img class="mx-auto h-12 w-auto" src="principle group 330 130 transparent.png"
                 alt="Workflow"/>
            <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">Verify your account</h2>
            <p class="mt-2 text-center text-sm text-gray-600">
                Please verify your email in order to gain full access to your account functionality.
                You will be sent a Verification Email with a link to verify your account.
            </p>
        </div>
        <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
            <div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                <form novalidate v-on:submit.prevent="onSubmit" class="space-y-6">
                    <div>
                        <BaseButton
                              title="Verify Email"
                              :submitting="isSubmitting"
                              :disabled="isSubmitting"
                        />
                    </div>
                    <BaseErrorMessage v-if="isError">
                        {{ errors }}
                    </BaseErrorMessage>
                    <BaseInformationMessage v-if="verifyMessages"
                    >
                        {{ verifyMessages }}
                    </BaseInformationMessage>

                </form>
            </div>
        </div>
    </div>


</template>

<script setup>
import {ref} from 'vue'
import useAuthService from "../../services/auth/useAuthService"
import {useAuthStore} from "../../stores/AuthStore";

const {user} = useAuthStore()
import BaseErrorMessage from "../ui/BaseErrorMessage.vue";
import BaseInformationMessage from "../ui/BaseInformationMessage.vue";
import BaseButton from "../ui/BaseButton.vue";

const verifyMessages = ref('')
const isSubmitting=ref(false)
const isError=ref(false)
const errors=ref({})

const {sendVerificationEmail} = useAuthService()
const onSubmit = async () => {
    try {
        isSubmitting.value=true
        await sendVerificationEmail(user.id)
        verifyMessages.value = 'We have sent a verification email to your email address. Once verified, you will be able to sign into your account.'
    } catch (e) {
        console.log("processing error ", e)
        console.log(e)
        isSubmitting.value=false
        isError.value=true
        errors.value=e.general
    }
    return{
        errors
    }
}

</script>

<style scoped>

</style>