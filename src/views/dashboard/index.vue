<template>
    <!-- 대시보드 -->
    <div class="page" :class="{'page-fadeIn': store.pageFadeIn, 'page-fadeOut': !store.pageFadeIn, 'dark-mode' : store.darkMode}">

        <CommonHeader />
        <DashBoard />
        <CommonFooter style="max-width: none !important" />
    
        <div class="loading-bg" :class="{ 'fadeIn': isLoading, 'fadeOut': !isLoading}">
            <div style="position: relative; ">
                <img class="loading-logo logoFadeIn"  :src="gsilLogowhite"  />
                <img class="loading-ball ballFadeIn" :src="dashboradLoading"  /> 
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import CommonHeader from "@components/Header.vue"
import CommonFooter from "@components/Footer.vue"
import DashBoard from "./dashboardComponents/index.vue"
import { ref } from "vue"
import { useStore } from "@stores/index"
import gsilLogowhite from "@assets/images/gsilLogowhite.svg"
import dashboradLoading from "@assets/icons/dashboradLoading.gif" 


const store = useStore()
const isLoading:any = ref(null)
isLoading.value = true
store.setPageFadeIn(true)

setTimeout(() => {
    isLoading.value = false
}, 3300)


window.addEventListener('resize', function() {
    store.setPageFadeIn(false)
    location.reload()
});
</script>

<style lang="scss" scoped>
@import "@assets/styles/main.scss";

.page {
    overflow: hidden;
    overflow-x: auto;
    zoom: 67%;
    @include laptop() {
        zoom: 55%;
    }
    display: flex;
    flex-direction: column;
    align-items: center;

    width: 100%;
    height: 100%;

    background-color: $color-white-100;

    &__dialog,
    &__release-dialog,
    &__alarmSend-dialog,
    &__attend-dialog {
        display: none;

        &.active {
            position: absolute;
            z-index: 2;

            display: flex;
        }
    }
    &__riskAssessment-dialog,
    &__tbm-dialog,
    &__workPermit-dialog {
        display: none;

        &.active {
            position: absolute;
            z-index: 3;

            display: flex;
        }
    }
    &__work-dialog,
    &__select-dialog,
    &__select-worker-dialog,
    &__approval-dialog {
        display: none;

        &.active {
            position: absolute;
            z-index: 4;

            display: flex;
        }
    }
    &__print-riskAssessment,
    &__print-workPermit,
    &__print-dialog {
        display: none;

        &.active {
            position: absolute;
            z-index: 5;

            display: flex;
        }
    }
    &__approval-detail {
        position: absolute;
        background-color: $color-white-100;
        width: 100%;
    }
}


:deep(.header.dark-mode){
    background-color: #15202c;
    span, a{
        color:#dddddd;
    }
    padding: 0 58px;

}
:deep(.sub-header.dark-mode){
    background-color: #15202c;
    span, a{
        color:#dddddd;
    }
    
}

:deep(.footer.dark-mode){
    background-color: #15202c !important;
    span, a{
        color:#dddddd !important;
    }
}


// dark mode css ------------------
:deep(.dashboard.dark-mode){
    background-color: #15202c !important;
    // background: url("@assets/images/viewMap.png");
    background-size: cover;
    .dashboard__body {
        // background-color: #15202c !important;
        background-color: #000000ab !important
    }
    span, a{
        color:#dddddd !important;
    }

    
    .block-item{
        // background: #2b3c4e;
        background: #15202c75;
        box-shadow: 0 0 8px #518fb461;
        .header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            width: 100%;
            padding: 14px;
            // background-color: #344258;
            background-color: #18243296;
            border-top-right-radius: 6px;
            box-sizing: border-box;
            box-shadow: 0px 1px 5px;
            border-top-left-radius: 6px;
        }
        .scene-info{
            
            .scene-info__weather-info__label{
                background: #afd2e975;
                color: #ffffff;
                
            }
            .scene-info__basic-info__detail-date{
                .item{
                    color: #ffffff;
                }
                .item__chip{
                    background: #afd2e975;
                    color: #ffffff;
                }
            }
            .scene-info__basic-info {
                .calendar, .today{
                    color: #ffffff !important;
                }
            }
        }
    }
}

@media (max-width: 1278px) {
    .page {
        height: unset !important;
    }
}

.loading-bg{
    background-color: #010304;
    width: 100%;
    height: 100%;
    position: absolute;
    z-index: 10;
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0; 
    img{
        height: 120px;
        width: 120px;
    }
    .loading-logo{
        width: 150px;
        position: absolute;
        z-index: 0;
        opacity: 0;
        right: -50px;
    }
    .loading-ball{
        margin-left: -6px;
        margin-top: -6px;
    }
}
.ballFadeIn{
    animation: ballFadeInAnimation 1s ease 1s forwards;
}
@keyframes ballFadeInAnimation {
  from {
    margin-left: -6px;

  }
  to {
    margin-left: 128px;
  }
}
.logoFadeIn{
    animation: logoFadeInAnimation 2s ease 1s forwards;
}
@keyframes logoFadeInAnimation {
  from {
    opacity: 0;
    right: -40px;
  }
  to {
    opacity: 1;
    right: 100px;
  }
}

.fadeIn{
    animation: fadeInAnimation 1s ease forwards;
}
.fadeOut{
    animation: fadeOutAnimation 1s ease forwards; 
}
@keyframes fadeInAnimation {
  from {
    opacity: 0; /* 动画起始状态为透明 */
  }
  to {
    opacity: 1; /* 动画结束状态为完全不透明 */
  }
}
@keyframes fadeOutAnimation {
  from {
    opacity: 1; 
  }
  to {
    opacity: 0; 
    display: none;
  }
}

.page-fadeIn{
    animation: fadePageInAnimation 0.5s ease  forwards; 
}
@keyframes fadePageInAnimation {
  from {
    opacity: 0;
   }
  to {
    opacity: 1;
  }
}
.page-fadeOut{
    animation: fadePageOutAnimation 0.5s ease forwards; 
}
@keyframes fadePageOutAnimation {
  from {
    opacity: 1;
   }
  to {
    opacity: 0;
  }
}
</style>
