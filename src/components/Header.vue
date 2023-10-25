<template>
    <div class="header desktop">
        <div class="header__main">
            <!-- <RouterLink to="/adminMain/dashboard" class="header__main__logo-box">
                <img src="@assets/images/logo.svg" alt="" class="logo" />
            </RouterLink> -->
            <img src="@assets/images/logo.svg" alt="" class="logo" />

            
        </div>
        <div class="header__profile-box">
            <div class="header__profile-box__profile">
                <img src="@assets/icons/myPage.svg" alt="" class="icon" />
                <span class="user-name">{{ userName }} </span>
                <span class="middle-line">|</span>
                <span class="user-position">{{ userPosition }}</span>
            </div>
            <CommonIconButton :label="'로그아웃'" :theme="'fill'" icon="logout" @send-event="logout" />
        </div>
    </div>
    <div class="sub-header" :class="{ active: isVisibleSubHeader }" @mouseleave="isVisibleSubHeader = false">
        <CommonRouterMenu v-for="item in subMenuList" :key="item.label" :data="item" class="sub-header__menu" />
    </div>
</template>

<script setup lang="ts">
import CommonIconButton from "@components/common/button/IconButton.vue"
import CommonRouterMenu from "@components/common/menu/RouterMenu.vue"
// import CommonNavigationMenu from "./common/NavigationMenu.vue"

import { ref, onMounted, onUnmounted } from "vue"
import { useRouter } from "vue-router"
import { useStore } from "@stores/index"

const store = useStore()
// 로그인 유저 이름 & 직종
const userName = store.loginData.user_data.user_name
const userPosition = store.loginData.user_permission.ctgo_duty_name
const userCompanyType = store.loginData.user_main_company.company_type

// 헤더 네비게이션 메뉴 리스트
// 서브 헤더 - 개발이 덜 된 메뉴에 대해서는 일단 Hidden 230517
const menuList:any = ref([
    { index: 0, label: "현장관리", path: "/adminMain/sceneManagement", active: false },
    { index: 1, label: "인력/차량", path: "/adminMain/vehicle", active: false },
    { index: 2, label: "교육/회의", path: "/adminMain/education", active: false },
    { index: 3, label: "작업관리", path: "/adminMain/taskManagement", active: false },
    { index: 4, label: "중장비", path: "/adminMain/heavyEquipment", active: false },
    { index: 5, label: "부적합", path: "/adminMain/safeManagement", active: false },
    { index: 6, label: "게시판", path: "/adminMain/notice", active: false },
    { index: 7, label: "전자결재", path: "/adminMain/Incongruity", active: false },
    { index: 8, label: "설정/관리", path: "/adminMain/setting", active: false },
])
const subMenuList:any = ref([])

// 서브 헤더 - 개발이 덜 된 메뉴에 대해서는 일단 Hidden 230517
const isVisibleSubHeader = ref<boolean>(false)
const getSubMenuList = (label: string) => {
    isVisibleSubHeader.value = true

    let sceneManagement = []

    if (userCompanyType === "협력사") {
        sceneManagement = [{ parentIdx: 0, index: 0, label: "업체관리", path: "/adminMain/sceneManagement/companyManagement", active: false }]
    } else {
        sceneManagement = [
            { parentIdx: 0, index: 0, label: "공사개요", path: "/adminMain/sceneManagement/constructionSummary", active: false },
            { parentIdx: 0, index: 1, label: "업체관리", path: "/adminMain/sceneManagement/companyManagement", active: false },
        ]
    }

    const vehicle = [
        { parentIdx: 1, index: 0, label: "근로자관리", path: "/adminMain/vehicle/workManagement", active: false },
        { parentIdx: 1, index: 1, label: "관리자관리", path: "/adminMain/vehicle/managerManagement", active: false },
        { parentIdx: 1, index: 2, label: "출역현황", path: "/adminMain/vehicle/releaseStatus", active: false },
        // { index: 2, label: "인력출역현황", path: "/adminMain/vehicle/releaseStatus", active: false },
        // { index: 3, label: "차량출역현황", path: "/adminMain/vehicle/vehicleManagement", active: false },
    ]
    const education = [
        { parentIdx: 2, index: 0, label: "안전교육", path: "/adminMain/education/safetyEducation", active: false },
        { parentIdx: 2, index: 1, label: "안전회의록", path: "/adminMain/education/safetyMeeting", active: false },
    ]
    const taskManagement = [
        { parentIdx: 3, index: 0, label: "MSDS", path: "/adminMain/taskManagement/msds", active: false },
        { parentIdx: 3, index: 1, label: "위험성평가서", path: "/adminMain/taskManagement/riskAssessment", active: false },
        { parentIdx: 3, index: 2, label: "협력사위험성평가", path: "/adminMain/taskManagement/suppierRiskAssessment", active: false },
        { parentIdx: 3, index: 3, label: "위험성평가점검", path: "/adminMain/taskManagement/riskAssessmentInspection", active: false },
        { parentIdx: 3, index: 4, label: "작업허가서", path: "/adminMain/taskManagement/workPermit", active: false },
        { parentIdx: 3, index: 5, label: "TBM일지", path: "/adminMain/taskManagement/tbm", active: false },
    ]
    const heavyEquipment = [
        { parentIdx: 4, index: 0, label: "반입전장비관리", path: "/adminMain/heavyEquipment/equipManagement", active: false },
        { parentIdx: 4, index: 1, label: "일일장비점검", path: "/adminMain/heavyEquipment/dailyEquipCheck", active: false },
        { parentIdx: 4, index: 2, label: "장비작업계획서", path: "/adminMain/heavyEquipment/workPlan", active: false },
        { parentIdx: 4, index: 3, label: "중장비현황", path: "/adminMain/heavyEquipment/heavyEquipStatus", active: false },
    
    ]
    const incongruity = [{ parentIdx: 5, index: 0, label: "안전점검부적합", path: "/adminMain/safeManagement/inadequate", active: false }]
    const notice = [
        { parentIdx: 6, index: 0, label: "긴급알림이력", path: "/adminMain/notice/alarm", active: false },
        { parentIdx: 6, index: 1, label: "SOS요청이력", path: "/adminMain/notice/sos", active: false },
        { parentIdx: 6, index: 2, label: "작업중지요청이력", path: "/adminMain/notice/stop", active: false },
    ]
    const approvalManagement = [
        { parentIdx: 7, index: 0, label: "결재대기함", path: "/adminMain/approvalManagement/approvalAwaiting", active: false },
        { parentIdx: 7, index: 1, label: "결재진행함", path: "/adminMain/approvalManagement/approvalProceeding", active: false },
        { parentIdx: 7, index: 2, label: "완료문서함", path: "/adminMain/approvalManagement/approvalFinished", active: false },
        { parentIdx: 7, index: 3, label: "반려문서함", path: "/adminMain/approvalManagement/approvalRejected", active: false },
    ]
    const setting = [
        { parentIdx: 8, index: 0, label: "위험성평가설정", path: "/adminMain/setting/riskAssessmentSetting", active: false },
        { parentIdx: 8, index: 1, label: "현장세부정보설정", path: "/adminMain/setting/sceneInfoSetup", active: false },
        // { index: 2, label: "비콘관리", path: "/adminMain/setting/bicon", active: false },
    ]

    if (label === "현장관리") subMenuList.value = sceneManagement
    if (label === "인력/차량") subMenuList.value = vehicle
    if (label === "교육/회의") subMenuList.value = education
    if (label === "작업관리") subMenuList.value = taskManagement
    if (label === "중장비") subMenuList.value = heavyEquipment
    if (label === "부적합") subMenuList.value = incongruity
    if (label === "게시판") subMenuList.value = notice
    if (label === "전자결재") subMenuList.value = approvalManagement
    if (label === "설정/관리") subMenuList.value = setting
}

