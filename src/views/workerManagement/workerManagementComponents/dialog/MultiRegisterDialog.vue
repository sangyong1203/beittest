<template>
    <FormDialog :title="'근로자 일괄 등록'" class="dialog" @submit="onSubmit" @close-dialog="closeDialog">
        <div class="header">
            <FormDropdown v-model="companyId" :label="'업체'" :label-width="'60px'" :required="true" :placeholder="'선택'" :data="companyList" @send-data="selectedCompany" />
            <div class="repeat" v-if="repeatedIds.length > 0">
                중복된 아이디 :
                 <div>
                    <span v-for="item in repeatedIds">{{ item }}</span>
                </div>
            </div>
        </div>
        <div class="table">
            <div class="table__header">
                <div class="table__header__index" :style="{ width: `10%` }">NO</div>
                <div v-for="item in menuList" class="table__header__menu">{{ item }}</div>
                <div class="table__header__index" :style="{ width: `10%` }"></div>
            </div>
            <div class="table__body">
                <div v-if="workerList.length === 0" class="table__body__no-data">근로자를 등록해주세요.</div>
                <div class="table__body__list">
                    <!-- 테이블 추가 버튼 눌렀을 때, 추가되는 테이블 Row -->
                    <div v-for="(item, index) in workerList" :key="index" class="column">
                        <div class="column__item" :style="{ width: `10%` }">{{ index + 1 }}</div>
                        <div class="column__item">
                            <input v-model="item.user_name" type="text" @input="autoAddId(item)" :placeholder="'성명을 입력해주세요.'" class="column__item__input" />
                        </div>
                        <div class="column__item">
                            <input v-model="item.auth_id" type="text" :placeholder="'아이디를 입력해주세요.'" class="column__item__input" @keyup="getCharacterCheck(item.auth_id, index)" />
                        </div>
                        <div class="column__item">
                            <input
                                v-model="item.user_phone"
                                type="text"
                                :placeholder="'숫자만 입력해주세요.'"
                                maxlength="13"
                                class="column__item__input"
                                @input="getPhoneReg(item.user_phone, index)"
                            />
                        </div>
                        <div class="column__item" :style="{ width: `10%` }">
                            <BasicButton :label="'삭제'" :theme="'delete'" @click="deleteRow(index)" />
                        </div>
                    </div>
                </div>
                <button class="table__body__button" @click="addTable">
                    <img src="@assets/icons/add.svg" alt="" class="icon" />
                </button>
            </div>
        </div>
        <div class="warning">
            ※ 암호는 0000로 설정됩니다.
            <br />
            근로자는 App 마이페이지에서 비밀번호를 포함하여 개인정보를 수정할 수 있도록 안내가 필요합니다.
        </div>
    </FormDialog>
</template>

<script setup lang="ts">
import FormDialog from "@components/common/layout/FormDialogLayout.vue"
import FormDropdown from "@components/common/form/dropdown/Dropdown.vue"
import BasicButton from "@components/common/button/BasicButton.vue"
import api from "../selfApi"

import { ref } from "vue"
import { useStore } from "@stores/index"
import { toast } from "vue3-toastify"

interface WorkerList {
    user_name: string
    auth_id: string
    user_phone: string
    // ctgo_nation_id: number

    [prop: string]: any
}

// Store에서 카테고리 불러오기
const store = useStore()

const emit = defineEmits(["close-dialog"])

const companyList: any[] = store.getCompanyList

const companyName = ref<string>("") // 업체 이름
const companyId = ref<number>(0) // 업체 ID
const menuList = ["성명", "아이디", "연락처"] // 테이블 메뉴 리스트
// 건강검진 테이블 추가
const workerList = ref<WorkerList[]>([]) // 건강검진 리스트
const repeatedIds:any = ref([])

