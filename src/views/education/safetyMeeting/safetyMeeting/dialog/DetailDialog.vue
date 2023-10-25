<template>
    <FormDialog :title="'안전회의록'" :key="dialogKey" :isUpdate="true" @close-dialog="closeDialog" @update="onUpdate" @delete="onDelete" @save="onSave" @print="onPrint">
        <div class="container">
            <div class="container__label-box">
                <span class="container__label-box__label">회의 정보</span>
            </div>
            <div class="container__content-box">
                <FormLabelField v-model="sceneName" :label="'공사명'" :disabled="true" />
                <FormLabelField v-model="writer" :label="'작성자'" :disabled="true" />
                <FormLabelField v-model="companyName" :label="'업체'" :disabled="true" />
                <FormLabelField v-model="regDate" :label="'작성일'" :disabled="true" />
                <FormSingleDatePicker v-model="meetingDate" label="회의일자" :required="true" :validation="validation.minutes_date" @remove="updateValidation" :disabled="!isEdit" />
                <FormDoubleTime
                    v-model:start-time="meetingStartTime"
                    v-model:end-time="meetingEndTime"
                    :label="'회의시간'"
                    :required="true"
                    :validation="validation.minutes_time"
                    @remove="updateValidation"
                    :disabled="!isEdit"
                />
            </div>
            <FormLabelField v-model="meetingTitle" :label="'회의명'" :required="true" :disabled="!isEdit" :validation="validation.minutes_type" @remove="updateValidation" />
            <!-- 회의내용 & 의결사항 -->
            <div class="table">
                <div class="table__header">
                    <div class="table__header__index" :style="{ width: `8%` }">NO</div>
                    <div class="table__header__menu" style="flex: 1">회의내용<span class="required-mark">*</span></div>
                    <div class="table__header__menu" style="flex: 1">의결사항</div>
                    <div class="table__header__menu" :style="{ width: `6%` }"></div>
                </div>
                <div class="table__body">
                    <div v-for="(item, index) in meetingData" :key="index" class="table__body__list-box">
                        <div class="list" :style="{ width: `8%` }">
                            {{ index + 1 }}
                        </div>
                        <div class="list" style="flex: 1">
                            <textarea
                                v-model="item.minutes_text"
                                class="text-area"
                                type="text"
                                placeHolder="회의내용을 입력하세요"
                                maxlength="100"
                                :class="{ disabled: !isEdit }"
                                :disabled="!isEdit"
                            />
                        </div>
                        <div class="list" style="flex: 1">
                            <textarea
                                v-model="item.minutes_resolution"
                                class="text-area"
                                type="text"
                                placeHolder="의결사항을 입력하세요"
                                maxlength="100"
                                :class="{ disabled: !isEdit }"
                                :disabled="!isEdit"
                            />
                        </div>
                        <div class="list" :style="{ width: `6%` }">
                            <div class="list__button-box">
                                <button class="list__button-box__button" style="color: #9d9d9c; outline: none; border: none; background: transparent; cursor: pointer" @click="remove(index)">
                                    삭제
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <button class="table__button" @click="addTableRow">
                    <img src="@assets/icons/add.svg" alt="" class="table__button__icon" />
                </button>
            </div>
        </div>
        <div class="container" style="margin-top: 20px">
            <FileTab :data="meetingAttendee" :photos="photos" @send-event="setFiles" @send-data="setAttendees" @delete-file="deleteFiles" :disabled="!isEdit" @open-select="openSelectWorkerDialog" />
        </div>
    </FormDialog>
</template>

<script setup lang="ts">
import FormDialog from "@components/common/layout/FormNewDialogLayout.vue"
import FormLabelField from "@components/common/form/input/LabelField.vue"
import FormSingleDatePicker from "@components/common/form/calendar/SingleDatePicker.vue"
import FormDoubleTime from "@components/common/form/calendar/DoubleTime.vue"
import FileTab from "./FileTab.vue"

import { ref } from "vue"
import { useStore } from "@stores/index"
import { toast } from "vue3-toastify"
import api from "@apis/selfApi"
import dayjs from "dayjs"
import { downLoadExcel } from "./downloadExcel.js"

interface Photo {
    file_name: string
    file_url: string
    full_name: string
    seq_no: number
}

const isEdit = ref<boolean>(false)
const dialogKey = ref<number>(0)

// Store 접근
const store = useStore()
const headerParams = store.headerParams

// 등록 시, 필요한 데이터
const sceneId = ref<number>(0) // 현장 ID
const sceneName = ref<string>("") // 공사명
const companyId = ref<number>(0) // 업체 ID
const companyName = ref<string>("") // 업체 이름
const writer = ref<string>("") // 작성자
const documentId = ref<number>(0) // 해당 문서 번호

const regDate = ref<string>(dayjs().format("YYYY-MM-DD")) // 작성일
const meetingDate = ref<string>("") // 회의일자
const meetingStartTime = ref<string>("") // 회의시작시간
const meetingEndTime = ref<string>("") // 회의종료시간

const meetingTitle = ref<string>("") // 회의명
const meetingData: any = ref([]) // 회의내용/의결사항 data list

const photos = ref<Photo[]>([]) // 첨부파일
const meetingAttendee = ref<any>([]) // 회의참석인원

// 파일 첨부에 필요한 기본 형태
const defaultFile = ref<any>({
    files: [],
    fileName: "minutes_file",
    file_json: {
        insert: [],
        update: [],
        delete: [],
    },
})

