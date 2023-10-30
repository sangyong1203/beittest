<script setup lang="ts">
import { RouterView } from 'vue-router'
import Menu from "@components/Menu.vue"
import { menuList } from "@router/menuList.js"

</script>

<template>
  <RouterView />
  <Menu :menus="menuList"  ref="menuRef"/>
  
</template>
<style>

</style>
