<template>
    <div class="container">
        <div class="container__popup">
            <span class="container__popup__label">정말 삭제하시겠습니까?</span>
            <div class="container__popup__button-box">
                <BasicButton :label="'취소'" :theme="'cancel'" @click="cancel" />
                <BasicButton :label="'확인'" :theme="'fill'" @click="onDelete" />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import BasicButton from '@components/common/button/BasicButton.vue'

const emit = defineEmits(['cancel', 'delete'])
// 취소
const cancel = () => {
    emit('cancel')
}
// 삭제
const onDelete = () => {
    emit('delete')
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
