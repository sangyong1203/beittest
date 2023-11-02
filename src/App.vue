<script setup lang="ts">
import { RouterView } from 'vue-router'
import Menu from "@components/Menu.vue"
import { menuList } from "@router/menuList.js"
import ko from '@assets/language/ko.js'

let locale = ko

</script>

<template>
  <el-config-provider :locale="locale">
    <RouterView />
  </el-config-provider>
  <Menu :menus="menuList"  ref="menuRef"/>
  
</template>
<style>

</style>
