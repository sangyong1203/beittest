<template>
    <div class="single-datePicker">
        <div class="single-datePicker__label" :style="{ width: labelWidth ? `${labelWidth}` : `120px` }">
            {{ label }}
        </div>
        <form class="single-datePicker__form">
            <input v-model="formatedDate" type="text" placeholder="날짜 선택" class="single-datePicker__form__input" :style="{ width: inputWidth ? `${inputWidth}` : `230px` }" />
            <IconButton :icon="'calendarBlack'" class="single-datePicker__form__button" @click="openDatePicker" />
            <!-- <v-date-picker v-model="date" mode="date" class="single-datePicker__form__calendar" :class="{ active: isActive }" /> -->
        </form>
    </div>
</template>

<script setup lang="ts">
import IconButton from '@components/common/button/IconButton.vue'
import { ref, toRefs, computed } from 'vue'
import dayjs from 'dayjs'

interface Props {
    label?: string
    labelWidth?: string
    required?: boolean
    inputWidth?: string
    setInfo?: string
}
const props = defineProps<Props>()
const { label, labelWidth, inputWidth, required, setInfo } = toRefs(props)

// Calendar 열고 닫는 기능
const isActive = ref<boolean>(false)
const openDatePicker = (): void => {
    isActive.value = !isActive.value
}
const date = ref<Date>(new Date())
const formatedDate = computed(() => {
    // if (setInfo?.value) {
    //     return setInfo.value
    // } else {
    //     const res = dayjs(date.value).format("YYYY.MM.DD")
    //     isActive.value = false

    //     return res
    // }
    return setInfo?.value
})
</script>

<style lang="scss" scoped>
@import '@assets/styles/main.scss';

.single-datePicker {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;

    &__label {
        display: block;

        font-size: 16px;
        line-height: 20px;

        &__required {
            display: none;

            &.active {
                display: block;
                margin-left: 4px;
                color: $color-red-000;
            }
        }
    }
    &__form {
        display: flex;
        flex-grow: 1;
        align-items: center;
        justify-content: space-between;

        height: 36px;

        padding: 6px;

        background-color: $color-white-000;
        border: 1px solid $color-white-400;
        border-radius: 6px;

        position: relative;

        &__input {
            padding: 10px 0;
            margin: 0 12px 0 6px;

            outline: none;
            border: none;
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

            z-index: 1;

            &.active {
                display: block;
                width: 100%;
            }
        }
    }
}
</style>
