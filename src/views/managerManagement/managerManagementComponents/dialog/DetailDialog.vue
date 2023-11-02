<template>
    <FormDialog
        :key="dialogKey"
        :title="'관리자 상세'"
        :user_id="userId"
        @close-dialog="closeDialog"
        @update="updateDisable"
        @delete="onDelete"
        @submit="onSubmit"
    >
        <div class="container">
            <div class="container__section">
                <FormImage
                    v-model="userProfileImage"
                    :label="'사진'"
                    @send-event="selectedImage"
                    :disabled="isDisabled"
                    @delete="deleteProfile"
                />
                <FormDropdown
                    v-model="userAuthorityId"
                    :label="'권한'"
                    :required="true"
                    :disabled="isDisabled"
                    :data="permissionList"
                    :validation="validation.permission_level"
                    @send-data="selectedAuthority"
                    @remove="updateValidation"
                />
                <FormLabelField
                    v-model="userAuthId"
                    :label="'아이디'"
                    :required="true"
                    :disabled="true"
                    :validation="validation.auth_id"
                    @remove="updateValidation"
                />
                <FormChangePassword
                    :label="'비밀번호'"
                    :disabled="isDisabled"
                    @send-event="openPasswordDialog"
                    style="margin-top: -2px"
                />
                <HealthSelectBox
                    label="보건"
                    :select-list="healthCareList"
                    :disabled="isDisabled"
                />
            </div>
            <div class="container__section">
                <FormDropdown
                    v-model="userCompanyId"
                    :label="'업체'"
                    :required="true"
                    :disabled="isDisabled"
                    :data="companyList"
                    :validation="validation.company_ids"
                    @send-data="selectedCompany"
                    @remove="updateValidation"
                />
                <FormLabelField
                    v-model="ctgoConstructionName"
                    :label="'공종'"
                    :disabled="true"
                />
                <FormAutoCompleteField
                    v-model="userPositionName"
                    :label="'직책'"
                    :data="ctgoDutyList"
                    :required="true"
                    :disabled="isDisabled"
                    :validation="validation.ctgo_duty_id"
                    @remove="updateValidation"
                    @send-event="selectedPosition"
                />
                <FormLabelField
                    v-model="userName"
                    :label="'성명'"
                    :required="true"
                    :disabled="isDisabled"
                    :validation="validation.user_name"
                    @remove="updateValidation"
                />
                <FormDateField
                    v-model="userBirthday"
                    :label="'생년월일'"
                    :required="false"
                    :isUpdate="true"
                    :disabled="isDisabled"
                    :placeholder="'예) 2023.01.01'"
                />
                <FormLabelField
                    v-model="userPhone"
                    :label="'연락처'"
                    :required="true"
                    :disabled="isDisabled"
                    :isNumber="true"
                    :validation="validation.user_phone"
                    @remove="updateValidation"
                />
                <FormLabelField
                    v-model="userSOSPhone"
                    :label="'비상연락처'"
                    :disabled="isDisabled"
                    :isNumber="true"
                />
                <FormLabelRegEquipField
                    v-model="userVehicleNo"
                    :label="'차량번호'"
                    :disabled="isDisabled"
                    :required="false"
                    :validation="validation.vehicle_no"
                    :input-length="10"
                    @send-valid="sendValidation"
                    @remove="updateValidation"
                />
            </div>
        </div>
        <!-- <FormFileTab
            :userEduData="userEduData"
            :userHealthData="userHealthData"
            :userEduFiles="userEduFiles"
            :userHealthFiles="userHealthFiles"
            :disabled="isDisabled"
            @send-event="getTabData"
            @send-eduFile="getEduFile"
            @send-healthFile="getHealthFile"
            @delete-eduFile="deleteEduFile"
            @delete-healthFile="deleteHealthFile"
        /> -->
    </FormDialog>
</template>

<script setup lang="ts">
import FormDialog from "@components/common/layout/FormUserDialogLayout.vue"
import FormImage from "@components/common/form/Image.vue"
import FormDropdown from "@components/common/form/dropdown/Dropdown.vue"
import FormDateField from "@components/common/form/input/DateField.vue"
import FormLabelField from "@components/common/form/input/LabelField.vue"
import FormChangePassword from "@components/common/form/ChangePassword.vue"
import FormAutoCompleteField from "@components/common/form/input/AutoCompleteField.vue"
import FormFileTab from "@components/common/form/FileTab.vue"
import FormLabelRegEquipField from "@components/common/form/LabelRegEquipField.vue"
import HealthSelectBox from './HealthSelectBox.vue'

