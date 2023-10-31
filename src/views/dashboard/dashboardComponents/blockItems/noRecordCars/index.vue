<template>
    <Teleport to="#noRecordCars">
        <BasicLayout class=" block-item" 
            :label="label" 
            :show-button="button"  
            @open-click="openDialog"
        >
            <template #header>( 총 {{data.length}}대 )</template>
            <div class="body">
                <div class="no-RecordCars">
                    <div class="car-number" v-for="item in data">{{ item }}</div>
                </div>
            </div>
        </BasicLayout>
    </Teleport>
</template>

<script setup lang="ts">
import BasicLayout from "@components/common/layout/BlockBasicLayout.vue"

import { Teleport, toRefs } from "vue"

interface Props {
    label?: string
    button: boolean
    data: any
}
const props = defineProps<Props>()
const { label, button, data } = toRefs(props)

// 다이얼로그 열기
const emit = defineEmits(["send-event"])
const openDialog = (): void => {
    const datas = {
        label: label?.value,
        isVisible: true,
    }
    emit("send-event", datas)
}





</script>

<style lang="scss" scoped>
@import "@assets/styles/main.scss";

$bordercolor: #895f2b;

$HEIGHT: 54px; // 헤더 Height 값
.header {
    display: flex;
    align-items: center;

    width: 100%;
    height: $HEIGHT;

    position: relative;

    &__label {
        position: absolute;
        left: 0;

        font-weight: 700;
        font-size: 17px;
        line-height: 20px;

    }
    &__button {
        display: flex;
        align-items: center;
        justify-content: center;

        gap: 6px;

        position: absolute;
        right: 0;

        outline: none;
        border: none;

        color: $color-blue-600;
        background-color: transparent;

        cursor: pointer;

        &__icon {
            width: 16px;
            height: 16px;

            @include laptop() {
                width: 14px;
                height: 14px;
            }
        }
    }
}
.body {
    width: 100%;
    height: calc(100% - 50px);
    padding: 20px;
    box-sizing: border-box;
    overflow-y: scroll;
    display: flex;
    align-items: flex-start;
    // /* Hide scrollbar for IE, Edge and Firefox */
    -ms-overflow-style: none; /* IE and Edge */
    scrollbar-width: none; /* Firefox */
    overflow-y: scroll;

    // /* Hide scrollbar for Chrome, Safari and Opera */
    &::-webkit-scrollbar {
        display: none;
    }
}

.no-RecordCars {
    // columns: 4;
    width: 100%;
    height: 100%;
    gap: 5px;
    padding-top: 10px;
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
    .car-number{
        color: white;
        font-size: 20px;
        border: 1px solid $bordercolor;
        padding: 2px;
        width: 24%;
        white-space: nowrap;
        display: flex;
        align-items: center;
        justify-content: center;
    }
        
}
</style>
