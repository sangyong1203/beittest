<template>
    <div class="common-content">
        <div class="common-content__header">
            <span class="common-content__header__label">{{ label }}</span>
        </div>
        <div class="divider"></div>
        <div class="common-content__sub-header">
            <div class="common-content__sub-header__select-box">
                <FormDoubleDate :label="''" :label-width="'0px'" :input-width="'174px'" :start-date="startDate" :end-date="endDate" @send-startDate="setStartDate" @send-endDate="setEndDate" />
                <SearchBar @send-event="getSearchText" />
            </div>
        </div>
        <div class="common-content__body">
            <slot></slot>
        </div>
    </div>
</template>

<script setup lang="ts">
import FormDoubleDate from "@components/common/form/calendar/DoubleDateAll.vue"
import SearchBar from "@components/common/SearchBar.vue"

import { ref } from "vue"

interface CommonContentProps {
    label: string
}
const { label } = defineProps<CommonContentProps>()

const startDate = ref<string>("")
const endDate = ref<string>("")

const emit = defineEmits(["send-search"])
const getSearchText = (value: string) => {
    const data = {
        search_text: value,
        start_date: startDate.value,
        end_date: endDate.value,
    }
    emit("send-search", data)
}

const setStartDate = (value: string) => {
    startDate.value = value
}

const setEndDate = (value: string) => {
    endDate.value = value
}
</script>

<style lang="scss" scoped>
@import "@assets/styles/main.scss";

.common-content {
    display: flex;
    flex-direction: column;

    width: 100%;
    height: 100%;
    gap: 15px;

    &__header {
        display: flex;
        align-items: center;
        justify-content: space-between;

        padding-left: 25px;

        &__label {
            font-weight: 600;
            font-size: 24px;
            line-height: 29px;

            @include laptop() {
                font-size: 22px;
            }
        }
    }
    &__sub-header {
        display: flex;
        align-items: center;
        justify-content: space-between;

        &__select-box {
            display: flex;
            align-items: center;


            gap: 24px;
        }
    }
    &__body {
        width: 100%;
        height: calc(100% - 130px);
        padding: 30px 40px 0 40px;
        background-color: $color-white-000;
        border-radius: 6px;
        box-shadow: (0px 0px 3px rgba(0, 0, 0, 0.149));
        display: flex;
        flex-direction: column;
    }
}
.divider {
    width: 100%;
    height: 1px;

    background-color: $color-white-200;
}
:deep(.double-datePicker__label-box){
    display: none;
}
:deep(.table){
    height: calc(100% - 60px) !important;
}
</style>
