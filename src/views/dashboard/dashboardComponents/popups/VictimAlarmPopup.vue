<template>
    <div
        v-if="isEmergnShowDialog"
        class="container"
        :class="{ emergnBackground: showRedBackground }"
    >
        <div class="container-popup">
            <div class="container-popup__header">
                <span class="container-popup__header__title">
                    {{ msgData.push_title }}
                </span>
            </div>
            <div class="container-popup__body">

                <div  class="container-popup__content">
                    <div class="content-img">
                        <img :src="msgData.sos_profile_image" alt="그래픽" />
                    </div>
    
                    <div class="contents">
                        <div class="contents-header"> SOS 신고자 정보</div>
    
                        <div class="contents-list">
                            <span
                                ><span class="contents-list-label">업체: </span
                                >{{ msgData.sos_company_name }}</span
                            >
                        </div>
                        <div class="contents-list">
                            <span
                                ><span class="contents-list-label">이름: </span
                                >{{ msgData.sos_user_name }}</span
                            >
                        </div>
                        <div class="contents-list">
                            <span
                                ><span class="contents-list-label">연락처: </span>
                                {{ msgData.sos_user_phone }}</span
                            >
                        </div>
                        <div class="contents-list">
                            <span
                                ><span class="contents-list-label">현장: </span>
                                {{ msgData.scene_name }}</span
                            >
                        </div>
                        <div class="contents-list">
                            <span
                                ><span class="contents-list-label">요청시간: </span>
                                {{ msgData.sos_reg_date }}</span
                            >
                        </div>
                    </div>
                </div>
                <div class="dividing-line"></div>

                <div class="container-popup__content" >
                    <div class="content-img">
                        <img :src="msgData.victim_profile_image" alt="그래픽" />
                    </div>
    
                    <div class="contents">
                        <div class="contents-header"> 재해자 정보</div>
    
                        <div class="contents-list">
                            <span
                                ><span class="contents-list-label">업체: </span
                                >{{ msgData.victim_company_name }}</span
                            >
                        </div>
                        <div class="contents-list">
                            <span
                                ><span class="contents-list-label">이름: </span
                                >{{ msgData.victim_name }}</span
                            >
                        </div>
                        <div class="contents-list">
                            <span
                                ><span class="contents-list-label">연락처: </span>
                                {{ msgData.victim_phone }}</span
                            >
                        </div>
                        <div class="contents-list">
                            <span
                                ><span class="contents-list-label">현장: </span>
                                {{ msgData.scene_name }}</span
                            >
                        </div>
                        <div class="contents-list">
                            <span
                                ><span class="contents-list-label">요청시간: </span>
                                {{ msgData.victim_reg_time }}</span
                            >
                        </div>
                    </div>
                </div>
            </div>
           

            <div class="container-popup__button-box">
                <BasicButton
                    class="buttons"
                    :label="'확인'"
                    :theme="'fill'"
                    @click="closeDialog"
                />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import BasicButton from "@components/common/button/BasicButton.vue"
import sossound from "@assets/audio/sossound.mp3"

import { ref, watch, nextTick } from "vue"

const showRedBackground: any = ref(false)
let interval: any = null
const msgData: any = ref({})
const isEmergnShowDialog: any = ref(false)
function openDialog(data: any) {
    msgData.value = data
    isEmergnShowDialog.value = true
    showRedBackground.value = true
    if (!interval) {
        interval = setInterval(() => {
            showRedBackground.value = !showRedBackground.value
        }, 1000)
    }
    // 비상알림 소리
    const audio = new Audio(sossound)
    audio.play()
}
defineExpose({ openDialog })

// 닫기
const closeDialog = () => {
    isEmergnShowDialog.value = false
    clearInterval(interval)
}
watch(isEmergnShowDialog, () => {
    if (isEmergnShowDialog.value === false) {
        clearInterval(interval)
        interval = null
    }
})
</script>

<style lang="scss" scoped>
@import "@assets/styles/main.scss";

.container {
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;

    width: 100%;
    height: 100%;

    background-color: rgba($color-black-900, 0.5);
    box-sizing: border-box;
    z-index: 3;
    .container-popup {
        position: absolute;
        box-sizing: border-box;

        display: flex;
        flex-direction: column;
        align-items: flex-start;

        min-height: 300px;
        max-height: 80%;

        border-radius: 6px;
        background-color: $color-white-000;

        z-index: 2;

        &__header {
            display: flex;
            align-items: center;
            background-color: #de3e47;
            width: 100%;
            height: 70px;
            padding: 10px;
            box-sizing: border-box;
            border-top-right-radius: 6px;
            border-top-left-radius: 6px;

            &__title {
                font-size: 24px;
                font-weight: 700;
                width: 100%;
                display: flex;
                justify-content: center;
                color: #ffffff;
            }
            &__close {
                cursor: pointer;
            }
        }
        &__body{
            display: flex;
            padding: 20px 10px;
            align-items: center;
        }
        .dividing-line {
            width: 2px;
            height: 280px;
            background-color: $color-white-400;
            margin: 0 10px;
        }
        &__content {
            width: 100%;
            display: flex;
            flex-direction: row;
            height: calc(100% - 140px);
            padding: 24px;
            gap: 20px;
            .content-img {
                padding: 12px;
                width: 180px;
                border: 1px solid #dadada;
                img {
                    width: 180px;
                    height: 100%;
                }
            }

            

            .contents {
                display: flex;
                gap: 16px;
                flex-direction: column;
                width: 350px;
                box-sizing: border-box;
                .contents-header {
                    height: 40px;
                    background-color: #f5f6f7;
                    font-size: 20px;
                    color: #2f2f35;
                    font-weight: 600;
                    display: flex;
                    align-items: center;
                    padding: 10px 24px;
                    box-sizing: border-box;
                }
                .contents-list {
                    display: flex;
                    width: 384px;
                    height: 24px;
                    gap: 13px;
                    span {
                        font-size: 17px;
                        color: #2f2f35;
                        font-weight: 400;
                    }
                    .contents-list-label {
                        width: 120px;
                        margin-right: 10px;
                    }
                }
            }
        }
        &__button-box {
            display: flex;
            justify-content: center;
            width: 100%;
            padding: 24px;
            box-sizing: border-box;
            .buttons {
                width: 86px;
                height: 40px;
                border-radius: 6px;
                background-color: #de3e47;
                color: #ffffff;
                font-weight: 500;
            }
        }
    }
}
.emergnBackground {
    background-color: #ff00005c;
}
</style>
