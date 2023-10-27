<template>
    <Teleport to="#dangerousWork">
        <BasicLayout class=" block-item" 
            :label="label" 
            :show-button="button"  
            @open-click="openDialog"
        >
            <div class="body">
                <div class="graph">
                    <div class="graph__content">
                        <BarChart :data="data" />
                    </div>
                </div>
            </div>
        </BasicLayout>
    </Teleport>
</template>

<script setup lang="ts">
import BasicLayout from "@components/common/layout/BlockBasicLayout.vue"
import BarChart from "./BarChart.vue"
import { toRefs } from "vue"
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
        }
    }
}
.body {
    width: 100%;
    height: calc(100% - $HEIGHT);
    .graph, .graph__content{
        width: 100%;
        height: 100%;  
    }
}
</style>
