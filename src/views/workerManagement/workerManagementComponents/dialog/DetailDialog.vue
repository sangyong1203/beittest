<template>
    <FormDialog :title="'근로자 상세'" :is-update="true" :user_id="userId" @close-dialog="closeDialog" @update="updateDisable" @delete="onDelete" @submit="onSubmit">
        <div class="dialog-content">
            <div class="dialog-content__column">
                <FormImage v-model="userProfileImage" :label="'사진'" @send-event="selectedImage" :disabled="isDisabled" @delete="deleteProfile" />
                <FormLabelField v-model="userNationality" :label="'국적'" :disabled="true" />
                <FormLabelField v-model="userAuthId" :label="'아이디'" :validation="validation.auth_id" :disabled="true" :required="true" @remove="updateValidation" />
                <FormChangePassword :label="'비밀번호'" :disabled="isDisabled" @send-event="openPasswordDialog" />
                <HealthSelectBox
                    label="보건"
                    :select-list="healthCareList"
                    :disabled="isDisabled"
                />
            </div>
            <div class="dialog-content__column" style="padding-top: 2px">
                <FormAutoCompleteField
                    v-model="userCompanyName"
                    :label="'업체'"
                    :required="true"
                    :validation="validation.company_id"
                    :disabled="isDisabled"
                    @remove="updateValidation"
                    @send-event="setUserCompany"
                />
                <FormLabelField v-model="ctgoConstructionName" :label="'공종'" :disabled="true" />
                <FormAutoCompleteField
                    v-model="userOccupationName"
                    :label="'직종'"
                    :data="ctgoOccupationList"
                    :required="true"
                    :disabled="isDisabled"
                    :validation="validation.ctgo_occupation_id"
                    @remove="updateValidation"
                    @send-event="setUserOccupation"
                />
                <FormLabelField v-model="userName" :label="'성명'" :validation="validation.user_name" :disabled="isDisabled" :required="true" @remove="updateValidation" />
                <FormDateField v-model="userBirthday" :label="'생년월일'" :required="false" :isUpdate="false" :disabled="isDisabled" :placeholder="'예) 2023.01.01'" />
                <FormLabelField v-model="userPhone" :label="'연락처'" :validation="validation.user_phone" :disabled="isDisabled" :isNumber="true" :required="true" @remove="updateValidation" />
                <FormLabelField v-model="userSOSPhone" :label="'비상연락처'" :disabled="isDisabled" :isNumber="true" />
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
        <FormFileTab
            :userEduData="userEduData"
            :userHealthData="userHealthData"
            :userEduFiles="userEduFiles"
            :userHealthFiles="userHealthFiles"
            :disabled="isDisabled"
            @send-event="getTabData"
            @send-eduFile="setEduFile"
            @send-healthFile="getHealthFile"
            @delete-eduFile="deleteEduFile"
            @delete-healthFile="deleteHealthFile"
        />
    </FormDialog>
</template>

<script setup lang="ts">
import FormDialog from "@components/common/layout/FormUserDialogLayout.vue"
import FormImage from "@components/common/form/Image.vue"
import FormDateField from "@components/common/form/input/DateField.vue"
import FormLabelField from "@components/common/form/input/LabelField.vue"
import FormChangePassword from "@components/common/form/ChangePassword.vue"
import FormAutoCompleteField from "@components/common/form/input/AutoCompleteField.vue"
import FormFileTab from "@components/common/form/FileTab.vue"
import FormLabelRegEquipField from "@components/common/form/LabelRegEquipField.vue"
import HealthSelectBox from './HealthSelectBox.vue'

import { ref, computed } from "vue"
import { useStore } from "@stores/index"
import { toast } from "vue3-toastify"

import api from "@apis/selfApi"

const isDisabled = ref<boolean>(true)

// Store에서 카테고리 불러오기
const store = useStore()
const companyList: any[] = store.getCompanyList
const ctgoOccupationList: any[] = store.getCtgoOccupationList

const ctgoConstructionName = ref<string>("업체 대표 공정")
const ctgoConstructionId = ref<number>(0)

const emit = defineEmits(["open-dialog", "close-dialog", "submit", "open-password"])
const closeDialog = (): void => {
    validation.value = {
        user_name: false,
        user_phone: false,
        company_id: false,
        auth_id: false,
        auth_token: false,
        vehicle_no: false,
        ctgo_occupation_id: false,
        check_password: false,
    }
    isDisabled.value = true
    initForm()
    defaultFile.value = initDefaultFileForm()
    emit("close-dialog", false)
}

