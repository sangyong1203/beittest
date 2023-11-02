<template>
    <div v-if="isShowDialog" class="container">
        <div class="container-popup">
            <div class="container-popup__header" :style="{backgroundColor:dataMsg.backgroundColor}">
                <img src="@assets/images/warningMark.png" alt="경고">
                <span class="container-popup__header__title">
                    {{dataMsg.type}}
                </span>
            </div>
            <div class="container-popup__content">
                <div class="degreeImg">
                    <img src="@assets/images/heatwavePng.png" alt="폭염_인포그래픽">
                </div>
                <div class="dividing-line" />

                <div class="contents">
                    <div class="contents-header">{{dataMsg.title}}</div>
                    <div class="contents-list" v-for="item in dataMsg.list">
                        <img src="@assets/images/checkmark.png" alt="checkmark">
                        <span>{{ item }}</span>
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

import { ref } from "vue"

const dataList:any = ref([])

const level1: any = {
    type: "폭염주의보",
    title: "체감온도 33°C  이상",
    list:[
        "온열질환 예방 3대 기본수칙 준수(물,그늘,휴식)",
        "50분 작업, 10분 휴식 권고",
        "식염포도당 복용",
        "안전교육장 상시 개방"
    ],
    backgroundColor:"#FFD466",
}
const level2: any = {
    type: "폭염경보",
    title: "체감온도 35°C  이상",
    list:[
        "온열질환 예방 3대 기본수칙 준수(물,그늘,휴식)",
        "45분 작업, 15분 휴식 권고",
        "식염정 복용",
        "안전교육장 상시 개방"
    ],
    backgroundColor:"#FF8E25",
}
const level3: any = {
    type: "폭염위험",
    title: "체감온도 38°C  이상",
    list:[
        "온열질환 예방 3대 기본수칙 준수(물,그늘,휴식)",
        "45분 작업, 15분 휴식 권고",
        "식염정 복용",
        "안전교육장 상시 개방",
        "옥외 작업 최소화",
        "근로자 간 건강상태 확인"
    ],
    backgroundColor:"#DE3E47",
}

const dataMsg: any = ref("")
const isShowDialog: any = ref(false)
function openDialog(degreeState:string){
    console.log("degreeState",degreeState)
    if(degreeState === "폭염주의보"){
        dataMsg.value = level1
    }
    if(degreeState === "폭염경보"){
        dataMsg.value = level2
    }
    if(degreeState === "폭염위험"){
        dataMsg.value = level3
    }
    isShowDialog.value = true
    // setTimeout(()=>{
    //     isShowDialog.value = false
    // },1000*30)
}
defineExpose({openDialog})

// 닫기
const closeDialog = () => {
    isShowDialog.value = false
}
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

        width: 590px;
        min-height: 390px;

        border-radius: 6px;
        background-color: $color-white-000;
        box-sizing: border-box;
        z-index: 2;


        &__header {
            display: flex;
            align-items: center;
            justify-content: center;
            background-color: #FFD466;
;
            width: 100%;
            height: 70px;
            padding: 10px;
            box-sizing: border-box;
            border-top-right-radius: 6px;
            border-top-left-radius: 6px;

            &__title {
                padding-left: 10px;
                font-size: 24px;
                font-weight: 600;
                color: #2F2F35;
                display: flex;
                justify-content: center;
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

            .degreeImg{
                margin-left: 24px;
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
                width: 384px;
                box-sizing:border-box;
                .contents-header{
                    height: 40px;
                    background-color: #F5F6F7;
                    font-size: 20px;
                    color: #2F2F35;
                    font-weight: 600;
                    display: flex;
                    align-items: center;
                    padding-left: 36px;
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
                width: 120px;
                height: 40px;
                border-radius: 6px;
                background-color: #FFD466;
                color: #2F2F35;
                font-weight: 500;
            }
        }
    }
    
}
</style>
