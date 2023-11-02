<template>
    <FormDialog :title="'알림'" :isUpdate="false" :key="dialogKey" @close-dialog="closeDialog" @submit="onSubmit">
        <div class="container">
            <div class="container__label-box">
                <span class="container__label-box__label">알림 정보</span>
            </div>
            <div class="container__content-box">
                <FormLabelField v-model="sceneName" :label="'공사명'" :disabled="true" />
                <FormLabelField v-model="writer" :label="'작성자'" :disabled="true" />
                <FormLabelField v-model="companyName" :label="'업체'" :disabled="true" />
                <FormLabelField v-model="regDate" :label="'작성일'" :disabled="true" />
                <FormDropdown
                    v-model="alarm_type"
                    :label="'알림종류'"
                    :data="alarmTypes"
                    :required="true"
                    :placeholder="'선택'"
                    :validation="validation.alarm_type"
                    @send-data="selectedCategory"
                    @remove="updateValidation"
                />
                <FormDropdownCheckbox
                    v-model="company_ids"
                    :label="'수신자'"
                    :data="companyList"
                    :required="true"
                    :placeholder="'선택'"
                    :validation="validation.company_ids"
                    @remove="updateValidation"
                />
                <HealthSelectBox
                    label="보건"
                    :select-list="healthCareList"
                />
            </div>
            <FormTextField 
                v-model="contents" 
                :label="'알림내용'"  
                :required="true"
                :validation="validation.alarm_type"
                @remove="updateValidation"
            />

            <div v-if="isVictim" class="dividing-line">재해자 신고 정보</div>
            
            <div  v-if="isVictim" class="victim-info-box">
                <div class="info-box sos-info">
                    <BasicButton :label="'SOS 선택'" :theme="'fill'" @click="openSosInfoDialog" />
                    <div class="info-content">
                        <div class="content-img">
                            <img v-if="sosInfo.sos_profile_image" :src="sosInfo.sos_profile_image" alt="그래픽"/>
                            <span v-else>사진이 없습니다</span>
                        </div>

                        <div class="contents">
                            <div class="contents-header">SOS 신고자 정보</div>

                            <div class="contents-list">
                                <span><span class="contents-list-label">업체: </span>{{ sosInfo.company_name }}</span>
                            </div>
                            <div class="contents-list">
                                <span><span class="contents-list-label">이름: </span>{{ sosInfo.user_name }}</span>
                            </div>
                            <div class="contents-list">
                                <span><span class="contents-list-label">직종/직책: </span> {{ sosInfo.ctgo_occupation_name }}</span>
                            </div>
                            <div class="contents-list">
                                <span><span class="contents-list-label">연락처: </span> {{ sosInfo.user_phone }}</span>
                            </div>
                            <div class="contents-list">
                                <span><span class="contents-list-label">요청시간: </span> {{ sosInfo.reg_time }}</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="info-box victim-info">
                    <BasicButton :label="'재해자 선택'" :theme="'fill'" @click="openWorkerDialog" />
                    <div class="info-content">
                        <div class="content-img">
                            <img v-if="workerInfo.photo" :src="workerInfo.photo" alt="그래픽"/>
                            <span v-else>사진이 없습니다</span>
                        </div>

                        <div class="contents">
                            <div class="contents-header">재해자 정보</div>

                            <div class="contents-list">
                                <span><span class="contents-list-label">업체: </span>{{ workerInfo.company_name }}</span>
                            </div>
                            <div class="contents-list">
                                <span><span class="contents-list-label">이름: </span>{{ workerInfo.user_name }}</span>
                            </div>
                            <div class="contents-list">
                                <span><span class="contents-list-label">직종/직책: </span> {{ workerInfo.duty }}</span>
                            </div>
                            <div class="contents-list">
                                <span><span class="contents-list-label">연락처: </span> {{ workerInfo.user_phone }}</span>
                            </div>
                            <div class="contents-list">
                                <span><span class="contents-list-label">요청시간: </span> {{ regTime }}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </FormDialog>
</template>

<script setup lang="ts">
import FormDialog from "@components/common/layout/FormNewDialogLayout.vue"
import FormLabelField from "@components/common/form/input/LabelField.vue"
import FormTextField from "@components/common/form/input/TextField.vue"
import FormDropdown from "@components/common/form/dropdown/Dropdown.vue"
import FormDropdownCheckbox from "@components/common/form/dropdown/DropdownCheckbox.vue"
import BasicButton from "@components/common/button/BasicButton.vue"
import HealthSelectBox from '@components/common/HealthSelectBox.vue'

