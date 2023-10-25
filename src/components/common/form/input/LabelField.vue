<template>
    <div class="label-textField">
        <div class="label-textField__label-box" :style="{ width: labelWidth ? `${labelWidth}` : `120px` }">
            <span class="label-textField__label-box__label">{{ label }}</span>
            <span class="label-textField__label-box__required-mark" :class="{ active: required }">*</span>
        </div>
        <input
            v-if="isNumber"
            :value="modelValue"
            @input="updateNumber"
            type="text"
            :disabled="disabled"
            :placeHolder="checkPlaceholder(label)"
            maxlength="13"
            class="label-textField__input"
            :class="{ disabled: disabled, validation: validation }"
            :style="{ width: inputWidth ? `${inputWidth}` : `230px` }"
        />
        <input
            v-else
            :value="modelValue"
            @input="updateValue"
            type="text"
            :disabled="disabled"
            :placeholder="checkPlaceholder(label)"
            maxlength="30"
            class="label-textField__input"
            :class="{ disabled: disabled, validation: validation }"
            :style="{ width: inputWidth ? `${inputWidth}` : `230px` }"
        />
        <span class="label-textField__unit">{{ unit }}</span>
        <span v-if="validation" class="label-textField__validation">{{ checkValidation(label) }}</span>
    </div>
</template>

<script setup lang="ts">
import { toRefs, ref, watch } from "vue"

interface Props {
    label: string // 라벨
    unit?: string // 유닛

    required?: boolean // 필수값 마크
    disabled?: boolean // Readonly 체크
    validation?: boolean // Validation 체크

    labelWidth?: string // 라벨 값 default: 120px
    inputWidth?: string // 인풋 값 default: 230px

    isNumber?: boolean // true

    modelValue: any
}
const props = defineProps<Props>()
const { label, unit, required, disabled, validation, labelWidth, modelValue } = toRefs(props)

// v-model 양방향 데이터 바인딩
const emit = defineEmits(["update:modelValue", "remove"])
const inputValue = ref<string>("") // input value

const updateValue = (event: any) => {
    emit("update:modelValue", event.target.value)
    inputValue.value = event.target.value
}
const updateValidation = (label: string) => {
    if (inputValue.value) {
        emit("remove", label, false)
    } else {
        emit("remove", label, true)
    }
}
const updateNumber = (event: any) => {
    const originValue = event.target.value
    const removeChar = originValue.replace(/[^\d.]/g, "").replace(/(\..*)\./g, "$1")

    if (/(?<![-+])(\d*\.\d{0,1}|\d+)/.test(removeChar)) {
        if (originValue !== removeChar) {
            event.target.value = removeChar
        }
    } else {
        if (originValue !== removeChar) {
            event.target.value = ""
        }
    }
    inputValue.value = removeChar.replace(/[^0-9]/g, "").replace(/^(\d{2,3})(\d{3,4})(\d{4})$/, `$1-$2-$3`)
    emit("update:modelValue", inputValue.value)
}

// PlaceHolder 체크 함수
const checkPlaceholder = (data: string) => {
    // data의 마지막 음절의 유니코드 (UTF-16)
    const charCode = data.charCodeAt(data.length - 1)
    // 유니코드의 한글 범위 내에서 해당 코드의 받침 확인
    const consonantCode = (charCode - 44032) % 28

    if (consonantCode === 0) {
        return `${data}를 입력하세요.`
    } else {
        return `${data}을 입력하세요.`
    }
}

// Spacebar 입력방지 함수
const checkSpacebar = (event: any) => {
    if (event.keyCode === 32) event.preventDefault()
}

// 한글 Validation Check 함수
const checkValidation = (data: string) => {
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
// input value가 변하면 validation check 해제
watch(inputValue, () => {
    updateValidation(label.value)
})
</script>

<style lang="scss" scoped>
@import "@assets/styles/main.scss";

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