const addTable = () => {
    const item = {
        user_name: "", // 성명
        auth_id: "", // 아이디
        user_phone: "", // 연락처
    }
    workerList.value.push(item)
}
const getPhoneReg = (phoneNumber: string, index: number) => {
    const res = phoneNumber.replace(/[^0-9]/g, "").replace(/^(\d{2,3})(\d{3,4})(\d{4})$/, `$1-$2-$3`)
    workerList.value[index].user_phone = res
}
const getCharacterCheck = (authId: string, index: number) => {
    // 특수문자, 괄호, 점, 공백 모두 제거
    const regExp = /[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/ ]/gim
    //정규식에 해당하는 문자를 replace 로 제거
    const res = authId.replace(regExp, "")
    workerList.value[index].auth_id = res
}
const selectedCompany = (value: any) => {
    companyId.value = value.id
}

const deleteRow = (index: number) => {
    workerList.value.splice(index, 1)
}

const autoAddId = ( item: any ) => {
    item.auth_id = item.user_name
}

const hasEmptyFields = () => {
    return Object.values(workerList.value).every((item: any) => item.user_name !== "" && item.auth_id !== "" && item.user_phone !== "")
}

const closeDialog = () => {
    emit("close-dialog", false)
}

// 등록
const onSubmit = () => {
    const store = useStore()
    const headerParams = store.getHeaderParams
    const userDatas = workerList.value

    if (hasEmptyFields() === true && userDatas.length > 0) {
        let params = {
            scene_id: JSON.stringify([1]),
            company_id: companyId.value,
            user_datas: JSON.stringify(workerList.value),
        }
        params = Object.assign({}, params, headerParams)

        if (companyId.value === 0) {
            toast.warn("업체를 입력해주세요")
        } else {
            api.postWorkerBatch(params).then((res) => {
                try {
                    const rsCode = res.data.rsCode

                    if (rsCode === 0) {
                        toast.success("근로자 등록에 성공하였습니다.")
                        closeDialog()
                    } else if(res.data.rsMap) {
                        toast.error("중복된 아이디가 있습니다.")
                        let data = res.data.rsMap
                        let arr: any = []
                        data.forEach( (item:any) => {
                            arr.push(item.auth_id)
                        })
                        repeatedIds.value = arr

                    }
                } catch (error) {
                    console.log(error)
                    toast.warn(res.data.rsMsg)
                }
            })
        }
    } else {
        toast.warn("등록되지 않은 항목이 있습니다.")
    }
}
</script>

<style lang="scss" scoped>
@import "@assets/styles/main.scss";

.header {
    display: flex;
    align-items: flex-start;
    flex-direction: column;

    padding-left: 10px;
    margin-bottom: 20px;
    .repeat{
        padding: 20px 10px 0px 10px;
        color: #de3e47;
        line-height: 25px;
        span{
            margin-right: 20px;
            color: #de3e47;
        }
    }
}
.table {
    display: flex;
    flex-direction: column;
    align-items: center;

    width: 100%;

    &__header {
        display: flex;
        align-items: center;

        width: 100%;
        height: 50px;

        border-top: 1px solid $color-white-300;
        border-bottom: 1px solid $color-white-300;

        background-color: $color-white-100;

        &__index {
            display: flex;
            align-items: center;
            justify-content: center;

            width: 10%;
            height: 100%;
        }
        &__menu {
            display: flex;
            align-items: center;
            justify-content: center;

            width: 30%;
            height: 100%;
        }
    }
    &__body {
        display: flex;
        flex-direction: column;
        align-items: center;

        width: 100%;
        height: 380px;

        &__list {
            width: 100%;
            max-height: 308px;

            overflow-y: scroll;

            // /* Hide scrollbar for IE, Edge and Firefox */
            -ms-overflow-style: none; /* IE and Edge */
            scrollbar-width: none; /* Firefox */

            // /* Hide scrollbar for Chrome, Safari and Opera */
            &::-webkit-scrollbar {
                display: none;
            }

            .column {
                display: flex;
                align-items: center;

                width: 100%;
                height: 50px;

                gap: 8px;

                border-bottom: 1px solid $color-white-300;

                &__item {
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

                    &__icon {
                        height: 2.25rem;
                        cursor: pointer;
                    }

                    &:first-child {
                        margin-right: 4px;
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
    }
}
.warning {
    margin-bottom: 20px;

    color: $color-red-000;
    font-size: 17px;
    line-height: 20px;
}
</style>
../selfApi