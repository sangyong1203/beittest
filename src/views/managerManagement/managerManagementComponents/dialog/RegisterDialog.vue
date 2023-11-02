<template>
    <FormDialog
        :title="'관리자 등록'"
        @close-dialog="closeDialog"
        @submit="onSubmit"
    >
        <div class="container">
            <div class="container__section">
                <FormProfile
                    v-model="userProfileImage"
                    :label="'사진'"
                    @send-event="selectedImage"
                />
                <FormDropdown
                    v-model="userAuthority"
                    :label="'권한'"
                    :required="true"
                    :placeholder="'선택'"
                    :data="permissionList"
                    :validation="validation.permission_level"
                    @send-data="selectedAuthority"
                    @remove="updateValidation"
                />
                <FormLabelField
                    v-model="userName"
                    :label="'아이디'"
                    :required="true"
                    :validation="validation.user_name"
                    @remove="updateValidation"
                />
                <FormPassword
                    v-model="userPassword"
                    :label="'비밀번호'"
                    :inputWidth="'276px'"
                    :required="true"
                    :disabled="true"
                    :validation="validation.auth_token"
                    :placeholder="'비밀번호를 입력하세요.'"
                    @remove="updateValidation"
                    class="input"
                />
                <FormPassword
                    v-model="checkPassword"
                    :label="'비밀번호 확인'"
                    :inputWidth="'276px'"
                    :required="true"
                    :disabled="true"
                    :validation="validation.check_password"
                    :match="validation.match"
                    :not-match="validation.notMatch"
                    :placeholder="'비밀번호를 입력하세요.'"
                    style="margin-bottom: 1px"
                    @remove="updateValidation"
                />
                <FormSelectBox
                    label="보건"
                    :select-list="healthCareList"
                />
            </div>
            <div class="container__section">
                <FormAutoCompleteField
                    v-model="userCompanyName"
                    :label="'업체'"
                    :required="true"
                    :validation="validation.company_ids"
                    @remove="updateValidation"
                    @send-event="setUserCompany"
                />
                <FormLabelField
                    v-model="userConstructionName"
                    :label="'공종'"
                    :disabled="true"
                />
                <FormAutoCompleteField
                    v-model="userPositionName"
                    :label="'직책'"
                    :data="ctgoDutyList"
                    :required="true"
                    :validation="validation.ctgo_duty_id"
                    @remove="updateValidation"
                    @send-event="selectedPosition"
                />
                <FormLabelField
                    v-model="userName"
                    :label="'성명'"
                    :required="true"
                    :validation="validation.user_name"
                    @remove="updateValidation"
                />
                <FormDateField
                    v-model="userBirthday"
                    :label="'생년월일'"
                    :required="false"
                    :isUpdate="false"
                    :disabled="false"
                    :placeholder="'예) 2023.01.01'"
                />
                <FormLabelField
                    v-model="userPhone"
                    :label="'연락처'"
                    :required="true"
                    :isNumber="true"
                    :validation="validation.user_phone"
                    @remove="updateValidation"
                />
                <FormLabelField
                    v-model="userSOSPhone"
                    :label="'비상연락처'"
                    style="margin-bottom: 1px"
                    :isNumber="true"
                />
                <FormLabelRegEquipField
                    v-model="userVehicleNo"
                    :label="'차량번호'"
                    style="margin-bottom: 1px"
                    :required="false"
                    :validation="validation.vehicle_no"
                    :input-length="10"
                    @send-valid="sendValidation"
                    @remove="updateValidation"
                />
            </div>
        </div>
    </FormDialog>
</template>

<script setup lang="ts">
import FormDialog from "@components/common/layout/FormDialogLayout.vue"
import FormProfile from "@components/common/form/file/Profile.vue"
import FormDropdown from "@components/common/form/dropdown/Dropdown.vue"
import FormPassword from "@components/common/form/PasswordField.vue"
import FormDateField from "@components/common/form/input/DateField.vue"
import FormLabelField from "@components/common/form/input/LabelField.vue"
import FormAutoCompleteField from "@components/common/form/input/AutoCompleteField.vue"
import FormLabelRegEquipField from "@components/common/form/LabelRegEquipField.vue"
import FormSelectBox from './HealthSelectBox.vue'

import { ref, watch } from "vue"
import { useStore } from "@stores/index"
import { toast } from "vue3-toastify"
import ctgoApi from "@apis/categoryApi"
import api from "../selfApi"

// Store에서 카테고리 불러오기
const store = useStore()
const ctgoDutyList: any[] = store.getCtgoDutyList
const permissionList = ref<any>([]) // 권한

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

// 등록에 필요한 데이터
const userProfileImage = ref<string>("") // 프로필 이미지 - 타입 수정
const userName = ref<string>("") // 이름
const userBirthday = ref<string>("") // 생년월일
const userPhone = ref<string>("") // 연락처
const userSOSPhone = ref<string>("") // 비상연락처
const userCompanyId = ref<number>(0) // 업체 ID
const userCompanyName = ref<string>("") // 업체 이름
const userConstructionId = ref<number>(0) // 공종 ID
const userConstructionName = ref<string>("") // 공종 이름
const userAuthority = ref<number>(0) // 권한
const userPositionId = ref<number>(0) // 직책 ID
const userPositionName = ref<string>("") // 직책 이름
const userRank = ref<string>("") // 직위
const userVehicleNo = ref<string>("") // 차량번호
const userAuthId = ref<string>("") // 아이디
const userPassword = ref<string>("0000") // 비밀번호
const checkPassword = ref<string>("0000") // 비밀번호 확인

