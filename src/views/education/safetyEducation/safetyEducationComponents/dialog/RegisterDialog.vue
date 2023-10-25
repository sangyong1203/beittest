<template>
    <FormDialog :title="'안전교육'" :key="dialogKey" @close-dialog="closeDialog" @submit="onSubmit">
        <div class="container">
            <div class="container__label-box">
                <span class="container__label-box__label">교육 정보</span>
            </div>
            <div class="container__content-box">
                <FormLabelField v-model="sceneName" :label="'공사명'" :disabled="true" />
                <FormLabelField v-model="writer" :label="'작성자'" :disabled="true" />
                <FormLabelField v-model="companyName" :label="'업체'" :disabled="true" />
                <FormLabelField v-model="regDate" :label="'작성일'" :disabled="true" />
                <FormLabelField v-model="instructorName" :label="'강사명'" :required="true" :validation="validation.lecturer_name" @remove="updateValidation" />
                <FormLabelField v-model="occupationName" :label="'직책'" :required="true" :validation="validation.lecturer_position" @remove="updateValidation" />
                <FormDropdown
                    v-model="educationTypeName"
                    :label="'교육종류'"
                    :data="educationTypes"
                    :required="true"
                    :placeholder="'선택'"
                    :validation="validation.education_class_id"
                    :set-info="setCategory"
                    @send-data="selectedCategory"
                    @remove="updateValidation"
                />
                <FormLabelField v-model="educationPlace" :label="'교육장소'" />
                <FormSingleDatePicker v-model="educationDate" label="교육일자" :required="true" :validation="validation.education_date" @remove="updateValidation" />
                <FormDoubleTime
                    v-model:start-time="educationStartTime"
                    v-model:end-time="educationEndTime"
                    :label="'교육시간'"
                    :required="true"
                    :validation="validation.education_start_time"
                    @remove="updateValidation"
                />
            </div>
            <div class="container__text-area">
                <span class="container__text-area__label">교육내용</span>
                <textarea v-model="educationContents" type="text" class="container__text-area__input" placeholder="교육내용을 입력하세요." />
            </div>
        </div>
    </FormDialog>
</template>

<script setup lang="ts">
import FormDialog from "@components/common/layout/dialog/BasicDialog.vue"
import FormDropdown from "@components/common/form/dropdown/Dropdown.vue"
import FormLabelField from "@components/common/form/input/LabelField.vue"
import FormSingleDatePicker from "@components/common/form/calendar/SingleDatePicker.vue"
import FormDoubleTime from "@components/common/form/calendar/DoubleTime.vue"

import { ref, computed } from "vue"
import { useStore } from "@stores/index"
import api from "@apis/selfApi"
import dayjs from "dayjs"
import { toast } from "vue3-toastify"

// Store 접근
const store = useStore()
const headerParams = store.headerParams
const dialogKey = ref<number>(0)

const sceneName = store.loginData.user_permission.scene_name // 공사명
const companyId = store.loginData.user_main_company.company_id // 업체 ID
const companyName = store.loginData.user_main_company.company_name // 업체 이름
const writer = store.loginData.user_data.user_name // 작성자

// 등록 시, 필요한 데이터
const regDate = ref<string>(dayjs(new Date()).format("YYYY-MM-DD")) // 작성일
const instructorName = ref<string>("") // 강사명
const occupationName = ref<string>("") // 직책
const educationTypes = ref<any>([]) // 교육종류 배열
const educationTypeId = ref<number>(0) // 교육종류 ID
const educationTypeName = ref<string>("") // 교육종류 이름
const educationContents = ref<string>("") // 교육내용
const educationPlace = ref<string>("") // 교육장소
const educationDate = ref<string>("") // 교육일자
const educationStartTime = ref<string>("") // 교육시작시간
const educationEndTime = ref<string>("") // 교육종료시간

// 파일 첨부에 필요한 기본 형태
const defaultFile = ref<any>({
    files: [],
    fileName: "education_file",
    file_json: {
        insert: [],
        update: [],
        delete: [],
    },
})

// 벨리데이션 데이터
const validation = ref<any>({
    lecturer_name: false,
    lecturer_position: false,
    education_class_id: false,
    education_date: false,
    education_start_time: false,
})

