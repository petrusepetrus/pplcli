<template>
    <div class="relative flex items-start">
        <div class="flex items-center h-5">
            <input
                  class="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                  type="checkbox"
                  :checked="modelValue"
                  @change="$emit('update:modelValue', $event.target.checked)"
            />
        </div>
        <div class="ml-3 text-sm">
            <label class="font-medium text-gray-700"
                   v-if="label">{{ label }}</label>
            <p  class="text-gray-500"
                v-if="labelDescription">{{labelDescription}}</p>
        </div>

    </div>
</template>

<script>
export default {
    name: "BaseCheckbox",
    props: {
        label: {
            type: String,
            default: ''
        },
        labelDescription:{
            type: String,
            default: ''
        },
        modelValue: {
            type: Boolean,
            default: false
        }
    }
}
</script>