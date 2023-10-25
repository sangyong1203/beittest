<template>
    <div class="text-field">
        <div class="text-field__label" :style="{ width: labelWidth ? `${labelWidth}` : `120px` }">
            {{ label }}
            <span class="text-field__label__small">{{ smallLabel }}</span>
            <span class="text-field__label__required" :class="{ active: required }">*</span>
        </div>
        <input
            :value="modelValue"
            @input="updateValue"
            type="password"
            class="text-field__input"
            :class="{ disabled: disabled, validation: validation }"
            :disabled="disabled"
            :style="{ width: inputWidth ? `${inputWidth}` : `262px` }"
            :placeholder="`${placeholder}`"
            autoComplete="off"
        />
        <span class="text-field__unit">{{ unit }}</span>
        <span v-if="validation" class="text-field__validation">{{ checkName(label) }}</span>

        <span v-if="match" class="text-field__confirm">&#10003; 비밀번호가 일치합니다.</span>
        <span v-if="notMatch" class="text-field__validation">비밀번호가 일치하지 않습니다.</span>
    </div>
</template>

<script setup lang="ts">
import { ref, toRefs, watch } from "vue"

interface Props {
    label: string
    smallLabel?: string
    unit?: string
    placeholder?: string
    required?: boolean
    disabled?: boolean
    validation?: boolean
    match?: boolean
    notMatch?: boolean

    labelWidth?: string // 라벨 값 default: 120px
    inputWidth?: string // 인푼 값 default : 262px

    modelValue: string
}
const props = defineProps<Props>()
const { label, placeholder, required, disabled, validation, match, notMatch, modelValue } = toRefs(props)

const inputValue = ref<string>("")

const emit = defineEmits(["update:modelValue", "remove"])
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
// 한글 Validation Check 함수
const checkName = (data: string) => {
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

.text-field {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;

    height: 48px;

    position: relative;

    &__label {
        display: flex;
        flex-direction: row;
        align-items: center;

        &__small {
            font-size: 14.5px;
            display: block;
            margin-left: 2px;
        }

        &__required {
            display: none;

            &.active {
                display: block;

                margin-left: 4px;
                color: $color-red-000;
            }
        }
    }

    &__input {
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
        top: 52px;
        left: 126px;
        color: $color-red-000;
        font-size: 12px;
    }
    &__confirm {
        position: absolute;
        top: 52px;
        left: 126px;

        color: $color-green-100;
        font-size: 12px;
    }
    &__unit {
        position: absolute;
        right: 10px;

        color: #595959;
    }

    input::placeholder {
        color: #b1b1b1;
    }
    input:focus {
        outline: none;
    }
}
</style>
