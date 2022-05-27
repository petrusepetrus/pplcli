<template>
    <label v-if="label" :for="uuid" class="block text-sm font-medium text-gray-700">{{ label }} </label>
    <select
          class="field mt-1 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"

          v-bind="{
      ...$attrs,
            onChange: ($event) => {
          $emit('update:modelValue',
          $event.target.value)
      }
    }"
          :value="modelValue"
          :id="uuid"
          :aria-describedby="error ? `${uuid}-error` : null"
          :aria-invalid="error ? true : false"
          :class="{ error }"
    >
        <option
              v-for="option in options"
              :value="option"
              :key="option"
              :selected="option === modelValue"
        >{{ option }}
        </option>
    </select>
    <BaseInputErrorMessage
          v-if="error"
          :id="`${uuid}-error`"
    >
        {{ error }}
    </BaseInputErrorMessage>

</template>

<script>
import UniqueID from "../../utils/UniqueID.js";
import BaseInputErrorMessage from "./BaseInputErrorMessage.vue";

export default {
    name: "BaseSelect",
    components: {
        BaseInputErrorMessage
    },
    props: {
        label: {
            type: String,
            default: ''
        },
        modelValue: {
            type: [String, Number],
            default: ''
        },
        options: {
            type: Object,
            required: true
        },
        error: {
            type: String,
            default: ''
        },
    },
    setup(props, context) {
        const uuid = UniqueID().getID()
        return {
            uuid
        }
    }
}
</script>