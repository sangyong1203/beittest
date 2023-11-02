<template>
    <div class="page">
        <div class="page__section page-text-box">
            <div class="page__section__text-box">
                <img src="@assets/images/GSIL_white.svg" alt="" class="gsil-logo" />
                <span class="title">Smart Safety System</span>
                <div class="sub-title">
                    <span class="sub-title__text">안전에 스마트를 더하다,</span>
                    <span class="sub-title__text">지에스아이엘 스마트 안전 솔루션 
                        <img src="@assets/images/beitLogo.png" alt="" class="beit-logo" />에 
                    </span>
                    <span class="sub-title__text">오신 것을 환영합니다.</span>
                </div>
            </div>
        </div>
        <div class="page__section login-form">
            <LoginForm />
        </div>
    </div>
</template>

<!-- 이름 수정할 때 - 한글 / 영어 / 숫자만 입력되도록 설정한다. -->
<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import LoginForm from './loginForm/index.vue'
import { toast } from 'vue3-toastify'
import loginsound from "@assets/audio/loginsound.mp3"
import { useStore } from "@stores/index"

const store = useStore()


onMounted(() => {
    store.setMenuOpen(false)
    const router = useRouter()
    if (router.currentRoute.value.query.showAlert === 'true') {
        toast.warn('다른기기에서 로그인했습니다. 로그아웃 됩니다.')
        const { showAlert, ...query } = router.currentRoute.value.query
        router.replace({ query })
    }
    // 소리
    const audio = new Audio(loginsound);
    audio.play()

})
</script>

<style lang="scss" scoped>
@import '@assets/styles/main.scss';

.page {
    display: flex;
    align-items: center;
    justify-content: center;

    width: 100%;
    height: 100%;

    background-color: $color-blue-500;

    
    @include mobile() {
        zoom: 60%;
        .login-form{
            display: flex;
            padding: 40px;
            align-items: flex-end;
            position: absolute;
            
        }
        .page-text-box{
            padding: 70px 50px;
            display: flex;
            align-items: flex-start;
        }
        :deep(.form){
            padding: 55px 85px;
        }
        .sub-title__text{
            font-size: 30px !important;
        }
    }

    &__section {
        display: flex;
        align-items: center;
        justify-content: center;

        width: 100%;
        height: 100%;

        &__text-box {
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            justify-content: center;

            gap: 18px;

            @include laptop() {
                gap: 8px;
            }
            @include mobile() {
                gap: 8px;
            }

            .gsil-logo {
                width: 190px;

                @include laptop() {
                    width: 160px;
                }
            }
            .title {
                color: $color-white-000;

                font-weight: 600;
                font-size: 70px;
                line-height: 84px;

                @include laptop() {
                    font-size: 60px;
                }
            }
            .sub-title {
                display: flex;
                flex-direction: column;

                gap: 8px;

                &__text {
                    color: $color-white-000;

                    font-weight: 600;
                    font-size: 32px;
                    line-height: 38px;

                    @include laptop() {
                        font-size: 30px;
                    }
                    @include mobile() {
                        font-size: 28px;
                    }

                    .beit-logo {
                        width: 100px;

                        margin-right: 4px;
                    }
                }
            }
        }
    }
}
</style>
