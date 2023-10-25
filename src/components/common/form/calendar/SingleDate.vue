<template>
    <div class="datePicker">
        <div class="datePicker__label-box" :style="{ width: labelWidth ? `${labelWidth}` : `120px` }">
            <span class="datePicker__label-box__label">{{ label }}</span>
            <span class="datePicker__label-box__required-mark" :class="{ active: required }">*</span>
        </div>
        <form class="datePicker__form" :class="{ disabled: disabled }">
            <input
                v-model="setDate"
                type="text"
                placeholder="날짜 선택"
                class="datePicker__form__input"
                :class="{ disabled: disabled }"
                :disabled="disabled"
                :readonly="true"
                :style="{ width: inputWidth ? `${inputWidth}` : `230px`, fontSize: fontSize ? `${fontSize}` : `16px` }"
            />
            <IconButton :icon="'calendarBlack'" class="datePicker__form__button" @click="openCalendar" :class="{ disabled: disabled }" />

            <v-date-picker v-if="!disabled" v-model="date" mode="date" class="datePicker__form__calendar" :class="{ active: showCalendar }" />
        </form>
    </div>
</template>

<script setup lang="ts">
import IconButton from "@components/common/button/IconButton.vue"
import { ref, computed, toRefs, watch } from "vue"
import dayjs from "dayjs"

const emit = defineEmits(["send-date"])

interface Props {
    label?: string
    labelWidth?: string
    inputWidth?: string
    fontSize?: string
    required?: boolean
    setInfo: string
    disabled?: boolean
    isUpdate?: boolean
}
const props = defineProps<Props>()
const { setInfo, disabled, isUpdate, label, labelWidth, inputWidth, fontSize } = toRefs(props)

// 시작일 (임의로 -21일 지정 '* 추후 데이터 있을 때는 예외처리 필요')
const initStartDate = new Date(Date.now() - 0 * 24 * 60 * 60 * 1000)
const date = ref<Date>(initStartDate)

let setDate = computed(() => {
    if (isUpdate.value != true) {
        const res = dayjs(date.value).format("YYYY.MM.DD")
        if (setInfo.value != null && setInfo.value != "") {
            showCalendar.value = false
            if (res == "Invalid Date") {
                emit("send-date", "")
                return date.value
            } else {
                emit("send-date", res)
                return res
            }
        } else {
            emit("send-date", res)
            return res
        }
    } else {
        const res = dayjs(date.value).format("YYYY.MM.DD")
        if (setInfo.value != null && setInfo.value != "") {
            return setInfo.value
        } else {
            emit("send-date", res)
            return res
        }
    }
})

watch(date, (vo) => {
    if (vo) {
        const res = dayjs(date.value).format("YYYY.MM.DD")
        showCalendar.value = false
        if (res == "Invalid Date") {
            emit("send-date", "")
            return setInfo.value
        } else {
            emit("send-date", res)
            return res
        }
    }
})

// Calendar 열기 & 닫기
const showCalendar = ref<boolean>(false)

const openCalendar = () => {
    showCalendar.value = !showCalendar.value
}
</script>

<style lang="scss" scoped>
@import "@assets/styles/main.scss";

.datePicker {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;

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

                cursor: not-allowed;
            }
        }
        &__button {
            display: flex;
            align-items: center;
            justify-content: center;

            width: 40px;
            height: 40px;

            background-color: $color-white-100;
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

            &.active {
                display: block;

                position: absolute;
                top: 54px;
                left: 0px;

                min-width: 248px;
                width: 100%;

                z-index: 10;
            }
        }
    }
    &__hyphen {
        width: 8px;
        height: 2px;
        background-color: $color-black-800;
    }
}
</style>
