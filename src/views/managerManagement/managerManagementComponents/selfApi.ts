import fetch from "@apis/fetch"

export default {
    
    // 관리자관리 - 목록 조회
    getAdminInfoList(params: any) {
        return fetch.post("/ui/Admin/Get_AdminInfo_List", params)
    },
    // 관리자관리 - 등록
    insertAdminInfo(params: any) {
        return fetch.post("/ui/Admin/Insert_AdminInfo", params)
    },
    // 관리자관리 - 상세
    getAdminInfo(params: any) {
        return fetch.post("/ui/Admin/Get_AdminInfo", params)
    },
    // 관리자관리 - 삭제
    deleteAdminInfo(params: any) {
        return fetch.post("/ui/Admin/Delete_AdminInfo", params)
    },
    // 관리자관리 - 수정
    updateAdminInfo(params: any) {
        return fetch.post("/ui/Admin/Update_AdminInfo", params)
    },
    // 관리자관리 - 비밀번호 초기화
    initAdminPassword(params: any) {
        return fetch.post("/ui/Admin/Update_Admin_Pass", params)
    },
    // 관리자관리 - 상세보기 - 비밀번호변경
    changePassword(parmas: any) {
        return fetch.post("/user/password", parmas)
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