import { ref } from "vue"
import { useStore } from "@stores/index"
import { toast } from "vue3-toastify"
import ctgoApi from "@apis/categoryApi"
import api from "../selfApi"

const isDisabled = ref<boolean>(true)

// Store에서 카테고리 불러오기
const store = useStore()
const companyList: any[] = store.getCompanyList
const companyId = store.getLoginData.user_main_company.company_id
const ctgoDutyList: any[] = store.getCtgoDutyList
const permissionList = ref<any>([]) // 권한


// 등록에 필요한 데이터
const sceneName = ref<string>("") // 공사명
const userId = ref<any>() // 비밀번호 변경시 필요한 USER ID
const userProfileSeqNo = ref<number>(0)
const userProfileImage = ref<string>("") // 프로필 이미지 - 타입 수정
const userName = ref<string>("") // 이름
const userBirthday = ref<string>("") // 생년월일
const userPhone = ref<string>("") // 연락처
const userSOSPhone = ref<string>("") // 비상연락처
const userCompanyId = ref<number>(0) // 업체 ID
const userCompanyName = ref<string>("") // 업체 이름
const userConstructionId = ref<number>(0) // 공종
const userAuthorityId = ref<number>(0) // 권한 ID
const userAuthorityName = ref<string>("") // 권한 이름
const userPositionId = ref<number>(0) // 직책 ID
const userPositionName = ref<string>("") // 직책 이름
const userRank = ref<string>("") // 직위
const userAuthId = ref<string>("") // 아이디
const userVehicleNo = ref<string>("") // 차량번호

const dialogKey = ref(0)
const ctgoConstructionName = ref<string>("")
const ctgoConstructionId = ref<number>(0)

// 교육이력 및 건강검진 데이터 및 파일
const userProfileFile = ref<any>([])
const userEduData = ref<any>([])
const userEduFiles = ref<any>([])
const userHealthData = ref<any>([])
const userHealthFiles = ref<any>([])

// 건강검진 새롭게 추가된 정보들
const examinationList = ref<any>([])

// 파일 첨부에 필요한 기본 형태
const defaultFile = ref<any>({
    files: [],
    fileName: "file",
    file_json: {
        insert: [],
        update: [],
        delete: [],
    },
})
const initDefaultFileForm = (): any => {
    return {
        files: [],
        fileName: "file",
        file_json: {
            insert: [],
            update: [],
            delete: [],
        },
    }
}

// 벨리데이션에 필요한 데이터
let validation:any = ref({
    user_name: false,
    user_phone: false,
    company_ids: false,
    auth_id: false,
    auth_token: false,
    ctgo_occupation_id: false,
    check_password: false,
    ctgo_duty_id: false,
    permission_level: false,
    match: false,
    notMatch: false,
    vehicle_no: true,
})

