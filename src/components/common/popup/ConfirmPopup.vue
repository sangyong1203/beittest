<template>
    <div class="container" v-if="isVisible">
        <div class="container__popup">
            <span class="container__popup__label">{{label}}</span>
            <div class="container__popup__button-box">
                <BasicButton :label="'취소'" :theme="'cancel'" @click="cancel" />
                <BasicButton :label="'확인'" :theme="'fill'" @click="onConfirm" />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import BasicButton from '@components/common/button/BasicButton.vue'
import { ref } from "vue"
interface Props{
    label: string
}
const {label} = defineProps<Props>()

const emit = defineEmits(['cancel', 'confirm'])
const isVisible:any = ref(false)
const openDialog = () => {
    console.log("open confirm dialog")
    isVisible.value = true
}
defineExpose({openDialog})
// 취소
const cancel = () => {
    emit('cancel', false)
    isVisible.value = false
}
// 확인
const onConfirm = () => {
    emit('confirm', true)
    isVisible.value = false
}
</script>

<style lang="scss" scoped>
@import '@assets/styles/main.scss';

.container {
    position: absolute;
        top: 0;
        left: 50%;
        transform: translateX(-50%);

        display: flex;

        border-radius: 12px;

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
