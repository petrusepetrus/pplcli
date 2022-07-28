<template>
    <BaseSpinner v-if="isLoading">

    </BaseSpinner>
    <div v-if="!isLoading" class="rounded border border-grey p-2">
        <form novalidate class="space-y-6 " @submit="onSubmit">
            <div class="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                <div class="sm:col-span-2">
                    <BaseSelect
                          v-model="address_type"
                          label="Address type"
                          :options="address_types"
                          :error="errors.address_type"
                    >
                    </BaseSelect>
                </div>
            </div>
            <div class="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                <div class="sm:col-span-3">
                    <BaseInput
                          v-model="address_line_1"
                          type="string"
                          :required="true"
                          placeholder="Address Line 1"
                          autocomplete="Address Line 1"
                          label="Address Line 1"
                          name="address_line_1"
                          :error="errors.address_line_1">
                    </BaseInput>
                </div>
                <div class="sm:col-span-3">
                    <BaseInput
                          v-model="address_line_2"
                          type="string"
                          :required="false"
                          placeholder="Address Line 2"
                          autocomplete="Address Line 2"
                          label="Address Line 2"
                          name="address_line_2"
                          :error="errors.address_line_2">
                    </BaseInput>
                </div>
                <div class="sm:col-span-2">
                    <BaseInput
                          v-model="town"
                          type="string"
                          :required="true"
                          placeholder="Town"
                          autocomplete="Town"
                          label="Town"
                          name="town"
                          :error="errors.town">
                    </BaseInput>
                </div>
                <div class="sm:col-span-2">
                    <BaseInput
                          v-model="region"
                          type="string"
                          :required="true"
                          placeholder="Region"
                          autocomplete="Region"
                          label="Region"
                          name="region"
                          :error="errors.region">
                    </BaseInput>
                </div>
                <div class="sm:col-span-2">
                    <BaseInput
                          v-model="postal_code"
                          type="string"
                          :required="true"
                          placeholder="Postal code"
                          autocomplete="Postal code"
                          label="Postal code"
                          name="postal_code"
                          :error="errors.postal_code">
                    </BaseInput>
                </div>
                <div class="sm:col-span-2">
                    <BaseSelect
                          v-model="country"
                          label="Country"
                          :options="countries"
                          :error="errors.country"
                    >
                    </BaseSelect>
                </div>


            </div>
            <div class="sm:col-span-3">
                <BaseCheckbox
                      v-model="preferred_contact_address"
                      label="Preferred contact address"
                      label-description="We will use this as your main correspondence address"
                >
                </BaseCheckbox>
            </div>
            <div class="mt-2 flex items-center flex-wrap sm:flex-nowrap">
                <div class="mr-2">
                    <BaseButton
                          v-if="isDirty"
                          title="Save"
                          :submitting="isSubmitting"
                          :disabled="isSubmitting"
                    />
                </div>
                <div class="mr-2">
                    <BaseButton
                          title="Cancel"
                          :disabled="isSubmitting"
                          @click="onCancel"
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
<script>
// use normal <script> to declare options
export default {
    inheritAttrs: false
}
</script>
<script setup>
/*------------------------------------------------------------------------------
Imports
------------------------------------------------------------------------------*/
/*
Vue
*/
import {onBeforeMount, onMounted, ref} from 'vue'
/*
Stores
*/
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
If we are adding and address
    the userAddress prop will be null
otherwise
    it will contain the set of address details to be changed
 */
const props = defineProps({
    userAddress: {},
    userID: String
})
/*-----------------------------------------------------------------------------
Emits
refresh - triggers a refresh of the user's phone list in the parent
cancelled - announces that the action was cancelled
updated - announces that a user was
-------------------------------------------------------------------------------*/
const emit = defineEmits(['refresh', 'cancelled', 'updated'])
/*-----------------------------------------------------------------------------
Variable Declaration and Initialisation
-------------------------------------------------------------------------------*/
/*
Stores
*/

/*
Services
*/
const {getCountries} = useMiscService()
const {getAvailableAddressTypes} = useUserService()
const {getAddressTypes} = useMiscService()
const {updateUserAddress, addUserAddress} = useUserService() // The update and add functions for maintaining addresses
/*
Refs
*/
const updateMessages = ref('')
let countries = ref([])
let address_types = ref([])
let isLoading = ref(true)


initialiseForm()
/*
default changeMode to false
if we have a userPhone prop
    we are changing an existing phone so set changeMode to true
 */
