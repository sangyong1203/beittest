<template>
    <!-- 작업중지 요청이력 -->
    <div class="common-body">
        <div class="common-body__body">
            <!-- 리스트 -->
            <CommonContent :label="'작업중지 요청이력'" @send-search="checkContentParams">
                <CommonTable :label="'작업중지 요청이력'" :menu-list="menuList" :data="tableData" :limit="limit" :selectedPage="selectedPage" />
                <CommonPagination :totalPage="totalPage" :selectedPage="selectedPage" :limit="limit" @send-event="moveToPage" @send-data="changeLimit" />
            </CommonContent>
        </div>
    </div>
</template>

<script setup lang="ts">
import CommonContent from "@components/Content.vue"
import CommonPagination from "@components/common/Pagination.vue"
import CommonTable from "./Table.vue"

import { onMounted, ref, watch } from "vue"
import { useStore } from "@stores/index"
import { toast } from "vue3-toastify"
import api from "./selfApi"
import dayjs from "dayjs"

// 테이블 메뉴 리스트
const menuList: string[] = ["요청사유", "업체", "공종", "성명", "직종/직책", "전화번호", "요청일자", "요청시간"]
const tableData = ref<[]>() // 전체 데이터
const totalCount = ref<number | undefined>()
const totalPage = ref<number>(0)
const limit = ref<number>(10)
const selectedPage = ref<number>(1)

let contentParams = {
    search_text: "",
    start_date: "",
    end_date: "",
}
const checkContentParams = (data: any) => {
    contentParams = data
    getData()
}
//  리스트 조회
const getData = () => {
    const store = useStore()
    const headerParams = store.getHeaderParams

    let params = {
        company_ids: JSON.stringify(["전체"]),
        ctgo_construction_id: 0,
        ctgo_occupation_id: 0,
        scene_ids: JSON.stringify([1]),
        start_date: contentParams.start_date === "" ? "1900-01-01" : contentParams.start_date,
        end_date: contentParams.end_date === "" ? dayjs(new Date()).format("YYYY-MM-DD") : contentParams.end_date,
        search_text: contentParams.search_text ?? "",
    }
    params = Object.assign({}, params, headerParams)
    api.getStopList(params).then((res) => {
        try {
            const rsCode = res.data?.rsCode
            const data = res.data?.rsMap ?? []

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

onMounted(() => {
    getData()
})

defineExpose({ getData })
</script>

<style lang="scss" scoped>
@import "@assets/styles/main.scss";

$HEADER: 70px; // 공통 헤더 Height 값
$FOOTER: 60px; // 공통 푸터 Height 값
.common-body {
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
