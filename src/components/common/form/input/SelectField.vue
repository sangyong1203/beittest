<template>
    <div class="select-user">
        <!-- NEW -->
        <div class="select-user__label-box" :style="{ width: labelWidth ? `${labelWidth}` : `120px` }">
            <span class="select-user__label-box__label">{{ label }}</span>
            <span class="select-user__label-box__required-mark" :class="{ active: required }">*</span>
        </div>
        <form class="select-user__input-box" :class="{ disabled: disabled, validation: validation }">
            <input
                :value="modelValue"
                @input="updateValue"
                type="text"
                :placeholder="`${label}를 선택하세요.`"
                class="select-user__input-box__input"
                :class="{ disabled: disabled, validation: validation }"
                :style="{ width: inputWidth ? `${inputWidth}` : `230px` }"
            />
            <BasicButton :label="'선택'" class="select-user__input-box__button" :disabled="disabled" :class="{ disabled: disabled }" @click.prevent="openDialog" />
        </form>
        <span v-if="validation" class="select-user__validation">{{ checkName(label) }}</span>
    </div>
</template>

<script setup lang="ts">
import { toRefs, watch, ref } from 'vue'
import BasicButton from '@components/common/button/BasicButton.vue'

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
const { label, required, validation, modelValue } = toRefs(props)

// 운전원 선택 팝업이 띄워져야함
const emit = defineEmits(['open-dialog', 'update:modelValue', 'remove'])
const openDialog = (): void => {
    emit('open-dialog', true)
}

const updateValue = (event: any) => {
    emit('update:modelValue', event.target.value)
    modelValue.value = event.target.value
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

// Input Value 값이 변하면 validation check 해제
watch(modelValue, () => {
    emit('remove', label.value, false)
})
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

        &.disabled {
            background-color: $color-white-150;
        }
        &.validation {
            border: 1px solid $color-red-000;
        }

        &__input {
            padding: 14px 12px;

            outline: none;
            border: none;
            border-radius: 6px;

            cursor: pointer;

            &::placeholder {
                color: $color-white-450;
            }
            &.disabled {
                color: $color-white-500;
                background-color: $color-white-150;
            }
            &.validation {
                &::placeholder {
                    color: rgba($color-red-000, 0.9);
                }
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
