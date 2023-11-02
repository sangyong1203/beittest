<template>
    <div class="dashboard" :class="store.darkMode ? 'dark-mode' : ''" >
        <div class="dashboard__body " >
            <!---------- setting buttn ------------->
            <div style="position: absolute; right: 20px; cursor: pointer;" @click="openSetting">
                <img :src="settingBtn" alt=""/> 
            </div>
            <SettingDialog ref="settingDialogRef" @changeBlockItems="changeBlockItems"/>
            

             <!---------- block items ----------->
            <div 
                v-for="item in blockItemIds" 
                :id="item.id" 
                class="blocks" 
                :style="{width:item.width, height:item.height, float:'left'}">
            </div>
            <template v-if="DashBoardObj" v-for="item in blockItemIds">
                <SceneInfo
                v-if="item.id==='sceneInfo'"
                    label="신림봉천 터널"
                    :data="DashBoardObj"
                    :button="false"
                />
                <Notification
                v-if="item.id==='notification'"
                    label="현장 공지사항"
                    :data="DashBoardObj.news"
                    :button="false"
                />
                <DepartureStatus
                v-if="item.id==='departureStatus'"
                    label="출역 현황"
                    :data="DashBoardObj.company_count"
                    :button="false"
                />
                <HeavyEquipStatus
                v-if="item.id==='heavyEquipStatus'"
                    label="중장비 출입 현황"
                    :data="DashBoardObj.equip_count"
                    :button="false"
                />
                <NoRecordCars
                v-if="item.id==='noRecordCars'"
                    label="미등록 차량"
                    :data="DashBoardObj.noRecordCarsData"
                    :button="false"
                />
                <ViewMap
                v-if="item.id==='viewMap'"
                    :data="DashBoardObj.Scene_data"
                />
                
                 <!-- 
                <RiskAssessment
                v-if="item.id==='riskAssessment'"
                    label="위험성평가 등급별 현황"
                    :data="DashBoardObj.RA_weekly"
                    :button="true"
                />
                <SmartTbm
                v-if="item.id==='smartTbm'"
                    label="스마트 TBM 현황"
                    :data="DashBoardObj.Tbm"
                    :button="true"
                />
                <WorkStatus
                v-if="item.id==='workStatus'"
                    label="공종별 작업 현황"
                    :data="DashBoardObj.DP"
                    :button="true"
                />
                <WorkPermit
                v-if="item.id==='workPermit'"
                    label="작업허가서 일반/특별 현황"
                    :data="DashBoardObj.DP_weekly"
                    :button="true"
                />
                <DangerousWork
                v-if="item.id==='dangerousWork'"
                    label="고위험군 근로자 현황"
                    :data="DashBoardObj.worker_weekly"
                    :button="true"
                />
                <SafetyManagement
                v-if="item.id==='safetyManagement'"
                    label="안전점검 부적합 현황"
                    :data="DashBoardObj.Incongruity"
                    :button="true"
                />
                <HeavyEquipStatus
                v-if="item.id==='heavyEquipStatus'"
                    label="중장비 출입 현황"
                    :data="DashBoardObj.equip_count"
                    :button="true"
                />
                <DailyEquip
                v-if="item.id==='dailyEquip'"
                    label="일일 장비 사용 전 점검 현황"
                    :data="DashBoardObj.Equip"
                    :button="true"
                /> -->
            </template>
                
        </div>
        
    </div>

    <FcmPopup
        class="fcm-dialog"
        ref="fcmPopupRef"
        @get-push-data="getPushData"
    />
    <HeatwavePopup
        class="heatwave-dialog"
        ref="heatwavePopupRef"
    />
    <AlarmPopup 
        class="alarmPopup-dialog" 
        ref="alarmPopupRef"
    />
</template>

<script setup lang="ts">

// 다이어로그
import Chart from "chart.js/auto"
import { onMounted, onUnmounted, ref, provide } from "vue"
import { useStore } from "@stores/index"
import api from "../selfApi"
import dayjs from "dayjs"
import "dayjs/locale/ko" //한국어

