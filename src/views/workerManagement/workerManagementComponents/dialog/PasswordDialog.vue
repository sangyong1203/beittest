<template>
    <div class="container">
        <div class="container__layout">
            <div class="container__layout__label-box">
                <span class="label">비밀번호 변경</span>
                <button class="button">
                    <img class="button__image" src="@assets/icons/close.svg" alt="" @click="closeDialog" />
                </button>
            </div>
            <div class="container__layout__content-box">
                <div class="inform">
                    <span class="inform__name">{{ userName }}</span>
                    님의 새 비밀번호를 등록해주세요.
                </div>
            </div>
            <form class="container__layout__input-box">
                <PasswordField
                    v-model="curentPassword"
                    :label="'현재 비밀번호'"
                    :inputWidth="'424px'"
                    :required="true"
                    :validation="validation.auth_token"
                    :placeholder="'현재 비밀번호를 입력하세요.'"
                    @remove="updateValidation"
                    class="input"
                />
                <PasswordField
                    v-model="newPassword"
                    :label="'새 비밀번호'"
                    :inputWidth="'424px'"
                    :required="true"
                    :validation="validation.new_auth_token"
                    :placeholder="'새 비밀번호를 입력하세요.'"
                    @remove="updateValidation"
                />
                <PasswordField
                    v-model="confirmNewPassword"
                    :label="'비밀번호 확인'"
                    :inputWidth="'424px'"
                    :required="true"
                    :match="validation.match"
                    :not-match="validation.notMatch"
                    :placeholder="'변경할 비밀번호를 입력해주세요.'"
                    @remove="updateValidation"
                />
            </form>
            <span class="container__layout__alarm">* 신규근로자 비밀번호는 휴대폰 뒷 번호(4자리)로 설정되어 있습니다.</span>
            <div class="container__layout__button-box">
                <BasicButton :label="'비밀번호 초기화'" :theme="'cancel'" @click="initPassword" />
                <BasicButton :label="'변경하기'" :theme="'fill'" @click="changePassword" />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import BasicButton from '@components/common/button/BasicButton.vue'
import PasswordField from '@components/common/form/PasswordField.vue'

import { ref, toRefs } from 'vue'
import { useStore } from '@stores/index'
import { toast } from 'vue3-toastify'
import api from '@apis/selfApi'

interface Props {
    userName: string
    userId: number
}
const props = defineProps<Props>()
const { userName, userId } = toRefs(props)

const curentPassword = ref<string>('')
const newPassword = ref<string>('')
const confirmNewPassword = ref<string>('')

// 벨리데이션에 필요한 데이터
let validation:any = ref({
    target_id: false,
    auth_token: false,
    new_auth_token: false,
    check_new_auth_token: false,
    match: false,
    notMatch: false,
})

function formValidation(data: any): void {
    const validationKeys = Object.keys(validation.value)

    for (let key in data) {
        validationKeys.forEach((item) => {
            if (item === key && !data[key]) validation.value[key] = true
            if (item === key && data[key]) validation.value[key] = false
        })
    }
    if (confirmNewPassword.value && newPassword.value === confirmNewPassword.value) {
        validation.value.match = true
        validation.value.notMatch = false
    }
    if (confirmNewPassword.value && newPassword.value !== confirmNewPassword.value) {
        validation.value.match = false
        validation.value.notMatch = true
    }
}

function updateValidation(label: string, value: boolean) {
    if (label === '현재 비밀번호') {
        if (curentPassword.value.length > 0) {
            validation.value.auth_token = false
        } else {
            validation.value.auth_token = true
        }
    }
    if (label === '새 비밀번호') {
        if (newPassword.value.length > 0) {
            validation.value.new_auth_token = value
        } else {
            validation.value.match = false
            validation.value.notMatch = true
        }
    }
    if (label === '비밀번호 확인') {
        if (confirmNewPassword.value.length > 0) {
            if (newPassword.value === confirmNewPassword.value) {
                validation.value.match = true
                validation.value.notMatch = false
            } else {
                validation.value.match = false
                validation.value.notMatch = true
            }
        } else {
            validation.value.match = false
            validation.value.notMatch = true
        }
    }
}

const emit = defineEmits(['close-dialog'])
// 다이얼로그 닫기
const closeDialog = () => {
    emit('close-dialog', false)
}
// 비밀번호 변경하기
const changePassword = () => {
    const store = useStore()
    const headerParams = store.getHeaderParams

    let params = {
        // Required
        target_id: userId.value, // 변경 대상 유저 ID
        auth_token: curentPassword.value, // 기존 비밀번호
        new_auth_token: newPassword.value, // 변경할 비밀번호
    }
    params = Object.assign({}, params, headerParams)

    if (!validation.value.auth_token && validation.value.match) {
        api.changePassword(params).then((res) => {
            try {
                const rsCode = res.data.rsCode
                if (rsCode === 0) {
                    toast.success('비밀번호를 변경하였습니다.')
                    closeDialog()
                } else {
                    toast.warn('현재 비밀번호가 맞지 않습니다.')
                }
            } catch (error) {
                console.log(error)
                toast.warn('알 수 없는 에러가 발생했습니다.')
            }
        })
    } else {
        formValidation(params)
    }
}

const initPassword = () => {
    const store = useStore()
    const headerParams = store.getHeaderParams

    let params = {
        target_id: userId.value,
    }
    params = Object.assign({}, params, headerParams)

    api.postResetPassword(params).then((res) => {
        try {
            const rsCode = res.data.rsCode
            if (rsCode === 0) {
                toast.success('비밀번호를 초기화 하였습니다.')
                closeDialog()
            }
        } catch (error) {
            console.log(error)
            toast.warn('알 수 없는 에러가 발생했습니다.')
        }
    })
}
</script>

<style lang="scss" scoped>
@import '@assets/styles/main.scss';

.container {
    display: flex;
    align-items: center;
    justify-content: center;

    width: 100%;
    height: 100%;

    background-color: rgba($color-black-900, 0.5);

    z-index: 3;

    &__layout {
        display: flex;
        flex-direction: column;
        align-items: flex-end;

        width: 572px;

        padding: 30px 40px;

        background-color: $color-white-000;
        border-radius: 6px;

        &__label-box {
            display: flex;
            align-items: center;
            justify-content: space-between;

            width: calc(100% - 10px);

            padding: 0 0 10px 10px;

            border-bottom: 1px solid $color-white-400;

            .label {
                font-weight: 700;
                font-size: 19px;
                line-height: 23px;
            }
            .button {
                outline: none;
                border: none;
                background: transparent;

                width: 20px;
                height: 20px;

                cursor: pointer;
            }
        }
        &__content-box {
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            justify-content: center;

            width: 100%;

            .inform {
                display: flex;
                align-items: center;

                padding: 24px 10px;

                font-size: 17px;
                line-height: 20px;

                &__name {
                    font-weight: 700;
                    font-size: 17px;
                    line-height: 20px;

                    margin-right: 4px;
                }
            }
        }
        &__input-box {
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            justify-content: center;

            width: 100%;
            gap: 24px;

            .input {
                flex-grow: 1;
            }
        }
        &__alarm {
            display: flex;
            align-items: center;
            justify-content: flex-start;

            width: 100%;

            margin: 28px 0;

            color: $color-red-000;
        }
        &__button-box {
            display: flex;
            align-items: center;

            width: 100%;
            align-items: center;
            justify-content: flex-end;

            gap: 12px;
        }
    }
}
</style>
