<template>
    <div class="label-textField">
        <div class="label-textField__label-box" :style="{ width: labelWidth ? `${labelWidth}` : `120px` }">
            <span class="label-textField__label-box__label">{{ label }}</span>
            <span class="label-textField__label-box__required-mark" :class="{ active: required }">*</span>
        </div>
        <input
            @input="updateValue"
            class="label-textField__input"
            type="text"
            :value="modelValue"
            :disabled="disabled"
            placeholder="'서울01가1234' 또는 '123가4567'"
            :class="{ disabled: disabled, validation: validation }"
            :style="{ width: inputWidth ? `${inputWidth}` : `230px` }"
        />
        <span class="label-textField__unit">{{ unit }}</span>
        <span v-if="validation" class="label-textField__validation">{{ checkValidation(label, inputValue) }}</span>
    </div>
</template>

<script setup lang="ts">
import { toRefs, ref, watch } from 'vue'

interface Props {
    label: string // 라벨
    unit?: string // 유닛
    required?: boolean // 필수값 마크
    disabled?: boolean // Readonly 체크
    validation?: boolean // Validation 체크
    labelWidth?: string // 라벨 값 default: 120px
    inputWidth?: string // 인풋 값 default: 230px
    inputLength?: number // 인풋 Length 길이 설정
    modelValue: any
}
const props = defineProps<Props>()
const { label, unit, required, disabled, validation, labelWidth, inputLength, modelValue } = toRefs(props)

// v-model 양방향 데이터 바인딩
const inputValue = ref<string>('') // input value
const emit = defineEmits(['update:modelValue', 'remove', 'send-valid'])

const updateValue = (event: any) => {
    inputValue.value = event.target.value
    if (inputLength?.value != null) {
        inputValue.value = inputValue.value.slice(0, inputLength.value) // 길이 제한
    }
    inputValue.value = inputValue.value.replace(/ |-/g, '')
    emit('update:modelValue', inputValue.value)
}

const patterns: RegExp[] = [
    new RegExp('^[0-9]{2,3}[가-힣]{1}[0-9]{4}$'),
    new RegExp('^[가-힣]{1,2}[0-9]{2}[가-힣]{1}[0-9]{4}$'),
    new RegExp('^[가-힣]{2}[0-9]{1}[가-힣]{1}[0-9]{4}$'),
    new RegExp('^(외교|영사|대표|국기|준외|준영|협정)[0-9]{6}$'),
    new RegExp('^임시[0-9]{4,6}$'),
]

// 한글 Validation Check 함수
const checkValidation = (label: string, input: string) => {
    if (input.length == 0) {
        if (required.value == true) {
            emit('remove', label, true)
            emit('send-valid', true)
            return `${label}는 필수 값입니다.`
        } else {
            emit('remove', label, false)
            emit('send-valid', false)
            return
        }
    } else {
        for (let pattern of patterns) {
            if (pattern.test(input)) {
                emit('remove', label, false)
                emit('send-valid', false)
                return
            }
        }
        // If none of the patterns matched, return an error message
        emit('remove', label, true)
        emit('send-valid', true)
        return '올바르지 않는 형식입니다.'
    }
}

// input value가 변하면 validation check 해제
watch(inputValue, () => {
    checkValidation(label.value, inputValue.value)
})
</script>

<style lang="scss" scoped>
@import '@assets/styles/main.scss';

.label-textField {
    position: relative;

    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;

    height: 48px;

    &__label-box {
        display: flex;
        align-items: center;
        justify-content: flex-start;

        &__required-mark {
            display: none;

            &.active {
                display: block;

                margin: 4px 0 0 4px;
                color: $color-red-000;
            }
        }
    }
    &__input {
        flex-grow: 1;

        padding: 14px 12px;

        border: 1px solid $color-white-400;
        border-radius: 6px;

        &.disabled {
            cursor: not-allowed !important;
            color: $color-white-500;
        }
        &.validation {
            border: 1px solid $color-red-000;

            &::placeholder {
                color: rgba($color-red-000, 0.9);
            }
        }
    }
    &__validation {
        position: absolute;
        top: 53px;
        left: 132px;

        color: $color-red-000;
        font-size: 12px;
    }
    &__unit {
        position: absolute;
        right: 10px;

        color: $color-black-500;
    }
    input::placeholder {
        color: $color-white-450;
    }
    input:focus {
        outline: none;
    }
}
</style>