import HeatwavePopup from "./popups/HeatwavePopup.vue"
import AlarmPopup from "./popups/AlarmPopup.vue"
import FcmPopup from "./popups/FcmPopup.vue"
import SettingDialog from "./popups/settingPopup.vue"
import settingBtn from "@assets/images/settingBtn.svg"

// blocks items
import DepartureStatus from "./blockItems/departureStatus/index.vue"
import HeavyEquipStatus from "./blockItems/heavyEquipStatus/index.vue"
import SceneInfo from "./blockItems/sceneInfo/index.vue"
import Notification from "./blockItems/notification/index.vue"
import NoRecordCars from "./blockItems/noRecordCars/index.vue"
import ViewMap from "./blockItems/viewMap/index.vue"
// import DangerousWork from "./blockItems/dangerousWork/index.vue"
// import DailyEquip from "./blockItems/dailyEquip/index.vue"
// import SafetyManagement from "./blockItems/safetyManagement/index.vue"
// import SmartTbm from "./blockItems/smartTbm/index.vue"
// import WorkStatus from "./blockItems/workStatus/index.vue"
// import RiskAssessment from "./blockItems/riskAssessment/index.vue"
// import WorkPermit from "./blockItems/workPermit/index.vue"

import { getCarNumber } from "./blockItems/noRecordCars/carnumber.js"


dayjs.locale("ko")
provide("Chart", Chart)
Chart.defaults.interaction.mode = 'nearest';

const store = useStore()
const headerParams = store.headerParams

const DashBoardObj:any = ref(null)

const blockItemIds:any = ref([
    {id:"sceneInfo", name:"현장정보", width: "19%", height: "32%"},
    {id:"notification", name:"공지사항", width: "19%", height: "32%"},
    {id:"departureStatus", name:"출역 현황", width: "19%", height: "32%"},
    {id:"heavyEquipStatus", name:"중장비 출입", width: "19%", height: "32%"},
    {id:"noRecordCars", name:"미등록차량", width: "19%", height: "32%"},
    {id:"viewMap", name:"터널도면", width: "100%", height: "66%"},
    

    // // left part
    // {id:"sceneInfo", name:"현장정보", width: "47.9%", height: "24%"},
    // {id:"notification", name:"공지사항", width: "47.9%", height: "24%"},
    // {id:"departureStatus", name:"출역 현황", width: "47.9%", height: "24%"},
    // {id:"smartTbm", name:"스마트TBM", width: "47.9%", height: "24%"},
    // {id:"viewMap", name:"도면", width: "97.7%", height: "48.5%"},
    
    // //right part
    // {id:"workStatus", name:"공종별 작업", width: "47.9%", height: "48.5%"},
    // {id:"riskAssessment", name:"위험성평가", width: "47.9%", height: "24%"},
    // {id:"workPermit", name:"작업허가서", width: "47.9%", height: "24%"},
    // {id:"dangerousWork", name:"고위험군 근로자", width: "47.9%", height: "24%"},
    // {id:"safetyManagement", name:"안전점검 부적합", width: "47.9%", height: "24%"},
    // {id:"heavyEquipStatus", name:"중장비 출입", width: "47.9%", height: "24%"},
    // {id:"dailyEquip", name:"일일 장비점검", width: "47.9%", height: "24%"},

])

const changeBlockItems = ( list: []) => {
    blockItemIds.value = list
}


