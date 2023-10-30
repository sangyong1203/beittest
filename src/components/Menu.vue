<template>
  <el-drawer 
      v-model="store.isMenuOpen" 
      direction="ltr" 
      size="280"
      :show-close="false"
      :with-header="false"
      @closed="handleClose"
      >
      <div ref="headerLeftBoxs" class="logo-box">
        <img
          class="header-logo"
          :src="logo"
        />
      </div>
      <el-menu
        ref="elmenu"
        class="el-menu-vertical-demo"
        :router="true"
        :unique-opened="true"
      >
        <template v-for="(item, index) in menus">
          <el-sub-menu
            v-if="item.menuVOList.length > 0"
            :key="index"
            :index="item.name"
          >
            <template #title>
              <el-icon v-html="item.iconCls"></el-icon>
              <span>{{ item.nameZh }}</span>
            </template>
            <el-menu-item
              v-for="(subItem, subIndex) in item.menuVOList"
              :key="subIndex"
              :index="subItem.name"
              :route="toRoute({ name: subItem.name })"
              @click="menueClose"
              >{{ subItem.nameZh }}</el-menu-item
            >
          </el-sub-menu>
        </template>
      </el-menu>
    </el-drawer>
</template>
<script setup lang="ts">
  import { useStore } from "@stores/index"
  import {onMounted, ref, watch} from "vue";
  import { useRoute } from "vue-router"
  import logo from "@assets/images/gsilLogo.svg"

  
  interface props {
    menus: any[]
  }
  
  const { menus } = defineProps<props>()
  const store = useStore()
  const defaultActive:any = ref("home")
  const routes = useRoute();

  watch(routes, ()=>{
    setCurrentRoute()
  })
  onMounted(()=>{
    setCurrentRoute()
  })
  // router active 상태 설정
  function setCurrentRoute() {
    const { parentName } = routes.meta
    parentName
      ? (defaultActive.value = parentName)
      : (defaultActive.value = routes.name)
    console.log(routes.name)
  }
  function toRoute(item:any) {
    if(item.name == 'login'){
      return {}
    }else if (item.name) {
      return { name: item.name }
    } else if (item.path) {
      return { path: item.path }
    }
    return {}
  }
  function menueClose(){
    handleClose()
  }
  function handleClose() {
      store.setMenuOpen(false)
  }
</script>
<style lang="scss" scoped>
// @import "@assets/styles/main.scss";

.el-menu-vertical-demo {
  background-color: var(--el-menu-bg-color);
  padding:10px 0;
  height: calc(100% - 55px);
  width: 100%;
}
.el-menu {
    overflow-y: scroll;
    border-right:none !important;
    
}
.el-menu-item.is-active{
  color: var(--el-color-primary) !important;
}
.el-sub-menu .el-menu-item{
  min-width: none !important;
}
.el-menu::-webkit-scrollbar {
    width: 0px;
    background-color: transparent;
}
.el-menu::-webkit-scrollbar-thumb {
    background-color: transparent;
}
.el-menu:hover::-webkit-scrollbar-thumb{
  /*background-color: #e4e4e4;	*/
  background-color: transparent;
}
.el-sub-menu__title *{
  color: var(--el-menu-text-color);
}
.el-menu-item{
  color:var(--el-sub-menu-text-color)  !important;
  background-color: var(--el-menu-item-color);
}

.el-menu--collapse{
  width: 0;
}
.logo-box {
  position: relative;
  top:0;
  justify-content: center;
  display: flex;
  transition: all 0.3s ease-in-out;
  padding: 12px 0;
  img{
    width: 80px;
  }
} 

</style>
