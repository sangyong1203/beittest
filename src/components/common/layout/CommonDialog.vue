<template>
    <div class="dashboard-dialog">
        <div class="dashboard-dialog__layout">
            <div class="dashboard-dialog__layout__header">
                <span class="label">{{ label }} 상세 </span>
                <button class="button" @click="closeDialog">
                    <img src="@assets/icons/close.svg" alt="" class="button__icon" />
                </button>
            </div>
            <div class="dashboard-dialog__layout__body">
                <slot></slot>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { toRefs } from 'vue'

interface Props {
    label: string
}
const props = defineProps<Props>()
const { label } = toRefs(props)

// 다이얼로그 닫기
const emit = defineEmits(['close-dialog'])
const closeDialog = (): void => {
    emit('close-dialog', false)
}
</script>

<style lang="scss" scoped>
@import '@assets/styles/main.scss';

.dashboard-dialog {
    display: none;

    &.active {
        display: flex;
        align-items: center;
        justify-content: center;

        width: 100%;
        height: 100%;

        background-color: rgba($color-black-900, 0.5);
    }
    &__layout {
        display: flex;
        flex-direction: column;
        align-items: center;

        max-width: 80%;
        min-width: 60%;
        height: 80%;

        padding: 30px 40px 0 40px;

        background-color: $color-white-000;
        box-shadow: 0px 0px 3px rgba(0, 0, 0, 0.15);
        border-radius: 6px;
        overflow: hidden;
        margin: auto;

        &__header {
            display: flex;
            align-items: center;
            justify-content: space-between;

            width: calc(100% - 10px);

            padding: 10px 0px 20px 10px;
            gap: 10px;

            border-bottom: 1px solid $color-white-400;

            .label {
                font-weight: 600;
                font-size: 19px;
                line-height: 23px;
            }
            .button {
                outline: none;
                border: none;

                width: 24px;
                height: 24px;

                background: transparent;

                cursor: pointer;

                &__icon {
                    width: 20px;
                    height: 20px;
                }
            }
        }
        &__body {
            display: flex;
            flex-direction: column;
            align-items: center;

            width: 100%;
            height: calc(100% - 55px);
            overflow: hidden;
            gap: 16px;
        }
    }
}
</style>
