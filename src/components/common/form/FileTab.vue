<template>
    <div class="file">
        <div class="file__tab">
            <button class="file__tab__button" :class="{ active: isEduActive }" @click="getEduData">교육이력</button>
            <button class="file__tab__button" :class="{ active: isHealthActive }" @click="getHealthData">건강검진</button>
        </div>
        <!-- 교육이력 버튼 눌렀을 때 -->
        <div v-if="isEduActive" class="file__table">
            <span class="file__table__label">교육 이수 현황</span>
            <div class="file__table__header">
                <div class="index" :style="{ width: `10%` }">NO</div>
                <div v-for="item in menuList" class="menu">{{ item }}</div>
            </div>
            <div v-if="!userEduData.length">
                <div class="file__table__no-data">교육이력이 없습니다.</div>
            </div>
            <div v-else>
                <div v-for="(item, index) in userEduData" :key="item.education_id" class="file__table__body">
                    <div class="column" :style="{ width: `10%` }">{{ index + 1 }}</div>
                    <div class="column">{{ item.education_class_name }}</div>
                    <div class="column">{{ item.education_date }}</div>
                    <div class="column">{{ item.education_time }}</div>
                </div>
            </div>
            <!-- 파일 첨부 -->
            <FileUpload :label="isEduLabel" :data="userEduFiles" :disabled="disabled" @send-eduFile="sendEduFile" @delete-eduFile="deleteEduFile" />
        </div>
        <!-- 건강검진 버튼 눌렀을 때 -->
        <div v-else class="file__table">
            <span class="file__table__label">건강 검진 현황</span>
            <div class="file__table__header">
                <div class="index" :style="{ width: `10%` }">NO</div>
                <div v-for="item in menuList" class="menu">{{ item }}</div>
                <div :style="{ width: `10%` }"></div>
            </div>
            <div v-if="!userHealthData.length">
                <div v-if="examinationList.length === 0" class="file__table__no-data">검진이력이 없습니다.</div>
                <!-- 테이블 추가 버튼 눌렀을 때, 추가되는 테이블 Row -->
                <div v-for="(item, index) in examinationList" :key="index" class="file__table__body">
                    <div class="column" :style="{ width: `10%` }">{{ index + 1 }}</div>
                    <div class="column">
                        <input v-model="item.health_type" type="text" :placeholder="'검진유형을 입력해주세요.'" class="column__input" />
                    </div>
                    <div class="column">
                        <input v-model="item.health_date" @input="getDateReg(item)" type="text" maxlength="10" :placeholder="'예) 20230101'" class="column__input" />
                    </div>
                    <div class="column">
                        <input v-model="item.health_etc" type="text" :placeholder="'특이사항을 입력해주세요.'" class="column__input" />
                    </div>
                    <div class="column" :style="{ width: `10%` }">
                        <div class="button-box" >
                            <button class="button-box__button"  @click="removeRow(examinationList, index)">삭제</button>
                        </div>
                    </div>
                </div>
                <button class="file__table__button" @click="addTable">
                    <img src="@assets/icons/add.svg" alt="" class="icon" />
                </button>
            </div>
            <div v-else>
                <div v-for="(item, index) in userHealthData" :key="item.health_type" class="file__table__body">
                    <div class="column" :style="{ width: `10%` }">{{ index + 1 }}</div>
                    <div class="column" style="margin-left: -20px">{{ item.health_type }}</div>
                    <div class="column">{{ item.health_date }}</div>
                    <div class="column">{{ item.health_etc }}</div>
                    <div class="column" :style="{ width: `10%` }">
                        <div class="button-box" >
                            <button class="button-box__button"  @click="removeRow(userHealthData, index)">삭제</button>
                        </div>
                    </div>
                </div>
                <!-- 테이블 추가 버튼 눌렀을 때, 추가되는 테이블 Row -->
                <div v-for="(item, index) in examinationList" :key="index" class="file__table__body">
                    <div class="column" :style="{ width: `10%` }">{{ userHealthData.length + 1 }}</div>
                    <div class="column">
                        <input v-model="item.health_type" type="text" :placeholder="'검진유형을 입력해주세요.'" class="column__input" />
                    </div>
                    <div class="column">
                        <input v-model="item.health_date" @input="getDateReg(item)"  type="text" :placeholder="'예) 20230101'" maxlength="10" class="column__input" />
                    </div>
                    <div class="column">
                        <input v-model="item.health_etc" type="text" :placeholder="'특이사항을 입력해주세요.'" class="column__input" />
                    </div>
                    <div class="column" :style="{ width: `10%` }">
                        <div class="button-box" >
                            <button class="button-box__button"  @click="removeRow(examinationList, index)">삭제</button>
                        </div>
                    </div>
                </div>
                <button class="file__table__button" @click="addTable">
                    <img src="@assets/icons/add.svg" alt="" class="icon" />
                </button>
            </div>
            <!-- 파일 첨부 -->
            <FileUpload :label="isHealthLabel" :data="userHealthFiles" :disabled="disabled" @send-healthFile="sendHealthFile" @delete-healthFile="deleteHealthFile" />
        </div>
    </div>
