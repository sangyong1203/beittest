<template>
    <div class="approval-dropdown">
        <Dropdown v-model="selected" :label="dropdownLabel" :input-width="'294px'" :data="data" :set-info="selected" @send-data="selectedCategory" />
        <BasicButton :label="buttonLabel" :theme="'normal'" class="approval-dropdown__button" @click.prevent="openPopup" />
    </div>
    <!-- 삭제 팝업 -->
    <DeletePopup class="popup" :class="{ active: isVisible }" @cancel="closePopup" @delete="onDelete" />
</template>

<script setup lang="ts">
import BasicButton from '@components/common/button/BasicButton.vue'
import Dropdown from '@components/common/approval/Dropdown.vue'
import DeletePopup from '@components/common/popup/DeletePopup.vue'

import { toRefs, ref, watch } from 'vue'
import { useStore } from '@stores/index'
import { toast } from 'vue3-toastify'
import api from '@apis/selfApi'

interface Props {
    dropdownLabel: string
    buttonLabel: string
    data: any[] // 등록된 사용자 결재선 리스트
}
const props = defineProps<Props>()
const { dropdownLabel, buttonLabel, data } = toRefs(props)

const emit = defineEmits(['send-event', 'delete'])

const selected = ref<string>('선택')
watch(data, (vo) => {
    if (vo.length == 0) {
        selected.value = '선택'
    }
})

const selectedId = ref<number>(0)
const selectedCategory = (item: any) => {
    selected.value = item.name
    selectedId.value = item.id
    emit('send-event', selectedId.value)
}

// 사용자 결재라인 삭제
const deleteApprovalLine = () => {
    const store = useStore()
    const headerParams = store.headerParams

    let params = {
        // Required
        line_id: selectedId.value, // 결재선 ID
    }
    params = Object.assign({}, params, headerParams)
    api.deleteApprovalLine(params).then((res:any) => {
        try {
            const rsCode = res.data.rsCode

            if (rsCode === 0) {
                toast.success('결재선 삭제를 완료하였습니다.')
                emit('delete')
            }
        } catch (error) {
            console.log(error)
            toast.error(res.data.rsMsg)
        }
    })
}
// 삭제 팝업 열기 & 닫기
const isVisible = ref<boolean>(false)
const openPopup = () => {
    isVisible.value = true
}
const closePopup = () => {
    isVisible.value = false
}
const onDelete = () => {
    deleteApprovalLine()
    isVisible.value = false
}
</script>

<style lang="scss" scoped>
@import '@assets/styles/main.scss';

.approval-dropdown {
    display: flex;
    align-items: center;
    justify-content: space-between;

    padding: 6px 6px 6px 10px;

    background: $color-white-050;
    border: 1px solid $color-white-400;
    border-radius: 6px;

    &__button {
        min-width: 70px;

        padding: 14px 20px;
        margin-left: 6px;
    }
}

.popup {
    display: none;

    &.active {
        position: absolute;
        top: 0;
        left: 50%;
        transform: translateX(-50%);

        display: flex;

        border-radius: 12px;
    }
}
</style>
