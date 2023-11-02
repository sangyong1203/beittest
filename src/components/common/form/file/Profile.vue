<template>
    <div class="image">
        <div class="image__label" :style="{ width: labelWidth ? `${labelWidth}` : `120px` }">
            {{ label }}
            <span class="image__label__required" :class="{ active: required }">*</span>
        </div>
        <form class="image__imageArea">
            <span class="image__imageArea__inform">
                사진은 안면인식기에서 사진 촬영 후 <br />
                자동으로 불러옵니다.
            </span>
        </form>
    </div>
</template>

<script setup lang="ts">
import { ref, toRefs, watch } from 'vue'
import { useBase64 } from '@vueuse/core'

interface Props {
    label: string
    labelWidth?: string
    required?: boolean
    modelValue: string
}
const props = defineProps<Props>()
const { label, labelWidth, required, modelValue } = toRefs(props)
// 이미지 파일 데이터 - 부모 컴포넌트로 전달하기
const preview = ref<any>()
const { base64 } = useBase64(preview)

const emit = defineEmits(['send-event', 'update:modelValue'])
const insertImage = (event: any) => {
    preview.value = event.target.files[0]
    emit('update:modelValue', base64)
    sendEvent(preview.value)
}
const sendEvent = (data: any) => {
    emit('send-event', data)
}

const changeInit = () => {
    userImage.value = ''
    preview.value = null
}
const userImage = ref<string>('')

watch(modelValue, (vo) => {
    if (vo) {
        userImage.value = vo
    }
})
</script>

<style lang="scss" scoped>
@import '@assets/styles/main.scss';
.image {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: flex-start;

    &__label {
        display: flex;
        flex-direction: row;

        padding: 12px 0 0 0;
        height: 252px;

        &__required {
            display: none;

            &.active {
                display: block;

                margin-left: 4px;
                color: $color-red-000;
            }
        }
    }

    &__imageArea {
        display: flex;
        flex-grow: 1;
        align-items: center;
        justify-content: center;

        width: 300px;
        height: 268px; // 강제 사이즈 맞춤

        border: 1px solid $color-white-400;
        border-radius: 6px;

        position: relative;

        opacity: 0.6;

        &__profile {
            width: 100%;
            height: calc(100% - 50px);
            border-radius: 6px;
            padding-bottom: 50px;
        }

        &__inform {
            height: 50px;
            font-size: 14px;
            font-weight: 700;
            color: #8c8c8c;
            text-align: center;
            position: absolute;
            bottom: 74px;
        }

        &__button {
            display: flex;
            align-items: center;
            justify-content: center;

            width: 100%;
            height: 100%;

            outline: none;
            border: none;
            background: transparent;

            cursor: pointer;

            position: relative;

            .arrow-row {
                width: 32px;
                border: 1px solid $color-white-400;
                transform: rotate(90deg);

                position: absolute;
            }
            .arrow-column {
                width: 32px;
                border: 1px solid $color-white-400;
            }
        }

        transition: all 0.5s ease;

        &__updateBtn {
            position: absolute;
            top: 10px;
            right: 10px;
        }
    }
}
input[type='file'] {
    display: none;
}
</style>
