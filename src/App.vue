<template>
    <navbar/>
    <router-view/>
    <footerbar/>
</template>
<script setup>

import Navbar from "./components/layout/Navbar.vue";
import Footerbar from "./components/layout/Footerbar.vue";
import Sidebar from "./components/layout/Sidebar.vue";
</script>

