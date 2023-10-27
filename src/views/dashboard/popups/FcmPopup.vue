<template>
    <div v-if="isEmergnShowDialog" class="container" :class="{emergnBackground: showRedBackground}">
        <div class="container-popup">
            <div class="container-popup__header">

                <span class="container-popup__header__title">
                    {{ msgData.push_title }}
                </span>
            </div>
            <div class="container-popup__content">
                <div class="content-img">
                    <img :src="msgData.profile_image" alt="그래픽">
                </div>
                <div class="dividing-line"> </div>

                <div class="contents">
                    <div class="contents-header">{{msgData.push_text}}</div>

                    <div class="contents-list">
                        <span><span class="contents-list-label">업체: </span>{{ msgData.company_name }}</span>
                    </div>
                    <div class="contents-list">
                        <span><span class="contents-list-label">이름: </span>{{ msgData.user_name }}</span>
                    </div>
                    <div class="contents-list">
                        <span><span class="contents-list-label">연락처: </span>연락처: {{ msgData.user_phone }}</span>
                    </div>
                    <div class="contents-list">
                        <span><span class="contents-list-label">현장: </span>현장: {{ msgData.scene_name }}</span>
                    </div>
                    <div class="contents-list">
                        <span><span class="contents-list-label">구역: </span>구역: {{ msgData.main_area }}</span>
                    </div>
                    <div class="contents-list">
                        <span><span class="contents-list-label">요청시간: </span> {{ msgData.reg_time }}</span>
                    </div>
                </div>
            </div>
            <div class="container-popup__button-box">
                <el-button class="button-blue" @click="closeDialog">확인</el-button>

            </div>
        </div>
    </div>
</template>

<script setup lang="ts">

import { ref, watch } from "vue"

const showRedBackground: any = ref(false)
let interval:any = null
const msgData: any = ref({})
const isEmergnShowDialog: any = ref(false)
function openDialog(data:any){
    msgData.value = data
    isEmergnShowDialog.value = true
    showRedBackground.value = true
    if(!interval){
        interval = setInterval(()=>{
            showRedBackground.value = !showRedBackground.value
        }, 1000)
    }
}
defineExpose({openDialog})

// 닫기
const closeDialog = () => {
    isEmergnShowDialog.value = false
    clearInterval(interval)
}
watch(isEmergnShowDialog, ()=>{
    if(isEmergnShowDialog.value === false){
        clearInterval(interval)
        interval = null
    }
})
</script>

<style lang="scss" scoped>
@import '@assets/styles/main.scss';

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
            background-color: #DE3E47;
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
                color:#ffffff;
            }
            &__close {
                cursor: pointer;
            }
        }
        &__content {
            width: 100%;
            display: flex;
            flex-direction: row;
            height: calc(100% - 140px);
            margin-top: 24px;
            padding: 0 24px;

            .content-img{
                padding: 12px;
                width: 180px;
                border: 1px solid #dadada;
                img{
                    width: 180px
                }
            }

            .dividing-line {
                width: 1px;
                height: 100%;
                background-color: $color-white-400;
                margin: 0 20px;
            }
    
            .contents{
                display: flex;
                gap: 16px;
                flex-direction: column;
                width: 350px;
                box-sizing:border-box;
                .contents-header{
                    height: 40px;
                    background-color: #F5F6F7;
                    font-size: 20px;
                    color: #2F2F35;
                    font-weight: 600;
                    display: flex;
                    align-items: center;
                    padding: 10px 24px;
                    box-sizing:border-box;
                }
                .contents-list{
                    display: flex;
                    width: 384px;
                    height: 24px;
                    gap: 13px;
                    span{
                        font-size: 17px;
                        color: #2F2F35;
                        font-weight: 400;
                    }
                    .contents-list-label{
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
            .buttons{
                width: 86px;
                height: 40px;
                border-radius: 6px;
                background-color: #DE3E47;
                color: #ffffff;
                font-weight: 500;
            }
        }
    }
}
.emergnBackground{
    background-color: #ff00005c;
}
</style>
