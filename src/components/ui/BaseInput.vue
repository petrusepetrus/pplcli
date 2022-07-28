<template>
    <label
          v-if="label"
          :for="uuid"
          class="block text-sm font-medium text-gray-700"
          :class="{ 'sr-only': !showLabel }"
    >
        {{ label }}
    </label>
    <div class="mt-1">
        <input
              v-bind="{
            ...$attrs,
            onInput:updateValue
             }"
              :id="uuid"
              class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              :type="type"
              :value="modelValue"
              :required="required"
              :placeholder="placeholder"
              :autocomplete="autocomplete"
              :aria-describedby="error ? `${uuid}-error` : null"
              :aria-invalid="error ? true : false"
              :class="{ error }"
        >
        <BaseErrorMessage
              v-if="error"
              :id="`${uuid}-error`"
        >
            {{ error }}
        </BaseErrorMessage>
    </div>
</template>

<script>
import SetupFormComponent from "../../utils/SetupFormComponent";
import UniqueID from "../../utils/UniqueID";
import {ExclamationCircleIcon} from '@heroicons/vue/solid'
import BaseErrorMessage from "./BaseInputErrorMessage.vue";

export default {
    name: "BaseInput",
    inheritAttrs: false,
    components: {
        BaseErrorMessage,
        ExclamationCircleIcon,
    },
    props: {
        label: {
            type: String,
            default: "",
        },
        error: {
            type: String,
            default: ''
        },
        modelValue: {
            type: [String, Number],
            default: "",
        },
        type: {
            type: String,
            default: "text",
        },
        showLabel: {
            type: Boolean,
            default: true,
        },
        required: {
            type: Boolean,
            default: false,
        },
        placeholder: {
            type: String,
            default: null,
        },
        autocomplete: {
            type: String,
            default: null,
        },
    },
    setup(props, context) {
        const {updateValue} = SetupFormComponent(props, context)
        const uuid = UniqueID().getID()

        return {
            updateValue,
            uuid

        }
    }
};
</script>
