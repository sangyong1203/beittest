<template>
    <ID_Dialog :title="'아이디 찾기'" @close-dialog="closeDialog" @save="onSubmit">
        <div class="container">
            <div class="container__inform">
                회원가입 시 등록한 이름과 전화번호를 통하여<br />
                회원님의 아이디를 찾을 수 있습니다.
            </div>
            <FormLabelField v-model="userName" :label="'이름'" :validation="validation.user_name" @remove="updateValidation" />
            <FormLabelField v-model="userPhone" :label="'휴대전화'" :validation="validation.user_phone" :isNumber="true" @remove="updateValidation" />
            <div v-if="showResult" class="container__result">
                <div class="container__result__title">아이디 찾기 결과</div>
                <div class="container__result__info-box">
                    <div v-if="result[0] && result[0].auth_id !== ''" v-for="item in result">
                        <span>ID: {{ item.auth_id }}</span> <br />
                        <span>User Type: {{ item.user_type }}</span>
                    </div>
                    <div v-else>
                        <span class="container__result__noinfo"> ※ 일치하는 회원정보가 없습니다. 입력하신 내용을 다시 확인해주세요. </span>
                    </div>
                </div>
            </div>
            <div class="container__button-box">
                <BasicButton v-if="isSearch" :label="'아이디 찾기'" :theme="'fill'" @click="onSubmit" />
                <BasicButton v-else :label="'확인'" :theme="'fill'" @click="closeDialog" />
            </div>
        </div>
    </ID_Dialog>
</template>

<script setup lang="ts">
import BasicButton from "@components/common/button/BasicButton.vue"
import FormLabelField from "@components/common/form/input/LabelField.vue"
import ID_Dialog from "@components/common/layout/dialog/ID_Dialog.vue"

import { ref } from "vue"
import { toast } from "vue3-toastify"
import api from "@apis/selfApi"

const userName = ref<string>("")
const userPhone = ref<string>("")
const isSearch = ref<boolean>(true)
const result = ref<any>([])
const showResult = ref<boolean>(false)

function onSubmit() {
    let params = {
        platform_key: makeKey(20),
        platform_type: 3,
        user_name: userName.value,
        user_phone: userPhone.value?.replace(/[^0-9]/g, ""),
    }

    let valid = formValidation(params)
    if (valid) {
        api.findAuthId(params).then((res) => {
            if (res && res.data?.rsCode === 0) {
                result.value = res.data.rsMap
                showResult.value = true

                if (result.value?.length > 0) {
                    toast.success(`ID ${result.value?.length}건을 찾았습니다.`)
                } else {
                    toast.warn(`ID 정보가 없습니다.`)
                }
            }
        })
    } else {
        return
    }
}

// PLATFORM_KEY 만들기
const makeKey = (length: number) => {
    let result = ""
    let characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
    let charactersLength = characters.length

    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength))
    }
    return result
}

// VALIDATION CHECK
const validation: any = ref({
    user_name: false,
    user_phone: false,
})
function formValidation(data: any) {
    let valid = true
    const validationKeys = Object.keys(validation.value)

    for (let key in data) {
        validationKeys.forEach((item) => {
            if (item === key) {
                if (data[key] === "" || data[key] === null || data[key] === undefined) {
                    validation.value[key] = true
                    valid = false
                } else if (key === "files" && data[key].length === 0) {
                    validation.value[key] = true
                    valid = false
                }
            }
        })
    }
    return valid
}

function updateValidation(label: string, value: boolean) {
    if (label === "이름") validation.value.user_name = value
    if (label === "휴대전화") validation.value.user_phone = value
}

const emit = defineEmits(["close-dialog"])
// 다이얼로그 닫기
const closeDialog = () => {
    emit("close-dialog", false)

    userName.value = ""
    userPhone.value = ""
    isSearch.value = true
    result.value = []
    showResult.value = false
}
</script>

<style lang="scss" scoped>
@import "@assets/styles/main.scss";

.container {
    display: flex;
    width: 100%;
    flex-wrap: wrap;
    justify-content: space-between;
    flex-direction: column;
    width: 494px;

    &__inform {
        margin-left: 10px;
        margin-top: 5px;
        margin-bottom: 20px;
        line-height: 24px;
        font-size: 17px;
    }
    &__button-box {
        display: flex;
        justify-content: flex-end;
    }
    &__result {
        height: 150px;
        transition: all 0.5s ease-in-out;

        &__title {
            font-weight: 700;
            margin: 10px;
        }
        &__inform {
            margin-left: 10px;
            margin-top: 5px;
            margin-bottom: 20px;
            line-height: 24px;
            font-size: 17px;
        }
        &__info-box {
            min-height: 82px;
            background-color: #f6f7f9;
            border-radius: 6px;
            margin-bottom: 25px;
            padding: 14px 12px;
            box-sizing: border-box;
            display: flex;
            flex-direction: column;
            justify-content: center;

            div {
                margin: 8px 0;
            }
        }
        &__noinfo {
            color: #de3e47;
            display: block;
            transition: all 0.5s ease-in-out;
        }
    }
}
:deep(.dialog-layout__body) {
    min-width: unset !important;
    min-height: 220px !important;
}
:deep(.dialog-layout__footer) {
    display: none !important;
}
:deep(.label-textField) {
    margin-bottom: 20px;
}
:deep(.label-textField__label-box) {
    display: none;
}
:deep(.label-textField__validation) {
    left: 10px !important;
}
</style>