// 수정에 필요한 데이터
const sceneName = ref<string>("") // 공사명
const userId = ref<number>(0)
const userProfileSeqNo = ref<number>(0)
const userProfileImage = ref<string>("") // 프로필 이미지 - 타입 수정
const userName = ref<string>("") // 이름
const userBirthday = ref<string>("") // 생년월일
const userPhone = ref<string>("") // 연락처
const userSOSPhone = ref<string>("") // 비상연락처
const userCompanyId = ref<number>(0) // 업체 ID
const userCompanyName = ref<string>("") // 업체 ID
const userOccupationId = ref<number>(0) // 직종 ID
const userOccupationName = ref<string>("") // 직종
const userAuthId = ref<string>("") // 아이디
const userNationality = ref<string>("대한민국")
const userVehicleNo = ref<string>("")

const setUserBirthDay = (value: string) => {
    userBirthday.value = value
}

// 교육이력 및 건강검진 데이터 및 파일
const userProfileFile = ref<any>([])
const userEduData = ref<any>([])
const userEduFiles = ref<any>([])
const userHealthData = ref<any>([])
const userHealthFiles = ref<any>([])

// 건강검진 새롭게 추가된 정보들
const examinationList = ref<any>([])

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

// Dialog 닫을 때 정보 초기화
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
    userOccupationId.value = 0
    userOccupationName.value = ""
    userAuthId.value = ""
    userNationality.value = ""
    userVehicleNo.value = ""
    userProfileFile.value = []
    userEduData.value = []
    userEduFiles.value = []
    userHealthData.value = []
    userHealthFiles.value = []
    examinationList.value = []
}

// 파일 첨부에 필요한 기본 형태
const defaultFile = ref<any>({
    files: [],
    fileName: "user_file",
    file_json: {
        insert: [],
        update: [],
        delete: [],
    },
})

const initDefaultFileForm = (): any => {
    return {
        files: [],
        fileName: "user_file",
        file_json: {
            insert: [],
            update: [],
            delete: [],
        },
    }
}

// 벨리데이션에 필요한 데이터
const validation:any = ref({
    user_name: false,
    user_phone: false,
    company_id: false,
    auth_id: false,
    auth_token: false,
    ctgo_occupation_id: false,
    check_password: false,
    vehicle_no: true,
})

// 상세데이터 조회
const getData = (id: number) => {
    const headerParams = store.getHeaderParams

    let params = {
        target_id: id,
    }
    params = Object.assign({}, params, headerParams)
    api.getWorkerManagementDetail(params, id).then((res) => {
        try {
            const rsCode = res.data.rsCode
            const data = res.data.rsObj
            const userCompanyData = data.user_company[0]
            const userData = data.user_data
            const userFile = data.user_file

            // 프로필 이미지 띄우기
            userFile.forEach((item: any, index: number) => {
                if (userFile.length !== 0 && item.view_type === "profile") {
                    userProfileImage.value = item.file_url_full
                    userProfileSeqNo.value = item.seq_no
                } else if (item.view_type === "certificate") {
                    userEduFiles.value = userEduFiles.value.concat({ ...item, index: userEduFiles.value.length })
                } else if (item.view_type === "health") {
                    userHealthFiles.value = userHealthFiles.value.concat({ ...item, index: userHealthFiles.value.length })
                }
            })

            if (rsCode === 0) {
                sceneName.value = userCompanyData.scene_name
                userCompanyId.value = userCompanyData.company_id
                userId.value = userData.user_id
                //userProfileImage.value = file.file_url + file.file_name (추후 서버단 수정 필요)
                userProfileImage.value = "https://wpgumi.com/image/" + userData.user_id + ".jpg"
                userName.value = userData.user_name
                userBirthday.value = userData.user_birthday
                userAuthId.value = userData.auth_id
                userPhone.value = userData.user_phone.replace(/^(\d{2,3})(\d{3,4})(\d{4})$/, `$1-$2-$3`)
                userSOSPhone.value = userData.user_sos_phone ? userData.user_sos_phone.replace(/^(\d{2,3})(\d{3,4})(\d{4})$/, `$1-$2-$3`) : ""
                userVehicleNo.value = userData.vehicle_no ? userData.vehicle_no : ""
                userCompanyId.value = userCompanyData.company_id
                userCompanyName.value = userCompanyData.company_name

                ctgoConstructionId.value = userCompanyData.ctgo_construction_id
                ctgoConstructionName.value = userCompanyData.ctgo_construction_name

                userOccupationId.value = userCompanyData.ctgo_occupation_id
                userOccupationName.value = userCompanyData.ctgo_occupation_name

                userEduData.value = userData.edu_data ? JSON.parse(userData.edu_data) : []
                userHealthData.value = userData.health_data ? JSON.parse(userData.health_data) : []

                getHealthCare(userData) // 보건
            }
        } catch (error) {
            console.log(error)
            toast.warn(res.data.rsMsg)
        }
    })
}

