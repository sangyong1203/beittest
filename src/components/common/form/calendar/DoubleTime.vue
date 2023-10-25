<template>
    <div class="dropdown-container">
        <!-- NEW -->
        <div class="dropdown-container__label-box" :style="{ width: labelWidth ? `${labelWidth}` : `120px` }">
            <span class="dropdown-container__label-box__label">{{ label }}</span>
            <span class="dropdown-container__label-box__required-mark" :class="{ active: required }">*</span>
        </div>
        <div class="dropdown-container__content">
            <div class="dropdown-container__dropdown" :class="{ disabled: disabled, validation: validation }" style="margin-right: 10px" @click="openDropdown('start')">
                <div
                    type="text"
                    :disabled="true"
                    class="dropdown-container__dropdown__input"
                    :class="{ disabled: disabled }"
                    :style="{ width: inputWidth ? `${inputWidth}` : `115px` }"
                >
                    {{ startTime }} 
                    <span v-show="!startTime" class="dropdown-container__dropdown__placeholder">
                        {{ startPlaceholder ? startPlaceholder : '시작시간' }}
                    </span>
                </div>
                <IconButton :icon="'arrowDown'" class="dropdown-container__dropdown__button" />
                <!-- Dropdown -->
                <div class="dropdown-container__dropdown__drawer" :class="{ active: isStartActive }">
                    <div v-for="(item, index) in timeList" :key="item" class="list" @click="closeDropdown('start')">
                        <div class="list__name" :class="{ disabled: compareTime(item, endTime) }" @click="selectStartTime(item)">
                            {{ item }}
                        </div>
                        <div class="list__dividing-line" :class="{ inActive: index === timeList.length - 1 ? true : false }" />
                    </div>
                </div>
            </div>
            <div class="dropdown-container__dropdown" :class="{ disabled: disabled, validation: validation }" @click="openDropdown('end')">
                <div
                    type="text"
                    :placeholder="endPlaceholder ? endPlaceholder : '종료시간'"
                    :disabled="true"
                    class="dropdown-container__dropdown__input"
                    :class="{ disabled: disabled }"
                    :style="{ width: inputWidth ? `${inputWidth}` : `115px` }"
                >
                    {{ endTime }} 
                    <span v-show="!endTime" class="dropdown-container__dropdown__placeholder">
                        {{ endPlaceholder ? endPlaceholder : '종료시간' }}
                    </span>
                </div>
                <IconButton :icon="'arrowDown'" class="dropdown-container__dropdown__button" />
                <!-- Dropdown -->
                <div class="dropdown-container__dropdown__drawer" :class="{ active: isEndActive }">
                    <div v-for="(item, index) in timeList" :key="item" class="list" @click="closeDropdown('end')">
                        <div class="list__name" :class="{ disabled: compareTime(startTime, item) }" @click="selectEndTime(item)">
                            {{ item }}
                        </div>
                        <div class="list__dividing-line" :class="{ inActive: index === timeList.length - 1 ? true : false }" />
                    </div>
                </div>
            </div>
        </div>
        <span v-if="validation" class="dropdown-container__validation">{{ checkName(label) }}</span>
    </div>
</template>

<script setup lang="ts">
import { ref, toRefs } from "vue"
import { toast } from "vue3-toastify"
import IconButton from "@components/common/button/IconButton.vue"

interface Props {
    label: string
    required?: boolean
    validation?: boolean
    startPlaceholder?: string
    endPlaceholder?: string
    disabled?: boolean
    labelWidth?: string // 라벨 값 default: 120px
    inputWidth?: string // 드롭다운 값 default: 274px
    startTime: string
    endTime: string
    durationMinute?:any
}
const props = defineProps<Props>()
let { label, required, validation, startPlaceholder, endPlaceholder, disabled, startTime, endTime, durationMinute } = toRefs(props)
let durationTime:any = durationMinute.value? durationMinute.value : 60
let timeList: any = []
timeList = createTimeList(durationTime)
function createTimeList(duration: any) {
    duration = Number(duration)

    let minute = 0
    let hour = 0
    let tList = []

    while (hour < 24) {
        let mm = ""
        let hh = ""

        if (minute < 60) {
            minute = minute + duration
            if (minute < 10) {
                mm = "0" + minute.toString()
            } else {
                mm = minute.toString()
            }
        }
        if (minute >= 60) {
            hour++
            minute = 0
            mm = "00"
        }
        if (hour < 10) {
            hh = "0" + hour.toString()
        } else {
            hh = hour.toString()
            if (hh === "24") {
                hh = "00"
            }
        }
        tList.push(hh + " : " + mm)
    }
    return tList
}

// Dropdown 열고 닫는 기능
const isStartActive = ref<boolean>(false)
const isEndActive = ref<boolean>(false)

