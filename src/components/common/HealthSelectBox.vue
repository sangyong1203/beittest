<template>
    <div class="select-box">
        <div class="select-box__label-box" :style="{ width: labelWidth ? `${labelWidth}` : `120px` }">
            <span class="select-box__label-box__label">{{ label }}</span>
            <span class="select-box__label-box__required-mark" :class="{ active: required }">*</span>
        </div>
        <BasicButton
            v-for="(item, index) in selectList"
            :key="index"
            :label="item.name"
            :theme="'normal'"
            class="select-button"
            :class="{ 'active': item.isChecked, 'disabled': disabled }"
            @click="onSelect(item)"
        />
        <span v-if="validation" class="select-box__validation">{{ checkValidation(label) }}</span>
    </div>
</template>

<script setup lang="ts">
import BasicButton from "@components/common/button/BasicButton.vue"
import {toRefs  } from "vue";
type SelectButtons = {
    name: string,
    isChecked: Boolean
}
interface Props {
    label: string // 라벨
    selectList: SelectButtons[],
    required?: boolean,  // 필수값 마크
    validation?:boolean,  // 필수값 마크
    disabled?:boolean,  // Readonly 체크
    labelWidth?: boolean, // 라벨 값 default: 120px 
}
const prop = defineProps<Props>()
const  { label, disabled, required, validation, selectList, labelWidth } = toRefs(prop)


const onSelect = (item:SelectButtons)=>{
    if(disabled.value) return
    item.isChecked = !item.isChecked
}


// 한글 Validation Check 함수
const checkValidation = (label:any) => {
    
    // data의 마지막 음절의 유니코드 (UTF-16)
    const charCode = label.charCodeAt(label.length - 1)
    // 유니코드의 한글 범위 내에서 해당 코드의 받침 확인
    const consonantCode = (charCode - 44032) % 28

    if (consonantCode === 0) {
        return `${label}는 필수 값입니다.`
    } else {
        return `${label}은 필수 값입니다.`
    }
}
</script>

<style lang="scss" scoped>
@import "@assets/styles/main.scss";

.select-box {
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

.select-button {
    &.active {
        background-color: #4b639a;
        border-radius: 6px;
        border: 1px solid transparent;

        color: $color-white-000;
    }
    &.disabled {
        cursor: not-allowed;
        color: $color-white-500;
    }
}
</style>