// 수정
const onSubmit = () => {
    const headerParams = store.headerParams

    if (userProfileFile.value != null) {
        if (userProfileFile.value.name != null) {
            defaultFile.value.files.push(userProfileFile.value)
            defaultFile.value.file_json.insert.push({
                order_no: 1,
                view_type: "profile",
            })
        }
    }

    userHealthData.value = [...userHealthData.value, ...examinationList.value]
    setHealthCare() // 보건 데이터 setting 

    let params = {
        // Required
        target_id: userId.value, // 수정할 유저의 ID
        ctgo_nation_id: 100, // 대한민국 고정 코드
        user_name: userName.value, // 수정할 유저의 이름
        user_phone: userPhone.value, // 수정할 유저의 휴대전화번호
        // user_license_state: userVehicleNo.value === null ? false : true,
        // NotRequired
        vehicle_no: userVehicleNo.value ? userVehicleNo.value : null, // 수정할 유저의 운전자 면허번호
        user_birthday: userBirthday.value ? userBirthday.value : null, // 수정할 유저의 생년월일
        user_sos_phone: userSOSPhone.value, // 수정할 유저의 비상연락처
        education_data: userEduData.value ? JSON.stringify(userEduData.value) : [], // 수정할 유저의 교육이력
        health_data: JSON.stringify(userHealthData.value), // 수정할 유저의 건강검진이력 - 기존 데이터 + 추가된 것까지 push 해서 넣어야함
        company_data: JSON.stringify([
            {
                company_id: userCompanyId.value,
                ctgo_occupation_id: userOccupationId.value,
                ctgo_construction_id: ctgoConstructionId.value,
            },
        ]),
        files: defaultFile.value.files,
        fileName: defaultFile.value.fileName,
        user_json: JSON.stringify(defaultFile.value.file_json),

        high_blood_state: high_blood_state, // 고혈압
        after_care_state: after_care_state, // 사후관리
        diabetes_state: diabetes_state, // 당뇨
        etc_state: etc_state, // 기타
    }
    params = Object.assign({}, params, headerParams)

    let valid = formValidation(params) // Validation Check
    let phone = checkPhoneNumber(params) // Validation Check

    if (valid && phone) {
        api.updateWorkerManagement(params).then((res) => {
            try {
                const rsCode = res.data.rsCode

                if (rsCode === 0) {
                    toast.success("수정을 완료하였습니다.")
                    closeDialog()
                } else {
                    toast.error(res.data.exMsg)
                }
            } catch (error) {
                console.log(error)
                toast.warn(res.data.rsMsg)
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
        target_ids: JSON.stringify([userId.value]),
    }
    params = Object.assign({}, params, headerParams)
    api.deleteWorkerManagement(params).then((res) => {
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

const setUserCompany = (value: any) => {
    userCompanyId.value = value.id
    userCompanyName.value = value.name
    ctgoConstructionId.value = value.other_id
    ctgoConstructionName.value = value.other_name
}

const setUserOccupation = (value: any) => {
    userOccupationId.value = value.id
    userOccupationName.value = value.name
}
function selectedImage(profile: any): void {
    userProfileFile.value = profile.value
}

const setCompany = computed(() => {
    const res = {
        id: userCompanyId.value,
        name: userCompanyName.value,
    }
    return res
})
const setOccupation = computed(() => {
    const res = {
        id: userOccupationId.value,
        name: userOccupationName.value,
    }
    return res
})

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
function checkPhoneNumber(data: any) {
    let isValid = true

    for (let key in data) {
        if ((key === "user_phone" && data.user_phone !== "") || (key === "user_sos_phone" && data.user_sos_phone !== "")) {
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

function updateValidation(label: string, value: boolean) {
    if (label === "성명") validation.value.user_name = value
    if (label === "연락처") validation.value.user_phone = value
    if (label === "아이디") validation.value.auth_id = value
    if (label === "업체") validation.value.company_id = value
    if (label === "직종") validation.value.ctgo_occupation_id = value
    if (label === "차량번호") {
        validation.value.vehicle_no = value
    }
}

// 수정버튼 클릭
function updateDisable() {
    isDisabled.value = false
}
// 근로자 프로필 사진 제거
function deleteProfile(event: boolean) {
    if (event) {
        console.log(event)
        userProfileFile.value = null
        console.log(userProfileSeqNo.value)
        if (userProfileSeqNo.value > 0) {
            defaultFile.value.file_json.delete.push({
                seq_no: userProfileSeqNo.value,
            })
        }
    }
}
// 교육이력 파일첨부 및 파일삭제
function setEduFile(data: any) {
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
const deleteHealthFile = (data: any) => {
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
}
const openPasswordDialog = (value: boolean): void => {
    const data = {
        userId: userId.value,
        userName: userName.value,
        isVisible: value,
    }
    emit("open-password", data)
}
function openDialog(value:any){
    userId.value = value.id
    getData(value.id)
}
defineExpose({
    openDialog,
})
</script>

<style lang="scss" scoped>
@import "@assets/styles/main.scss";

.dialog-content {
    display: grid;
    grid-template-columns: 1fr 1fr;

    width: 100%;
    gap: 24px;

    &__column {
        display: flex;
        flex-direction: column;

        width: 100%;
        gap: 24px;
    }
}
</style>
