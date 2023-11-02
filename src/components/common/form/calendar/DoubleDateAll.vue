<template>
    <div class="double-datePicker">
        <!-- 라벨 -->
        <div class="double-datePicker__label-box" :style="{ width: labelWidth ? `${labelWidth}` : `120px` }">
            <span class="double-datePicker__label-box__label">{{ label }}</span>
            <span class="double-datePicker__label-box__required-mark" :class="{ active: required }">*</span>
        </div>
        <!-- 시작일 -->
        <el-date-picker

            v-model="formatedStartDate"
            type="date"
            placeholder="날짜 선택"
            :disabled="disabled"
        />
        <div class="double-datePicker__hyphen"></div>
        <el-date-picker
            v-model="formatedEndDate"
            type="date"
            placeholder="날짜 선택"
            :disabled="disabled"
        />
    </div>
</template>

<script setup lang="ts">
import IconButton from "@components/common/button/IconButton.vue"
import { ref, computed, toRefs, watch } from "vue"
import dayjs from "dayjs"

// const emit = defineEmits(["send-startDate", "send-endDate"])

interface Props {
    label?: string
    labelWidth?: string
    required?: boolean
    startDate: string
    endDate: string
    disabled?: boolean
}
const props = defineProps<Props>()
const { startDate, endDate, disabled, label, labelWidth } = toRefs(props)

// 시작일 (임의로 -60 일 지정 '* 추후 데이터 있을 때는 예외처리 필요')
    

const emit = defineEmits(["update:startDate", "update:endDate"])

const formatedStartDate = computed({
    get() {
        const initdate = dayjs(new Date()).subtract(3, "month").format("YYYY-MM-DD")
        let res = startDate.value ? startDate.value : initdate
        emit("update:startDate", res)
        return res
    },
    set(value) {
        const res = dayjs(value).format("YYYY-MM-DD")
        emit("update:startDate", res)
    },
})

const formatedEndDate = computed({
    get() {
        const initdate = dayjs(new Date()).format("YYYY-MM-DD")
        let res = endDate.value ? endDate.value : initdate
        emit("update:endDate", res)
        return res
    },
    set(value) {
        const res = dayjs(value).format("YYYY-MM-DD")
        emit("update:endDate", res)
    },
})

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
:deep(.el-date-editor){
    flex: 1;
    --el-input-height: 48px;
    font-size: 16px;
    font-weight: 500;
}
</style>