const emit = defineEmits(["close-dialog", "open-password"])
// 정보 초기화
const initForm = (): void => {
    userId.value = 0
    userProfileSeqNo.value = 0
    userProfileImage.value = ""
    userName.value = ""
    userBirthday.value = ""
    userPhone.value = ""
    userSOSPhone.value = ""
    userCompanyId.value = 0
    userCompanyName.value = ""
    userConstructionId.value = 0
    userAuthorityId.value = 0
    userAuthorityName.value = ""
    userPositionId.value = 0
    userPositionName.value = ""
    userRank.value = ""
    userAuthId.value = ""
    // 차량번호 (6월부터 추가)
    userVehicleNo.value = ""

    // 교육이력 및 건강검진 데이터 및 파일
    userProfileFile.value = []
    userEduData.value = []
    userEduFiles.value = []
    userHealthData.value = []
    userHealthFiles.value = []
    examinationList.value = []

    dialogKey.value++
}
// 위험성평가 - 등록 다이얼로그 닫기
const closeDialog = () => {
    validation.value = {
        user_name: false,
        user_phone: false,
        company_ids: false,
        auth_id: false,
        auth_token: false,
        ctgo_occupation_id: false,
        check_password: false,
        ctgo_duty_id: false,
        permission_level: false,
        match: false,
        notMatch: false,
        vehicle_no: false,
    }

    isDisabled.value = true
    initForm()
    defaultFile.value = initDefaultFileForm()
    emit("close-dialog", false)
}
const openPasswordDialog = (value: boolean): void => {
    const data = {
        userId: userId.value,
        userName: userName.value,
        isVisible: value,
    }
    emit("open-password", data)
}
const setUserBirthDay = (value: string) => {
    userBirthday.value = value
}
function selectedImage(profile: any): void {
    userProfileFile.value = profile.value
}
const selectedCompany = (value: any) => {
    userCompanyId.value = value.id
    ctgoConstructionId.value = value.ctgo_construction_id
    ctgoConstructionName.value = value.ctgo_construction_name
}
const selectedAuthority = (value: any) => {
    userAuthorityId.value = value.id
}
const selectedPosition = (value: any) => {
    userPositionId.value = value.id
    userPositionName.value = value.name
}

