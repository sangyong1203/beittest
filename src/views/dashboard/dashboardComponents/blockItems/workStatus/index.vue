<template>
    <Teleport to="#workStatus">
        <BasicLayout class=" block-item" 
            :label="label" 
            :show-button="button"  
            @open-click="openDialog"
        >
            <div class="body">
                <div class="donut-graph">
                    <div class="donut-graph__content">
                        <PieChart :data="data" />
                    </div>
                </div>
            </div>
        </BasicLayout>
    </Teleport>
</template>

<script setup lang="ts">
import BasicLayout from "@components/common/layout/BlockBasicLayout.vue"
import PieChart from "./PieChart.vue"
import { ref, toRefs } from "vue"

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
    padding: 15px;
    box-sizing: border-box;
    
    &__content{
        width: 100%;
        height: 100%;
    }
}
</style>