// 다이얼로그 닫기
const emit = defineEmits(["close-dialog"])
const closeDialog = () => {
    emit("close-dialog")
    dialogKey.value++

    // 벨리데이션 초기화
    validation.value = {
        lecturer_name: false,
        lecturer_position: false,
        education_class_id: false,
        education_date: false,
        education_start_time: false,
    }

    // 초기화
    regDate.value = dayjs(new Date()).format("YYYY-MM-DD")
    instructorName.value = ""
    occupationName.value = ""
    educationTypes.value = []
    educationTypeId.value = 0
    educationTypeName.value = ""
    educationContents.value = ""
    educationPlace.value = ""
    educationDate.value = ""
    educationStartTime.value = ""
    educationEndTime.value = ""
}

const setCategory = computed(() => {
    const res = {
        id: educationTypeId.value,
        name: educationTypeName.value,
    }
    return res
})

// 교육종류 카테고리 조회
function getEducationTypes() {
    let eduClass = store.eduClassList
    let response = new Array()

    eduClass.forEach((item: any) => {
        let data = {
            id: item.education_class_id,
            name: item.education_class_name,
            contents: item.education_class_contents,
        }
        response.push(data)
    })
    educationTypes.value = response

    return response
}
// 교육종류 선택시 교육내용 자동 할당
function selectedCategory(data: any) {
    educationTypeId.value = data.id
    educationTypeName.value = data.name
    educationContents.value = data.contents
        .split(".")
        .map((item: any) => item.trim())
        .join(".\n")
}

// 안전교육 등록
function onSubmit() {
    let params = {
        company_ids: JSON.stringify([companyId]),
        education_area: educationPlace.value,
        education_class_id: educationTypeId.value,
        education_contents: educationContents.value,
        education_date: educationDate.value,
        education_start_time: educationStartTime.value,
        education_end_time: educationEndTime.value,
        lecturer_name: instructorName.value,
        lecturer_position: occupationName.value,
        scene_ids: JSON.stringify([1]),
        // 첨부파일
        files: defaultFile.value.files,
        fileName: "education_file",
        file_json: JSON.stringify(defaultFile.value.file_json),
    }
    params = Object.assign({}, params, headerParams)

    console.log("date----------", params)
    return
    let valid = formValidation(params) // Validation Check

    if (valid) {
        api.insertEdu(params).then((res:any) => {
            try {
                const rsCode = res.data.rsCode

                if (rsCode === 0) {
                    toast.success("등록을 완료하였습니다.")
                    closeDialog()
                }
            } catch (error) {
                console.log(error)
                toast.error(res.data.rsMsg)
            }
        })
    }
}

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
    if (label === "강사명") validation.value.lecturer_name = value
    if (label === "직책") validation.value.lecturer_position = value
    if (label === "교육종류") validation.value.education_class_id = value
    if (label === "교육일자") validation.value.education_date = value
    if (label === "교육시간") validation.value.education_start_time = value
}

defineExpose({ getEducationTypes })
</script>

<style lang="scss" scoped>
@import "@assets/styles/main.scss";

.container {
    display: flex;
    flex-direction: column;

    width: calc(100% - 20px);

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

        gap: 22px 16px;
    }
    &__text-area {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        position: relative;

        width: 100%;

        &__validation {
            margin-top: -16px;
            margin-bottom: -16px;
            color: $color-red-000;
            font-size: 12px;
        }
        &__label {
            display: flex;
            align-items: flex-start;

            width: 120px;
            height: 100%;

            margin-top: 16px;
        }
        &__input {
            flex: 1;
            max-height: 500px;
            min-height: 150px;
            padding: 14px 12px;

            border: 1px solid $color-white-400;
            border-radius: 6px;

            resize: none; // textarea 크기 고정

            &.disabled {
                color: $color-white-500;
            }
            &.validation {
                border: 1px solid $color-red-000;

                &::placeholder {
                    color: rgba($color-red-000, 0.9);
                }
            }
            &::placeholder {
                color: #b1b1b1;
            }
            &:focus {
                outline: none;
            }
        }
    }
}
</style>
