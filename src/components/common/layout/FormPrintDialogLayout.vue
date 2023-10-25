<template>
    <!-- 프린트 Form 다이얼로그 -->
    <!-- 프린트 Form 다이얼로그는 상세 기능에서만 사용한다. -->
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
            <div v-if="btnVisible" class="dialog-layout__footer">
                <slot name="print-button"></slot>
                <BasicButton v-show="rightBtn==='수정'" :label="leftBtn" :theme="'outer'" @click="print(leftBtn)"></BasicButton>
                <BasicButton :label="middleBtn" :theme="'cancel'" @click="closeDialog(middleBtn)"></BasicButton>
                <BasicButton :label="rightBtn" :theme="'fill'" @click="onSubmit(rightBtn)"></BasicButton>
            </div>
            <div v-else class="dialog-layout__footer">
                <BasicButton :label="leftBtn" :theme="'outer'" @click="print(leftBtn)"></BasicButton>
            </div>
        </div>
        <!-- 삭제 팝업 -->
        <DeletePopup class="popup" :class="{ active: isVisible }" @cancel="closePopup" @delete="onDelete" />
    </div>
</template>

<script setup lang="ts">
import BasicButton from "@components/common/button/BasicButton.vue"
import IconButton from "@components/common/button/IconButton.vue"
import DeletePopup from "@components/common/popup/DeletePopup.vue"

import { ref, toRefs } from "vue"

interface Props {
    title: string
    btnVisible?: boolean
}
const props = defineProps<Props>()
const { title, btnVisible } = toRefs(props)

// 버튼 Label Name
const leftBtn = ref<string>("인쇄하기")
const middleBtn = ref<string>("삭제")
const rightBtn = ref<string>("수정")

// 다이얼로그 닫기 외 버튼 기능 함수
const emit = defineEmits(["close-dialog", "submit", "update", "delete", "print", "close-findDialog"])
const closeDialog = (label: string): void => {
    if (label === "삭제") {
        // 삭제 버튼을 눌렀을 때 - 삭제 문구 팝업 띄워야 하기 때문에 openPopup 함수 호출
        openPopup()
    } else if (label === "취소") {
        emit("close-dialog", false)

        middleBtn.value = "삭제"
        rightBtn.value = "수정"
    }
}
// 프린트
const print = (label: string) => {
    emit("print", true)
}
// 저장
const onSubmit = (label: string): void => {
    if (label === "수정") {
        emit("update", true)

        middleBtn.value = "취소"
        rightBtn.value = "저장"
    } else {
        emit("submit", false)
    }
}
// 삭제
const onDelete = () => {
    isVisible.value = false
    emit("delete")
}
// 삭제 팝업 열기 & 닫기
const isVisible = ref<boolean>(false)
const openPopup = () => {
    isVisible.value = true
}
const closePopup = () => {
    isVisible.value = false
}
</script>

<style lang="scss" scoped>
@import "@assets/styles/main.scss";

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
        z-index: 2; // 추후 삭제할지 말지 고민
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