// 사진 첨부 및 삭제
const setFiles = (data: any[]) => {
    defaultFile.value.files = data
    console.log("register setFiles", data)
    let fileJson: any = { insert: [] }
    for (let i = 0; i < data.length; i++) {
        fileJson.insert.push({
            order_no: i,
            view_type: "safety-meeting",
        })
        defaultFile.value.file_json.insert = fileJson.insert
    }
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
}

// 참석인원 삭제
const setAttendees = (data: any) => {
    meetingAttendee.value = data
}

// 다이얼로그 닫기
const emit = defineEmits(["close-dialog", "open-select", "open-print", "send-data"])
const closeDialog = () => {
    emit("close-dialog", false)
    isEdit.value = false
    dialogKey.value++

    // 벨리데이션 초기화
    validation.value = {
        minutes_date: false,
        minutes_time: false,
        minutes_type: false,
        minutes_text: false,
    }

    // 데이터 초기화
    documentId.value = 0
    sceneName.value = ""
    companyId.value = 0
    companyName.value = ""
    writer.value = ""
    sceneId.value = 0
    regDate.value = ""
    meetingDate.value = ""
    meetingStartTime.value = ""
    meetingEndTime.value = ""
    meetingTitle.value = ""
    meetingData.value = []
    photos.value = []
    meetingAttendee.value = []
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

const openSelectWorkerDialog = (value: boolean) => {
    emit("open-select", value)
}

// 상세 데이터 조회
function getData(props: any) {
    // 안전회의록 삭제시 필요한 ID
    documentId.value = props.minutes_id

    let params = {
        minutes_id: props.minutes_id,
        scene_ids: JSON.stringify([1]),
    }
    params = Object.assign({}, params, headerParams)
    api.getMinutesData(params).then((res: any) => {
        try {
            const rsCode = res.data.rsCode
            const data = res.data.rsObj

            if (rsCode === 0) {
                sceneName.value = data.scene_name
                companyId.value = data.company_id
                companyName.value = data.company_name
                writer.value = data.user_name
                sceneId.value = data.scene_id
                regDate.value = data.reg_date
                meetingDate.value = data.minutes_date ?? dayjs(new Date()).format("YYYY-MM-DD")

                meetingStartTime.value = data.minutes_time.slice(0, 7)
                meetingEndTime.value = data.minutes_time.slice(7, 14)

                meetingTitle.value = data.minutes_type
                meetingData.value = data.minutes_detail

                meetingAttendee.value = data.minutes_attend
                photos.value = data.minutes_file_data ? JSON.parse(data.minutes_file_data) : []

                photos.value.forEach((item: any) => {
                    item.file_url = item.file_url + item.file_name
                })

                printData = data

                emit("send-data", meetingAttendee.value)
            }
        } catch (error) {
            console.log(error)
            toast.error(res.data.rsMsg)
        }
    })
}

// 수정(저장 & 등록)
function onSave() {
    let params = {
        scene_id: sceneId.value,
        company_id: companyId.value,
        minutes_id: documentId.value, // 안전회의록 ID
        minutes_time: meetingStartTime.value + meetingEndTime.value, //회의시간
        minutes_type: meetingTitle.value, // 회의종류

        minutes_date: meetingDate.value, // 회의날짜
        minutes_detail: JSON.stringify(meetingData.value),

        minutes_attend: JSON.stringify(meetingAttendee.value), // 회의참석자
        // 첨부파일
        files: defaultFile.value.files,
        fileName: "minutes_file",
        minutes_json: JSON.stringify(defaultFile.value.file_json),
    }
    params = Object.assign({}, params, headerParams)

    let valid = formValidation(params)

    if (valid) {
        api.updateMinutes(params).then((res: any) => {
            try {
                const rsCode = res.data.rsCode

                if (rsCode === 0) {
                    toast.success("수정을 완료하였습니다.")
                    closeDialog()
                }
            } catch (error) {
                console.log(error)
                toast.error(res.data.rsMsg)
            }
        })
    }
}

// 수정버튼 클릭
function onUpdate() {
    isEdit.value = true
}

// 삭제
function onDelete() {
    let params = {
        scene_ids: JSON.stringify([sceneId.value]),
        minutes_ids: JSON.stringify([documentId.value]),
    }
    params = Object.assign({}, params, headerParams)
    api.deleteMinutes(params).then((res: any) => {
        try {
            const rsCode = res.data.rsCode

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

// add meeitng table row
function addTableRow() {
    if (isEdit.value === false) return
    const row = {
        meetingContent: "",
        meetingResolution: "",
    }
    meetingData.value.push(row)
}

function remove(index: any) {
    if (meetingData.value.length === 1 || isEdit.value === false) return
    meetingData.value.splice(index, 1)
}

// 벨리데이션 데이터
const validation = ref<any>({
    minutes_date: false,
    minutes_time: false,
    minutes_type: false,
    minutes_text: false,
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
    if (label === "회의일자") validation.value.minutes_date = value
    if (label === "회의시간") validation.value.minutes_time = value
    if (label === "회의명") validation.value.minutes_type = value
    if (label === "회의내용") validation.value.minutes_text = value
}

function openDialog(value: any) {
    getData(value)
}

defineExpose({ meetingAttendee, openDialog })

// -------------------- 프린트 print dialog ----------------------------------------
let printData: any = {}
const onPrint = () => {
    let data = Object.assign({}, printData)
    downLoadExcel(data)
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

        gap: 18px 16px;
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
            flex-grow: 1;

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
            .text-area {
                width: 95%;
                min-height: 80px;
                height: 100%;
                display: block;
                padding: 5px;
                border: 1px solid $color-white-400;
                border-radius: 6px;
                resize: vertical;
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
</style>
