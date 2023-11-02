<template>
    <FormDialog :key="dialogKey" :title="'근로자 등록'" @close-dialog="closeDialog" @submit="onSubmit">
        <div class="container">
            <div class="container__section">
                <FormProfile v-model="userProfileImage" :label="'사진'" @send-event="selectedImage" />
                <FormLabelField v-model="userNationality" :label="'국적'" :disabled="true" />
                <FormLabelField v-model="userName" :label="'아이디'" :validation="validation.user_name" :required="true" @remove="updateValidation" />
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
                <HealthSelectBox
                    label="보건"
                    :select-list="healthCareList"
                />
            </div>
            <div class="container__section">
                <FormAutoCompleteField
                    v-model="userCompanyName"
                    :label="'업체'"
                    :required="true"
                    :validation="validation.company_id"
                    @remove="updateValidation"
                    @send-event="setUserCompany"
                />
                <FormLabelField v-model="ctgoConstructionName" :label="'공종'" :disabled="true" />
                <FormAutoCompleteField
                    v-model="userOccupationName"
                    :label="'직종'"
                    :required="true"
                    :validation="validation.ctgo_occupation_id"
                    @remove="updateValidation"
                    @send-event="setUserOccupation"
                />

                <FormLabelField v-model="userName" :label="'성명'" :validation="validation.user_name" :required="true" @remove="updateValidation" />
                <FormDateField v-model="userBirthday" :label="'생년월일'" :required="false" :isUpdate="false" :disabled="false" :placeholder="'예) 2023.01.01'" />
                <FormLabelField v-model="userPhone" :label="'연락처'" :validation="validation.user_phone" :required="true" :isNumber="true" @remove="updateValidation" />
                <FormLabelField v-model="userSOSPhone" :label="'비상연락처'" style="margin-bottom: 1px" :isNumber="true" />

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
                <div class="empty-block" style="height: 48px;"></div>
            </div>
        </div>
    </FormDialog>
</template>

<script setup lang="ts">
import FormDialog from '@components/common/layout/FormDialogLayout.vue'
import FormProfile from '@components/common/form/Image.vue'
import FormPassword from '@components/common/form/PasswordField.vue'
import FormDateField from '@components/common/form/input/DateField.vue'
import FormLabelField from '@components/common/form/input/LabelField.vue'
import FormAutoCompleteField from '@components/common/form/input/AutoCompleteField.vue'
import FormLabelRegEquipField from '@components/common/form/LabelRegEquipField.vue'
import HealthSelectBox from './HealthSelectBox.vue'
import api from '../selfApi'

import { ref } from 'vue'
import { useStore } from '@stores/index'
import { toast } from 'vue3-toastify'


// Store에서 카테고리 불러오기
const store = useStore()
const companyId = store.getLoginData.user_main_company.company_id
const ctgoConstructionName = ref<string>('업체 대표 공정')
const ctgoConstructionId = ref<number>(0)

// 등록에 필요한 데이터
const userProfileImage = ref<string>('') // 프로필 이미지 - 타입 수정
const userName = ref<string>('') // 이름
const userBirthday = ref<string>('') // 생년월일
const userPhone = ref<string>('') // 연락처
const userSOSPhone = ref<string>('') // 비상연락처
const userCompanyId = ref<number>(0) // 업체 ID
const userCompanyName = ref<string>('') // 업체 이름
const userConstructionId = ref<number>(0) // 공종
const userOccupationId = ref<number>(0) // 직종 ID
const userOccupationName = ref<string>('') // 직종 이름
const userAuthId = ref<string>('') // 아이디
const userPassword = ref<string>('0000') // 비밀번호
const checkPassword = ref<string>('0000') // 비밀번호 확인
const userNationality = ref<string>('대한민국') // 국적
const userVehicleNo = ref<string>('') // 차량번호
const userVehicleType = ref<string>('V') // 출입게이트


const dialogKey = ref(0)

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

// 다이얼로그 닫기
const emit = defineEmits(['close-dialog', 'submit'])
const closeDialog = (): void => {
    emit('close-dialog', false)
    // 기입된 데이터 초기화
    userProfileImage.value = ''
    userName.value = ''
    userBirthday.value = ''
    userPhone.value = ''
    userSOSPhone.value = ''
    userCompanyId.value = 0
    userConstructionId.value = 0
    userOccupationId.value = 0
    userOccupationName.value = ''
    userAuthId.value = ''
    userPassword.value = ''
    checkPassword.value = ''
    userNationality.value = '대한민국'
    userVehicleNo.value = ''
    userVehicleType.value = 'V'

    // Validation 초기화
    validation.value = {
        user_name: false,
        user_phone: false,
        company_id: false,
        auth_id: false,
        auth_token: false,
        ctgo_occupation_id: false,
        check_password: false,
        vehicle_no: false,
        match: false,
        notMatch: false,
    }
    dialogKey.value++
}

