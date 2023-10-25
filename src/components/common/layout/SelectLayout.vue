<template>
    <DriverDialogLayout :title="title" @close-dialog="closeDialog">
        <div class="userList-box">
            <DriverCard v-for="item in driverList" :key="item.user_id" :data="item" @send-driver="selectDriver" />
            <div v-if="driverList?.length == 0" class="no-data">
                <img src="@assets/images/logo.svg" alt="" class="no-data__image" />
                <span class="no-data__title">조회 가능한 출역 인원이 없습니다.</span>
            </div>
        </div>
        <ComfirmPopup class="popup" :class="{ active: isVisible }" @cancel="closePopup" @confirm="confirmPopup" />
    </DriverDialogLayout>
</template>

<script setup lang="ts">
import DriverDialogLayout from "@components/mocules/heavyEquipment/equipManagement/DriverDialogLayout.vue"
import DriverCard from "@components/mocules/heavyEquipment/equipManagement/DriverCard.vue"
import ComfirmPopup from "@components/common/original/ComfirmPopup.vue"
import { Driver } from "@/types/heavyEquipment/equipManagement"
import { useStore } from "@stores/index"
import api from "@apis/selfApi"

import { watch, ref, toRefs } from "vue"

interface Props {
    title: string
    event: boolean
}
const props = defineProps<Props>()
const { title, event } = toRefs(props)
const store = useStore()

// 삭제 팝업 열기
const isVisible = ref<boolean>(false)
const openPopup = () => {
    isVisible.value = true
}
const closePopup = () => {
    isVisible.value = false
    emit("close-dialog", false)
    emit("send-driver", false)
}
const confirmPopup = () => {
    isVisible.value = false
    emit("send-driver", driverObj.value)
}

const emit = defineEmits(["close-dialog", "send-driver"])
const closeDialog = (label: string): void => {
    emit("close-dialog", false)
}

const driverObj = ref<any>([])
const selectDriver = (data: any) => {
    driverObj.value = data
    openPopup()
}

watch(event, (newVal, oldVal) => {
    if (newVal) {
        getDriverList()
    }
})

const driverList = ref<Driver[]>() || []
const getDriverList = () => {
    const headerParams = store.headerParams
    const loginSession = store.loginData
    const scene_id = loginSession.user_permission.scene_id
    const company_id = loginSession.user_main_company.company_id

    let params = {
        scene_id: scene_id,
        company_id: company_id,
    }
    params = Object.assign({}, params, headerParams)
    api.getEquipDriverList(params).then((res) => {
        try {
            const rsCode = res.data.rsCode
            const data = res.data.rsMap
            if (rsCode === 0) {
                driverList.value = data !== undefined ? data : []
            }
        } catch (error) {
            console.log(error)
        }
    })
}
</script>

<style lang="scss" scoped>
@import "@assets/styles/main.scss";

.userList-box {
    width: 100%;
    height: 100%;
    padding-right: 8px;

    overflow-y: scroll;

    // /* Hide scrollbar for IE, Edge and Firefox */
    -ms-overflow-style: none; /* IE and Edge */
    scrollbar-width: none; /* Firefox */

    // /* Hide scrollbar for Chrome, Safari and Opera */
    &::-webkit-scrollbar {
        display: none;
    }
}
.no-data {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    width: 100%;
    height: 100%;

    padding-right: 2px;

    background-color: $color-white-000;
    border-radius: 6px;

    box-shadow: inset 0px 0px 3px rgba(0, 0, 0, 0.15);

    &__image {
        opacity: 0.6;
    }
    &__title {
        font-size: 18px;
        font-weight: 700;
        color: $color-white-400;
    }
}

.popup {
    display: none;
    position: absolute;
    top: 0;
    left: 0;

    &.active {
        display: flex;
    }
}
</style>