</template>

<script setup lang="ts">
import FileUpload from "@components/common/form/file/upload.vue"

import { onMounted, ref, toRefs, watch } from "vue"

interface ExaminationList {
    health_type: string
    health_date: string
    health_etc: string

    [prop: string]: any
}
interface File {
    content_type: string
    file_name: string
    file_size: string
    file_type: string
    file_url: string
    file_url_full: string
    order_no: number
    seq_no: number
    user_id: number
    view_type: string

    [prop: string]: any
}
interface Props {
    userEduData: any[]
    userEduFiles: File[]
    userHealthData: any[]
    userHealthFiles: File[]
    disabled: boolean
}
const props = defineProps<Props>()
const { userEduData, userHealthData, disabled, userEduFiles, userHealthFiles } = toRefs(props)

// 교육이력 및 건강검진 라벨에 따른 테이블 헤더 메뉴 리스트 분기 처리
const isEduActive = ref<boolean>(true)
const isHealthActive = ref<boolean>(false)
const isEduLabel = ref<string>("교육이력")
const isHealthLabel = ref<string>("건강검진")

const menuList = ref()
const eduMenu = ["교육종류", "교육 이수일", "교육 이수 시간"]
const healthMenu = ["검진유형", "검진일", "특이사항"]

const getData = () => {
    if (isEduActive.value === true) menuList.value = eduMenu
    if (isHealthActive.value === true) menuList.value = healthMenu
}

// 버튼 클릭으로 인한 분기처리
const getEduData = (): void => {
    isEduActive.value = true
    isHealthActive.value = false
    getData()
}
const getHealthData = (): void => {
    isEduActive.value = false
    isHealthActive.value = true
    getData()
}

// 건강검진 테이블 추가
const examinationList = ref<ExaminationList[]>([]) // 건강검진 리스트
const addTable = () => {
    if (!disabled.value) {
        const item = {
            health_type: "", // 검진유형
            health_date: "", // 검진일
            health_etc: "", // 특이사항
        }
        examinationList.value.push(item)
    } else {
        return
    }
}

// 건강검진현황 row 삭제
const removeRow = ( data: any, index: number ) => {
    console.log("data",data)
    if(disabled.value) return
    data.splice(index, 1)
}

// 교육이력 파일첨부 및 파일삭제
const emit = defineEmits(["send-event", "send-eduFile", "delete-eduFile", "send-healthFile", "delete-healthFile"])
const sendEduFile = (data: any) => {
    emit("send-eduFile", data)
}
const deleteEduFile = (data: any) => {
    emit("delete-eduFile", data)
}
// 건강검진 파일첨부 및 파일삭제
const sendHealthFile = (data: any) => {
    emit("send-healthFile", data)
}
const deleteHealthFile = (data: any) => {
    emit("delete-healthFile", data)
}

const getDateReg = (item: any) => {
    const res = item.health_date.replace(/[^0-9]/g, "").replace(/^(\d{4})(\d{2})(\d{2})$/, `$1.$2.$3`)
    item.health_date = res
}
watch(examinationList.value, () => {
    emit("send-event", examinationList.value)
})

