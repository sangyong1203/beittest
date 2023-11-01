<template>
    <Teleport to="#heavyEquipStatus">
        <BasicLayout class=" block-item" 
            :label="label" 
            :show-button="button"  
            @open-click="openDialog"
        >
            <div class="body">
                <div class="donut-graph">
                    <div class="donut-graph__content">
                        <DashboardCompanyChart :data="data" style="width: 160px; height: 160px;"/>
                        <DashboardContent :label="'중장비별'" :data="data" />
                    </div>
                </div>
            </div>
        </BasicLayout>
    </Teleport>
</template>

<script setup lang="ts">
import BasicLayout from "@components/common/layout/BlockBasicLayout.vue"
import DashboardCompanyChart from "./companyChart.vue"
import DashboardContent from "./contents.vue"
import { toRefs } from "vue"

interface Props {
    label?: string
    button: boolean
    data: any
    date?: string
}
const porps = defineProps<Props>()
const { label, button, data, date } = toRefs(porps)

// 다이얼로그 열기
const emit = defineEmits(["send-event"])
const openDialog = (): void => {
    const datas = {
        label: label,
        isVisible: true,
    }
    emit("send-event", datas)
}
</script>

<style lang="scss" scoped>
@import "@assets/styles/main.scss";

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

        @include laptop() {
            font-weight: 700;
            font-size: 16px;
            line-height: 20px;
        }
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

        @include laptop() {
            font-weight: 700;
            font-size: 15px;
            line-height: 20px;
        }

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
.emergen-button{
    background-color: #de3e47;
    border-radius: 5px;
    padding: 5px 8px;
    color: white;
}
.body {
    width: 100%;
    height: calc(100% - $HEIGHT);
}
.donut-graph {
    display: flex;
    flex-direction: row;
    align-items: center;
    width: 100%;
    height: 100%;
    padding: 24px 18px;
    box-sizing: border-box;

    &__content {
        display: flex;
        align-items: center;
        justify-content: space-around;
        width: 100%;
        height: 100%;
        gap: 10px;
    }
}
</style>
