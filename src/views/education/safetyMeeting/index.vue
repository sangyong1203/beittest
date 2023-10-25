<!-- eslint-disable vue/multi-word-component-names -->
<template>
    <!-- 교육/회의 - 안전회의록 -->
    <div class="page">
        <CommonHeader />
        <SafetyMeeting ref="safetyMeetingRef" @open-dialog="openDialog" @open-detail="openDetailDialog" />
        <CommonFooter />
        <!-- 등록 다이얼로그 -->
        <RegisterDialog ref="registerDialogRef" class="page__dialog" :class="{ active: isVisible }" @close-dialog="closeDialog" @open-select="openSelectWorkerDialog" />
        <!-- 상세 다이얼로그 -->
        <DetailDialog
            ref="detailDialogRef"
            class="page__detail-dialog"
            :class="{ active: isDetailVisible }"
            @send-data="setAttendees"
            @close-dialog="closeDetailDialog"
            @open-select="openSelectWorkerDialog"
            @open-print="openPrintDialog"
        />
        <!-- 회의참석인원 다이얼로그 -->
        <SelectWorkerDialog
            ref="selectUserRef"
            :label="'회의참석인원 선택'"
            class="page__select-dialog"
            :class="{ active: isSelectVisible }"
            @close-dialog="closeSelectWorkerDialog"
            @send-event="getUsers"
        />
    </div>
</template>

<script setup lang="ts">
import CommonHeader from "@components/Header.vue"
import SafetyMeeting from "./safetyMeeting/indexSafetyMeeting.vue"
import CommonFooter from "@components/Footer.vue"
// 다이얼로그
import RegisterDialog from "./safetyMeeting/dialog/RegisterDialog.vue"
import DetailDialog from "./safetyMeeting/dialog/DetailDialog.vue"
import SelectWorkerDialog from "./safetyMeeting/dialog/SelectWorkerDialog.vue"

import { ref } from "vue"
import { toast } from "vue3-toastify"

const safetyMeetingRef = ref<InstanceType<typeof SafetyMeeting> | null>(null)
const selectUserRef: any = ref(null)

// 등록 다이얼로그 열기 & 닫기
const isVisible = ref<boolean>(false)
const openDialog = (value: boolean): void => {
    isVisible.value = value
}
const closeDialog = (): void => {
    isVisible.value = false
    safetyMeetingRef.value?.getData()
    attendees.value = []
}

// 상세 다이얼로그 열기 & 닫기
const item = ref<any>({})
const isDetailVisible = ref<boolean>(false)
const openDetailDialog = (data: any) => {
    isDetailVisible.value = true
    item.value = data
    detailDialogRef.value.openDialog(data)
}
const setAttendees = (data: any) => {
    attendees.value = data
}
const closeDetailDialog = () => {
    isDetailVisible.value = false
    safetyMeetingRef.value?.getData()
    attendees.value = []
}

// 회의참석인원 선택 다이얼로그 열기 & 닫기
const isSelectVisible = ref<boolean>()
const attendees:any = ref([])

const openSelectWorkerDialog = () => {
    isSelectVisible.value = true

    selectUserRef.value.openDialog(attendees.value)
}
const closeSelectWorkerDialog = (value: boolean) => {
    isSelectVisible.value = value
}

const registerDialogRef: any = ref(null)
const detailDialogRef: any = ref(null)
const getUsers = (data: any[]) => {
    // 이전에 이미 등록된 데이터
    let prevUsersIds = []
    if (isVisible.value) {
        prevUsersIds = registerDialogRef.value.meetingAttendee.map((item: any) => {
            return item.user_id
        })
    }
    if (isDetailVisible.value) {
        prevUsersIds = detailDialogRef.value.meetingAttendee.map((item: any) => {
            return item.user_id
        })
    }
    // 새롭게 추가할 데이터
    let newUsersIds = data.map((item: any) => {
        return item.user_id
    })
    // 중복 있는가
    const res = prevUsersIds.filter((element: number) => newUsersIds.includes(element))
    if (res.length === 0 && data.length === 0 && attendees.value.length === 0) {
        toast.warn("추가할 인원을 선택해주세요.")
        return
    }
    if (res.length > 0 && data.length > 0) {
        toast.warn("이미 추가된 인원이 있습니다.")
        return
    }

    if (isVisible.value) {
        let list = registerDialogRef.value.meetingAttendee
        registerDialogRef.value.meetingAttendee = [...list, ...data]
        attendees.value = registerDialogRef.value.meetingAttendee
        isSelectVisible.value = false
    }
    if (isDetailVisible.value) {
        let list = detailDialogRef.value.meetingAttendee
        detailDialogRef.value.meetingAttendee = [...list, ...data]
        attendees.value = detailDialogRef.value.meetingAttendee
        isSelectVisible.value = false
    }
}

// -------프린트  print dialog----------------------------
const safetyMeetingPrintRef: any = ref(null)
const isPrintVisible = ref<boolean>(false)
const defaultPrintData = ref<any>({})
const openPrintDialog = (printData: any) => {
    isPrintVisible.value = true
    defaultPrintData.value = printData.value
    safetyMeetingPrintRef.value.setData(printData.value)
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
    &__detail-dialog,
    &__select-dialog {
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
