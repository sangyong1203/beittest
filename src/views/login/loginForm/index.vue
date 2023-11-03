<template>
    <div class="form">
        <div class="form__title">
            <img src="@assets/images/logo_doosan.png" alt="" class="form__title__image" />
            <!-- <span class="form__title__text">안전에 스마트를 더하다</span> -->
        </div>
        <div class="form__input-box">
            <FormID v-model="ID_InputValue" :label="'아이디'" :inputWidth="'400px'" :validation="false" @keydown.enter="login" />
            <FormPassword v-model="PASSWORD_InputValue" :label="'비밀번호'" :inputWidth="'400px'" :validation="false" @keydown.enter="login" />
            <div class="form__check-box">
                <input type="checkbox" class="form__check-box__input" @click="saveId" />
                아이디 저장
            </div>
            <div class="form__button-box">
                <el-button class="button-blue" @click="login">로그인<img :src="loginIcon" alt=""></el-button>
                <el-button class="button-white" @click="openDialog">아이디 찾기<img :src="searchIconBlue" alt=""></el-button>
            </div>
        </div>
        <div class="form__button-box">
            <span class="policy">
                <a link href="https://wpgumi.com/api/upload/policy/서비스이용약관.html" target="_blank">시스템 이용약관</a> 
                ㅣ
                <a link href="https://wpgumi.com/api/upload/policy/개인(위치)정보처리방침.html" target="_blank">개인정보처리방침</a> 
            </span>
        </div>
    </div>
    <!-- 아이디 찾기 다이얼로그 -->
    <DialogIdSearch class="form__search-dialog" :class="{ active: isVisible }" @close-dialog="closeDialog" />
    <ComfirmPopup
        class="form__comfirm-dialog"
        :class="{ active: isComfirm }"
        :message="'이미 로그인된 다른 기기가 있습니다. 이 기기에서 로그인하면 다른 기기는 자동으로 로그아웃 됩니다. 정말 로그인하시겠습니까??'"
        @cancel="confirmCancel"
        @confirm="confirmOK"
    />
</template>

<script setup lang="ts">
import FormID from "../components/input.vue"
import FormPassword from "../components/Password.vue"
import DialogIdSearch from "./dialog/dialogIdSearch.vue"
import ComfirmPopup from "@components/common/layout/ComfirmPopup.vue"
import api from "@apis/selfApi"
import loginIcon from "@assets/icons/login.svg"
import searchIconBlue from "@assets/icons/search_blue.svg"


import { ref } from "vue"
import { useRouter } from "vue-router"
import { useStore } from "@stores/index"
import { toast } from "vue3-toastify"

// 아이디 찾기 다이얼로그 열기 및 닫기
const isVisible = ref<boolean>(false)
const isComfirm = ref<boolean>(false)

const openDialog = (): boolean => {
    return (isVisible.value = true)
}
const closeDialog = (event: boolean): boolean => {
    return (isVisible.value = event)
}


const ID_InputValue = ref<string | null>("")
const PASSWORD_InputValue = ref<string | null>("")

// 저장된 id 나 password가 있으면 자동 입력
ID_InputValue.value = localStorage.getItem("westernpower_auth_id")
PASSWORD_InputValue.value = localStorage.getItem("westernpower_auth_token")

// 아이디 저장
const isSaveId = ref<boolean>(false)
const saveId = (event: any) => {
    isSaveId.value = event.target.checked
}

// platform_key 만들기
const makeKey = (length: number) => {
    let result = ""
    let characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
    let charactersLength = characters.length

    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength))
    }
    return result
}

const login = () => {
    const id = ID_InputValue.value
    const password = PASSWORD_InputValue.value

    if (!id) {
        toast.warn("아이디를 입력하세요.")
        return
    } else if (!password) {
        toast.warn("비밀번호를 입력하세요.")
        return
    } else {
        // 아이디 저장 체크상태시 id 및 password 저장
        if (isSaveId.value) {
            localStorage.setItem("westernpower_auth_id", ID_InputValue.value ?? "")
            localStorage.setItem("westernpower_auth_token", PASSWORD_InputValue.value ?? "")
            console.log("Saved", localStorage.getItem("westernpower_auth_id"), localStorage.getItem("westernpower_auth_token"))
        }

        // 로그인 성공 Server에서 로그인 후 받는 정보 어떤걸 Session에 저장할지
        // 협의 후 Store에 저장할 것
        let key = window.localStorage.getItem("uuid")

        if (key == null || key == undefined) {
            window.localStorage.setItem("uuid", makeKey(20))
            key = window.localStorage.getItem("uuid")
        } else {
            key = window.localStorage.getItem("uuid")
        }

        const params = {
            platform_type: 3,
            platform_key: key,
            user_id: id,
            scene_id: 1,
            auth_id: id,
            auth_token: password,
            auth_type: 1,
        }

        api.userLoginPortal(params).then((res: any) => {
            const rsCode = res.data.rsCode
            const data = res.data.rsObj

            if (rsCode === 0) {
                if (data.user_data.user_permission == null) {
                    toast.warn("권한이 없습니다.")
                    return
                }

                let params = Object.assign({}, data.user_data, {
                    platform_type: 3,
                    platform_key: key,
                })

                const store = useStore()
                store.setLoginData(params)

                store.setHeaderParams()
                console.log("stroe header", store.headerParams)

                moveToPage()
            } else if (rsCode === 1002) {
                toast.error("중복 로그인이 감지되어 다시 로그인해주세요")
            } else {
                toast.error("계정정보가 맞지 않습니다.")
            }
        })
    }
}
// 페이지 라우팅
const router = useRouter()
const moveToPage = () => {
    router.push({ name: "dashboard" })
    // router.push({ name: "safefyEducation" })

}
const confirmCancel = () => {
    // alert("confirmCancel")
}
const confirmOK = () => {
    // alert("confirmOK")
}
</script>

<style lang="scss" scoped>
@import "@assets/styles/main.scss";

.form {
    position: relative;

    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    padding: 80px;

    border-radius: 28px;
    background-color: $color-white-000;
    box-shadow: 0px 5px 20px rgba(0, 0, 0, 0.05);


    &__title {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;

        width: 100%;

        gap: 16px;

        &__image {
            width: 300px;
        }
        &__text {
            font-weight: 600;
            font-size: 20px;
            line-height: 24px;

            color: #9d9d9d;

        }
    }
    &__input-box {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;

        gap: 18px;
        margin-top: 25px;
    }
    &__check-box {
        display: flex;
        justify-content: flex-start;

        width: 100%;

        gap: 8px;


        &__input {
            width: 18px;
            height: 18px;
        }
    }
    &__button-box {
        display: flex;
        align-items: center;
        width: 100%;

        gap: 20px;
        margin-top: 20px;
        justify-content: center;
    }
    &__search-dialog {
        display: none;

        &.active {
            position: absolute;

            top: 0;
            left: 0;
            right: 0;
            bottom: 0;

            display: flex;
        }
    }

    &__comfirm-dialog {
        display: none;
        &.active {
            position: absolute;

            top: 0;
            left: 0;
            right: 0;
            bottom: 0;

            display: flex;
        }
    }
    .policy, a {
        font-weight: 400;
        font-size: 14px;
        line-height: 25px;
        text-align: right;

        color: $color-white-600;
    
    }
}
</style>
