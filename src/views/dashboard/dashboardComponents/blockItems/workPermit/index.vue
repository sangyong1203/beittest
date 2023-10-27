<template>
    <Teleport to="#workPermit">
        <BasicLayout class=" block-item" 
            :label="label" 
            :show-button="button"  
            @open-click="openDialog"
        >
            <div class="body">
                <div class="graph__content">
                    <BarlineChart :data="data" />
                </div>
            </div>
        </BasicLayout>
    </Teleport>
</template>

<script setup lang="ts">
import BasicLayout from "@components/common/layout/BlockBasicLayout.vue"
import BarlineChart from "./BarlineChart.vue"
import { toRefs } from "vue"
import { useStore } from '@stores/index'

const store = useStore()

interface Props {
    label?: string
    button: boolean
    data: any
    date?: string
}
const props = defineProps<Props>()
const { label, button, data, date } = toRefs(props)
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
    padding: 5px 10px;
    box-sizing: border-box;
    .graph__content{
        width: 100%;
        height: 100%;  
        box-sizing: border-box;
    }
}
</style>