import api from "./selfApi"
import dayjs from "dayjs"
import { toast } from "vue3-toastify"
import {  ref } from "vue"
import { useStore } from "@stores/index"

// Store 접근
const store = useStore()
const headerParams = store.getHeaderParams
const dialogKey = ref<number>(0)

const sceneName = store.getLoginData.user_permission.scene_name // 공사명
const companyId = store.getLoginData.user_main_company.company_id // 업체 ID
const companyName = store.getLoginData.user_main_company.company_name // 업체 이름
const writer = store.getLoginData.user_data.user_name // 작성자
const regDate = ref<string>(dayjs().format("YYYY-MM-DD")) // 작성일
const regTime = ref<string>(dayjs().format("hh:mm:ss"))

// 등록 시, 필요한 데이터
console.log("regDate",regDate.value)
const alarmTypes:any = [
    {id:"비상 알림", name:"비상 알림"},
    {id:"경고 알림", name:"경고 알림"},
    {id:"SOS 알림", name:"SOS 알림"},
    {id:"보건알림", name:"보건 알림"},
]
const alarm_type: any = ref("")
const contents: any = ref("")
const company_ids: any = ref([])
const companyList: any = ref(store.companyList)
const isVictim: any = ref(false)
const msgData: any =ref({})
const sosInfo: any = ref({})
const sosInfoList: any = ref([])
const workerInfo:any = ref([])

// 다이얼로그 닫기
const emit = defineEmits(["close-dialog", "open-select", "openSosDialog", "openWorkerDialog"])
const closeDialog = () => {
    emit("close-dialog", false)

    // 벨리데이션 초기화
    validation.value = {
        alarm_type: false,
        text:false,
        company_ids:false
    }

    // 데이터 초기화
    regDate.value = dayjs().format("YYYY-MM-DD")
    alarm_type.value = ""
    contents.value = ""
    isVictim.value = false
    msgData.value = {}
    sosInfo.value = {}
    sosInfoList.value = []

    dialogKey.value++
}


// 보건 --------------------------
let high_blood_state= false // 고혈압
let after_care_state= false // 사후관리
let diabetes_state= false // 당뇨
let etc_state= false // 기타
const healthCareList = ref([
    {name:"고혈압", isChecked:false},
    {name:"사후관리", isChecked:false},
    {name:"당뇨", isChecked:false},
    {name:"기타", isChecked:false},
])

function setHealthCare(){
    healthCareList.value.forEach( (item:any)=>{
        if(item.name==="고혈압"){
            high_blood_state = item.isChecked
        }
        if(item.name==="사후관리"){
            after_care_state = item.isChecked
        }
        if(item.name==="당뇨"){
            diabetes_state = item.isChecked
        }
        if(item.name==="기타"){
            etc_state = item.isChecked
        }
    })
}
// ---------------------

function selectedCategory(data: any) {
    console.log("select type---", data)
    alarm_type.value = data.name
    if(alarm_type.value === 'SOS 알림'){
        isVictim.value = true
        getSosList()
    } else {
        isVictim.value = false

    }
}

// sos 리스트 조회
const getSosList = () => {

    let params = {
        company_ids: JSON.stringify(["전체"]),
        ctgo_construction_id: 0, // 필수값 아님 - 추후 협의 후 삭제
        ctgo_occupation_id: 0, // 필수값 아님 - 추후 협의 후 삭제
        scene_ids: JSON.stringify([1]),
        start_date: dayjs(new Date()).format("YYYY.MM.DD"),
        end_date: dayjs(new Date()).format("YYYY.MM.DD"),
        search_text: "",
    }
    params = Object.assign({}, params, headerParams)
    api.getSOSPushList(params).then((res) => {
        try {
            const rsCode = res.data?.rsCode
            const data = res.data?.rsMap ?? []

            if (rsCode === 0) {
                sosInfoList.value = data !== undefined ? data : []
                sosInfo.value = sosInfoList.value[0]??{}
            }
        } catch (error) {
            console.log(error)
            toast.error(res.data.rsMsg)
        }
    })
}