// 파일 첨부에 필요한 기본 형태
const defaultFile = ref<any>({
    files: [],
    fileName: "profile_file",
    file_json: {
        insert: [],
        update: [],
        delete: [],
    },
})

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
    vehicle_no: false,
    match: false,
    notMatch: false,
})

const emit = defineEmits(["close-dialog"])
// 위험성평가 - 등록 다이얼로그 닫기
const closeDialog = () => {
    emit("close-dialog", false)
    // Data Init
    userProfileImage.value = ""
    userName.value = ""
    userBirthday.value = ""
    userPhone.value = ""
    userSOSPhone.value = ""
    userCompanyId.value = 0
    userConstructionId.value = 0
    userConstructionName.value = ""
    userAuthority.value = 0
    userPositionId.value = 0
    userPositionName.value = ""
    userRank.value = ""
    userVehicleNo.value = ""
    userAuthId.value = ""
    userPassword.value = ""
    checkPassword.value = ""

    // Validation Init
    for (let key in validation.value) {
        validation.value[key] = false
    }
}
const setUserCompany = (value: any) => {
    userCompanyId.value = value.id
    userCompanyName.value = value.name
    userConstructionId.value = value.other_id
    userConstructionName.value = value.other_name
}
function selectedImage(value: any): void {
    userProfileImage.value = value

    defaultFile.value.files.push(userProfileImage.value)

    for (let i = 0; i < defaultFile.value.files.length; i++) {
        defaultFile.value.file_json.insert.push({
            order_no: i,
            view_type: "profile",
        })
    }
}
const selectedAuthority = (value: any) => {
    userAuthority.value = value.id
}
const selectedPosition = (value: any) => {
    userPositionId.value = value.id
    userPositionName.value = value.name
}


// 보건 ------------------------
let high_blood_state= false // 고혈압
let after_care_state= false // 사후관리
let diabetes_state= false // 당뇨
let etc_state= false // 기타
const healthCareList:any = ref([
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
// -----------------

// 등록
const onSubmit = () => {
    const headerParams = store.getHeaderParams
    setHealthCare()
    let params = {
        // Required
        user_name: userName.value, // 성명
        user_phone: userPhone.value, // 연락처
        company_ids: JSON.stringify([userCompanyId.value]), // 업체
        permission_level: userAuthority.value, // 권한
        ctgo_duty_id: userPositionId.value, // 직책
        auth_id: userName.value, // 아이디
        auth_token: userPassword.value, // 비밀번호
        // Not Required
        company_position: userRank.value, // 직위
        vehicle_no: userVehicleNo.value, // 차량번호
        user_birthday: userBirthday.value, // 생년월일
        user_sos_phone: userSOSPhone.value, // 비상연락처
        files: defaultFile.value.files,
        fileName: "file",
        file_json: JSON.stringify(defaultFile.value.file_json),

        high_blood_state: high_blood_state, // 고혈압
        after_care_state: after_care_state, // 사후관리
        diabetes_state: diabetes_state, // 당뇨
        etc_state: etc_state, // 기타
    }
    params = Object.assign({}, params, headerParams)
    console.log("params", params)
    let valid = formValidation(params) // Validation Check
    let phone = checkPhoneNumber(params) // Validation Check
    confirmPassword(userPassword.value, checkPassword.value) // 비밀번호 & 비밀번호 확인 데이터 일치여부 비교

    if (valid && phone) {
        api.insertAdminInfo(params).then((res) => {
            try {
                const rsCode = res.data.rsCode

                if (rsCode === 0) {
                    toast.success("등록을 완료하였습니다.") // Toast UI 띄우기
                    closeDialog() // 다이얼로그 닫기
                } else {
                    toast.error(res.data.rsMsg)
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
// 벨리데이션 체크
function formValidation(data: any) {
    const initial = data
    const validationKeys = Object.keys(validation.value)

    let isValid = true
    console.log("formValidation", data)
    for (let key in initial) {
        validationKeys.forEach((item) => {
            if (item !== "vehicle_no") {
                if (userCompanyId.value === 0) {
                    validation.value["company_ids"] = true
                    isValid = false
                }
                if (item === key && !initial[key]) {
                    validation.value[key] = true
                    isValid = false
                }

            }
        })
    }

    // 차량번호 관련
    // isValid = !validation.value.vehicle_no

    return isValid
}

const sendValidation = (data: boolean) => {
    if (userVehicleNo.value.length === 0) {
        validation.value.vehicle_no = false
    } else {
        validation.value.vehicle_no = data
    }
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
    if (label === "비밀번호") validation.value.auth_token = value
    if (label === "비밀번호 확인") {
        if (checkPassword.value.length > 0) {
            validation.value.check_password = false

            if (userPassword.value === checkPassword.value) {
                validation.value.match = true
                validation.value.notMatch = false
            } else {
                validation.value.match = false
                validation.value.notMatch = true
            }
        } else {
            validation.value.check_password = true
            validation.value.match = false
            validation.value.notMatch = false
        }
    }
    if (label === "차량번호") {
        validation.value.vehicle_no = value
    }
}
// // 비밀번호 & 비밀번호 확인 값 일치여부
function confirmPassword(
    auth_token: string | number,
    checkAuth_token: string | number
) {
    if (auth_token && auth_token === checkAuth_token) {
        // 비밀번호가 일치합니다. Validation 메시지 띄우기 - 코드 추가될 부분
        validation.value.check_password = false
    } else {
        // 비밀번호가 일치하지 않습니다. Validation 메시지 띄우기 - 코드 추가될 부분
        validation.value.check_password = true
    }
}

watch([userCompanyId], () => {
    validation.value.company_ids = false
})

defineExpose({
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

        &:nth-child(2) {
            margin-top: 4px;
        }
    }
}
</style>
