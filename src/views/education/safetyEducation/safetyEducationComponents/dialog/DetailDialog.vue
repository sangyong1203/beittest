<template>
    <FormDialog :title="'안전교육'" :isUpdate="true" :key="dialogKey" @close-dialog="closeDialog" @update="onUpdate" @delete="onDelete" @save="onSubmit" @print="onPrint">
        <div class="container">
            <div class="container__label-box">
                <span class="container__label-box__label">교육 정보</span>
            </div>
            <div class="container__content-box">
                <FormLabelField v-model="sceneName" :label="'공사명'" :disabled="true" />
                <FormLabelField v-model="writer" :label="'작성자'" :disabled="true" />
                <FormLabelField v-model="companyName" :label="'업체'" :disabled="true" />
                <FormLabelField v-model="regDate" :label="'작성일'" :disabled="true" />
                <FormLabelField v-model="instructorName" :label="'강사명'" :required="true" :disabled="!isEdit" :validation="validation.lecturer_name" @remove="updateValidation" />
                <FormLabelField v-model="occupationName" :label="'직책'" :required="true" :disabled="!isEdit" :validation="validation.lecturer_position" @remove="updateValidation" />
                <FormDropdown
                    v-model="educationTypeId"
                    :label="'교육종류'"
                    :data="educationTypes"
                    :required="true"
                    :placeholder="'선택'"
                    :disabled="!isEdit"
                    :validation="validation.education_class_id"
                    :set-info="setCategory"
                    @send-data="selectedCategory"
                    @remove="updateValidation"
                />
                <FormLabelField v-model="educationPlace" :label="'교육장소'" :disabled="!isEdit" />
                <FormSingleDatePicker v-model="educationDate" label="교육일자" :required="true" :validation="validation.education_date" @remove="updateValidation" :disabled="!isEdit" />
                <FormDoubleTime
                    v-model:start-time="educationStartTime"
                    v-model:end-time="educationEndTime"
                    :label="'교육시간'"
                    :required="true"
                    :disabled="!isEdit"
                    :validation="validation.education_start_time"
                    @remove="updateValidation"
                />
            </div>
            <div class="container__text-area">
                <span class="container__text-area__label">교육내용</span>
                <textarea v-model="educationContents" type="text" class="container__text-area__input" :class="{ disabled: !isEdit }" placeholder="교육내용을 입력하세요." :disabled="!isEdit" />
            </div>
        </div>
        <div class="container" style="margin-top: 20px">
            <FormFileTab :data="attendees" :photos="photos" @send-event="setFiles" @delete-file="deleteFiles" :disabled="!isEdit" />
        </div>
    </FormDialog>
</template>

<script setup lang="ts">
import FormDialog from "@components/common/layout/FormNewDialogLayout.vue"
import FormDropdown from "@components/common/form/dropdown/Dropdown.vue"
import FormLabelField from "@components/common/form/input/LabelField.vue"
import FormSingleDatePicker from "@components/common/form/calendar/SingleDatePicker.vue"
import FormDoubleTime from "@components/common/form/calendar/DoubleTime.vue"
import FormFileTab from "./FileTab.vue"

import { ref, toRefs, watch, computed } from "vue"
import { useStore } from "@stores/index"
import api from "@apis/selfApi"
import { toast } from "vue3-toastify"

interface Photo {
    file_name: string
    file_url: string
    full_name: string
    seq_no: number
}

interface Props {
    item: any
}
const props = defineProps<Props>()
const { item } = toRefs(props)

const isEdit = ref<boolean>(false)
const dialogKey = ref<number>(0)

// Store 접근
const store = useStore()
const headerParams = store.headerParams

// 등록 시, 필요한 데이터
const sceneName = ref<string>("") // 공사명
const companyId = ref<number>(0) // 업체 ID
const companyName = ref<string>("") // 업체 이름
const writer = ref<string>("") // 작성자
const regDate = ref<string>("") // 작성일
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
const photos = ref<Photo[]>([]) // 첨부파일
const attendees:any = ref([]) // 참석인원

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

