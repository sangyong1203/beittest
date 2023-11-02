<template>
    <div class="manager-management">
        <div class="manager-management__body">
            <!-- 리스트 -->
            <CommonContent :label="'관리자 관리'" class="content" @send-search="checkContentParams">
                <ManagerManagementTable
                    :label="'관리자'"
                    :menu-list="menuList"
                    :data="tableData"
                    :limit="limit"
                    :selectedPage="selectedPage"
                    @open-dialog="openDialog"
                    @open-detail="openDetailDialog"
                />
                <CommonPagination :totalPage="totalPage" :selectedPage="selectedPage" :limit="limit" class="content__pagination" @send-event="moveToPage" @send-data="changeLimit" />
            </CommonContent>
        </div>
    </div>
</template>

<script setup lang="ts">
import CommonContent from "@components/Content.vue"
import ManagerManagementTable from "./Table.vue"
import CommonPagination from "@components/common/Pagination.vue"

import { onMounted, ref, watch } from "vue"
import { useStore } from "@stores/index"
import { toast } from "vue3-toastify"
import api from "./selfApi"
import dayjs from "dayjs"

let contentParams = {
    search_text: "",
    start_date: "",
    end_date: "",
}

const checkContentParams = (data: any) => {
    contentParams = data
    getData()
}

// 테이블 메뉴 리스트
const menuList: string[] = ["업체", "공종", "직책", "성명", "아이디", "가입일"]

const tableData:any = ref([]) // 전체 데이터
const totalCount = ref<number>(0)
const totalPage = ref<number>(0)
const limit = ref<number>(10)
const selectedPage = ref<number>(1)

// 등록 다이얼로그 열기
const emit = defineEmits(["open-dialog", "open-detail"])
const openDialog = (value: boolean) => {
    emit("open-dialog", value)
}
const openDetailDialog = (value: any) => {
    emit("open-detail", value)
}

// 관리자관리 - 리스트 조회
const getData = () => {
    const store = useStore()
    const headerParams = store.headerParams

    let params = {
        // Required
        company_ids: JSON.stringify(["전체"]), // 전체
        ch_scene_id: JSON.stringify([1]), // 전체
        ctgo_duty_id: 0, // 전체
        // Not Required
        search_text: contentParams.search_text !== "" ? contentParams.search_text : "",
        start_date: contentParams.start_date !== "" ? contentParams.start_date : "1900.01.01",
        end_date: contentParams.end_date !== "" ? contentParams.end_date : dayjs(new Date(Date.now())).format("YYYY.MM.DD"),
    }
    params = Object.assign({}, params, contentParams, headerParams)
    api.getAdminInfoList(params).then((res) => {
        try {
            const rsCode = res.data.rsCode
            const data = res.data.rsMap

            if (rsCode === 0) {
                tableData.value = data !== undefined ? data : []

                if (data !== undefined) {
                    // currentPage: 현재 페이지
                    // totalCount: 총 데이터 갯수
                    // pageCount: 화면에 나타날 페이지 갯수
                    // limit: 한 페이지 당 나타낼 데이터의 갯수
                    totalCount.value = tableData.value !== undefined ? tableData.value.length : 0
                    totalPage.value = Math.ceil(totalCount.value / limit.value) !== 0 ? Math.ceil(totalCount.value / limit.value) : 1
                    tableData.value = disassemble(selectedPage.value - 1, data, limit.value)

                    if (totalPage.value === 1) moveToPage(1)
                }
            }
        } catch (error) {
            console.log(error)
            toast.error(res.data.rsMsg)
        }
    })
}
function disassemble(index: number, data: any[], size: number) {
    const res = new Array()

    for (let i = 0; i < data.length; i += size) {
        res.push(data.slice(i, i + size))
    }
    return res[index]
}

// 페이지네이션
function moveToPage(index: number) {
    selectedPage.value = index
}
function changeLimit(value: number) {
    limit.value = Number(value)
    getData()
    moveToPage(1)
}

// selectedPage가 변할 때마다 getData 함수 호출
watch(selectedPage, () => {
    getData()
})

defineExpose({ getData })
</script>

<style lang="scss" scoped>
@import "@assets/styles/main.scss";

$HEADER: 70px; // 공통 헤더 Height 값
$FOOTER: 60px; // 공통 푸터 Height 값

.manager-management {
    display: flex;
    flex-direction: column;
    align-items: center;

    width: 100%;
    height: calc(100% - $HEADER - $FOOTER);

    &__body {
        display: flex;
        flex-direction: column;
        width: 100%;
        height: 100%;
        padding: 30px 42px 0 42px;
        gap: 16px;
        background-color: #fafbfd;
        box-sizing: border-box;
        overflow: hidden;
    }
}
</style>
