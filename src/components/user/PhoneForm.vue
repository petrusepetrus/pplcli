<template>
    <BaseSpinner v-if="isLoading">

    </BaseSpinner>
    <div v-if="!isLoading" class="rounded border border-grey p-2">
        <form novalidate v-on:submit="onSubmit" class="space-y-6 ">
            <div class="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                <div class="sm:col-span-2">
                    <BaseSelect
                          label="Phone number type"
                          :options="phone_types"
                          v-model="phone_type"
                          :selected="phone_type"
                          :error="errors.phone_type"
                    >
                    </BaseSelect>
                </div>
            </div>
            <div class="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">

                <div class="sm:col-span-3">
                    <BaseInput
                          type="string"
                          :required="true"
                          placeholder="Phone Number"
                          autocomplete="Phone Number"
                          label="Phone Number"
                          name="phone_number"
                          :error="errors.phone_number"
                          v-model="phone_number">
                    </BaseInput>
                </div>
                <div class="sm:col-span-2">
                    <BaseSelect
                          label="Country"
                          :options="countries"
                          v-model="country"
                          :error="errors.country"
                    >
                    </BaseSelect>
                </div>
            </div>
            <div class="sm:col-span-3">
                <BaseCheckbox
                      label="Preferred contact number"
                      label-description="We will use this as your main contact number"
                      v-model="preferred_contact_number"
                >
                </BaseCheckbox>
            </div>
            <div class="mt-2 flex items-center flex-wrap sm:flex-nowrap">
                <div class="mr-2">
                    <BaseButton v-if="isDirty"
                                title="Save"
                                :submitting="isSubmitting"
                                :disabled="isSubmitting"
                    />
                </div>
                <div class="mr-2">
                    <BaseButton v-on:click="onCancel"
                                title="Cancel"
                                :disabled="isSubmitting"
                    />
                </div>
            </div>
            <div class="mt-6 lg:col-span-1 md:col-span-1 sm:col-span-4">
                <BaseErrorMessage v-if="errors.general">
                    {{ errors.general }}
                </BaseErrorMessage>
            </div>
            <div class="mt-6 lg:col-span-1 md:col-span-1 sm:col-span-4">
                <BaseInformationMessage v-if="updateMessages && !isDirty">
                    {{ updateMessages }}
                </BaseInformationMessage>
            </div>
        </form>
    </div>
</template>

<script setup>
/* ----------------------------------------------------------------------------
Overview

The PhoneForm component manages
- the addition or change of a user's phone details
-------------------------------------------------------------------------------
/*------------------------------------------------------------------------------
Imports
------------------------------------------------------------------------------*/
/*
Vue
*/
import {onMounted, ref, toRefs} from 'vue'
/*
Stores
*/
import {useAuthStore} from "../../stores/AuthStore.js";
/*
Validation
*/
import {useField, useForm, useIsFormDirty} from 'vee-validate'
import {boolean, object, string} from 'yup'
/*
Base Components
*/
import BaseSelect from "../ui/BaseSelect.vue";
import BaseInput from "../ui/BaseInput.vue";
import BaseButton from "../ui/BaseButton.vue";
import BaseInformationMessage from "../ui/BaseInformationMessage.vue";
import BaseErrorMessage from "../ui/BaseErrorMessage.vue";
import BaseCheckbox from "../ui/BaseCheckbox.vue";
import BaseSpinner from "../ui/BaseSpinner.vue";
/*
API
*/
import useMiscService from "../../services/misc/useMiscService.js";
import useUserService from "../../services/user/useUserService.js";
/*------------------------------------------------------------------------------
Props
------------------------------------------------------------------------------*/
/*
If we are adding a phone
    the userPhone prop will be null
otherwise
    it will contain the set of phone details to be changed
 */
const props = defineProps({
    userPhone: {}
})
/*-----------------------------------------------------------------------------
Emits
cancelled - announces that the action was cancelled
updated - announces that a user was
-------------------------------------------------------------------------------*/
const emit = defineEmits(['cancelled', 'updated'])
/*-----------------------------------------------------------------------------
Variable Declaration and Initialisation
-------------------------------------------------------------------------------*/
/*
Stores
*/
const authStore = useAuthStore()
/*
Services
*/
const {getCountries} = useMiscService()
const {getAvailablePhoneTypes} = useUserService()
const {getPhoneTypes} = useMiscService()
const {updateUserPhone, addUserPhone} = useUserService()
/*
Refs
*/
const updateMessages = ref('')
let phone_types = ref([])
let countries = ref([])
let isLoading=ref(true)

