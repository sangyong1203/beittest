<template>
    <div class="oneBtn-dialog">
        <div class="oneBtn-dialog__layout">
            <div class="oneBtn-dialog__layout__header">
                <span class="label">{{ label }}</span>
                <button class="button" @click="closeDialog">
                    <img src="@assets/icons/close.svg" alt="" />
                </button>
            </div>
            <div class="oneBtn-dialog__layout__body">
                <slot></slot>
            </div>
            <div class="oneBtn-dialog__layout__footer">
                <BasicButton :label="'선택'" :theme="'fill'" @click="onSubmit"></BasicButton>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import BasicButton from '@components/common/button/BasicButton.vue'
import { toRefs } from 'vue'

interface Props {
    label: string
}
const props = defineProps<Props>()
const { label } = toRefs(props)

// 다이얼로그 닫기
const emit = defineEmits(['close-dialog', 'submit'])
const closeDialog = (): void => {
    emit('close-dialog', false)
}
const onSubmit = () => {
    emit('submit')
}
</script>

<style lang="scss" scoped>
@import '@assets/styles/main.scss';

.oneBtn-dialog {
    display: none;

    &.active {
        display: flex;
        align-items: center;
        justify-content: center;

        width: 100%;
        height: 100vh;

        background-color: rgba($color-black-900, 0.5);
    }
    &__layout {
        display: flex;
        flex-direction: column;
        align-items: center;

        position: relative;

        max-width: 80%;
        min-width: 1146px;
        height: 80%;
        
        padding: 30px 40px;

        background-color: $color-white-000;
        box-shadow: 0px 0px 3px rgba(0, 0, 0, 0.15);
        border-radius: 6px;

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
            }
        }
        &__body {
            display: flex;
            flex-direction: row;
            width: 100%;
            height: 100%;

            padding: 24px 0;
            gap: 16px;
            overflow: hidden;
        }
        &__footer {
            display: flex;
            align-items: center;
            justify-content: flex-end;

            width: 100%;

            gap: 12px;
        }
    }
}
</style>
