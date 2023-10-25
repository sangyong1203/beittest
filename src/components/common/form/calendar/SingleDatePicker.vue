<template>
    <div class="single-datePicker">

        <div class="single-datePicker__label-box" :style="{ width: labelWidth ? `${labelWidth}` : `120px` }">
            <span class="single-datePicker__label-box__label">{{ label }}</span>
            <span class="single-datePicker__label-box__required-mark" :class="{ active: required }">*</span>
        </div>
        <el-date-picker

            v-model="formatedDate"
            type="date"
            placeholder="날짜 선택"
            :disabled="disabled"
        />
        <!-- <form class="single-datePicker__form" :class="{ disabled: disabled }">
            <input
                v-model="formatedDate"
                type="text"
                placeholder="날짜 선택"
                class="single-datePicker__form__input"
                :class="{ disabled: disabled }"
                :disabled="disabled"
                :style="{ width: inputWidth ? `${inputWidth}` : `100%` }"
            />
            <IconButton :icon="'calendarBlack'" class="single-datePicker__form__button" @click="openDropdown" />

            <v-date-picker v-model="formatedDate" mode="date" class="single-datePicker__form__calendar" :class="{ active: isActive }" />
            
        </form> -->
    </div>
</template>

<script setup lang="ts">
import IconButton from "@components/common/button/IconButton.vue"
import { ref, computed, toRefs } from "vue"
import dayjs from "dayjs"

interface Props {
    label?: string
    labelWidth?: string
    required?: boolean
    inputWidth?: string
    disabled?: boolean
    modelValue: string
}
const props = defineProps<Props>()
let { label, labelWidth, inputWidth, disabled, modelValue } = toRefs(props)

const emit = defineEmits(["update:modelValue"])
const formatedDate = computed({
    get() {
        let dateValue = modelValue.value ? modelValue.value : new Date()
        const res = dayjs(dateValue).format("YYYY-MM-DD")
        emit("update:modelValue", res)
        return res
    },
    set(value) {
        const res = dayjs(value).format("YYYY-MM-DD")
        emit("update:modelValue", res)
    },
})
</script>

<style lang="scss" scoped>
@import "@assets/styles/main.scss";

.single-datePicker {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;

    &__label-box {
        display: flex;
        align-items: center;
        justify-content: flex-start;

        &__required {
            display: none;

            &.active {
                display: block;

                margin: 4px 0 0 4px;
                color: $color-red-000;
            }
        }
        &__required-mark {
            display: none;

            &.active {
                display: block;

                margin: 4px 0 0 4px;
                color: $color-red-000;
            }
        }
    }
    &__form {
        display: flex;
        flex-grow: 1;
        align-items: center;
        justify-content: space-between;

        padding: 3px;

        background-color: $color-white-000;
        border: 1px solid $color-white-400;
        border-radius: 6px;

        position: relative;

        &.disabled {
            background-color: #fafafa;
        }

        &__input {
            padding: 10px 0;
            margin: 0 12px 0 6px;

            outline: none;
            border: none;
            &.disabled {
                background-color: #fafafa;
                color: $color-white-500;
            }
        }
        &__button {
            display: flex;
            align-items: center;
            justify-content: center;

            width: 40px;
            height: 40px;

            background-color: $color-white-050;
            border-radius: 3px;

            outline: none;
            border: none;

            cursor: pointer;

            &__icon {
                width: 24px;
                height: 24px;
            }
        }
        &__calendar {
            display: none;

            position: absolute;
            top: 52px;
            left: -1px;

            z-index: 999;

            &.active {
                display: block;
                width: 100%;
            }
        }
    }
}
:deep(.el-date-editor){
    flex: 1;
    --el-input-height: 48px;
    font-size: 16px;
    font-weight: 500;
}
</style>
