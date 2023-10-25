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

            <v-date-picker v-if="!disabled" v-model="startDate" mode="date" class="double-datePicker__form__calendar" :class="{ active: showFrontCalendar }" />
        </form>
        <div class="double-datePicker__hyphen"></div>
        <!-- 마감일 -->
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

            <v-date-picker v-if="!disabled" v-model="endDate" mode="date" class="double-datePicker__form__calendar" :class="{ active: showBackCalendar }" />
        </form>
    </div>
</template>

<script setup lang="ts">
import IconButton from '@components/common/button/IconButton.vue'
import { ref, computed, toRefs } from 'vue'
import dayjs from 'dayjs'

const emit = defineEmits(['send-start-date', 'send-end-date'])

interface Props {
    label?: string
    labelWidth?: string
    inputWidth?: string
    fontSize?: string
    required?: boolean
    setInfo?: {
        startDate: string
        endDate: string
    }
    disabled?: boolean
    isUpdate?: boolean
}
const props = defineProps<Props>()
const { setInfo, disabled, isUpdate, label, labelWidth, inputWidth, fontSize } = toRefs(props)

// 시작일 (임의로 -60 일 지정 '* 추후 데이터 있을 때는 예외처리 필요')
const initStartDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
const startDate = ref<Date>(initStartDate)
const endDate = ref<Date>(new Date())

let setStartDate = computed(() => {
    if (setInfo?.value != null) {
        if (disabled.value == true) {
            return setInfo.value.startDate
        } else {
            const res = dayjs(startDate.value).format('YYYY.MM.DD')
            showFrontCalendar.value = false

            if (res == 'Invalid Date') {
                emit('send-start-date', '')
                return ''
            } else {
                emit('send-start-date', res)
                return res
            }
        }
    } else {
        const res = dayjs(startDate.value).format('YYYY.MM.DD')
        showFrontCalendar.value = false

        if (res == 'Invalid Date') {
            emit('send-start-date', '')
            return ''
        } else {
            emit('send-start-date', res)
            return res
        }
    }
})

let setEndDate = computed(() => {
    if (setInfo?.value != null) {
        if (disabled.value == true) {
            return setInfo.value.endDate
        } else {
            const res = dayjs(endDate.value).format('YYYY.MM.DD')

            showBackCalendar.value = false

            if (res == 'Invalid Date') {
                emit('send-end-date', '')
                return ''
            } else {
                emit('send-end-date', res)
                return res
            }
        }
    } else {
        const res = dayjs(endDate.value).format('YYYY.MM.DD')

        showBackCalendar.value = false

        if (res == 'Invalid Date') {
            emit('send-end-date', '')
            return ''
        } else {
            emit('send-end-date', res)
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
@import '@assets/styles/main.scss';

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