function fetchApi() {
    
    console.log("dashbord 3 fetchApi---")
    let params = {
        scene_ids: JSON.stringify([1]),
    }
    params = Object.assign({}, params, headerParams)
    api.getKintexDashboard(params).then((res: any) => {
        const rsCode = res.data.rsCode
        
        if (rsCode === 0) {
            const data = res.data.rsObj
                DashBoardObj.value = data
            
            // 폭염알림  
            if (!store.heatwaveAlarmTimeoutState) {
                getFeelsLike(DashBoardObj.value.weather)
                store.heatwaveAlarmTimeoutState = true
                // 폭염알림창 1시간에 한번 폽업 설정
                setTimeout(() => {
                    store.setHeatwaveAlarmTimeoutState(false)
                }, 1000 * 60 * 60 * 1)
            }

            // 비상알림
            getPushData(data.Push)


            // mock data
            //----------------------------
            let company_count = DashBoardObj.value.company_count?.splice(0, 11)
            company_count.forEach( (item:any) => {
                item.cnt = Math.floor(Math.random() * 40);
            })
            DashBoardObj.value.company_count = company_count.sort((a:any, b:any) => b.cnt - a.cnt)
            
            // - equip_count 
            let equip_count = DashBoardObj.value.equip_count?.splice(0, 11)
            equip_count.forEach( (item:any) => {
                item.cnt = Math.floor(Math.random() * 10);
            })
            DashBoardObj.value.equip_count = equip_count.sort((a:any, b:any) => b.cnt - a.cnt)
            // - stamrt
            let Tbm = DashBoardObj.value.Tbm
            Tbm.forEach( (item:any) => {
                item.cnt = Math.floor(Math.random() * 50 + 100);
                item.usr_cnt = Math.floor(Math.random() * 20 + 80);

            })
            DashBoardObj.value.Tbm = Tbm

            // - DP
            // let DP = DashBoardObj.value.DP
            let DP = [
                {name: '가시설, 콘크리트 타설', cnt: 48},
                {name: '파일항타', cnt: 36},
                {name: '거푸집동바리', cnt: 45}, 
                {name: '차량계하역운반', cnt: 37},
                {name: '전기', cnt: 34},
                {name: '산업보건', cnt: 43},
                {name: '양중기', cnt: 37}
            ]
            DP.forEach( (item:any) => {
                item.cnt = Math.floor(Math.random() * 30 + 20);
            })
            DashBoardObj.value.DP = DP

            // - worker_weekly
            let worker_weekly = DashBoardObj.value.worker_weekly
            worker_weekly.forEach( (item:any) => {
                item.hyp_cnt = Math.floor(Math.random() * 15);
                item.new_cnt = Math.floor(Math.random() * 30);
                item.old_cnt = Math.floor(Math.random() * 15);
            })
            DashBoardObj.value.worker_weekly = worker_weekly

            // - RA_weekly
            let RA_weekly = DashBoardObj.value.RA_weekly
            RA_weekly.forEach( (item:any) => {
                item.a_cnt = Math.floor(Math.random() * 20);
                item.b_cnt = Math.floor(Math.random() * 20);
                item.c_cnt = Math.floor(Math.random() * 20);
            })
            DashBoardObj.value.RA_weekly = RA_weekly

            // - DP_weekly
            let DP_weekly = DashBoardObj.value.DP_weekly
            DP_weekly.forEach( (item:any) => {
                item.safety_cnt = Math.floor(Math.random() * 20);
                item.special_cnt = Math.floor(Math.random() * 20);
            })
            DashBoardObj.value.DP_weekly = DP_weekly

            // - Incongruity
            let Incongruity = DashBoardObj.value.Incongruity
            Incongruity.forEach( (item:any) => {
                item.action_cnt = Math.floor(Math.random() * 20);
                item.inaction_cnt = Math.floor(Math.random() * 20);
            })
            DashBoardObj.value.Incongruity = Incongruity

            // - Equip
            let Equip = DashBoardObj.value.Equip
            Equip.forEach( (item:any) => {
                item.com_cnt = Math.floor(Math.random() * 10);
                item.standby_cnt = Math.floor(Math.random() * 10);
            })
            DashBoardObj.value.Equip = Equip

            // - Equip
            // let noRecordCarsData = DashBoardObj.value.noRecordCarsData
            let noRecordCarsData:any = getCarNumber().slice(0, 20)
            
            DashBoardObj.value.noRecordCarsData = noRecordCarsData
        } 
        

    })
}

const heatwavePopupRef: any = ref(null)

function getFeelsLike(weather: any) {
    let degreeState = ""
    if (weather.feels_like && weather.feels_like >= 38) {
        degreeState = "폭염위험"
    } else if (weather.feels_like && weather.feels_like >= 35) {
        degreeState = "폭염경보"
    } else if (weather.feels_like && weather.feels_like >= 33) {
        degreeState = "폭염주의보"
    }
    if (degreeState) openHeatwave(degreeState)
}
function openHeatwave(degreeState: string) {
    heatwavePopupRef.value.openDialog(degreeState)
}

