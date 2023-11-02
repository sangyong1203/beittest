<template>
    <!-- 인력/차량 - 근로자관리 -->
    <div class="page">
        <CommonHeader />
        <WorkerManagement ref="workerManagementRef" @open-dialog="openDialog" @open-detail="openDetailDialog" @open-multi="openMultiDialog" />
        <CommonFooter />
        <!-- 등록 다이얼로그 -->
        <RegisterDialog :key="regDialogKey" class="page__dialog" :class="{ active: isVisible }" @close-dialog="closeDialog" />
        <MultiRegisterDialog :key="mRegDialogKey" class="page__multi-dialog" :class="{ active: isMultiVisible }" @close-dialog="closeMultiDialog" />
        <!-- 상세 다이얼로그 -->
        <DetailDialog
            :key="detailDialogKey"
            ref="detailDialogRef"
            class="page__detail-dialog"
            :class="{ active: isDetailVisible }"
            @close-dialog="closeDetailDialog"
            @open-password="openPasswordDialog"
        />
        <!-- 비밀번호 변경 다이얼로그 -->
        <PasswordDialog
            :key="pwDialogKey"
            :user-name="userName"
            :user-id="userId"
            class="page__password-dialog"
            :class="{ active: isPasswordVisible }"
            @close-dialog="closePasswordDialog"
        />
    </div>
</template>

<script setup lang="ts">
import CommonHeader from '@components/Header.vue'
import CommonFooter from '@components/Footer.vue'
import WorkerManagement from './workerManagementComponents/index.vue'
// 다이얼로그
import RegisterDialog from './workerManagementComponents/dialog/RegisterDialog.vue'
import DetailDialog from './workerManagementComponents/dialog/DetailDialog.vue'
import PasswordDialog from './workerManagementComponents/dialog/PasswordDialog.vue'
import MultiRegisterDialog from './workerManagementComponents/dialog/MultiRegisterDialog.vue'

import { ref } from 'vue'
import { useStore } from '@stores/index'

const userId = ref<number>(0) // 리스트 유저 ID
const userName = ref<string>('') // 리스트 유저 Name
const regDialogKey = ref(0)
const mRegDialogKey = ref(0)
const detailDialogKey = ref(0)
const pwDialogKey = ref(0)

const workerManagementRef = ref<InstanceType<typeof WorkerManagement> | null>(null)

const store = useStore()

// 등록 다이얼로그 열기 & 닫기
const isVisible = ref<boolean>(false)
const openDialog = (value: boolean): void => {
    isVisible.value = value

    store.setCompanyList()
    store.setCtgoConstructionList()
    store.setCtgoOccupationList()
}
const closeDialog = (value: boolean): void => {
    regDialogKey.value++
    isVisible.value = value
    workerManagementRef.value?.getData()
}
// 일괄등록 다이얼로그 열기 & 닫기
const isMultiVisible = ref<boolean>(false)
const openMultiDialog = (value: boolean) => {
    isMultiVisible.value = value
}
const closeMultiDialog = (value: boolean) => {
    mRegDialogKey.value++
    isMultiVisible.value = value
    workerManagementRef.value?.getData()
}
// 상세 다이얼로그 열기 & 닫기
const isDetailVisible = ref<boolean>(false)
const detailDialogRef:any = ref(null)
const openDetailDialog = (value: any): void => {
    isDetailVisible.value = value.isVisible
    detailDialogRef.value.openDialog(value)
    store.setCompanyList()
    store.setCtgoConstructionList()
    store.setCtgoOccupationList()
}
const closeDetailDialog = (value: boolean): void => {
    detailDialogKey.value++
    isDetailVisible.value = value
    workerManagementRef.value?.getData()
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
    userName.value = ''
}
</script>

<style lang="scss" scoped>
@import '@assets/styles/main.scss';

.page {
    display: flex;
    flex-direction: column;
    align-items: center;

    width: 100%;
    height: 100%;

    background-color: $color-white-100;

    &__dialog,
    &__multi-dialog,
    &__detail-dialog,
    &__password-dialog {
        display: none;

        &.active {
            position: absolute;
            display: flex;
        }
    }
}
</style>
