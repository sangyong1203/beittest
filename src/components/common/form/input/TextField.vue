<template>
    <div class="label-textField">
        <div class="label-textField__label-box" :style="{ width: labelWidth ? `${labelWidth}` : `120px` }">
            <span class="label-textField__label-box__label">{{ label }}</span>
            <span class="label-textField__label-box__required-mark" :class="{ active: required }">*</span>
        </div>
        <div class="label-textField__container" >
            <div class="container__text-area">
                <textarea 
                    type="text" 
                    :value="modelValue" 
                    @input="updateValue"
                    :rows="rows ?? 5"
                    class="container__text-area__input"
                    :placeholder="checkPlaceholder(label)"
                    :class="{ disabled: disabled, validation: validation }"
                    :style="{ width: inputWidth ? `${inputWidth}` : `calc(100% - ${inputWidth})` }" 
                    :disabled="disabled"
                />
                <span 
                    v-if="validation" 
                    class="container__text-area__validation" 
                    >{{ checkValidation(label) }}
                </span>
            </div>
        </div>
    </div>
   
</template>

<script setup lang="ts">
import { toRefs, ref, watch } from "vue"

interface Props {
    label: string // 라벨

    required?: boolean // 필수값 마크
    disabled?: boolean // Readonly 체크
    validation?: boolean // Validation 체크

    labelWidth?: string // 라벨 값 default: 120px
    inputWidth?: string // 인풋 값 default: 230px
    rows?:any
    modelValue: any
}
const props = defineProps<Props>()
const { label, required, disabled, validation, labelWidth,rows, inputWidth, modelValue } = toRefs(props)

// v-model 양방향 데이터 바인딩
const emit = defineEmits(["update:modelValue", "remove"])
const inputValue = ref<string>("") // input value

const updateValue = (event: any) => {
    emit("update:modelValue", event.target.value)
    // inputValue.value = event.target.value
}
const updateValidation = (label: string) => {
    if (inputValue.value) {
        emit("remove", label, false)
    } else {
        emit("remove", label, true)
    }
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
    &__container{
        flex-grow: 1;

        
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
}
.container {
    display: flex;
    flex-direction: column;

    width: calc(100% - 20px);

    padding: 0 10px;
    gap: 22px;
    &__text-area {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        position: relative;
        flex-direction: column;
        width: 100%;

        &__validation {
            margin: 5px;
            color: $color-red-000;
            font-size: 12px;
        }
        &__label {
            display: flex;
            align-items: flex-start;

            width: 120px;
            height: 100%;

            margin-top: 16px;
        }
        &__input {
            width: 100%;
            max-height: 500px;
            min-height: 150px;
            padding: 14px 12px;

            border: 1px solid $color-white-400;
            border-radius: 6px;
            box-sizing: border-box;
            resize: none; // textarea 크기 고정

            &.disabled {
                color: $color-white-500;
            }
            &.validation {
                border: 1px solid $color-red-000;

                &::placeholder {
                    color: rgba($color-red-000, 0.9);
                }
            }
            &::placeholder {
                color: #b1b1b1;
            }
            &:focus {
                outline: none;
            }
        }
    }
}

</style>
