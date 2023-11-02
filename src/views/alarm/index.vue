<template>
    <!-- 알림이력-->
    <div class="page">
        <CommonHeader />
        <Alarm />
        <CommonFooter />
    </div>
</template>

<script setup lang="ts">
import CommonHeader from '@components/Header.vue'
import CommonFooter from '@components/Footer.vue'
import Alarm from './alarmComponents/index.vue'
</script>

<style lang="scss" scoped>
@import '@assets/styles/main.scss';
.page {
    display: flex;
    flex-direction: column;
    align-items: center;

    width: 100%;
    height: 100%;

    background-color: $color-white-100;

    &__dialog {
        display: none;

        &.active {
            position: absolute;
            z-index: 2;

            display: flex;
        }
    }
    &__detail-dialog {
        display: none;

        &.active {
            position: absolute;
            z-index: 2;

            display: flex;
        }
    }
}
</style>