const openDropdown = (value: string): void => {
    if (disabled.value) return
    if (value === "start") {
        isStartActive.value = !isStartActive.value
    } else {
        if (startTime.value) {
            isEndActive.value = !isEndActive.value
        } else {
            toast.warn("시작 시간을 먼저 선택하세요.")
        }
    }
}
const closeDropdown = (value: string): void => {
    if (value === "start") {
        isStartActive.value = !isStartActive.value
    } else {
        isEndActive.value = !isEndActive.value
    }
}
// Dropdown Value 전달
const selected = ref<string>("")
const emit = defineEmits(["send-event", "send-data", "update:startTime", "update:endTime", "remove"])
function selectStartTime(item: any) {
    if (endTime.value && compareTime(item, endTime.value)) {
        toast.warn("선택할 수 없는 시간입니다.")
    } else {
        emit("update:startTime", item)
        // console.log("update:startTime", item)
        updateSelectionStatus("startTime")
        updateValidation()
        closeDropdown("start")
    }
}
function selectEndTime(item: any) {
    console.log("time--", item)
    if (!startTime.value) {
        toast.warn("시작 시간을 먼저 선택하세요.")
        return
    }

    if (compareTime(startTime.value, item)) {
        toast.warn("선택할 수 없는 시간입니다.")
    } else {
        emit("update:endTime", item)
        updateSelectionStatus("endTime")
        updateValidation()
        closeDropdown("end")
    }
}
// 선택시간 비교. 시작시간은 종료시간보다 크면  return true, 아니면 false
function compareTime(start: string, end: string) {
    let isBiger = false
    let sTime = start.replaceAll(" ", "").split(":")
    let eTime = end.replaceAll(" ", "").split(":")
    if (!end) {
        isBiger = false
    } else if (Number(sTime[0]) > Number(eTime[0])) {
        isBiger = true
    } else if (Number(sTime[0]) === Number(eTime[0])) {
        isBiger = Number(sTime[1]) > Number(eTime[1])
    }
    return isBiger
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
// input value가 변하면 validation check 해제
let startTimeSelected = false
let endtTimeSelected = false
function updateSelectionStatus(value: string) {
    if (value == "startTime" || startTime.value) {
        startTimeSelected = true
    }
    if (value == "endTime" || endTime.value) {
        endtTimeSelected = true
    }
}
function updateValidation() {
    if (startTimeSelected && endtTimeSelected) {
        emit("remove", label.value, false)
    } else {
        emit("remove", label.value, true)
    }
}
</script>

<style lang="scss" scoped>
@import "@assets/styles/main.scss";

.dropdown-container {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;

    position: relative;

    &__label-box {
        display: flex;
        align-items: center;

        &.inActive {
            display: none;
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
    &__content {
        display: flex;
        flex: 1;
    }
    &__dropdown {
        position: relative;

        display: flex;
        flex: 1;
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
            border-radius: 6px;
        }

        .list {
            display: flex;
            flex-direction: column;

            width: 100%;
            height: 100%;

            border-radius: 6px;

            &__name {
                padding: 12px 16px !important;

                &:hover {
                    cursor: pointer;
                    background-color: #f5f8fc;
                }
                &.disabled {
                    cursor: not-allowed;
                    background-color: $color-white-150;
                }
            }
            &__dividing-line {
                width: 95%;
                height: 1px;
                background-color: $color-white-200;
                align-self: center;

                &.inActive {
                    display: none;
                }
            }
        }
        input::placeholder {
            color: $color-white-450;
        }
        &__placeholder{
            color: $color-white-450;
        }
        &__input {
            padding: 12px;

            outline: none;
            border: none;
            border-radius: 6px;
            background-color: $color-white-000;

            cursor: pointer;

            &.disabled {
                color: $color-white-500;
                background-color: $color-white-150;
            }

            &::placeholder {
                color: #2f2f35;
            }
        }
        &__button {
            display: flex;
            align-items: center;
            justify-content: center;

            width: 40px;
            height: 40px;

            margin-right: 4px;

            border-radius: 3px;
            background-color: $color-white-050;
        }
        &__drawer {
            position: absolute;
            left: -1px;
            top: 52px;
            display: none;

            &.active {
                display: block;

                width: 100%;
                max-height: 180px;
                background-color: $color-white-000;

                border: 1px solid #dadada;
                border-radius: 6px;
                box-shadow: 0px 0px 3px rgba(0, 0, 0, 0.15);

                overflow-y: scroll;
                z-index: 2;
            }
        }
    }
    &__validation {
        position: absolute;
        top: 54px;
        left: 132px;

        color: $color-red-000;
        font-size: 12px;
    }
}
</style>