const fcmPopupRef: any = ref(null)
const alarmPopupRef: any = ref(null)

function getPushData(data: any) {
    let mockdata = [
        {
            company_name: "지에스아이엘",
            main_area: "현장입장",
            profile_image:
                "https://wpgumi.com/api/upload/admin/10/_BE_IT_png_.png",
            push_text: "지에스아이엘/KR/소장",
            push_title: "SOS 화재 구조 요청",
            reg_time: "2023-08-07 11:27:24",
            scene_name: "구미천연가스발전소 건설공사",
            user_name: "KR",
            user_phone: "010-6666-6667",
        },
        {
            push_title: "비상알림",
            company_name: "금호건설",
            reg_time: "2023-08-07 11:27:24",
            text: "[금호건설] 폭염경보 발효중. 야외활동을 자제하고 물 충분히 마시기, 무더위쉼터 이용, 실외작업장 안전수칙(물, 그늘, 휴식) 지키기 등 건강에 유의 바랍니다.",
        },
    ]

    let pushData = data

    if(pushData && pushData.length > 0){
        pushData.forEach( (item:any)=>{
            if( item.push_title === "비상 알림" ||  item.push_title === "경고 알림"){
                alarmPopupRef.value.openDialog(item)
            } else if(item.push_title === "폭염주의보" ||  item.push_title === "폭염경보"){

                if(!store.heatwaveAlarmTimeoutState){
                    openHeatwave(item.push_title)
                    setTimeout(() => {
                        store.setHeatwaveAlarmTimeoutState(false)
                    }, 1000*60*60*1);
                }
            } else {
                fcmPopupRef.value.openDialog(item)
            }
        })
        
    }
}

const settingDialogRef: any = ref(null)
function openSetting(){
    settingDialogRef.value.openDialog(blockItemIds.value)
}

// 공통 다이얼로그 열기
const emit = defineEmits(["open-dialog", "open-release", "get-push-data"])
const openDialog = (data: any): void => {
    emit("open-dialog", data)
}
// 출역현황 다이얼로그 열기
const openReleaseDialog = (data: any): void => {
    emit("open-release", data)
}

const timer: any = []
onMounted(() => {

    fetchApi()

    timer.push(setInterval(fetchApi, 10000))

    store.setCompanyList() // 업체 dropdown 세팅
    store.setCtgoMsdsList() // 구분 msds  dropdown 세팅
    store.setCtgoConstructionList() // 공종 dropdown 세팅
    store.setCtgoOccupationList() // 직종  dropdown 세팅
    store.setCtgoNatioinList() // 국적  dropdown 세팅
    store.setAdminPermission() // 권한  dropdown 세팅
    store.setSceneList() // 현장  dropdown 세팅
    store.setCtgoEquipList() // 장비  dropdown 세팅
    store.setCtgoEducationClass() // 교육종류 dropdown 세팅
    // store.setCtgoToolList() // 공도구  dropdown 세팅
    store.setCtgoDutyList() // 직책  dropdown 세팅
})

onUnmounted(() => {
    // 컴포넌트가 언마운트될 때 타이머 종료
    timer.forEach((item: any) => {
        clearInterval(item)
    })
    timer.length = 0
})
</script>

<style lang="scss" scoped>
@import "@assets/styles/main.scss";

$HEADER: 70px; // 공통 헤더 Height 값
$FOOTER: 60px; // 공통 푸터 Height 값
$GAP: 16px;

.dashboard {
    position: relative;

    display: flex;
    flex-direction: column;
    align-items: center;

    width: 100%;
    height: calc(100% - $HEADER - $FOOTER);
    

    &__body {
        width: 100%;
        height: 100%;
        padding: 12px 42px 0px 42px;
        box-sizing: border-box;

        display: flex;
        flex-wrap: wrap;
        justify-content: space-around;
    }
 
    :deep(.basic-layout){
        width: 100%;
        height: 100%;
        margin-bottom: 0 !important
    }
    .blocks{
        // float: left ;
        margin: 6px 12px;
    }
}


.fcm-dialog,
.heatwave-dialog,
.alarmPopup-dialog {
    position: absolute;
    z-index: 5;

    display: flex;
}

</style>