// 벨리데이션에 필요한 데이터
let validation:any = ref({
    user_name: false,
    user_phone: false,
    company_id: false,
    auth_id: false,
    auth_token: false,
    ctgo_occupation_id: false,
    check_password: false,
    vehicle_no: false,
    match: false,
    notMatch: false,
})

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

// 저장 (등록)
function onSubmit() {
    setHealthCare()
    const headerParams = store.headerParams
    let params = {
        company_id: companyId,
        scene_id: JSON.stringify([1]),
        fileName: 'profile_file',
        profile_img: userProfileImage.value,
        user_data: JSON.stringify({
            company_id: userCompanyId.value,
            ctgo_construction_id: ctgoConstructionId.value,
            ctgo_occupation_id: userOccupationId.value,
            user_name: userName.value,
            user_birthday: userBirthday.value,
            user_phone: userPhone.value,
            user_sos_phone: userSOSPhone.value,
            auth_id: userName.value,
            auth_token: userPassword.value,
            ctgo_nation_id: 100, // 대한민국 고정 코드
            vehicle_no: userVehicleNo.value,

            high_blood_state: high_blood_state, // 고혈압
            after_care_state: after_care_state, // 사후관리
            diabetes_state: diabetes_state, // 당뇨
            etc_state: etc_state, // 기타
        }),
    }
    params = Object.assign({}, params, headerParams)
    console.log(" health care", params.user_data)

    let valid = formValidation(params) // Validation Check
    let phone = checkPhoneNumber(params) // Validation Check
    confirmPassword() // 비밀번호 & 비밀번호 확인 데이터 일치여부 비교

    if (valid && phone) {
        api.insertWorker(params).then((res) => {
            try {
                const rsCode = res.data.rsCode

                if (rsCode === 0) {
                    toast.success('등록을 완료하였습니다.')
                    closeDialog()
                } else {
                    toast.error(res.data.exMsg)
                }
            } catch (error) {
                console.log(error)
                toast.error(res.data.exMsg)
            }
        })
    } else {
        toast.error('항목을 확인해주세요.')
    }
}

function selectedImage(value: any): void {
    userProfileImage.value = value
}
function formValidation(data: any) {
    const initial = JSON.parse(data.user_data)
    const validationKeys = Object.keys(validation.value)

    let isValid = true
    
    for (let key in initial) {
        validationKeys.forEach((item:any) => {
            if (item !== 'vehicle_no') {
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

    // DropDown 관련
    if (userCompanyId.value > 0 && userOccupationId.value > 0) {
        return isValid
    } else {
        return false
    }
}

const sendValidation = (value: boolean) => {
        validation.value.vehicle_no = value
}

function checkPhoneNumber(data: any) {
    const initial = JSON.parse(data.user_data)
    let isValid = true

    for (let key in initial) {
        if ((key === 'user_phone' && initial.user_phone !== '') || (key === 'user_sos_phone' && initial.user_sos_phone !== '')) {
            const phoneRule = /^010-[0-9]{4}-[0-9]{4}$/
            const res = phoneRule.test(initial[key])

            if (!res) {
                toast.warn('올바른 형식의 연락처를 입력해주세요.')
                isValid = false
            } else {
                isValid = true
            }
        }
    }

    return isValid
}
function updateValidation(label: string, value: boolean) {
    if (label === '성명') validation.value.user_name = value
    if (label === '연락처') validation.value.user_phone = value
    if (label === '아이디') validation.value.auth_id = value
    if (label === '비밀번호') validation.value.auth_token = value
    if (label === '업체') validation.value.company_id = value
    if (label === '직종') validation.value.ctgo_occupation_id = value
    if (label === '직종') validation.value.ctgo_occupation_id = value

    if (label === '비밀번호 확인') {
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
    if (label === '차량번호') {
        validation.value.vehicle_no = value
    }
}
function confirmPassword() {
    if (userPassword.value && userPassword.value === checkPassword.value) {
        // 비밀번호가 일치합니다. Validation 메시지 띄우기 - 코드 추가될 부분
        validation.value.check_password = false
    } else {
        // 비밀번호가 일치하지 않습니다. Validation 메시지 띄우기 - 코드 추가될 부분
        validation.value.check_password = true
    }
}

// SELECT -------------------
// 1. 줄걸이 종류
const vehicle_type_select = ref([
    {
        id: 0,
        name: '화물차',
    },
    {
        id: 1,
        name: '슬링벨트',
    },
    {
        id: 2,
        name: 'Chain',
    },
    {
        id: 3,
        name: '라운드슬링',
    },
])
</script>

<style lang="scss" scoped>
@import '@assets/styles/main.scss';

.container {
    display: grid;
    grid-template-columns: 1fr 1fr;

    width: 100%;
    gap: 24px;

    &__section {
        display: flex;
        flex-direction: column;
        justify-content: space-between;

        width: 100%;

        gap: 24px;

        &:nth-child(1) {
            margin-bottom: 1px;
        }
        &:nth-child(2) {
            margin-top: 2px;
        }
    }
}
</style>
