<template>
    <div class="period-setting">
        <!-- 라벨 -->
        <div class="period-setting__label-box" :style="{ width: labelWidth ? `${labelWidth}` : `120px` }">
            <span class="period-setting__label-box__label">{{ label }}</span>
            <span class="period-setting__label-box__required-mark" :class="{ active: required }">*</span>
        </div>
        <!-- 시작일 -->
        <form class="period-setting__form" :class="{ disabled: disabled }">
            <input
                v-model="setStartDate"
                type="text"
                placeholder="날짜 선택"
                class="period-setting__form__input"
                :class="{ disabled: disabled }"
                :readonly="true"
                :disabled="disabled"
                :style="{ width: inputWidth ? `${inputWidth}` : `230px`, fontSize: fontSize ? `${fontSize}` : `16px` }"
            />
            <IconButton :icon="'calendarBlack'" class="period-setting__form__button" @click="openFrontCalendar" :class="{ disabled: disabled }" />
            <!-- 캘린더 -->
            <v-date-picker v-if="!disabled" v-model="initStartDate" mode="date" class="period-setting__form__calendar" :class="{ active: showFrontCalendar }" />
        </form>

        <div class="period-setting__hyphen"></div>

        <form class="period-setting__form" :class="{ disabled: disabled }">
            <input
                v-model="setEndDate"
                type="text"
                placeholder="날짜 선택"
                class="period-setting__form__input"
                :class="{ disabled: disabled }"
                :readonly="true"
                :disabled="disabled"
                :style="{ width: inputWidth ? `${inputWidth}` : `230px`, fontSize: fontSize ? `${fontSize}` : `16px` }"
            />
            <IconButton :icon="'calendarBlack'" class="period-setting__form__button" @click="openBackCalendar" :class="{ disabled: disabled }" />
            <!-- 캘린더 -->
            <v-date-picker v-if="!disabled" v-model="initEndDate" mode="date" class="period-setting__form__calendar" :class="{ active: showBackCalendar }" />
        </form>
    </div>
</template>

<script setup lang="ts">
import IconButton from "@components/common/button/IconButton.vue"
import { computed, ref, toRefs, watch, onMounted } from "vue"
import dayjs from "dayjs"

interface Props {
    label?: string
    labelWidth?: string
    inputWidth?: string
    fontSize?: string
    required?: boolean
    disabled?: boolean

    startDate: string
    endDate: string
}
const props = defineProps<Props>()
const { label, labelWidth, inputWidth, fontSize, required, disabled, startDate, endDate } = toRefs(props)
const emit = defineEmits(["send-startDate", "send-endDate"])

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

// Calendar 날짜 지정 (기간은 1주일)
// 시작일 (임의로 -7일 지정) + 추후 데이터가 수정될 경우 예외처리 필요
const diffDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
const initStartDate = ref<Date>(new Date())
const initEndDate = ref<Date>(diffDate)

let setStartDate = computed(() => {
    if (startDate.value !== "") {
        return startDate.value
    } else {
        const res = dayjs(initStartDate.value).format("YYYY.MM.DD")
        showFrontCalendar.value = false

        if (res == "Invalid Date") {
            emit("send-startDate", "")

            return initStartDate.value
        }
        emit("send-startDate", res)
        return res
    }
})
watch(initStartDate, () => {
    const res = dayjs(initStartDate.value).format("YYYY.MM.DD")
    showFrontCalendar.value = false

    if (res == "Invalid Date") {
        emit("send-startDate", "")

        return startDate.value
    } else {
        emit("send-startDate", res)
        emit("send-endDate", dayjs(initStartDate.value).add(7, "day").format("YYYY.MM.DD"))
    }
})

let setEndDate = computed(() => {
    if (endDate.value !== "") {
        return endDate.value
    } else {
        showBackCalendar.value = false
        return ""
    }
})
</script>

<style lang="scss" scoped>
@import "@assets/styles/main.scss";

.period-setting {
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
        align-items: center;

        max-width: 274px;
        height: 36px;

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

            &.disabled {
                color: $color-white-500;
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
        margin: 0 8px;
        background-color: $color-black-300;
    }

    .disabled {
        cursor: not-allowed !important;
        background: #fafafa !important;
    }
}
</style>
