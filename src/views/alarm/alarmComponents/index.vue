<template>
  <div class="common-body">
    <div class="common-body__body">
      <!-- 리스트 -->
      <CommonContent :label="'알림 이력'" @send-search="checkContentParams">
        <AlarmTable
          :label="'알림 이력'"
          :menu-list="menuList"
          :data="tableData"
          :limit="limit"
          :selectedPage="selectedPage"
          @open-dialog="openAlarmSendDialog"
          @open-detail="openDetailDialog"
        />
        <CommonPagination
          :totalPage="totalPage"
          :selectedPage="selectedPage"
          :limit="limit"
          @send-event="moveToPage"
          @send-data="changeLimit"
        />
      </CommonContent>
    </div>
  </div>
  <AlarmDetail ref="alarmDetailRef" />
  <!-- 알림 다이어로그 -->
  <AlarmSendDialog
    ref="alarmSendDialogRef"
    class="page__alarmSend-dialog"
    :class="{ active: isAlarmSend }"
    @openSosDialog="openSosTableDialog"
    @openWorkerDialog="openVictimWorkerDialog"
    @close-dialog="closeAlarmSendDialog"
  />
  <SosTableDialog
    ref="sosTableDialogRef"
    class="page__sosTable-dialog"
    :class="{ active: isSosTable }"
    @on-selected="onSelected"
    @close-dialog="closeSosTableDialog"
  />
  <WorkerDialog
    label="출역 인원 목록"
    class="page__worker-dialog"
    ref="victimWorkerDialog"
    :class="{ active: isVictimWorkerDialog }"
    @send-event="selecVictimtWorker"
    @close-dialog="closeWorkerDialog"
  />
</template>

<script setup lang="ts">
import CommonContent from '@components/Content.vue'
import AlarmTable from './Table.vue'
import CommonPagination from '@components/common/Pagination.vue'
import AlarmSendDialog from './AlarmSendDialog.vue'
import AlarmDetail from './AlarmDetail.vue'
import SosTableDialog from './SosTableDialog.vue'
import WorkerDialog from './WorkerDialog.vue'

import { onMounted, ref, watch } from 'vue'
import { useStore } from '@stores/index'
import { toast } from 'vue3-toastify'
import api from './selfApi'
import dayjs from 'dayjs'

// 테이블 메뉴 리스트
const menuList: string[] = ['알림종류', '업체', '내용', '작성일시']
const tableData = ref<[]>() // 전체 데이터
const totalCount = ref<number | undefined>()
const totalPage = ref<number>(0)
const limit = ref<number>(10)
const selectedPage = ref<number>(1)

let contentParams = {
  search_text: '',
  start_date: '',
  end_date: ''
}

const checkContentParams = (data: any) => {
  contentParams = data
  getData()
}

// 리스트 조회
const getData = () => {
  const store = useStore()
  const headerParams = store.getHeaderParams

  let params = {
    company_ids: JSON.stringify('전체'),
    start_date: contentParams.start_date === '' ? '1900-01-01' : contentParams.start_date,
    end_date: contentParams.end_date === '' ? dayjs().format('YYYY-MM-DD') : contentParams.end_date,
    search_text: contentParams.search_text ?? ''
  }
  params = Object.assign({}, params, headerParams)
  api.getEmrgList(params).then((res) => {
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
          totalPage.value =
            Math.ceil(totalCount.value / limit.value) !== 0
              ? Math.ceil(totalCount.value / limit.value)
              : 1
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


// 알림 다이어로그 ------------
// 알림
const isAlarmSend: any = ref(false)
const alarmSendDialogRef: any = ref(null)
const openAlarmSendDialog = () => {
  isAlarmSend.value = true
}
const closeAlarmSendDialog = () => {
  isAlarmSend.value = false
  getData()
}
// SOS 선택 창
const isSosTable: any = ref(false)
const sosTableDialogRef: any = ref(null)
const openSosTableDialog = (value: any) => {
  isSosTable.value = true
  sosTableDialogRef.value.openDialog(value)
}
const closeSosTableDialog = () => {
  isSosTable.value = false
}
const onSelected = (value: any) => {
  alarmSendDialogRef.value.setSosInfo(value)
}
// 재해자인원 선택 창
const victimWorkerDialog: any = ref(null)
const isVictimWorkerDialog: any = ref(false)
const openVictimWorkerDialog = () => {
  isVictimWorkerDialog.value = true
  victimWorkerDialog.value.getData()
}
const selecVictimtWorker = (value: any) => {
  alarmSendDialogRef.value.setWorkerInfo(value)
}
const closeWorkerDialog = () => {
  isVictimWorkerDialog.value = false
}

// -----------------
const alarmDetailRef: any = ref(null)
function openDetailDialog(data: any) {
  alarmDetailRef.value.openDialog(data)
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
@import '@assets/styles/main.scss';

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

.page__dialog
.page__detail-dialog,
.page__release-dialog,
.page__alarmSend-dialog,
.page__sosTable-dialog,
.page__worker-dialog,
.page__attend-dialog {
    display: none;
    &.active {
        position: absolute;
        z-index: 2;

        display: flex;
    }
}

</style>
