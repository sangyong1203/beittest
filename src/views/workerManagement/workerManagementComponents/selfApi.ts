import fetch from "@apis/fetch"

export default {
    
    // 근로자관리 - 목록 조회
    getWorkerManagement(params: any) {
        return fetch.get("/user/list", params)
    },
    // 근로자관리 - 등록
    insertWorker(params: any) {
        return fetch.post("/user/register", params)
    },
    // 근로자관리 - 일괄등록
    postWorkerBatch(params: any) {
        return fetch.post("/user/register-batch", params)
    },
    // 근로자관리 - 상세보기 조회
    getWorkerManagementDetail(params: any, id: number) {
        return fetch.get(`/user/details/${id}`, params)
    },
    // 근로자관리 - 상세보기 - 비밀번호변경
    changePassword(parmas: any) {
        return fetch.post("/user/password", parmas)
    },
    postResetPassword(parmas: any) {
        return fetch.post("/user/reset-password", parmas)
    },
    // 근로자관리 - 수정
    updateWorkerManagement(params: any) {
        return fetch.put("/user/update", params)
    },
    // 근로자 관리 - 삭제
    deleteWorkerManagement(params: any) {
        return fetch.delete("/user/delete", params)
    },
    
    //  출역현황 list
    getAttendanceList(params: any) {
        return fetch.post("/Attendance/attendanceList", params)
    },
    //  출역현황 상세
    getAttendanceDetail(params: any) {
        return fetch.post("/Attendance/attendance", params)
    },
    // 출역현황 상세 - 히스토리 보기
    getUserMoveNFCDate(params: any) {
        return fetch.post("/Attendance/Get_UserMoveNfcDate", params)
    },

}