onMounted(() => {
    getEduData()
})
</script>

<style lang="scss" scoped>
@import "@assets/styles/main.scss";

.file {
    display: flex;
    flex-direction: column;

    width: 100%;

    margin-top: 24px;

    &__tab {
        display: flex;

        border-bottom: 1px solid $color-white-400;

        &__button {
            display: flex;
            flex-direction: row;
            align-items: flex-start;

            padding: 16px 12px;

            font-weight: 600;
            font-size: 19px;
            line-height: 23px;

            color: $color-white-500;

            outline: none;
            border: none;
            background: transparent;

            cursor: pointer;

            &.active {
                color: $color-blue-850;
                border-bottom: 1px solid $color-blue-850;
            }
        }
    }
    &__table {
        display: flex;
        flex-direction: column;

        width: 100%;

        &__label {
            padding-left: 12px;
            margin: 20px 0;

            font-weight: 600;
            font-size: 19px;
            line-height: 23px;
        }
        &__header {
            display: flex;
            align-items: center;

            width: 100%;
            height: 50px;

            border-top: 1px solid $color-white-300;
            border-bottom: 1px solid $color-white-300;

            background-color: $color-white-100;

            .index {
                display: flex;
                align-items: center;
                justify-content: center;

                width: 10%;
                height: 100%;
            }
            .menu {
                display: flex;
                align-items: center;
                justify-content: center;

                width: 30%;
                height: 100%;
            }
        }
        &__body {
            display: flex;
            align-items: center;

            width: 100%;
            height: 50px;

            gap: 8px;

            border-bottom: 1px solid $color-white-300;

            .column {
                display: flex;
                align-items: center;
                justify-content: center;

                width: 30%;
                height: 50px;

                &__input {
                    display: flex;
                    align-items: center;
                    justify-content: center;

                    width: 100%;
                    height: 2.25rem;

                    padding: 0 10px;

                    background: $color-white-000;
                    border: 1px solid $color-white-400;
                    border-radius: 6px;

                    &::placeholder {
                        color: $color-white-500;
                    }
                }
                &:first-child {
                    margin-right: 16px;
                }
                .button-box {
                    display: flex;
                    align-items: center;
                    &__button {
                        color: #9d9d9c;
                        outline: none;
                        border: none;
                        background: transparent;

                        cursor: pointer;
                    }
                    
                }
            }
        }
        &__button {
            display: flex;
            align-items: center;
            justify-content: center;

            width: 100%;
            height: 48px;

            padding: 12px;
            margin-top: 6px;

            background-color: $color-white-050;

            outline: none;
            border: none;
            border-radius: 6px;

            cursor: pointer;

            .icon {
                width: 20px;
                height: 20px;
            }
        }
        &__no-data {
            display: flex;
            align-items: center;
            justify-content: center;

            width: 100%;
            height: 50px;

            color: $color-white-450;
            background-color: $color-white-000;
            border-bottom: 1px solid $color-white-200;
        }
        &__insert {
            display: flex;
            flex-direction: column;
            align-items: flex-start;

            width: 100%;

            margin-top: 24px;
            gap: 12px;

            .button-box {
                display: flex;
                align-items: center;

                padding-left: 12px;
                gap: 24px;

                &__label {
                    font-weight: 600;
                    font-size: 19px;
                    line-height: 23px;
                }
            }
            .file-box {
                display: flex;
                align-items: center;
                flex-wrap: wrap;

                gap: 12px;

                &__list {
                    display: flex;
                    align-items: center;
                    justify-content: center;

                    padding: 12px;
                    gap: 12px;

                    background-color: $color-white-050;
                    border-radius: 6px;

                    &__name {
                        &:hover {
                            text-decoration: underline;
                        }
                        cursor: pointer;
                    }
                    &__button {
                        outline: none;
                        border: none;

                        width: 20px;
                        height: 20px;

                        background: transparent;

                        cursor: pointer;
                    }
                }
            }
        }
    }
}
</style>
