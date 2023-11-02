
<template>
    <div v-if="isShowDialog" class="oneBtn-dialog">
        <div class="oneBtn-dialog__layout">
            <div class="oneBtn-dialog__layout__header">
                <span class="label">알림 공지</span>
                <button class="button" @click="closeDialog">
                    <img src="@assets/icons/close.svg" alt="" />
                </button>
            </div>
            <div class="oneBtn-dialog__layout__body">
                <FormLabelField v-model="alarmData.alarm_type" label="알림종류" :disabled="true" />
                <FormLabelField v-model="alarmData.company_name" label="업체" :disabled="true" />
                <FormLabelField v-model="alarmData.reg_date" label="작성일시" :disabled="true" />
                <FormTextField v-model="alarmData.text" label="내용" :disabled="true" />
                <div v-if="isVictim" class="dividing-line">재해자 신고 정보</div>
                <div  v-if="isVictim" class="victim-info-box">
                    <div class="info-box sos-info">
                        <div class="info-content">
                            <div class="content-img">
                                <img v-if="alarmData.sos_profile_image" :src="alarmData.sos_profile_image" alt="그래픽"/>
                                <span v-else>사진이 없습니다</span>
                            </div>
    
                            <div class="contents">
                                <div class="contents-header">SOS 신고자 정보</div>
    
                                <div class="contents-list">
                                    <span><span class="contents-list-label">업체: </span>{{ alarmData.sos_company_name }}</span>
                                </div>
                                <div class="contents-list">
                                    <span><span class="contents-list-label">이름: </span>{{ alarmData.sos_user_name }}</span>
                                </div>
                                <!-- <div class="contents-list">
                                    <span><span class="contents-list-label">직종/직책: </span> {{ alarmData.ctgo_occupation_name }}</span>
                                </div> -->
                                <div class="contents-list">
                                    <span><span class="contents-list-label">연락처: </span> {{ alarmData.sos_user_phone }}</span>
                                </div>
                                <!-- <div class="contents-list">
                                    <span><span class="contents-list-label">구역: </span> {{ alarmData.main_area }}</span>
                                </div> -->
                                <div class="contents-list">
                                    <span><span class="contents-list-label">요청시간: </span> {{ alarmData.reg_date }}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="info-box victim-info">
                        <div class="info-content">
                            <div class="content-img">
                                <img v-if="alarmData.victim_profile_image" :src="alarmData.victim_profile_image" alt="그래픽"/>
                                <span v-else>사진이 없습니다</span>
                            </div>
    
                            <div class="contents">
                                <div class="contents-header">재해자 정보</div>
    
                                <div class="contents-list">
                                    <span><span class="contents-list-label">업체: </span>{{ alarmData.victim_company_name }}</span>
                                </div>
                                <div class="contents-list">
                                    <span><span class="contents-list-label">이름: </span>{{ alarmData.victim_name }}</span>
                                </div>
                                <!-- <div class="contents-list">
                                    <span><span class="contents-list-label">직종/직책: </span> {{ alarmData.duty }}</span>
                                </div> -->
                                <div class="contents-list">
                                    <span><span class="contents-list-label">연락처: </span> {{ alarmData.victim_user_phone }}</span>
                                </div>
                                
                                <!-- <div class="contents-list">
                                    <span><span class="contents-list-label">구역: </span> {{ workerInfo.main_area }}</span>
                                </div> -->
                                <div class="contents-list">
                                    <span><span class="contents-list-label">요청시간: </span> {{ alarmData.victim_reg_time }}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="oneBtn-dialog__layout__footer">
                <BasicButton :label="'확인'" :theme="'fill'" @click="closeDialog"></BasicButton>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
import BasicButton from '@components/common/button/BasicButton.vue'
import FormLabelField from "@components/common/form/input/LabelField.vue"
import FormTextField from "@components/common/form/input/TextField.vue"

import { ref } from "vue"

const isVictim: any = ref(false)
const alarmData: any = ref({})
const isShowDialog: any = ref(false)
function openDialog(data:any){
    console.log("data", data)
    alarmData.value = data
    isShowDialog.value = true
    if(data.alarm_type === 'SOS 알림'){
        isVictim.value = true
    }
}
defineExpose({openDialog})

// 닫기
const closeDialog = () => {
    isShowDialog.value = false
    isVictim.value = false
    alarmData.value = {}
}
</script>

<style lang="scss" scoped>
@import '@assets/styles/main.scss';

.oneBtn-dialog {

    display: flex;
    align-items: center;
    justify-content: center;

    width: 100%;
    height: 100%;

    background-color: rgba($color-black-900, 0.5);
    position: absolute;
    top: 0;
    z-index: 2;

    &__layout {
        display: flex;
        flex-direction: column;
        align-items: center;

        position: relative;

        max-width: 80%;
        min-width: 600px;
        max-height: 80%;
        
        padding: 30px 40px;

        background-color: $color-white-000;
        box-shadow: 0px 0px 3px rgba(0, 0, 0, 0.15);
        border-radius: 6px;

        margin: auto;

        &__header {
            display: flex;
            align-items: center;
            justify-content: space-between;

            width: calc(100% - 10px);

            padding: 10px 0px 20px 10px;
            gap: 10px;

            border-bottom: 1px solid $color-white-400;
            .label {
                font-weight: 600;
                font-size: 19px;
                line-height: 23px;
            }
            .button {
                outline: none;
                border: none;

                width: 24px;
                height: 24px;

                background: transparent;

                cursor: pointer;
            }
        }
        &__body {
            display: flex;
            flex-direction: column;
            width: 100%;
            height: 100%;

            padding: 24px 0;
            gap: 16px;
            box-sizing: border-box;
            overflow-y: scroll;

            // /* Hide scrollbar for IE, Edge and Firefox */
            -ms-overflow-style: none; /* IE and Edge */
            scrollbar-width: none; /* Firefox */

            // /* Hide scrollbar for Chrome, Safari and Opera */
            &::-webkit-scrollbar {
                display: none;
            }

            .row{
                display: flex;
                justify-content: space-between;
            }
        }
        &__footer {
            display: flex;
            align-items: center;
            justify-content: flex-end;

            width: 100%;

            gap: 12px;
        }
    }
}


.victim-info-box{
    display: flex;
    align-items: center;
    gap: 10px;
    .info-box{
        width: 50%;
    }
}
.dividing-line {
    width: 100%;
    height: 35px;
    border-bottom: 1px solid #dadada;
    margin-top: 15px;
    font-size: 18px;
    font-weight: 700;
    line-height: 35px;
}
.info-content {
    width: 100%;
    display: flex;
    flex-direction: row;
    height: 100%;
    padding: 10px 10px;
    gap: 20px;
    flex: 1;
    margin-top: 15px;
    border: 1px solid #dadada;
    box-sizing: border-box;
    border-radius: 4px;

    .content-img{
        padding: 12px;
        width: 150px;
        height: 180px;
        border: 1px solid #dadada;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 4px;
        img{
            width: 100%;
            height: 100%;
        }
        span{
            color: #a3a3a3;
        }
    }

    .contents{
        display: flex;
        gap: 10px;
        flex-direction: column;
        box-sizing:border-box;
        flex: 1;
        .contents-header{
            height: 35px;
            background-color: #F5F6F7;
            font-size: 17px;
            display: flex;
            align-items: center;
            padding: 10px 24px;
            box-sizing: border-box;
            justify-content: center;
            border-radius: 4px;
        }
        .contents-list{
            display: flex;
            height: 24px;
            gap: 13px;
            span{
                font-size: 16px;
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
</style>
