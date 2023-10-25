<template>
    <div class="image-card">
        <div class="image-card__image-box">
            <img :src="base64" alt="" class="image-card__image-box__image" />
            <img src="@assets/icons/close.svg" alt="" class="image-card__image-box__icon" @click="deleteImage" />
        </div>
        <div class="image-card__info">
            <input v-model="imageName" class="image-card__info__title" placeholder="제목을 입력하세요." @input="updateValue" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, toRefs } from 'vue'
import { useBase64 } from '@vueuse/core'

interface Props {
    file: any
    index: number
}
const props = defineProps<Props>()
const { file, index } = toRefs(props)

const { base64 } = useBase64(file.value)
const imageName = ref<string>('')

const emit = defineEmits(['send-event', 'delete-file'])
const updateValue = () => {
    emit('send-event', imageName.value, index.value)
}
const deleteImage = () => {
    emit('delete-file')
}
</script>

<style lang="scss" scoped>
@import '@assets/styles/main.scss';

.image-card {
    display: flex;
    flex-direction: column;

    width: 272px;
    height: 317px;

    padding: 12px;
    gap: 12px;

    background: $color-white-000;
    border: 1px solid $color-white-400;
    border-radius: 6px;

    &__image-box {
        position: relative;

        display: flex;
        align-items: center;
        justify-content: center;

        width: 248px;
        height: 235px;

        padding: 12px;

        background-color: $color-white-050; // 이미지 추가되시면 삭제하시면 됩니다.

        &__image {
            width: calc(100% + 24px);
            height: 100%;

            object-fit: contain;
            border-radius: 6px;
        }
        &__icon {
            position: absolute;

            top: 12px;
            right: 12px;

            width: 20px;
            height: 20px;

            cursor: pointer;
        }
    }
    &__info {
        display: flex;
        align-items: center;
        justify-content: center;

        width: 248px;
        height: 20px;

        padding: 12px;

        border: 1px solid $color-white-200;
        background-color: $color-white-000;
        border-radius: 6px;

        &.disabled {
            background-color: $color-white-050;
        }

        &__title {
            border: none;
            outline: none;
            background: transparent;

            width: 100%;

            font-weight: 400;
            font-size: 17px;
            line-height: 20px;
        }
    }
}
</style>
