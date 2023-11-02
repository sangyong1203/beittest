import fetch from "@apis/fetch"

export default {
    
    //  SOS 요청이력 - 목록 조회
    getSOSPushList(params: any) {
        return fetch.post("/SosHistory/Get_SOSPushList", params)
    },
    // 알림 보내기
    sendEmergency(params: any){
        return fetch.post("/DashBoard/Send_Emergency", params)
    },
    // 알림이력 - 목록 조회
    getEmrgList(params: any) {
        return fetch.get("/emgr/Get_EmrgList", params)
    },

    // ----------------------------------------------------------------------------------------------------

    
}