// sos 이력 선택 창
function openSosInfoDialog(){
    console.log("openSosDialog emit", sosInfoList.value)
    emit("openSosDialog", sosInfoList.value)
}
function setSosInfo(value:any){
    console.log("setSosInfo", value)
    sosInfo.value = value
}
// 재해자 선택 창
function openWorkerDialog(){
    console.log("openWorkerDialog emit")
    emit("openWorkerDialog")
}
function setWorkerInfo(value:any){
    console.log("selectWorker", value)

    workerInfo.value = value
}
defineExpose({setSosInfo, setWorkerInfo})

// 저장
function onSubmit() {

    setHealthCare() // 보건 데이터 세팅
    let params = {
        company_id: companyId,
        scene_id: JSON.stringify([1]),
        scene_ids: JSON.stringify([1]),
        text: contents.value ??"",
        alarm_type: alarm_type.value ??"",
        company_ids: JSON.stringify(company_ids.value),
        sos_id: sosInfo.value.push_id,
        victim_id : workerInfo.value.user_id,
        high_blood_state: high_blood_state, // 고혈압
        after_care_state: after_care_state, // 사후관리
        diabetes_state: diabetes_state, // 당뇨
        etc_state: etc_state, // 기타
    }

    params = Object.assign({}, params, headerParams)

    let valid = formValidation(params) // Validation Check

    if (valid) {
        api.sendEmergency(params).then((res) => {
            try {
                const rsCode = res.data.rsCode

                if (rsCode === 0) {
                    toast.success("등록을 완료하였습니다.")
                }
            } catch (error) {
                console.log(error)
                toast.error(res.data.rsMsg)
                
            }
        })
        closeDialog()
    }
}


// 벨리데이션 데이터
const validation = ref<any>({
    alarm_type: false,
    text:false,
    company_ids:false,
})

// 벨리데이션 체크
function formValidation(data: any) {
    const initial = data
    const validationKeys = Object.keys(validation.value)

    let isValid = true

    for (let key in initial) {
        validationKeys.forEach((item) => {
            if (item === key && !initial[key]) {
                validation.value[key] = true
                isValid = false
            }
        })
    }
    return isValid
}

function updateValidation(label: string, value: boolean) {
    if (label === "알림종류") validation.value.alarm_type = value
    if (label === "내용") validation.value.text = value
    if (label === "수신자") validation.value.company_ids = value
}

</script>

<style lang="scss" scoped>
@import "@assets/styles/main.scss";

.container {
    display: flex;
    flex-direction: column;

    width: calc(100% - 20px);
    // width: 1173px;
    min-height: 410px;
    padding: 0 10px;
    gap: 22px;

    &__label-box {
        display: flex;
        align-items: center;

        gap: 10px;

        margin-bottom: -6px;

        &__label {
            font-weight: 700;
            font-size: 18px;
        }
    }
    &__content-box {
        display: grid;
        grid-template-columns: repeat(2, 1fr);

        gap: 18px 16px;
    }
    
    .required-mark {
        margin: 4px 0 0 4px;
        color: $color-red-000;
    }
}

.table {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;

    width: 100%;

    &__header {
        display: flex;
        align-items: center;
        justify-content: space-between;

        width: 100%;
        height: 48px;

        background-color: $color-white-100;
        border-top: 1px solid $color-white-200;
        border-bottom: 1px solid $color-white-200;

        &__index {
            display: flex;
            align-items: center;
            justify-content: center;
        }
        &__menu {
            display: flex;
            align-items: center;
            justify-content: center;
        }
    }
    &__body {
        width: 100%;
        height: calc(100% - 48px);
        overflow-y: scroll;

        // /* Hide scrollbar for IE, Edge and Firefox */
        -ms-overflow-style: none; /* IE and Edge */
        scrollbar-width: none; /* Firefox */

        // /* Hide scrollbar for Chrome, Safari and Opera */
        &::-webkit-scrollbar {
            display: none;
        }
        &__list-box {
            display: flex;
            align-items: center;
            justify-content: space-between;

            width: 100%;
            height: auto;
            padding: 5px 0;

            border-bottom: 1px solid $color-white-200;

            .list {
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
            }
        }
    }
    &__button {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 40px;
        padding: 12px;
        margin-top: 6px;
        background-color: $color-white-050;
        // border: 1px solid #e5e5e5;
        border: none;
        border-radius: 6px;
        cursor: pointer;
        &__icon {
            width: 20px;
            height: 20px;
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
    height: 30px;
    border-bottom: 1px solid #dadada;
    margin-top: 15px;
    font-size: 18px;
    font-weight: 700;
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

:deep(.container__text-area__input){
    min-height: 130px !important;
}
</style>
