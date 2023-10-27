import fetch from "@/apis/fetch"

export default {
    
    // 대시보드
    // 대시보드 - 현장정보 - 날씨정보 데이터 조회
    getDashboard(params: any) {
        return fetch.post("/DashBoard/Get_DashBoard", params)
    },
    // 대시보드 - 현장정보 - 날씨정보 데이터 조회
    getKintexDashboard(params: any) {
        return fetch.post("/Kintex/Get_Dashboard", params)
    },
    // 대시보드 - 출역현황 - 상세데이터 조회 - 업체별
    getUserMoveNfcData(params: any) {
        return fetch.post("/Attendance/Get_UserMoveNfcData", params)
    },
    // 대시보드 - 출역현황 - 상세데이터 조회 - 구간별
    getUserMoveNfcDataArea(params: any) {
        return fetch.post("/Attendance/Get_UserMoveNfcData_Area", params)
    },
    // 대시보드 - 출역현황 - 상세데이터 조회 - 근로자 이동기록 상세 가져오기 - 바인딩 기능
    getUserMoveNfcDetail(params: any) {
        return fetch.post("/Attendance/Get_UserMoveNfcDetail", params)
    },
    // 전재결재 - 결재현황 - 상세데이터 조회
    getApprovalList(params: any) {
        return fetch.post("/ui/Approval/Get_ApprovalList", params)
    },
    // 대시보드 -결재현황 - 상세데이터 조회
    getDailyApprovalList(params: any) {
        return fetch.post("/ui/Approval/DashApproval", params)
    },
    // 대시보드 긴급알림 보내기
    sendEmergency(params: any){
        return fetch.post("/DashBoard/Send_Emergency", params)
    },

    // fcm push event
    getPushEvent(params:any) {
        return fetch.post("/DashBoard/Get_PushEvent", params)
    },
     // 재해자 선택 인원 불러오기
     getVictimList(params:any) {
        return fetch.post("/DashBoard/Get_VictimList", params)
    },
    // ----------------------------------------------------------------------------------------------------

    // 중장비 출역현황
    // 장비 출입내역 조회하기
    getEquipCountList(params: any) {
        return fetch.get("/equip/count", params)
    },
    // 장비 출입내역 조회하기
    insertEquipCount(params: any) {
        return fetch.post("/equip/count", params)
    },
    // 장비 출입내역  상세 조회하기
    getEquipCountDetail(params: any) {
        return fetch.get("/equip/count/detail", params)
    },
    // 장비 출입내역 조회하기
    updateEquipCount(params: any) {
        return fetch.put("/equip/count", params)
    },
    // 장비 출입내역 조회하기
    deleteEquipCount(params: any) {
        return fetch.delete("/equip/count", params)
    },
    
}