/*
default changeMode to false
if we have a userPhone prop
    we are changing an existing phone so set changeMode to true
 */
let changeMode = false
if (props.userPhone != null) {
    changeMode = true
}

/*
Initialise the userID we are dealing with
TODO
we should accept this as a prop to make the component reusable
*/
const userID = authStore.user.id

/*
Set up the default entries for the form fields and
other items assuming we have entered the form to add an
address.
If, however, we have been passed a user address as a prop then we
are going to change an existing address so default the form fields
to their corresponding prop values
*/
let formValues;
let phoneId
let preferredContactNumberBoolean = false

if (changeMode) {
    if (props.userPhone.preferred_contact_number === 1) {
        preferredContactNumberBoolean = true
    }
    formValues = {
        phone_type: props.userPhone.phone_type,
        phone_number: props.userPhone.phone_number,
        country: props.userPhone.country,
        preferred_contact_number: preferredContactNumberBoolean
    }
    phoneId = props.userPhone.id
} else {
    formValues = {
        phone_type: "",
        phone_number: "",
        preferred_contact_number: false,
        country:"UK"
    };
}

/*
Define the validation schema
*/
const validationSchema = object({
    phone_type: string().required('Please select a phone type'),
    phone_number: string().required('Please enter your phone number'),
    country: string().required('Please select a country'),
    preferred_contact_number: boolean(),
})

/*
Implement the schema and initialise the fields
 */
const {handleSubmit, isSubmitting, setErrors, errors} = useForm({
    validationSchema,
    initialValues: formValues
})
/*
Track whether the form is dirty
 */
const isDirty = useIsFormDirty()

/*
map the fields in vee-validate
*/
let {value: phone_type} = useField('phone_type')
let {value: phone_number, handleChange} = useField('phone_number')
let {value: country} = useField('country')
let {value: preferred_contact_number} = useField('preferred_contact_number')

/*-----------------------------------------------------------------------------
Functions
-------------------------------------------------------------------------------*/
/*
Handle the form submission
 */
const onSubmit = handleSubmit(async (values, {resetForm}) => {
    /*
    Pull out the country and phone type ids to be stored
     */
    for (const [key, value] of Object.entries(countries.value)) {
        if (value === country.value) {
            values.country_id = (key)
        }
    }
    for (const [key, value] of Object.entries(phone_types.value)) {
        if (value === phone_type.value) {
            values.phone_type_id = (key)
        }
    }

    /*
    If we are changing an existing record
        update the phone details
    Otherwise
        add a new phone
     */
    if (changeMode) {
        try {
            isSubmitting.value = true
            await updateUserPhone(values, userID, props.userPhone.id)
            isSubmitting.value = false
            emit('updated')
            resetForm({
                values: {
                    phone_type: props.userPhone.phone_type,
                    phone_number: props.userPhone.phone_number,
                    country: props.userPhone.country,
                    preferred_contact_number: preferredContactNumberBoolean
                },
            })
        } catch (e) {
            console.log("processing error ", e)
            setErrors(e)
        }
    } else {
        try {
            isSubmitting.value = true
            await addUserPhone(values, userID)
            isSubmitting.value = false
            emit('updated')
        } catch (e) {
            console.log("processing error ", e)
            setErrors(e)
        }
    }

    return {
        onSubmit,
        phone_type,
        phone_number,
        country,
        preferred_contact_number,
        handleChange,
        errors
    }
})

/*
Announce to the parent that the user cancelled the edit
 */
const onCancel = () => {
    emit('cancelled')
}

/*
Initialise the countries and phone type variables
 */
onMounted(async () => {
    try {
        countries.value = await getCountries()
    } catch (e) {
        console.log("processing error ", e)
        console.log(e)
        setErrors(e)
    }
    if (changeMode) {
        try {
            phone_types.value = await getPhoneTypes()
        } catch (e) {
            console.log("processing error ", e)
            console.log(e)
            setErrors(e)
        }
    } else {
        try {
            phone_types.value = await getAvailablePhoneTypes(userID)
            console.log(phone_types.value)
        } catch (e) {
            console.log("processing error ", e)
            console.log(e)
            setErrors(e)
        }
    }
    isLoading.value=false
})
</script>

<style scoped>

</style>