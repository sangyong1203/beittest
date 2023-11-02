<template>
    <div class="work-management">
        <div class="work-management__body">
            <!-- 리스트 -->
            <CommonContent :label="'근로자 관리'" @send-search="checkContentParams">
                <WorkManagementTable
                    :label="'근로자'"
                    :menu-list="menuList"
                    :data="tableData"
                    :limit="limit"
                    :selectedPage="selectedPage"
                    @open-dialog="openDialog"
                    @open-multi="openMultiDialog"
                    @open-detail="openDetailDialog"
                />
                <CommonPagination :totalPage="totalPage" :selectedPage="selectedPage" :limit="limit" @send-event="moveToPage" @send-data="changeLimit" />
            </CommonContent>
        </div>
    </div>
</template>

<script setup lang="ts">
import CommonContent from "@components/Content.vue"
import WorkManagementTable from "./Table.vue"
import CommonPagination from "@components/common/Pagination.vue"

import { ref, watch } from "vue"
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

// 등록 다이얼로그 열기
const emit = defineEmits(["open-dialog", "open-detail", "open-multi"])
const openDialog = (value: boolean) => {
    emit("open-dialog", value)
}
const openDetailDialog = (value: any) => {
    emit("open-detail", value)
}
const openMultiDialog = (value: boolean): void => {
    emit("open-multi", value)
}

// 테이블 메뉴 리스트
const menuList: string[] = ["업체", "공종", "직종", "성명", "연락처", "가입일"]
const tableData = ref<any[]>() // 전체 데이터
const totalCount = ref<number | undefined>()
const totalPage = ref<number>(0)
const limit = ref<number>(10)
const selectedPage = ref<number>(1)

// 근로자 관리 - 리스트 조회
const getData = () => {
    const store = useStore()
    const headerParams = store.getHeaderParams

    let params = {
        search_text: contentParams.search_text !== "" ? contentParams.search_text : "",
        start_date: contentParams.start_date !== "" ? contentParams.start_date : "1900.01.01",
        end_date: contentParams.end_date !== "" ? contentParams.end_date : dayjs(new Date(Date.now())).format("YYYY.MM.DD"),
    }
    params = Object.assign({}, params, headerParams)
    api.getWorkerManagement(params).then((res) => {
        try {
            const rsCode = res.data.rsCode
            const data = res.data.rsMap

            if (rsCode === 0) {
                tableData.value = data !== undefined ? data : []
                tableData.value?.forEach((item) => {
                    item.user_phone = item.user_phone.replace(/^(\d{2,3})(\d{3,4})(\d{4})$/, `$1-$2-$3`)
                })
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

.work-management {
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