<template>
    <div class="header desktop" :class="store.darkMode ? 'dark-mode' : ''">
        <div class="header__main">
            <div class="menu-btn" @click="menuopen">
                <div class="menu-btn-line"></div>
                <div class="menu-btn-line"></div>
                <div class="menu-btn-line"></div>
            </div>
            <img :src="logo" alt="" class="logo" />
        </div>
        <div class="header__profile-box">
            <div class="header__profile-box__profile">
                <img src="@assets/icons/myPage.svg" alt="" class="icon" />
                <span class="user-name">{{ userName }} </span>
                <span class="middle-line">|</span>
                <span class="user-position">{{ userPosition }}</span>
            </div>
            <CommonIconButton :label="'로그아웃'" :theme="'fill'" icon="logout" @send-event="logout" />
        </div>
        
    </div>

</template>

<script setup lang="ts">
import CommonIconButton from "@components/common/button/IconButton.vue"
import logo from "@assets/images/logo_doosan.png"

import { useRouter } from "vue-router"
import { useStore } from "@stores/index"
import { ref } from "vue"

const store = useStore()
// 로그인 유저 이름 & 직종
const userName = store.loginData.user_data.user_name
const userPosition = store.loginData.user_permission.ctgo_duty_name


// 페이지 라우팅
const router = useRouter()
const moveToPage = () => {
    router.push({ name: "login" })
}

function menuopen() {
    store.setMenuOpen(!store.isMenuOpen)
}

// 로그아웃
const logout = () => {
    localStorage.removeItem("main")
    moveToPage()
}

</script>

<style lang="scss" scoped>
@import "@assets/styles/main.scss";

.header {
    position: relative;

    display: flex;
    align-items: center;
    justify-content: space-between;

    width: 100%;
    height: 70px;

    padding: 0 42px;

    background-color: $color-white-000;

    z-index: 2;

    &__main {
        display: flex;
        align-items: center;
        margin-right: 30px;
        height: 100%;
        // gap: 64px;
        flex: 1;

        &__logo-box {
            display: flex;
            align-items: center;
            justify-content: center;

            height: 100%;
            padding: 16px;

            &__logo {
                width: 100%;
                height: 100%;
            }
            @include laptop() {
            }
        }
        
    }
    &__profile-box {
        display: flex;
        align-items: center;
        justify-content: space-between;
        height: 100%;
        width: 276px;

        &__profile {
            display: flex;
            align-items: center;
            justify-content: center;
            height: 100%;
            margin-right: 20px;
            color: $color-black-700;
            gap: 8px;
            .icon {
                display: flex;
                align-items: center;
                justify-content: center;

                width: 26px;
                height: 26px;

                margin-top: 1px;
            }
            .middle-line {
                display: flex;
                align-items: center;
                justify-content: center;
            }
        }
    }


}
.logo{
    height: 30px;
    margin-left: 30px;
    margin-top: -5px;
}
.menu-btn{
    width: 35px;
    height: 35px;
    display: flex;
    justify-content: space-evenly;
    flex-direction: column;

    .menu-btn-line{
        height: 3px;
        background: #a4a4a4;
        width: 100%;
    }
}

</style>
