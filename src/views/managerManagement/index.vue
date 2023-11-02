<template>
    <!-- 인력/차량 - 관리자관리 -->
    <div class="page">
        <CommonHeader />
        <ManagerManagement ref="managerManagementRef" @open-dialog="openDialog" @open-detail="openDetailDialog" />
        <CommonFooter />
        <!-- 등록 다이얼로그 -->
        <RegisterDialog :key="regDialogKey" ref="registerDialogRef" class="page__dialog" :class="{ active: isVisible }" @close-dialog="closeDialog" />
        <!-- 상세 다이얼로그 -->
        <DetailDialog
            :key="detailDialogKey"
            ref="detailDialogRef"
            class="page__detail-dialog"
            :class="{ active: isDetailVisible }"
            @close-dialog="closeDetailDialog"
            @open-password="openPasswordDialog"
        />
        <!-- 비밀번호 빈경 다이얼로그 -->
        <PasswordDialog :key="pwDialogKey" :user-name="userName" :user-id="userId" class="page__password-dialog" :class="{ active: isPasswordVisible }" @close-dialog="closePasswordDialog" />
    </div>
</template>

<script setup lang="ts">
import CommonHeader from "@components/Header.vue"
import CommonFooter from "@components/Footer.vue"
import ManagerManagement from "./managerManagementComponents/index.vue"
// 다이얼로그
import RegisterDialog from "./managerManagementComponents/dialog/RegisterDialog.vue"
import DetailDialog from "./managerManagementComponents/dialog/DetailDialog.vue"
import PasswordDialog from "./managerManagementComponents/dialog/PasswordDialog.vue"

import { ref } from "vue"
import { useStore } from "@stores/index"

const userId = ref<number>(0) // 리스트 유저 ID
const userName = ref<string>("") // 리스트 유저 Name
const regDialogKey = ref(0)
const detailDialogKey = ref(0)
const pwDialogKey = ref(0)

const managerManagementRef = ref<InstanceType<typeof ManagerManagement> | null>(null)
const registerDialogRef = ref<InstanceType<typeof RegisterDialog> | null>(null)

const store = useStore()

// 등록 다이얼로그 열기 & 닫기
const isVisible = ref<boolean>(false)
const openDialog = (value: boolean): void => {
    isVisible.value = value
    registerDialogRef.value?.getPermisstionList()

    store.setCompanyList()
    store.setCtgoDutyList()
}
const closeDialog = (value: boolean): void => {
    regDialogKey.value++
    isVisible.value = value
    managerManagementRef.value?.getData()
}

// 상세 다이얼로그 열기 & 닫기
const isDetailVisible = ref<boolean>(false)
const detailDialogRef:any = ref(null)
const openDetailDialog = (value: any): void => {
    isDetailVisible.value = value.isVisible
    detailDialogRef.value.getPermisstionList()
    detailDialogRef.value.openDialog(value)
    store.setCompanyList()
    store.setCtgoDutyList()
}
const closeDetailDialog = (value: boolean): void => {
    detailDialogKey.value++
    isDetailVisible.value = value
    managerManagementRef.value?.getData()
    userId.value = 0
}

// 비밀번호 변경 다이얼로그 열기 & 닫기
const isPasswordVisible = ref<boolean>(false)
const openPasswordDialog = (value: any) => {
    isPasswordVisible.value = value.isVisible
    userId.value = value.userId
    userName.value = value.userName
}
const closePasswordDialog = (value: any) => {
    pwDialogKey.value++
    isPasswordVisible.value = value.isVisible
    userId.value = 0
    userName.value = ""
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
    &__password-dialog {
        display: none;

        &.active {
            position: absolute;
            z-index: 2;

            display: flex;
        }
    }
}
</style>