let changeMode = false
if (props.userAddress != null) {
    changeMode = true
}
/*
Initialise the userID we are dealing with
TODO
we should accept this as a prop to make the component reusable
*/
//const userID = authStore.user.id

/*
Set up the default entries for the form fields and
other items assuming we have entered the form to add an
address.
If, however, we have been passed a user address as a prop then we
are going to change an existing address so default the form fields
to their corresponding prop values
*/
let formValues;
let preferredContactAddressBoolean = false

if (changeMode) {
    if (props.userAddress.value.preferred_contact_address === 1) {
        preferredContactAddressBoolean = true
    }
    formValues = {
        address_type: props.userAddress.value.address_type,
        address_line_1: props.userAddress.value.address_line_1,
        address_line_2: props.userAddress.value.address_line_2,
        town: props.userAddress.value.town,
        region: props.userAddress.value.region,
        postal_code: props.userAddress.value.post_code,
        country: props.userAddress.value.country,
        preferred_contact_address: preferredContactAddressBoolean
    }
} else {
    formValues = {
        address_type: "",
        address_line_1: "",
        address_line_2: "",
        town: "",
        region: "",
        postal_code: "",
        country: "UK",
        preferred_contact_address: false
    };
}
/*
Define the validation schema
 */
const validationSchema = object({
    address_type: string().required('Please select an address type'),
    address_line_1: string().required('Please enter your address'),
    address_line_2: string().nullable(),
    town: string().required('Please enter your town'),
    region: string().required('Please enter your region'),
    postal_code: string().required('A postal code is required'),
    country: string().required('Please select a country'),
    preferred_contact_address: boolean(),
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
let {value: address_type} = useField('address_type')
let {value: address_line_1, handleChange} = useField('address_line_1')
let {value: address_line_2} = useField('address_line_2')
let {value: town} = useField('town')
let {value: region} = useField('region')
let {value: postal_code} = useField('postal_code')
let {value: country} = useField('country')
let {value: preferred_contact_address} = useField('preferred_contact_address')

/*-----------------------------------------------------------------------------
Functions
-------------------------------------------------------------------------------*/
/*
Handle the form submission
 */
const onSubmit = handleSubmit(async (values, {resetForm}) => {
    /*
    Pull out the country and address type ids to be stored
     */
    for (const [key, value] of Object.entries(countries.value)) {
        if (value === country.value) {
            values.country_id = (key)
        }
    }
    for (const [key, value] of Object.entries(address_types.value)) {
        if (value === address_type.value) {
            values.address_type_id = (key)
        }
    }
    /*
    If we are changing an existing record
        update the address details
    Otherwise
        add a new address
     */
    if (changeMode === true) {
        try {
            isSubmitting.value = true
            await updateUserAddress(values, props.userID, props.userAddress.value.id)
            emit('updated')
            resetForm({
                values: {
                    address_type: props.userAddress.address_type,
                    address_line_1: props.userAddress.address_line_1,
                    address_line_2: props.userAddress.address_line_2,
                    town: props.userAddress.town,
                    region: props.userAddress.region,
                    postal_code: props.userAddress.post_code,
                    country: props.userAddress.country,
                    preferred_contact_address: props.userAddress.preferrred_contact_address
                },
            })
            isSubmitting.value = false
        } catch (e) {
            console.log("processing error ", e)
            setErrors(e)
        }
    } else {
        try {
            isSubmitting.value = true
            await addUserAddress(values, props.userID)
            isSubmitting.value = false
            emit('refresh')
        } catch (e) {
            console.log("processing error ", e)
            setErrors(e)
        }
    }

    return {
        onSubmit,
        address_type,
        address_line_1,
        address_line_2,
        town,
        region,
        postal_code,
        country,
        preferred_contact_address,
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
Initialise the countries and address type variables
 */
async function initialiseForm() {
    try {
        countries.value = await getCountries()
    } catch (e) {
        console.log("processing error ", e)
        console.log(e)
        setErrors(e)
    }
    if (changeMode === true) {
        console.log("getting change types")
        try {
            address_types.value = await getAddressTypes()
        } catch (e) {
            console.log("processing error ", e)
            console.log(e)
            setErrors(e)
        }
    } else {
        try {
            console.log(props.userID)
            address_types.value = await getAvailableAddressTypes(props.userID)
            /*
            TODO
            Pull out the first of the remaining address types to pre-populate field
            and mirror in PhoneForm
             */
        } catch (e) {
            console.log("processing error ", e)
            console.log(e)
            setErrors(e)
        }
    }
    isLoading.value = false

}
</script>

<style scoped>

</style>