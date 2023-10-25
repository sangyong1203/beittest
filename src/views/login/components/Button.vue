<template>
    <div :data-theme="theme" class="button">
        {{ label }}
        <img v-if="icon" :src="iconUrl" alt="" class="button__icon" />
    </div>
</template>

<script setup lang="ts">
import { ref, toRefs } from "vue"
import login from "@assets/icons/login.svg"
import searchBlue from "@assets/icons/search_blue.svg"

interface Props {
    label: string
    theme?: string
    icon?: string
}
const props = defineProps<Props>()
const { label, theme, icon } = toRefs(props)
let iconUrl = icon && (icon.value === "login" ? login : searchBlue)
</script>

<style lang="scss" scoped>
@import "@assets/styles/main.scss";

.button {
    display: flex;
    align-items: center;
    justify-content: center;

    width: 100%;
    height: 50px;

    outline: none;
    border: none;
    border-radius: 12px;

    box-shadow: 2px 5px 10px 10px rgba(91, 139, 142, 0.05);

    cursor: pointer;

    &__icon {
        width: 18px;

        margin: 0 0 2px 12px;
    }
    &[data-theme="login"] {
        color: $color-white-000;
        background-color: $color-blue-500;
        box-shadow: 0px 4px 20px rgba(0, 88, 166, 0.1);
        border-radius: 6px;
    }
    &[data-theme="sign"] {
        height: 48px;

        color: $color-blue-600;
        border: 1px solid #294e92;
        filter: drop-shadow(0px 4px 20px rgba(0, 88, 166, 0.1));
        border-radius: 6px;
    }
}
</style>
