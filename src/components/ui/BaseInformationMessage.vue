<template>
    <div class="rounded-md bg-green-50 p-4" aria-live="assertive">
        <div class="flex">
            <div class="flex-shrink-0">
                <CheckCircleIcon class="h-5 w-5 text-green-400" aria-hidden="true" />
            </div>
            <div class="ml-3">
                <h3 class="text-sm font-medium text-green-800">{{ title }}</h3>
                <div class="mt-2 text-sm text-green-700">
                    <slot />
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import {CheckCircleIcon} from "@heroicons/vue/solid";

export default {
    components: {
        CheckCircleIcon
    },
    props: {
        title: {
            type: [String, Number],
            default:'Success'
        }
    }
}
</script>
