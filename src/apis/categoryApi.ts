import fetch from '@/apis/fetch'

export default {
    // 업체 dropdown list
    getCtgoCompanyListUser(params: any) {
        return fetch.post('/ctgo/Get_CtgoCompany_List_User', params)
    },
    // msds ctgo 구분 dropdown list
    getCtgoMsds(params: any) {
        return fetch.post('/ctgo/Get_CtgoMSDS', params)
    },
    // 공종 dropdown list
    getCtgoConstructionList(params: any) {
        return fetch.post('/ctgo/Get_CtgoConstruction_List', params)
    },
    // 직종 dropdown list
    getCtgoOccupationList(params: any) {
        return fetch.post('/ctgo/Get_CtgoOccupation_List', params)
    },
    // 국적 dropdown list
    getCtgoNationList(params: any) {
        return fetch.post('/ctgo/Get_CtgoNation_List', params)
    },
    // 권한 dropdown list
    getAdminPermission(params: any) {
        return fetch.post('/ui/Admin/Get_AdminPermission', params)
    },
    // 현장 dropdown list
    getSceneComboList(params: any) {
        return fetch.post('/scene/Get_Scene_Combo', params)
    },
    // 장비 dropdown list
    getCtgoEquipList(params: any) {
        return fetch.post('/ctgo/Get_Ctgo_Equip_List', params)
    },
    // 교육종류 dropdown list
    getCtgoEducationClass(params: any) {
        return fetch.post('/education/Get_EduClass', params)
    },
    // 공도구 구분 dropdown list
    getCtgoToolList(params: any) {
        return fetch.post('/Tool/Get_CtgoTool', params)
    },
    // 현장관릐/기준설정 - 현장세부정보설정 - 직책목록 조회
    getCtgoDutyList(params: any) {
        return fetch.post('/ctgo/Get_CtgoDuty_List', params)
    },
}
