<template>
  <span
        aria-live="assertive"
        class="mt-4 text-sm text-green-600"
  >
      <slot></slot>
  </span>
</template>

<script>
import {ExclamationCircleIcon} from "@heroicons/vue/solid";

export default {
    components: {
        ExclamationCircleIcon
    }
}
</script>
