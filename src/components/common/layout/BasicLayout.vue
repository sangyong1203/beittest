<template>
    <div class="basic-layout">
        <slot></slot>
    </div>
</template>

<script setup lang="ts"></script>

<style lang="scss" scoped>
@import "@assets/styles/main.scss";

.basic-layout {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;

    width: 100%;
    padding: 18px 18px 16px 18px; // 추후 수정

    border-radius: 6px;
    background-color: $color-white-000;
    box-shadow: 0px 0px 3px rgba($color-black-900, 0.15);
    margin-bottom: 16px;
    box-sizing: border-box;
    
    @include laptop() {
        width: 100%;
        margin-bottom: 12px;
    }
}
</style>