const setCategory = computed(() => {
    const res = {
        id: educationTypeId.value,
        name: educationTypeName.value,
    }
    return res
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
const emit = defineEmits(["close-dialog", "open-print"])
const closeDialog = () => {
    emit("close-dialog")
    isEdit.value = false
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
    sceneName.value = "" // 공사명
    companyId.value = 0 // 업체 ID
    companyName.value = "" // 업체 이름
    writer.value = "" // 작성자
    regDate.value = ""
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
    photos.value = []
    attendees.value = []
    defaultFile.value = {
        files: [],
        fileName: "education_file",
        file_json: {
            insert: [],
            update: [],
            delete: [],
        },
    }
}

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
    educationContents.value = data.contents
        .split(".")
        .map((item: any) => item.trim())
        .join(".\n")
}

// 사진 첨부 및 삭제
const setFiles = (data: any[]) => {
    defaultFile.value.files = data

    let fileJson: any = { insert: [] }
    for (let i = 0; i < data.length; i++) {
        fileJson.insert.push({
            order_no: i,
            view_type: "safety-education",
        })
    }
    defaultFile.value.file_json.insert = fileJson.insert
}
const deleteFiles = (file: any) => {
    if (file.seq_no) {
        defaultFile.value.file_json.delete.push({
            seq_no: file.seq_no,
        })
    } else {
        defaultFile.value.files.forEach((item: any, index: number) => {
            if (file.name === item.name) defaultFile.value.files.splice(index, 1)
        })
    }
    setFiles(defaultFile.value.files)
}
// 상세 데이터 조회
function getData(props: any) {
    let params = {
        company_ids: JSON.stringify([props.company_id]),
        education_id: props.education_id,
        scene_ids: JSON.stringify([props.scene_id]),
    }
    params = Object.assign({}, params, headerParams)
    api.getEduData(params).then((res: any) => {
        try {
            const rsCode = res.data.rsCode
            const data = res.data.rsObj

            if (rsCode === 0) {
                sceneName.value = data.scene_name
                companyId.value = data.company_id
                companyName.value = data.company_name
                writer.value = data.user_name
                regDate.value = data.reg_date
                instructorName.value = data.lecturer_name
                occupationName.value = data.lecturer_position
                educationTypeId.value = data.education_class_id
                educationTypeName.value = data.education_class_name
                educationContents.value = data.education_contents?.split(".").map((item: any) => item.trim()).join(".\n")
                educationPlace.value = data.education_area
                educationDate.value = data.education_date
                educationStartTime.value = data.education_start_time
                educationEndTime.value = data.education_end_time
                photos.value = data.file_data !== null ? JSON.parse(data.file_data) : []
                attendees.value = data.member !== null ? data.member : []

                photos.value.forEach((item: any) => {
                    item.file_url = item.file_url + item.file_name
                })

                printData.value = data //---print --프린트 데이터---
            }
        } catch (error) {
            console.log(error)
            toast.error(res.data.rsMsg)
        }
    })
    getEducationTypes()
}

// 안전교육 등록 & 수정
function onSubmit() {
    let params = {
        education_id: item.value.education_id,
        company_ids: JSON.stringify([companyId.value]),
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
        education_json: JSON.stringify(defaultFile.value.file_json),
    }
    params = Object.assign({}, params, headerParams)

    let valid = formValidation(params) // Validation Check

    if (valid) {
        api.updateEdu(params).then((res: any) => {
            try {
                const rsCode = res.data.rsCode

                if (rsCode === 0) {
                    toast.success("수정을 완료하였습니다.")
                    closeDialog()
                } else {
                    toast.error("수정을 실패하였습니다.")
                }
            } catch (error) {
                console.log(error)
                toast.error(res.data.rsMsg)
            }
        })
    }
}

// 안전교육 삭제
function onDelete() {
    let params = {
        scene_ids: JSON.stringify([item.value.scene_id]),
        education_ids: JSON.stringify([item.value.education_id]),
    }
    params = Object.assign({}, params, headerParams)
    api.deleteEdu(params).then((res: any) => {
        try {
            const rsCode = res.data?.rsCode

            if (rsCode === 0) {
                toast.success("삭제를 완료하였습니다.")
                closeDialog()
            }
        } catch (error) {
            console.log(error)
            toast.error(res.data.rsMsg)
        }
    })
}

// 수정버튼 클릭
function onUpdate() {
    isEdit.value = true
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
            if (item === key && initial[key]) {
                validation.value[key] = false
                isValid = true
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

watch(item, () => {
    getData(item.value)
})

// -------------------- 프린트 print dialog ----------------------------------------
const printData: any = ref({})
const onPrint = () => {
    emit("open-print", printData)
}
</script>

<style lang="scss" scoped>
@import "@assets/styles/main.scss";

.container {
    display: flex;
    flex-direction: column;

    width: calc(100% - 20px);
    // width: 1173px;

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
            width: calc(100% - 144px);
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
:deep(.dialog-layout){
    width: 1264px !important;
    max-width: unset;
}
</style>