// 페이지 라우팅
const router = useRouter()
const moveToPage = () => {
    router.push({ name: "login" })
}

router.beforeEach((to, from, next) => {
    next()
})

router.afterEach((to) => {
    const currentPath = to.path

    menuList.value.forEach((item:any, index:any) => {
        if (currentPath.includes(item.path)) {
            item.active = true

            // 자식 메뉴를 눌렀을 때 부모 메뉴에 active 클래스 추가
            if (item.index !== null) {
                setTimeout(() => {
                    menuList.value[menuList.value[index].index].active = true
                }, 0)
            }
        } else {
            item.active = false
        }
    })
})

// 로그아웃
const logout = () => {
    localStorage.removeItem("main")
    moveToPage()
}

onMounted(() => {
    const checkParentActive = setInterval(() => {
        const currentPath = router.currentRoute.value.path

        menuList.value.forEach((item:any, index:any) => {
            if (currentPath.includes(item.path)) {
                item.active = true
            }
        })
    }, 0) // 1초마다 체크

    onUnmounted(() => {
        clearInterval(checkParentActive)
    })
})
</script>

<style lang="scss" scoped>
@import "@assets/styles/main.scss";

.header {
    position: relative;

    display: flex;
    align-items: center;
    justify-content: space-between;

    width: 100%;
    height: 70px;

    padding: 0 42px;

    background-color: $color-white-000;

    z-index: 2;

    &__main {
        display: flex;
        align-items: center;
        margin-right: 30px;
        height: 100%;
        // gap: 64px;
        flex: 1;

        &__logo-box {
            display: flex;
            align-items: center;
            justify-content: center;

            height: 100%;
            padding: 16px;

            &__logo {
                width: 100%;
                height: 100%;
            }
            @include laptop() {
            }
        }
        &__navigation {
            display: flex;
            align-items: center;
            justify-content: flex-start;

            height: 100%;
            flex: 1;
            .menu {
                display: flex;
                align-items: center;
                justify-content: center;
                height: 100%;
            }

            @include laptop() {
            }
            @include tabletToLaptop() {
                display: none;
            }
            @include tablet() {
                display: none;
            }
        }
    }
    &__profile-box {
        display: flex;
        align-items: center;

        height: 100%;
        width: 276px;

        &__profile {
            display: flex;
            align-items: center;
            justify-content: center;
            height: 100%;
            margin-right: 20px;
            color: $color-black-700;
            gap: 8px;
            .icon {
                display: flex;
                align-items: center;
                justify-content: center;

                width: 26px;
                height: 26px;

                margin-top: 1px;
            }
            .middle-line {
                display: flex;
                align-items: center;
                justify-content: center;
            }
        }
    }

    @include laptop() {
        width: calc(100% - 48px);

        padding: 0 24px;
    }
}
.sub-header {
    display: none;

    &.active {
        position: absolute;
        top: 70px;
        z-index: 1;

        display: flex;
        align-items: center;

        width: 100%;
        height: 70px;

        background: rgba($color-white-000, 0.9);
        border-top: 1px solid $color-white-200;
        box-shadow: 0px 2px 3px rgba($color-black-900, 0.05);
    }

    // @include laptop() {
    //     &.active {
    //         // width: 100%;
    //         height: 70px;

    //         padding-left: 0;
    //         gap: 36px;
    //     }
        // &__menu {
        //     &:nth-child(1) {
        //         margin-left: 268px;
        //     }
        // }
    // }
}
</style>
