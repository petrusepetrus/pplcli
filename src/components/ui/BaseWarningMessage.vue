<template>
    <div class="rounded-md bg-amber-50 p-4" aria-live="assertive">
        <div class="flex">
            <div class="flex-shrink-0">
                <ExclamationCircleIcon class="h-5 w-5 text-amber-400" aria-hidden="true" />
            </div>
            <div class="ml-3">
                <h3 class="text-sm font-medium text-amber-800">{{ warningTitle }}</h3>
                <div class="mt-2 text-sm text-amber-700">
                    <slot />
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import {ExclamationCircleIcon} from "@heroicons/vue/solid";

export default {
    components: {
        ExclamationCircleIcon
    },
    props: {
        warningTitle: {
            type: [String, Number],
            required: true,
            default:'Warning'
        }
    }
}
</script>
