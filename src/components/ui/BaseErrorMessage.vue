<template>
  <span
        aria-live="assertive"
        class="mt-2 text-sm text-red-600"
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
