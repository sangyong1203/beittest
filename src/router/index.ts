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
]
const router = createRouter({
    history: createWebHashHistory(),
    routes,
})

export default router