// 권한 호출 함수
const getPermisstionList = () => {
    const headerParams = store.getHeaderParams
    let params = {
        scene_ids: JSON.stringify([1]),
    }
    params = Object.assign({}, params, headerParams)
    ctgoApi.getAdminPermission(params).then((res) => {
        const rsCode = res.data.rsCode
        const data = res.data.rsMap

        if (rsCode === 0) {
            data.forEach((item: any) => {
                item.id = item.permission_level
                item.name = item.permission_name
            })
            permissionList.value = data
        }
    })
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
function getHealthCare(healthData:any){
    healthCareList.value.forEach( (item:any)=>{
        if(item.name==="고혈압"){
            item.isChecked = healthData.high_blood_state === 1 ? true : false
        }
        if(item.name==="사후관리"){
            item.isChecked = healthData.after_care_state === 1 ? true : false
        }
        if(item.name==="당뇨"){
            item.isChecked = healthData.diabetes_state === 1 ? true : false
        }
        if(item.name==="기타"){
            item.isChecked = healthData.etc_state === 1 ? true : false
        }
    })
    console.log("getHealthCare", healthCareList.value)
}
// ---------------------


// 상세데이터 조회
const getData = (id: number) => {
    const headerParams = store.getHeaderParams

    let params = {
        view_user_id: id,
    }
    params = Object.assign({}, params, headerParams)
    api.getAdminInfo(params).then((res) => {
        try {
            const rsCode = res.data.rsCode
            const data = res.data.rsObj

            const file =
                JSON.parse(data.user_profile_file_data) !== null
                    ? JSON.parse(data.user_profile_file_data)[0]
                    : []

            if (rsCode === 0) {
                sceneName.value = data.scene_name
                ctgoConstructionId.value = data.ctgo_construction_id
                ctgoConstructionName.value = data.ctgo_construction_name

                userId.value = data.user_id
                //userProfileImage.value = file.file_url + file.file_name (추후 서버단 수정 필요)
                userProfileImage.value =
                    "https://wpgumi.com/image/" + data.user_id + ".jpg"
                userName.value = data.user_name
                userBirthday.value = data.user_birthday
                userPhone.value = data.user_phone.replace(
                    /^(\d{2,3})(\d{3,4})(\d{4})$/,
                    `$1-$2-$3`
                )
                userSOSPhone.value = data.user_sos_phone
                    ? data.user_sos_phone.replace(
                          /^(\d{2,3})(\d{3,4})(\d{4})$/,
                          `$1-$2-$3`
                      )
                    : ""
                userCompanyId.value = data.company_id // 업체 ID
                userCompanyName.value = data.company_name // 업체 이름
                userConstructionId.value = 0
                userAuthorityId.value = data.permission_level // 권한 ID
                userAuthorityName.value = data.permission_name // 권한 이름
                userPositionId.value = data.ctgo_duty_id // 직책 ID
                userPositionName.value = data.ctgo_duty_name // 직책 이름
                userRank.value = data.company_position // 직위
                userAuthId.value = data.auth_id
                userVehicleNo.value = data.vehicle_no

                userProfileSeqNo.value = file.seq_no
                userEduData.value =
                    data.edu_data !== null ? JSON.parse(data.edu_data) : [] // 교육이력 테이블 데이터
                userEduFiles.value =
                    data.user_certificate_file_data !== null
                        ? JSON.parse(data.user_certificate_file_data)
                        : [] // 교육이력 첨부파일

                userHealthData.value =
                    data.health_data !== null
                        ? JSON.parse(data.health_data)
                        : [] // 건강검진 테이블 데이터
                userHealthFiles.value =
                    data.user_health_file_data !== null
                        ? JSON.parse(data.user_health_file_data)
                        : [] // 건강검진 첨부파일

                getHealthCare(data) // 보건
                
            }
        } catch (error) {
            console.log(error)
            toast.warn(res.data.rsMsg)
        }
    })
}
// 수정
const onSubmit = () => {
    const headerParams = store.getHeaderParams

    if (userProfileFile.value != null) {
        if (userProfileFile.value.name != null) {
            defaultFile.value.files.push(userProfileFile.value)
            defaultFile.value.file_json.insert.push({
                order_no: 1,
                view_type: "profile",
            })
        }
    }
    
    if(!chechHealthData(examinationList.value)) return
    userHealthData.value = [...userHealthData.value, ...examinationList.value]
    
    setHealthCare() // 보건 데이터 setting

    let params = {
        // Required
        view_user_id: userId.value,
        user_name: userName.value, // 성명
        user_phone: userPhone.value, // 연락처
        company_ids: JSON.stringify([userCompanyId.value]), // 업체
        permission_level: userAuthorityId.value, // 권한
        ctgo_duty_id: userPositionId.value, // 직책
        auth_id: userAuthId.value, // 아이디

        // Not Required
        company_position: userRank.value, // 직위
        user_birthday: userBirthday.value, // 생년월일
        user_sos_phone: userSOSPhone.value, // 비상연락처
        education_data: userEduData.value
            ? JSON.stringify(userEduData.value)
            : [], // 수정할 유저의 교육이력
        health_data: JSON.stringify(userHealthData.value), // 수정할 유저의 건강검진이력 - 기존 데이터 + 추가된 것까지 push 해서 넣어야함
        vehicle_no: userVehicleNo.value, // 차량번호

        files: defaultFile.value.files,
        fileName: defaultFile.value.fileName,
        file_json: JSON.stringify(defaultFile.value.file_json),

        high_blood_state: high_blood_state, // 고혈압
        after_care_state: after_care_state, // 사후관리
        diabetes_state: diabetes_state, // 당뇨
        etc_state: etc_state, // 기타
    }
    params = Object.assign({}, params, headerParams)

    let valid = formValidation(params) // Validation Check
    let phone = checkPhoneNumber(params) // Validation Check

    

    if (valid && phone) {
        api.updateAdminInfo(params).then((res) => {
            try {
                const rsCode = res.data.rsCode

                if (rsCode === 0) {
                    toast.success("수정을 완료하였습니다.")
                    closeDialog()
                } else {
                    toast.error("수정 실패하였습니다")
                    closeDialog()
                }
            } catch (error) {
                console.log(error)
                toast.error(res.data.rsMsg)
            }
        })
    } else {
        toast.error("항목을 확인해주세요.")
    }
}
// 삭제
const onDelete = () => {
    const headerParams = store.headerParams

    let params = {
        view_user_ids: JSON.stringify([userId.value]),
    }
    params = Object.assign({}, params, headerParams)
    api.deleteAdminInfo(params).then((res) => {
        try {
            const rsCode = res.data.rsCode

            if (rsCode === 0) {
                toast.success("삭제를 완료하였습니다.")
                closeDialog()
            }
        } catch (error) {
            toast.error(res.data.rsMsg)
            console.log(error)
        }
    })
}
// 수정버튼 클릭
function updateDisable() {
    isDisabled.value = false
}
// 관리자 프로필 사진 제거
function deleteProfile(event: boolean) {
    if (event) {
        userProfileFile.value = null

        if (userProfileSeqNo.value > 0) {
            defaultFile.value.file_json.delete.push({
                seq_no: userProfileSeqNo.value,
            })
        }
    }
}
// 교육이력 파일첨부 및 파일삭제
function getEduFile(data: any) {
    userEduFiles.value = [...data]

    for (let i = 0; i < userEduFiles.value.length; i++) {
        defaultFile.value.files.push(userEduFiles.value[i])
        defaultFile.value.file_json.insert.push({
            order_no: i,
            view_type: "certificate",
        })
    }
}
function deleteEduFile(data: any) {
    if (data.seq_no !== null) {
        defaultFile.value.file_json.delete.push({
            seq_no: data.seq_no,
        })
    }
    userEduFiles.value.splice(data.seq_no, 1)
}
// 건강검진 파일첨부 및 파일삭제
function getHealthFile(data: any) {
    userHealthFiles.value = [...data]

    for (let i = 0; i < userHealthFiles.value.length; i++) {
        defaultFile.value.files.push(userHealthFiles.value[i])
        defaultFile.value.file_json.insert.push({
            order_no: i,
            view_type: "health",
        })
    }
}
function deleteHealthFile(data: any) {
    if (data.seq_no != null) {
        defaultFile.value.file_json.delete.push({
            seq_no: data.seq_no,
        })
    }
    userHealthFiles.value.files.splice(data.seq_no, 1)
}

// Tab 컴포넌트에서 전달받은 데이터
const getTabData = (data: any) => {
    // 자식컴포넌트에서 전달받은 value 안에는 교육이력 테이블, 건강검진 테이블 데이터가 있다.
    // 건강검진 테이블 데이터
    examinationList.value = data
    console.log("getTabData", data)
}

// 벨리데이션 체크
function formValidation(data: any) {
    const initial = data
    const validationKeys = Object.keys(validation.value)

    let isValid = true

    for (let key in initial) {
        validationKeys.forEach((item) => {
            if (item !== "vehicle_no") {
                if (item === key && !initial[key]) {
                    validation.value[key] = true
                    isValid = false
                }
                if (item === key && initial[key]) {
                    validation.value[key] = false
                    isValid = true
                }
            }
        })
    }
    // 차량번호 관련
    isValid = !validation.value.vehicle_no

    return isValid
}
function chechHealthData(healthData: any){
    let valid = true
    healthData.forEach( (item: any) => {
        if(!item.health_type){
            valid = false
            toast.error("검진유형을 입력해주세요.")
        }
        if(!item.health_date){
            valid = false
            toast.error("검진일을 입력해주세요.")
        }
    })
    return valid
}
function checkPhoneNumber(data: any) {
    let isValid = true

    for (let key in data) {
        if (key === "company_ids") data.company_ids = userCompanyId.value
        if (
            (key === "user_phone" && data.user_phone !== "") ||
            (key === "user_sos_phone" && data.user_sos_phone !== "")
        ) {
            const phoneRule = /^010-[0-9]{4}-[0-9]{4}$/
            const res = phoneRule.test(data[key])

            if (!res) {
                toast.warn("올바른 형식의 연락처를 입력해주세요.")
                isValid = false
            } else {
                isValid = true
            }
        }
    }

    return isValid
}

const sendValidation = (data: boolean) => {
    if (userVehicleNo.value.length === 0) {
        validation.value.vehicle_no = false
    } else {
        validation.value.vehicle_no = data
    }
}

// 벨리데이션 자동 해제 및 활성화
function updateValidation(label: string, value: boolean) {
    // DROPDOWN
    if (label === "업체") validation.value.company_ids = false
    if (label === "권한") validation.value.permission_level = false
    if (label === "직책") validation.value.ctgo_duty_id = false
    // TEXTFIELD
    if (label === "성명") validation.value.user_name = value
    if (label === "연락처") validation.value.user_phone = value
    if (label === "아이디") validation.value.auth_id = value
}

getPermisstionList()
function openDialog(value: any) {
    userId.value = value.id
    getData(value.id)
}
defineExpose({
    openDialog,
    getPermisstionList,
})
</script>

<style lang="scss" scoped>
@import "@assets/styles/main.scss";

.container {
    display: grid;
    grid-template-columns: 1fr 1fr;

    width: 100%;
    gap: 24px;

    &__section {
        display: flex;
        flex-direction: column;

        width: 100%;
        gap: 24px;
    }
}
</style>
