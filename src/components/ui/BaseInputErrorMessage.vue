<template>
  <span
        aria-live="assertive"
        class="mt-2 text-sm text-red-600"
        :id="id"
  >
      <slot>
         </slot>
  </span>
</template>

<script>
import {ExclamationCircleIcon} from "@heroicons/vue/solid";

export default {
    components: {
        ExclamationCircleIcon
    },
    props: {
        id: {
            type: [String, Number],
            required: true
        }
    }
}
</script>
