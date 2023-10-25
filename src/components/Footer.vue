<template>
    <div class="footer">
        <div class="footer__text-box">
            <span class="footer__text-box__policy">
                <a link href="https://wpgumi.com/api/upload/policy/서비스이용약관.html" target="_blank">시스템 이용약관</a> 
                ㅣ
                <a link href="https://wpgumi.com/api/upload/policy/개인(위치)정보처리방침.html" target="_blank">개인정보처리방침</a> 
            </span>
            <span class="footer__text-box__copy-right">Copyright © 2023 by GSIL Co., Ltd. All rights reserved.</span>
        </div>
        <div class="footer__logo-box">
            <img src="/assets/images/gsilLogo.svg" alt="" class="footer__logo-box__logo" />
            <img src="/assets/images/beitLogo.png" alt="" class="footer__logo-box__beit" />
        </div>
    </div>
</template>

<script setup lang="ts"></script>

<style lang="scss" scoped>
@import "@assets/styles/main.scss";

.footer {
    display: flex;
    align-items: center;
    justify-content: flex-end;

    width: 100%;
    max-width: 1920px;

    height: 60px;

    padding: 10px 42px;
    gap: 10px;
    box-sizing: border-box;
    background-color: $color-white-100;

    &__text-box {
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        justify-content: center;

        gap: 4px;

        &__policy, a {
            font-weight: 400;
            font-size: 12px;
            line-height: 13px;
            text-align: right;

            color: $color-white-600;
        }
        &__copy-right {
            font-weight: 400;
            font-size: 12px;
            line-height: 13px;
            text-align: right;

            color: $color-white-600;
        }
    }
    &__logo-box {
        display: flex;
        align-items: center;
        justify-content: center;

        height: 32px;

        &__logo {
            height: 100%;
        }
        &__beit {
            width: 80px;
            // height: 100%;
            margin: 0 0 8px 8px;
        }
    }
}
</style>
