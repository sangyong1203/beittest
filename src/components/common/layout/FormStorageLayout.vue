<template>
    <!-- 임시저장 Form 다이얼로그 -->
    <div class="dialog">
        <div class="dialog-layout">
            <div class="dialog-layout__header">
                <span class="dialog-layout__header__title">{{ title }}</span>
                <IconButton :icon="'close'" class="dialog-layout__header__close" @click="closeDialog('취소')" />
            </div>
            <div class="dialog-layout__dividing-line"></div>
            <div class="dialog-layout__body">
                <slot></slot>
            </div>
            <div class="dialog-layout__footer">
                <BasicButton :label="leftBtn" :theme="leftBtn === '임시저장' ? 'outer' : 'cancel'" @click="" />
                <BasicButton v-if="step >= 2" :label="'이전'" :theme="'cancel'" @click="prevPage" />
                <BasicButton :label="step === 4 ? (rightBtn = '등록') : rightBtn" :theme="'fill'" @click="onSubmit(rightBtn)" />
            </div>
        </div>
        <!-- 삭제 팝업 -->
        <DeletePopup class="popup" :class="{ active: isVisible }" @cancel="closePopup" @delete="onDelete" />
    </div>
</template>

<script setup lang="ts">
import BasicButton from '@components/common/button/BasicButton.vue'
import IconButton from '@components/common/button/IconButton.vue'
import DeletePopup from '@components/common/popup/DeletePopup.vue'

import { onMounted, ref, toRefs } from 'vue'

interface Props {
    title: string
    step: number // 현재 Step
}
const props = defineProps<Props>()
const { title, step } = toRefs(props)

// 버튼 Label Name
const leftBtn = ref<string>('')
const middleBtn = ref<string>('')
const rightBtn = ref<string>('')
// Prop된 Title 문자열 체크하여 버튼 네이밍 변경 함수
const check = (title: string) => {
    if (title !== undefined && title.includes('등록')) {
        leftBtn.value = '임시저장'
        rightBtn.value = '다음'
    } else {
        leftBtn.value = '삭제'
        rightBtn.value = '수정'
    }
}
// 다이얼로그 닫기 외 버튼 기능 함수
const emit = defineEmits(['close-dialog', 'submit', 'update', 'delete', 'prevPage', 'nextPage', 'close-findDialog'])
const closeDialog = (label: string): void => {
    if (title.value.includes('등록') && label === '취소') {
        emit('close-dialog', false)
        leftBtn.value = '임시저장'
        rightBtn.value = '다음'
    } else if (title.value.includes('상세') && label === '취소') {
        emit('close-dialog', false)
        leftBtn.value = '삭제'
        rightBtn.value = '수정'
    } else {
        // 삭제 버튼을 눌렀을 때 - 삭제 문구 팝업 띄워야 하기 때문에 openPopup 함수 호출
        openPopup()
    }
}
const onSubmit = (label: string): void => {
    if (label === '수정') {
        emit('update', true)
        leftBtn.value = '취소'
        rightBtn.value = '등록'
    } else {
        if (rightBtn.value === '다음') {
            emit('nextPage')
        } else {
            emit('submit')
        }
    }
}
const prevPage = () => {
    emit('prevPage')
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
    isVisible.value = false
    emit('delete')
}

onMounted(() => {
    check(title.value)
})
</script>

<style lang="scss" scoped>
@import '@assets/styles/main.scss';

.dialog {
    display: none;

    &.active {
        display: flex;
        align-items: center;
        justify-content: center;

        width: 100%;
        height: 100vh;

        background-color: rgba($color-black-900, 0.5);

        position: absolute;
        z-index: 1; // 추후 삭제할지 말지 고민
    }
    .dialog-layout {
        position: absolute;

        display: flex;
        flex-direction: column;
        align-items: flex-start;

        max-width: 80%;
        min-height: 50%;
        max-height: 80%;
        
        padding: 30px 40px;
        gap: 18px;

        border-radius: 12px;
        background-color: $color-white-000;

        z-index: 2;

        &__header {
            display: flex;
            justify-content: space-between;
            align-items: center;

            width: 100%;

            &__title {
                padding-left: 10px;
                font-size: 19px;
                font-weight: 700;
            }
            &__close {
                cursor: pointer;
            }
        }
        &__dividing-line {
            width: 100%;
            height: 1px;

            margin-top: -8px;
            background-color: $color-white-400;
        }
        &__body {
            width: 100%;
            min-width: 774px;
            flex: 1;
            overflow-y: scroll;

            // /* Hide scrollbar for IE, Edge and Firefox */
            -ms-overflow-style: none; /* IE and Edge */
            scrollbar-width: none; /* Firefox */

            // /* Hide scrollbar for Chrome, Safari and Opera */
            &::-webkit-scrollbar {
                display: none;
            }
        }

        &__footer {
            display: flex;
            flex-direction: row;
            align-self: flex-end;

            gap: 12px;
        }
    }
    .popup {
        display: none;

        &.active {
            display: flex;
        }
    }
}
</style>
