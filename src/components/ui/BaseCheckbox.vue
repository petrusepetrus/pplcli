<template>
    <div class="relative flex items-start">
        <div class="flex items-center h-5">
            <input
                  :id="id"
                  class="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                  type="checkbox"
                  :name="name"
                  :checked="modelValue"
                  @change="$emit('update:modelValue', $event.target.checked)"
            />
        </div>
        <div class="ml-3 text-sm">
            <label
                  v-if="label"
                  class="font-medium text-gray-700">{{ label }}</label>
            <p
                  v-if="labelDescription"
                  class="text-gray-500">{{ labelDescription }}</p>
        </div>

    </div>
</template>

<script>
export default {
    name: "BaseCheckbox",
    props: {
        name:{
          type:String,
          default:''
        },
        label: {
            type: String,
            default: ''
        },
        labelDescription: {
            type: String,
            default: ''
        },
        modelValue: {
            type: Boolean,
            default: false
        },
        id:{
            type:[Number,String],
            default:""
        }
    },
    emits: ['update:modelValue']
}
</script>