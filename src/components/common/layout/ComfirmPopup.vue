<template>
    <div class="container">
        <div class="container__popup">
            <span class="container__popup__label"> {{ message == null ? '선택하시겠습니까?' : message }}</span>

            <div class="container__popup__button-box">
                <BasicButton :label="'취소'" :theme="'cancel'" @click="onCancel" />
                <BasicButton :label="'확인'" :theme="'fill'" @click="onConfirm" />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import BasicButton from '@components/common/button/BasicButton.vue'

import { toRefs } from 'vue'

interface Props {
    message?: string | null
}

const props = defineProps<Props>()
const { message } = toRefs(props)

const emit = defineEmits(['cancel', 'confirm'])

const onCancel = () => {
    emit('cancel')
}

const onConfirm = () => {
    emit('confirm')
}
</script>

<style lang="scss" scoped>
@import '@assets/styles/main.scss';

.container {
    display: flex;
    align-items: center;
    justify-content: center;

    width: 100%;
    height: 100%;

    background-color: rgba($color-black-900, 0.5);

    z-index: 3;

    &__popup {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;

        width: 360px;

        padding: 24px;

        background-color: $color-white-000;
        box-shadow: 0px 0px 3px rgba(0, 0, 0, 0.15);
        border-radius: 6px;

        &__label {
            display: flex;
            align-items: center;
            justify-content: center;

            width: 100%;
            height: 144px;

            font-weight: 600;
            font-size: 19px;
            line-height: 23px;
        }
        &__button-box {
            display: flex;
            align-items: center;
            justify-content: flex-end;

            width: 100%;

            gap: 12px;
        }
    }
}
</style>
