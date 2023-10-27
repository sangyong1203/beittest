<template>
    <div v-if="isShowDialog" class="container">
        <div class="container-popup">
            <div class="container-popup__header">
                <img src="@assets/images/emergn.png" alt="비상알림">

                <span class="container-popup__header__title">
                    <span>비상알림</span>
                </span>
            </div>
            <div class="container-popup__content">
                <div class="content-text">
                    {{ emgData.push_text }}
                </div>
                <div class="content-time">
                    {{ emgData.reg_time }}
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

const emgData: any = ref({})
const isShowDialog: any = ref(false)
function openDialog(data:any){
    console.log("alrm pop up", data)
    emgData.value = data
    isShowDialog.value = true
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

        width: 406px;
        min-height: 290px;
        max-height: 80%;
        
        border-radius: 6px;
        background-color: $color-white-000;

        z-index: 2;


        &__header {
            display: flex;
            align-items: center;
            background-color: #F5F6F7;
            width: 100%;
            height: 70px;
            padding: 10px;
            box-sizing: border-box;
            border-top-right-radius: 6px;
            border-top-left-radius: 6px;

            &__title {
                padding-left: 10px;
                font-size: 19px;
                font-weight: 700;
                width: 100%;
                display: flex;
                justify-content: center;
            }
            &__close {
                cursor: pointer;
            }
            img{
                width: 214px;
                margin-top: -113px;
                position: absolute;
            }
            span{
                color:#DE3E47;
                font-size: 24px;
                font-weight: 700;
            }
        }
        &__dividing-line {
            width: 100%;
            height: 1px;

            margin-top: -8px;
            background-color: $color-white-400;
        }
        &__content{
            width: 100%;
            min-height: 140px;
            padding: 24px 28px 0 28px;
            display: flex;
            flex-direction: column;
            align-items: center;
            box-sizing: border-box;
            .content-text {
                font-size: 17px;
                color: #2F2F35;
                line-height: 22px;
                margin-bottom: 32px;
            }
            .content-time {
                font-size: 17px;
                color: #A4A7A7;
                line-height: 22px;

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
</style>
