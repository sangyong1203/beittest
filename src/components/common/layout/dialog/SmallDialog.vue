<template>
    <!-- Form 다이얼로그 Small Size -->
    <div class="dialog">
        <div class="dialog-layout">
            <div class="dialog-layout__header">
                <span class="dialog-layout__header__title">{{ title }}</span>
                <IconButton :icon="'close'" class="dialog-layout__header__close" @click="closeDialog()" />
            </div>
            <div class="dialog-layout__dividing-line"></div>
            <div class="dialog-layout__body">
                <slot></slot>
            </div>
            <div class="dialog-layout__footer">
                <BasicButton v-if="!isUpdate" :label="'취소'" :theme="'cancel'" @click="closeDialog" />
                <BasicButton v-if="!isUpdate" :label="'저장'" :theme="'fill'" @click="onSubmit" />
                <BasicButton v-if="isUpdate" :label="'삭제'" :theme="'cancel'" @click="openPopup" />
                <BasicButton v-if="isUpdate && !isVisibleSave" :label="'수정'" :theme="'fill'" @click="onUpdate" />
                <BasicButton v-if="isVisibleSave" :label="'저장'" :theme="'fill'" @click="onSave" />
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
    isUpdate?: boolean
}
const props = defineProps<Props>()
const { title, isUpdate } = toRefs(props)

// 다이얼로그 닫기 외 버튼 기능 함수
const emit = defineEmits(["close-dialog", "submit", "update", "delete", "save", "close-findDialog"])
const closeDialog = (): void => {
    emit("close-dialog", false)
}
const onSubmit = (label: string): void => {
    if (label === "수정") {
        emit("update", true)
    } else {
        emit("submit", false)
    }
}

const onDelete = () => {
    isVisible.value = false
    emit("delete")
}

const onUpdate = () => {
    isVisibleSave.value = true
    emit("update", true)
}

const isVisibleSave = ref<boolean>(false)
const onSave = () => {
    emit("save", true)
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
        z-index: 1; // 추후 삭제할지 말지 고민
    }
    .dialog-layout {
        position: absolute;

        display: flex;
        flex-direction: column;
        align-items: flex-start;

        max-width: 1340px;

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
            min-width: 400px;
            height: 100%;
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
