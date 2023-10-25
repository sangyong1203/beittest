<template>
    <div class="unit-textField">
        <div class="unit-textField__label-box">
            {{ label }}
            <span class="unit-textField__label-box__required" :class="{ active: required }">*</span>
        </div>
        <div class="unit-textField__input-box">
            <div class="unit-textField__input-box__props">
                <input
                    :value="defaultModelValue"
                    @input="updateValue"
                    type="text"
                    :placeholder="`${placeholder}`"
                    class="input"
                    :class="{ disabled: true, validation: validation }"
                    :disabled="true"
                />
                <span class="unit">ton</span>
            </div>
            <div class="unit-textField__input-box__input">
                <input
                    :value="modelValue"
                    @input="updateValue"
                    type="text"
                    :placeholder="`${placeholder}`"
                    class="input"
                    :class="{ disabled: false, validation: validation }"
                    :disabled="false"
                />
                <span class="unit">{{ unit }}</span>
            </div>
            <div class="unit-textField__input-box__output">
                <input
                    :value="Number(defaultModelValue) * Number(modelValue !== '' ? modelValue : 1)"
                    @input="updateValue"
                    type="text"
                    :placeholder="`${placeholder}`"
                    class="input"
                    :class="{ disabled: true, validation: validation }"
                    :disabled="true"
                />
                <span class="unit">ton</span>
            </div>
        </div>
        <span v-if="validation" class="unit-textField__validation">{{ checkName(label) }}</span>
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

    modelValue: string
    defaultModelValue: string
}
const props = defineProps<Props>()
const { label, placeholder, required, disabled, validation, modelValue } = toRefs(props)

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

.unit-textField {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;

    height: 48px;

    position: relative;

    &__label-box {
        display: flex;
        flex-direction: row;
        align-items: center;
        width: 120px;

        // &__small {
        //     font-size: 14.5px;
        //     display: block;
        //     margin-left: 2px;
        // }

        &__required {
            display: none;

            &.active {
                display: block;

                margin-left: 4px;
                color: $color-red-000;
            }
        }
    }
    &__input-box {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;

        gap: 4px;

        &__props {
            position: relative;

            .input {
                padding: 14px 12px;

                width: 61px;

                border: 1px solid $color-white-400;
                border-radius: 6px;
            }
        }
        &__input {
            position: relative;

            .input {
                padding: 14px 12px;

                width: 61px;

                border: 1px solid $color-white-400;
                border-radius: 6px;
            }
        }
        &__output {
            position: relative;

            .input {
                padding: 14px 12px;

                width: 61px;

                border: 1px solid $color-white-400;
                border-radius: 6px;
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
    input::placeholder {
        color: #b1b1b1;
    }
    input:focus {
        outline: none;
    }
}

.unit {
    position: absolute;
    top: 50%;
    right: 0;
    transform: translate(-50%, -50%);

    color: $color-black-500;
}
</style>
