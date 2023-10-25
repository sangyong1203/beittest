<template>
    <div class="double-datePicker">
        <!-- 라벨 -->
        <div class="double-datePicker__label-box" :style="{ width: labelWidth ? `${labelWidth}` : `120px` }">
            <span class="double-datePicker__label-box__label">{{ label }}</span>
            <span class="double-datePicker__label-box__required-mark" :class="{ active: required }">*</span>
        </div>
        <!-- 시작일 -->
        <form class="double-datePicker__form" :class="{ disabled: disabled }">
            <div
                type="text"
                :disabled="true"
                class="double-datePicker__form__input"
                :class="{ disabled: disabled }"
                :style="{ width: inputWidth ? `${inputWidth}` : `80%`, fontSize: fontSize ? `${fontSize}` : `16px` }"
            >
                {{ startDate }} 
                <span v-show="!startDate" class="dropdown-container__dropdown__placeholder">
                    {{ startDate ??'날짜 선택' }}
                </span>
            </div>
            <IconButton :icon="'calendarBlack'" class="double-datePicker__form__button" @click="openFrontCalendar" :class="{ disabled: disabled }" />
            
            <v-date-picker v-if="!disabled" v-model="startDate" mode="date" class="double-datePicker__form__calendar" :class="{ active: showFrontCalendar }" :disabled-dates="disabledDates" />
        </form>

        <div class="double-datePicker__hyphen"></div>

        <form class="double-datePicker__form" :class="{ disabled: disabled }">
            <div
                type="text"
                :disabled="true"
                class="double-datePicker__form__input"
                :class="{ disabled: disabled }"
                :style="{ width: inputWidth ? `${inputWidth}` : `80%`, fontSize: fontSize ? `${fontSize}` : `16px` }"
            >
                {{ endDate }} 
                <span v-show="!endDate" class="dropdown-container__dropdown__placeholder">
                    {{ endDate ??'날짜 선택' }}
                </span>
            </div>
            <IconButton :icon="'calendarBlack'" class="double-datePicker__form__button" @click="openBackCalendar" :class="{ disabled: disabled }" />

            <v-date-picker v-if="!disabled" v-model="endDate" mode="date" class="double-datePicker__form__calendar" :class="{ active: showBackCalendar }" />
        </form>
    </div>
</template>

<script setup lang="ts">
import IconButton from "@components/common/button/IconButton.vue"
import { ref, computed, toRefs, watch, onUpdated } from "vue"
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
const {  disabled, isUpdate, label, labelWidth, inputWidth, fontSize, setInfo } = toRefs(props)
const startDate: any = ref(props.startDate)
const endDate: any = ref(props.endDate)

onUpdated(()=>{
    startDate.value = props.startDate
    endDate.value = props.endDate
})
watch(startDate, (vo) => {
    console.log("startDate",startDate.value)
    if (vo) {
        startDate.value = dayjs(startDate.value).format("YYYY.MM.DD")
        emit("send-startDate", startDate.value)
        showFrontCalendar.value = false
    }
})

watch(endDate, (vo) => {
    if (vo) {
        endDate.value = dayjs(endDate.value).format("YYYY.MM.DD")
        emit("send-endDate", endDate.value)
        showBackCalendar.value = false
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

// Calendar DisabledDates
const disabledDates = ref([{ start: null, end: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) }])
</script>

<style lang="scss" scoped>
@import "@assets/styles/main.scss";

.double-datePicker {
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

        flex: 1;
        height: 36px;

        padding: 6px;

        background-color: $color-white-000;
        border: 1px solid $color-white-400;
        border-radius: 6px;

        position: relative;

        &.disabled {
            cursor: not-allowed !important;
            background: #fafafa !important;
            color: $color-white-500;
        }
        &__input {
            padding: 10px 0;
            margin: 0 6px 0 6px;
            width:80%;
            font-size: 15px;

            outline: none;
            border: none;
            
            &.disabled {
                cursor: not-allowed !important;
                background: #fafafa !important;
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
        margin: 0 8px;
        background-color: $color-black-800;
    }

    
}
</style>
