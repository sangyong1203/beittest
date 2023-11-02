import { createRouter, createWebHashHistory, type RouteRecordRaw } from "vue-router"

const routes: Array<RouteRecordRaw> = [
    {
        path: "/",
        name: "login",
        component: () => import("../views/login/index.vue"),
    },
    // 대시보드
    {
        path: "/dashboard",
        name: "dashboard",
        component: () => import("@views/dashboard/index.vue"),
    },
    // 근로자관리
    {
        path: "/workerManagement",
        name: "workerManagement", 
        component: () => import("@views/workerManagement/index.vue"),
    },
    // 관리자관리
    {
        path: "/managerManagement",
        name: "managerManagement", 
        component: () => import("@views/managerManagement/index.vue"),
    },
    // SOS요청이력
    {
        path: "/sos",
        name: "sos", 
        component: () => import("@views/sos/index.vue"),
    },
    // 작업중지요청이력
    {
        path: "/workStop",
        name: "workStop", 
        component: () => import("@views/workStop/index.vue"),
    },
    // 알림공지
    {
        path: "/alarm",
        name: "alarm", 
        component: () => import("@views/alarm/index.vue"),
    },
]
const router = createRouter({
    history: createWebHashHistory(),
    routes,
})

export default router
