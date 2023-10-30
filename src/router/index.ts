import { createRouter, createWebHashHistory, type RouteRecordRaw } from "vue-router"

const routes: Array<RouteRecordRaw> = [
    {
        path: "/",
        name: "login",
        component: () => import("../views/login/index.vue"),
    },
    {
        path: "/dashboard",
        name: "dashboard",
        component: () => import("@views/dashboard/index.vue"),
    },
    // // 현장관리
    // {
    //     path: "/sceneManagement/constructionSummary",
    //     name: "constructionSummary", // 현장관리 - 공사개요
    //     component: () => import("@views/sceneManagement/constructionSummary/index.vue"),
    // },
    // {
    //     path: "/sceneManagement/companyManagement",
    //     name: "companyManagement", // 현장관리 - 업체관리
    //     component: () => import("@views/sceneManagement/companyManagement/index.vue"),
    // },
    // {
    //     path: "/sceneManagement/notice",
    //     name: "constructionSumnoticemary", // 현장관리 - 공지사항
    //     component: () => import("@views/sceneManagement/notice/index.vue"),
    // },
    // // 인력 및 차량
    // {
    //     path: "/vehicle/workManagement",
    //     name: "workManagement", // 인력/차량 - 근로자관리
    //     component: () => import("@views/vehicle/workManagement/index.vue"),
    // },
    // {
    //     path: "/vehicle/managerManagement",
    //     name: "vehmanagerManagementicle", // 인력/차량 - 관리자관리
    //     component: () => import("@views/vehicle/managerManagement/index.vue"),
    // },
    // {
    //     path: "/vehicle/releaseStatus",
    //     name: "releaseStatus", // 인력/차량 - 인력출역현황
    //     component: () => import("@views/vehicle/releaseStatus/index.vue"),
    // },
    // {
    //     path: "/vehicle/vehicleManagement",
    //     name: "vehicleManagement", // 인력/차량 - 차량출차관리
    //     component: () => import("@views/vehicle/vehicleManagement/index.vue"),
    // },
    // 교육/회의
    {
        path: "/education/safetyEducation",
        name: "safefyEducation", // 교육/회의 - 안전교육
        component: () => import("../views/education/safetyEducation/index.vue"),
    },
    {
        path: "/education/safetyMeeting",
        name: "safetyMeeting", // 교육/회의 - 안전회의록
        component: () => import("../views/education/safetyMeeting/index.vue"),
    },
    // // 중장비
    // {
    //     path: "/heavyEquipment/equipManagement",
    //     name: "equipManagement", // 중장비 - 반입전 장비관리
    //     component: () => import("@views/heavyEquipment/equipManagement/index.vue"),
    // },
    // {
    //     path: "/heavyEquipment/dailyEquipCheck",
    //     name: "dailyEquipCheck", // 중장비 - 일일 장비점검
    //     component: () => import("@views/heavyEquipment/dailyEquipCheck/index.vue"),
    // },
    // {
    //     path: "/heavyEquipment/workplan",
    //     name: "workplan", // 중장비 - 장비작업계획서
    //     component: () => import("@views/heavyEquipment/workPlan/index.vue"),
    // },
    // {
    //     path: "/heavyEquipment/heavyEquipStatus",
    //     name: "heavyEquipStatus", // 중장비 - 중장비 현황
    //     component: () => import("@views/heavyEquipment/heavyEquipStatus/index.vue"),
    // },
    // {
    //     path: "/heavyEquipment/toolManagement",
    //     name: "toolManagement", // 중장비 - 공도구 관리
    //     component: () => import("@views/heavyEquipment/toolManagement/index.vue"),
    // },
    // {
    //     path: "/heavyEquipment/toolCheck",
    //     name: "toolCheck", // 중장비 - 공도구 점검
    //     component: () => import("@views/heavyEquipment/toolCheck/index.vue"),
    // },
    // {
    //     path: "/taskManagement/msds",
    //     name: "msds", // 작업관리 - MSDS
    //     component: () => import("@views/taskManagement/msds/index.vue"),
    // },
    // {
    //     path: "/taskManagement/riskAssessment",
    //     name: "riskAssessment", // 작업관리 - 위험성평가
    //     component: () => import("@views/taskManagement/riskAssessment/index.vue"),
    // },
    // {
    //     path: "/taskManagement/riskAssessmentInspection",
    //     name: "riskAssessmentInspection", // 작업관리 - 위험성평가점검
    //     component: () => import("@views/taskManagement/riskAssessmentInspection/index.vue"),
    // },
    // {
    //     path: "/taskManagement/suppierRiskAssessment",
    //     name: "suppierRiskAssessment", // 작업관리 - 협력사위험성평가
    //     component: () => import("@views/taskManagement/suppierRiskAssessment/index.vue"),
    // },
    // {
    //     path: "/taskManagement/tbm",
    //     name: "tbm", // 작업관리 - TBM
    //     component: () => import("@views/taskManagement/tbm/index.vue"),
    // },
    // {
    //     path: "/taskManagement/workPermit",
    //     name: "workPermit", // 작업관리 - 작업허가서
    //     component: () => import("@views/taskManagement/workPermit/index.vue"),
    // },
    // // 부적합
    // {
    //     path: "/safeManagement/inadequate",
    //     name: "inadequate", // 부적합 - 안전점검부적합
    //     component: () => import("@views/safeManagement/inadequate/index.vue"),
    // },
    // // 게시판
    // {
    //     path: "/notice/alarm",
    //     name: "alarm", // 게시판 - 긴급알림이력
    //     component: () => import("@views/notice/alarm/index.vue"),
    // },
    // {
    //     path: "/notice/sos",
    //     name: "sos", // 게시판 - SOS요청이력
    //     component: () => import("@views/notice/sos/index.vue"),
    // },
    // {
    //     path: "/notice/stop",
    //     name: "stop", // 게시판 - 작업중지요청이력
    //     component: () => import("@views/notice/workStop/index.vue"),
    // },
    // // 전자결재
    // {
    //     path: "/approvalManagement/approvalAwaiting",
    //     name: "approvalAwaiting", // 전자결재 - 결재대기함
    //     component: () => import("@views/approvalManagement/approvalAwaiting/index.vue"),
    // },
    // {
    //     path: "/approvalManagement/approvalProceeding",
    //     name: "approvalProceeding", // 전자결재 - 결재진행함
    //     component: () => import("@views/approvalManagement/approvalProceeding/index.vue"),
    // },
    // {
    //     path: "/approvalManagement/approvalFinished",
    //     name: "approvalFinished", // 전자결재 - 완료문서함
    //     component: () => import("@views/approvalManagement/approvalFinished/index.vue"),
    // },
    // {
    //     path: "/approvalManagement/approvalRejected",
    //     name: "approvalRejected", // 전자결재 - 반려문서함
    //     component: () => import("@views/approvalManagement/approvalRejected/index.vue"),
    // },
    // // 설정/관리
    // {
    //     path: "/setting/riskAssessmentSetting",
    //     name: "riskAssessmentSetting", // 설정/관리 - 위험성평가설정
    //     component: () => import("@views/setting/riskAssessmentSetting/index.vue"),
    // },
    // {
    //     path: "/setting/sceneInfoSetup",
    //     name: "sceneInfoSetup", // 설정/관리 - 현장세부설정
    //     component: () => import("@views/setting/sceneInfoSetup/index.vue"),
    // },
    // {
    //     path: "/setting/bicon",
    //     name: "bicon", // 설정/관리 - 비콘관리
    //     component: () => import("@views/setting/bicon/index.vue"),
    // },
]
const router = createRouter({
    history: createWebHashHistory(),
    routes,
})

export default router
