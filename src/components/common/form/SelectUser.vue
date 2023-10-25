<template>
    <div class="select-user">
        <!-- NEW -->
        <div class="select-user__label-box" :style="{ width: labelWidth ? `${labelWidth}` : `120px` }">
            <span class="select-user__label-box__label">{{ label }}</span>
            <span class="select-user__label-box__required-mark" :class="{ active: required }">*</span>
        </div>
        <form class="select-user__input-box" @click="">
            <input
                :value="modelValue"
                type="text"
                :placeholder="`${label}를 선택하세요.`"
                :disabled="true"
                class="select-user__input-box__input"
                :style="{ width: inputWidth ? `${inputWidth}` : `230px` }"
            />
            <BasicButton :label="'선택'" class="select-user__input-box__button" :disabled="disabled" :class="{ disabled: disabled }" @click.prevent="openDriverDialog" />
        </form>
        <span v-if="validation" class="select-user__validation">{{ checkName(label) }}</span>
    </div>
</template>

<script setup lang="ts">
import { ref, toRefs } from 'vue'
import BasicButton from '../button/BasicButton.vue'

interface Props {
    label: string
    required?: boolean
    validation?: boolean
    placeholder?: string
    modelValue?: any
    labelWidth?: string // 라벨 값 default: 120px
    inputWidth?: string // 인풋 값 default: 230px
    disabled?: boolean
}
const props = defineProps<Props>()
const { label, required, validation } = toRefs(props)

// Dropdown Value 전달
const selected = ref<string>('')

// 운전원 선택 팝업이 띄워져야함
const emit = defineEmits(['open-driver-dialog'])
const openDriverDialog = (): void => {
    emit('open-driver-dialog', true)
}

// 한글 Validation Check 함수
const checkName = (data: string | undefined) => {
    if (data !== undefined) {
        // data의 마지막 음절의 유니코드 (UTF-16)
        const charCode = data.charCodeAt(data.length - 1)
        // 유니코드의 한글 범위 내에서 해당 코드의 받침 확인
        const consonantCode = (charCode - 44032) % 28

        if (consonantCode === 0) {
            return `${data}는 필수 값입니다.`
        } else {
            return `${data}은 필수 값입니다.`
        }
    }
}
// input value가 변하면 validation check 해제
// watch(selected, () => {
//     updateValidation(label.value)
// })
</script>

<style lang="scss" scoped>
@import '@assets/styles/main.scss';

.select-user {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;

    position: relative;

    &__label-box {
        display: flex;
        align-items: center;

        &__required-mark {
            display: none;

            &.active {
                display: block;
                margin: 4px 0 0 4px;
                color: $color-red-000;
            }
        }
    }
    &__input-box {
        position: relative;

        display: flex;
        flex-grow: 1;
        justify-content: space-between;
        align-items: center;

        height: 48px;

        background-color: $color-white-000;
        border: 1px solid $color-white-400;
        border-radius: 6px;

        cursor: pointer;

        &__input {
            padding: 14px 12px;

            outline: none;
            border: none;
            border-radius: 6px;

            cursor: pointer;

            &:disabled {
                background-color: white;
            }
            &::placeholder {
                color: $color-white-450;
            }
        }
        &__button {
            display: flex;
            align-items: center;
            justify-content: center;

            width: 60px;
            height: 40px;

            margin-right: 4px;

            border-radius: 3px;
            background-color: $color-white-300;
            color: $color-black-500;
        }
    }
    &__validation {
        position: absolute;
        top: 54px;
        left: 132px;

        color: $color-red-000;
        font-size: 12px;
    }

    .disabled {
        cursor: not-allowed !important;
    }
}
</style>
