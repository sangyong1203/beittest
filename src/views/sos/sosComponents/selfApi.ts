import fetch from "@apis/fetch"

export default {
    
    // 게시판 - SOS 요청이력 - 목록 조회
    getSOSPushList(params: any) {
        return fetch.post("/SosHistory/Get_SOSPushList", params)
    },
    // 게시판 - 작업중지 요청이력 - 목록 조회
    getStopList(params: any) {
        return fetch.post("/Stop/Get_StopList", params)
    },
    // 게시판 - 긴급알림이력 - 목록 조회
    getEmrgList(params: any) {
        return fetch.get("/emgr/Get_EmrgList", params)
    },

    // ----------------------------------------------------------------------------------------------------

    
}
