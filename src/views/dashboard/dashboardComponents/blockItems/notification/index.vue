<template>
    <Teleport to="#notification">
        <BasicLayout class=" block-item" 
            :label="label" 
            :show-button="button"  
            @open-click="openDialog"
        >
            <div class="body">
                <div class="note-info">
                    <div class="note-info-item" v-for="item in data">
                        <div v-if="item.type === 'warning'" class="note-info-item__label" style="background-color: #78c8ff;">공지</div>
                        <div v-if="item.type === 'news'" class="note-info-item__label" style="background-color: #fba3b5;">뉴스</div>
                        <div class="note-info-item__content">
                            <a v-if="item.type === 'news'" :href="item.link" target="_blank" >{{ item.title }}</a>
                            <span v-else>{{ item.title }}</span>
                            <span style="color:#939393">{{ item.reg_date }}</span>
                        </div>
                    </div>
                </div>
            </div>
        </BasicLayout>
    </Teleport>
</template>

<script setup lang="ts">
import BasicLayout from "@components/common/layout/BlockBasicLayout.vue"

import { Teleport, toRefs } from "vue"

interface Props {
    label?: string
    button: boolean
    data: any
}
const props = defineProps<Props>()
const { label, button, data } = toRefs(props)

// 다이얼로그 열기
const emit = defineEmits(["send-event"])
const openDialog = (): void => {
    const datas = {
        label: label?.value,
        isVisible: true,
    }
    emit("send-event", datas)
}





</script>

<style lang="scss" scoped>
@import "@assets/styles/main.scss";

$HEIGHT: 54px; // 헤더 Height 값
.header {
    display: flex;
    align-items: center;

    width: 100%;
    height: $HEIGHT;

    position: relative;

    &__label {
        position: absolute;
        left: 0;

        font-weight: 700;
        font-size: 17px;
        line-height: 20px;

    }
    &__button {
        display: flex;
        align-items: center;
        justify-content: center;

        gap: 6px;

        position: absolute;
        right: 0;

        outline: none;
        border: none;

        color: $color-blue-600;
        background-color: transparent;

        cursor: pointer;

        &__icon {
            width: 16px;
            height: 16px;

            @include laptop() {
                width: 14px;
                height: 14px;
            }
        }
    }
}
.body {
    width: 100%;
    height: calc(100% - 50px);
    padding: 20px 30px;
    box-sizing: border-box;
    overflow-y: scroll;
    display: flex;
    align-items: flex-start;
    // /* Hide scrollbar for IE, Edge and Firefox */
    -ms-overflow-style: none; /* IE and Edge */
    scrollbar-width: none; /* Firefox */
    overflow-y: scroll;

    // /* Hide scrollbar for Chrome, Safari and Opera */
    &::-webkit-scrollbar {
        display: none;
    }
}

.note-info {
    display: flex;
    flex-direction: column;
    justify-content: center;

    width: 100%;

    gap: 20px;

    .note-info-item{
        display: flex;
        gap: 20px;
        &__label{
            height: 30px;
            padding: 5px 18px;
            border-radius: 6px;
            color: white;
            white-space: nowrap;
        }
        &__content{
            display: flex;
            flex-direction: column;
            gap: 8px;
            a {
                text-decoration: none;
            }
        }
    }
}
</style>
