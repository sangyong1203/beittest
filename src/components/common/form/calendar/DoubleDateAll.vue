<template>
    <div class="double-datePicker">
        <!-- 라벨 -->
        <div class="double-datePicker__label-box" :style="{ width: labelWidth ? `${labelWidth}` : `120px` }">
            <span class="double-datePicker__label-box__label">{{ label }}</span>
            <span class="double-datePicker__label-box__required-mark" :class="{ active: required }">*</span>
        </div>
        <!-- 시작일 -->
        <form class="double-datePicker__form" :class="{ disabled: disabled }">
            <input
                v-model="setStartDate"
                type="text"
                placeholder="날짜 선택"
                class="double-datePicker__form__input"
                :disabled="disabled"
                :style="{ width: inputWidth ? `${inputWidth}` : `230px`, fontSize: fontSize ? `${fontSize}` : `16px` }"
            />
            <IconButton :icon="'calendarBlack'" class="double-datePicker__form__button" @click="openFrontCalendar" :class="{ disabled: disabled }" />

            <!-- <v-date-picker v-if="!disabled" v-model="initStartDate" mode="date" class="double-datePicker__form__calendar" :class="{ active: showFrontCalendar }" /> -->
        </form>

        <div class="double-datePicker__hyphen"></div>

        <form class="double-datePicker__form" :class="{ disabled: disabled }">
            <input
                v-model="setEndDate"
                type="text"
                placeholder="날짜 선택"
                class="double-datePicker__form__input"
                :disabled="disabled"
                :style="{ width: inputWidth ? `${inputWidth}` : `230px`, fontSize: fontSize ? `${fontSize}` : `16px` }"
            />
            <IconButton :icon="'calendarBlack'" class="double-datePicker__form__button" @click="openBackCalendar" :class="{ disabled: disabled }" />

            <!-- <v-date-picker v-if="!disabled" v-model="initEndDate" mode="date" class="double-datePicker__form__calendar" :class="{ active: showBackCalendar }" /> -->
        </form>
    </div>
</template>

<script setup lang="ts">
import IconButton from "@components/common/button/IconButton.vue"
import { ref, computed, toRefs, watch } from "vue"
import dayjs from "dayjs"

const emit = defineEmits(["send-startDate", "send-endDate"])

interface Props {
    label?: string
    labelWidth?: string
    inputWidth?: string
    fontSize?: string
    required?: boolean
    startDate: string
    endDate: string
    disabled?: boolean
    isUpdate?: boolean
    setInfo?: {
        startDate: string
        endDate: string
    }
}
const props = defineProps<Props>()
const { startDate, endDate, disabled, isUpdate, label, labelWidth, inputWidth, fontSize, setInfo } = toRefs(props)

// 시작일 (임의로 -60 일 지정 '* 추후 데이터 있을 때는 예외처리 필요')
const diffDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
const initStartDate = ref<Date>(diffDate)
const initEndDate = ref<Date>(new Date())

let setStartDate = computed(() => {
    if (isUpdate.value != true) {
        if (startDate.value != null) {
            return startDate.value
        } else {
            const res = dayjs(initStartDate.value).format("YYYY.MM.DD")
            showFrontCalendar.value = false

            if (res == "Invalid Date") {
                emit("send-startDate", "")
                return initStartDate.value
            } else {
                emit("send-startDate", res)
                return res
            }
        }
    } else {
        const res = dayjs(initStartDate.value).format("YYYY.MM.DD")

        if (startDate.value != null) {
            return startDate.value
        } else {
            emit("send-startDate", res)
            return res
        }
    }
})

watch(initStartDate, (vo) => {
    if (vo) {
        const res = dayjs(initStartDate.value).format("YYYY.MM.DD")
        showFrontCalendar.value = false

        if (res == "Invalid Date") {
            emit("send-startDate", "")
            return startDate.value
        } else {
            emit("send-startDate", res)
            return res
        }
    }
})

let setEndDate = computed(() => {
    if (isUpdate.value != true) {
        if (endDate.value != null) {
            return endDate.value
        } else {
            const res = dayjs(initEndDate.value).format("YYYY.MM.DD")
            showBackCalendar.value = false

            if (res == "Invalid Date") {
                emit("send-endDate", "")
                return initEndDate.value
            } else {
                emit("send-endDate", res)
                return res
            }
        }
    } else {
        const res = dayjs(initEndDate.value).format("YYYY.MM.DD")

        if (endDate.value != null) {
            return endDate.value
        } else {
            emit("send-endDate", res)
            return res
        }
    }
})

watch(initEndDate, (vo) => {
    if (vo) {
        const res = dayjs(initEndDate.value).format("YYYY.MM.DD")
        showBackCalendar.value = false

        if (res == "Invalid Date") {
            emit("send-endDate", "")
            return endDate.value
        } else {
            emit("send-endDate", res)
            return res
        }
    }
})

// Calendar 열기 & 닫기
const showFrontCalendar = ref<boolean>(false)
const showBackCalendar = ref<boolean>(false)

const openFrontCalendar = () => {
    showFrontCalendar.value = !showFrontCalendar.value
    showBackCalendar.value = false
}
const openBackCalendar = () => {
    showFrontCalendar.value = false
    showBackCalendar.value = !showBackCalendar.value
}
</script>

<style lang="scss" scoped>
@import "@assets/styles/main.scss";

.double-datePicker {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;

    gap: 0 8px;

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
        align-items: center;

        max-width: 274px;

        padding: 6px;

        background-color: $color-white-000;
        border: 1px solid $color-white-400;
        border-radius: 6px;

        position: relative;

        &__input {
            padding: 10px 0;
            margin: 0 6px 0 6px;

            font-size: 15px;

            outline: none;
            border: none;
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
                right: 0px;

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

    .disabled {
        cursor: not-allowed !important;
        background: #fafafa !important;
    }
}
</style>
