<template>
    <div>
        <h1>Home</h1>
        {{user}}
        {{authenticated}}
        {{verified}}
    </div>

</template>

<script setup>
import {useAuthStore} from "../stores/AuthStore";

const {user,authenticated,verified}=useAuthStore()
console.dir(user)
</script>

<style scoped>

</style>