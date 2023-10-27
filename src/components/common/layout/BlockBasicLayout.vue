<template>
    <div class="basic-layout">
        <div class="header">
            <button  class="header__button">
                <img v-if="showButton" @click="openDialog" :src="detailBtn" alt="" class="header__button__icon" />
            </button>
            <span class="header__label">{{ label }}</span>
            <button  class="header__button" >
            </button>
        </div>
        <slot></slot>
    </div>
</template>

<script setup lang="ts">
import detailBtn from "@assets/icons/detailBtn.svg"

interface Props {
    label?: string
    showButton: boolean
}
const {label, showButton} = defineProps<Props>()

const emit = defineEmits(["open-dialog"])
function openDialog(){
 emit("open-dialog")
}
</script>

<style lang="scss" scoped>
@import "@assets/styles/main.scss";

.basic-layout {
    display: flex;
    flex-direction: column;
    align-items: flex-start;

    width: 100%;

    border-radius: 6px;
    background-color: $color-white-000;
    box-shadow: 1px 1px 6px rgba(black, 0.15);
    margin-bottom: 16px;
    box-sizing: border-box;
    .header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 100%;
        padding: 14px;
        border-top-right-radius: 6px;
        border-top-left-radius: 6px;
        box-sizing: border-box;
        box-shadow: 0px 1px 1px #dddddd;

        &__label {
            font-size: 20px;
            font-weight: 500;
            line-height: 20px;
        }
        &__button {
            display: flex;
            align-items: center;
            justify-content: center;

            gap: 6px;

            outline: none;
            border: none;

            background-color: transparent;

            cursor: pointer;

            &__icon {
                width: 26px;
                height: 26px;
            }
        }
    }
}
</style>
