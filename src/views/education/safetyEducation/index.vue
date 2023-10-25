<template>
    <!-- 교육/회의 - 안전교육 -->
    <div class="page">
        <CommonHeader />
        <safetyEducation ref="safetyEducationRef" @open-dialog="openDialog" @open-detail="openDetailDialog" />
        <CommonFooter />
        <!-- 등록 다이얼로그 -->
        <RegisterDialog ref="registerDialogRef" class="page__dialog" :class="{ active: isVisible }" @close-dialog="closeDialog" />
        <!-- 상세 다이얼로그 -->
        <DetailDialog ref="detailDialogRef" :item="item" class="page__detail-dialog" :class="{ active: isDetailVisible }" @close-dialog="closeDetailDialog" @open-print="openPrintDialog" />
        <SafetyEducationPrint ref="safetyEducationPrintRef" class="page__print-dialog" :class="{ active: isPrintVisible }" @close-dialog="closePrintDialog" />
    </div>
</template>

<script setup lang="ts">
import CommonHeader from "@components/Header.vue"
import safetyEducation from "./safetyEducationComponents/index.vue"
import CommonFooter from "@components/Footer.vue"
// 다이얼로그
import RegisterDialog from "./safetyEducationComponents/dialog/RegisterDialog.vue"
import DetailDialog from "./safetyEducationComponents/dialog/DetailDialog.vue"
import SafetyEducationPrint from "./safetyEducationComponents/dialog/SafetyEducationPrint.vue"

import { ref } from "vue"

const safetyEducationRef = ref<InstanceType<typeof safetyEducation> | null>(null)
const registerDialogRef = ref<InstanceType<typeof RegisterDialog> | null>(null)
const detailDialogRef = ref<InstanceType<typeof DetailDialog> | null>(null)

// 등록 다이얼로그 열기 & 닫기
const isVisible = ref<boolean>(false)
const openDialog = () => {
    isVisible.value = true
    registerDialogRef.value?.getEducationTypes()
}
const closeDialog = () => {
    isVisible.value = false
    safetyEducationRef.value?.getData()
}

// 상세 다이얼로그 열기 & 닫기
const item = ref<any>({})
const isDetailVisible = ref<boolean>(false)
const openDetailDialog = (data: any) => {
    isDetailVisible.value = true
    item.value = data
}
const closeDetailDialog = () => {
    isDetailVisible.value = false
    safetyEducationRef.value?.getData()
}

// -------프린트  print dialog----------------------------
const safetyEducationPrintRef: any = ref(null)
const isPrintVisible = ref<boolean>(false)
const defaultPrintData = ref<any>({})
const openPrintDialog = (printData: any) => {
    isPrintVisible.value = true
    defaultPrintData.value = printData.value
    safetyEducationPrintRef.value.setData(printData.value)
}
const closePrintDialog = (value: boolean) => {
    isPrintVisible.value = value
}
</script>

<style lang="scss" scoped>
@import "@assets/styles/main.scss";

.page {
    display: flex;
    flex-direction: column;
    align-items: center;

    width: 100%;
    height: 100%;

    background-color: $color-white-100;

    &__dialog,
    &__detail-dialog {
        display: none;
        &.active {
            position: absolute;
            z-index: 2;
            display: flex;
        }
    }
    &__print-dialog {
        display: none;
        &.active {
            position: absolute;
            z-index: 3 !important;
            display: flex;
        }
    }
}
</style>
