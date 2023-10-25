import fetch from "@/apis/fetch"

export default {
    userLoginPortal(params: any) {
        return fetch.post("/ui/signUp/Check_UserLogin", params)
    },

    // 로그인 화면
    // 로그인 화면 - 아이디 찾기
    findAuthId(params: any) {
        return fetch.post("/ui/signUp/Find_AuthId", params)
    },

    // ----------------------------------------------------------------------------------------------------

    // 대시보드
    // 대시보드 - 현장정보 - 날씨정보 데이터 조회
    getDashboard(params: any) {
        return fetch.post("/DashBoard/Get_DashBoard", params)
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

    // 현장관리 - 공사개요
    // 현장관리 - 공사개요 - 상세
    getConstructionSummary(params: any, sceneId: number) {
        return fetch.get(`/scene/details/${sceneId}`, params)
    },
    // 현장관리 - 공사개요 - 수정
    updateConstructionSummary(params: any) {
        return fetch.put("/scene/update", params)
    },
    // 현장관리 - 업체관리
    // 현장관리 - 업체관리 - 목록조회
    getCompanyList(params: any) {
        return fetch.post("/ui/Company/Get_Company_List", params)
    },
    // 현장관리 - 업체관리 - 등록
    insertCompanyInfo(params: any) {
        return fetch.post("/ui/Company/Insert_CompanyInfo", params)
    },
    // 현장관리 - 업체관리 - 조회
    getScene(params: any, id: number) {
        return fetch.get(`/scene/details/${id}`, params)
    },
    // 현장관리 - 업체관리 - 상세
    getCompanyInfo(params: any) {
        return fetch.post("/ui/Company/Get_CompanyInfo", params)
    },
    // 현장관리 - 업체관리 - 수정
    updateCompanyInfo(params: any) {
        return fetch.post("/ui/Company/Update_CompanyInfo", params)
    },
    // 현장관리 - 업체관리 - 삭제
    deleteCompanyInfo(params: any) {
        return fetch.post("/ui/Company/Delete_CompanyInfo", params)
    },

    // ----------------------------------------------------------------------------------------------------

    // 인력/차량 - 근로자관리
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
    // 인력/차량 - 관리자관리
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

    // ----------------------------------------------------------------------------------------------------
    // 교육/회의
    // 교육/회의 - 안전회의록
    // 교육/회의 - 안전회의록 - 목록 조회
    getSafetyMeetingList(params: any) {
        return fetch.post("/Minutes/Get_MinutesList", params)
    },
    // 교육/회의 - 안전회의록 - 상세
    getMinutesData(params: any) {
        return fetch.post("/Minutes/Get_MinutesData", params)
    },
    // 교육/회의 - 안전회의록 - 등록
    insertMinutes(params: any) {
        return fetch.post("/Minutes/Insert_Minutes", params)
    },
    // 교육/회의 - 안전회의록 - 수정
    updateMinutes(params: any) {
        return fetch.post("/Minutes/Update_Minutes", params)
    },
    // 교육/회의 - 안전회의록 - 삭제
    deleteMinutes(params: any) {
        return fetch.post("/Minutes/Update_MinutesDelete", params)
    },
    // 교육/회의 - 안전회의 참석자
    getAdminInfoApprList(params: any) {
        return fetch.post("/ui/Admin/Get_AdminInfo_Approval_List", params)
    },

    // 교육/회의 - 안전교육
    // 교육/회의 - 안전교육 - 교육종류 dropdown list
    getCtgoEducationClass(params: any) {
        return fetch.post("/education/Get_EduClass", params)
    },
    // 교육/회의 - 안전교육 - 목록 조회
    getEduList(params: any) {
        return fetch.post("/education/Get_EduList", params)
    },
    // 교육/회의 - 안전교육 - 상세
    getEduData(params: any) {
        return fetch.post("/education/Get_EduData", params)
    },
    // 교육/회의 - 안전교육 - 수정
    updateEdu(params: any) {
        return fetch.post("/education/Update_Edu", params)
    },
    // 교육/회의 - 안전교육 - 등록
    insertEdu(params: any) {
        return fetch.post("/education/Insert_Edu", params)
    },
    // 교육/회의 - 안전교육 - 삭제
    deleteEdu(params: any) {
        return fetch.post("/education/Delete_Edu", params)
    },
    // 교육참석자 list
    getEduUserList(params: any) {
        return fetch.post("/education/Get_EduUserList", params)
    },

    // ----------------------------------------------------------------------------------------------------

    // [중장비 - 반입전장비관리] --------------------------------------
    // 중방비 - 반입전장비관리 - 목록 조회
    getEquipManagement(params: any) {
        return fetch.get("/equip/list", params)
    },
    // 중장비 - 반입전장비관리 - 등록
    postEquipManagement(params: any) {
        return fetch.post("/equip/register", params)
    },
    // 중장비 - 반입전장비관리 - 삭제
    deleteEquipManagement(params: any) {
        return fetch.delete("/equip/delete", params)
    },
    // 중장비 - 반입전장비관리 - 수정
    updateEquipManagement(params: any) {
        return fetch.put("/equip/update", params)
    },
    // 중장비- 운전자 리스트 팝업
    getEquipDriverList(params: any) {
        return fetch.get("/equip/drivers", params)
    },
    // 중장비 - 반입전장비관리 - 상세
    getEquipManagementDetail(params: any, id: number) {
        return fetch.get(`/equip/details/${id}`, params)
    },

    // [중장비 - 장비일일점검] --------------------------------------
    // 중장비 - 장비일일점검 - 목록 조회
    getDailyEquipCheck(params: any) {
        return fetch.get("/equip/inspection-list", params)
    },
    // 중장비 - 장비일일점검 - 등록
    postDailyEquipCheck(params: any) {
        return fetch.post("/equip/inspection", params)
    },
    // 중장비 - 장비일일점검 - 상세
    getDailyEquipCheckDetail(params: any, id: number) {
        return fetch.get(`/equip/inspection/${id}`, params)
    },
    // 중장비- 장비일일점검 장비 팝업
    getEquipSelectList(params: any) {
        return fetch.get("/equip/inspection-target", params)
    },
    // 중장비 - 장비일일점검 - 삭제
    deleteDailyEquipCheck(params: any) {
        return fetch.delete("/equip/inspection/delete", params)
    },
    // 중장비 - 장비일일점검 - 수정
    updateDailyEquipCheck(params: any) {
        return fetch.put("/equip/inspection", params)
    },
    // 중장비 - 체크리스트
    getEquipCheckList(params: any, id: number) {
        return fetch.get(`/equip/questions/${id}`, params)
    },

    // [중장비 - 장비작업계획서] --------------------------------------
    // 중장비 - 장비작업계획서 - 목록 조회
    getWorkPlanList(params: any) {
        return fetch.get("/wp/list", params)
    },
    // 중장비 - 장비작업계획서 - 등록
    postWorkPlanRegister(params: any) {
        return fetch.post("/wp/register", params)
    },
    // 중장비 - 장비작업계획서 - 상세
    getWorkPlanDetail(params: any, id: number) {
        return fetch.get(`/wp/details/${id}`, params)
    },
    // 중장비 - 장비작업계획서 - 삭제
    deleteWorkPlan(params: any) {
        return fetch.delete("/wp/delete", params)
    },
    // 중장비 - 장비작업계획서 - 수정
    updateWorkPlan(params: any) {
        return fetch.put("/wp/update", params)
    },
    // 중장비 - 장비작업계획서 - My List 조회
    getMyWorkPlanList(params: any) {
        return fetch.put("/wp/my-list", params)
    },
    // 중장비 - 장비작업계획서 - 관리책임자
    getAdminList(params: any) {
        return fetch.post("/ui/Admin/Get_AdminInfo_List", params)
    },

    // ----------------------------------------------------------------------------------------------------

    // 작업관리 - 위험성평가 - 목록 조회
    getRiskAssessment(params: any) {
        return fetch.post("/ui/ra/Get_RiskAssessment", params)
    },
    // 작업관리 - 위험성평가 - 등록 - 작업단계등록 다이얼로그 - Tree 데이터 조회
    getCtgoRiskAssessmentByCode(params: any) {
        return fetch.post("/ui/ra/Get_Ctgo_RiskAssessment_By_Code", params)
    },
    // 작업관리 - 위험성평가 - 등록
    insertRiskAssessment(params: any) {
        return fetch.post("/ui/ra/Insert_RiskAssessment", params)
    },
    // 작업관리 - 위험성평가 - 등록 - 작업현장목록 조회
    getCtgoAreaList(params: any) {
        return fetch.post("/ctgo/Get_CtgoArea_List", params)
    },
    // 작업관리 - 위험성평가 - 등록 - 작업인원선택 - 업체별 카운터
    getRACompanyCount(params: any) {
        return fetch.post("/ui/ra/Get_RACompany_cnt", params)
    },
    // 작업관리 - 위험성평가 - 등록 - 작업인원선택 - 유저리스트
    getRAUser(params: any) {
        return fetch.post("/ui/ra/Get_RAUser", params)
    },
    // 작업관리 - 위험성평가 - 상세 조회 - 기본정보
    getRiskAssessmentDetail(params: any) {
        return fetch.post("/ui/ra/Get_RiskAssessmentData", params)
    },
    // 작업관리 - 위험성평가 - 상세 조회 - 작업내용
    getRiskAssessmentTreeData(params: any) {
        return fetch.post("/ui/ra/Get_RiskAssessment_TreeData", params)
    },
    // 작업관리 - 위험성평가 - 상세 조회 - 결재선 다이얼로그 - 업체 리스트(Tree Structure) 조회
    getApprovalLineUserList(params: any) {
        return fetch.post("/ui/Approval/ApprovalLine_UserList", params)
    },
    // 작업관리 - 위험성평가 - 상세 조회 - 결재선 다이얼로그 - 사용자 결재선 리스트 조회
    getUserApprovalLine(params: any) {
        return fetch.post("/ui/Approval/Get_LineList", params)
    },
    // 작업관리 - 위험성평가 - 상세 조회 - 결재선 다이얼로그 - 사용자 결재선 리스트 등록
    insertApprovalLine(params: any) {
        return fetch.post("/ui/Approval/Insert_LineInfo", params)
    },
    // 작업관리 - 위험성평가 - 상세 조회 - 결재선 다이얼로그 - 사용자 결재선 리스트 삭제
    deleteApprovalLine(parmas: any) {
        return fetch.delete("/ui/Approval/LineInfo", parmas)
    },
    // 작업관리 - 위험성평가 - 상세 조회 - 결재선 다이얼로그 - 최종결재라인 등록
    insertApprovalRequestLine(params: any) {
        return fetch.post("/ui/Approval/Insert_Approval_RequestLine", params)
    },
    // 작업관리 - 위험성평가 - 상세 조회 - 갤재요청(신규결재 상신)
    signApprovalRequest(params: any) {
        return fetch.post("/ui/Approval/Sign_Approval_Request", params)
    },
    // 작업관리 - 위험성평가 - 상세 조회 - 결재회수
    updateApprovalCancel(params: any) {
        return fetch.post("/ui/Approval/Update_ApprovalCancel", params)
    },
    // 작업관리 - 위험성평가 - 상세 조회 - 결재하기(승인 / 반려 / 결재취소)
    updateApproval(params: any) {
        return fetch.post("/ui/Approval/Update_Approval", params)
    },
    // 작업관리 - 위험성평가 - 삭제
    deleteRiskAssesment(params: any) {
        return fetch.post("/ui/ra/Delete_RiskAssessmentList", params)
    },
    // 작업관리 - 위험성평가 - 수정
    updateRiskAssessment(params: any) {
        return fetch.put("/ui/ra/UpdateRA", params)
    },
    // 작업관리 - 협력사위험성평가 - 목록 조회
    getRABP(params: any) {
        return fetch.get("/ui/ra/RABP", params)
    },
    // 작업관리 - 협력사위험성평가 - 상세 - 조회
    getRABPDetail(params: any) {
        return fetch.post("/ui/ra/BPRA_Detail", params)
    },
    // 작업관리 - 협력사위험성평가 - 상세 - 등록
    insertRABP(params: any) {
        return fetch.post("/ui/ra/Insert_BPRA", params)
    },
    // 작업관리 - 협력사위험성평가 - 상세 - 수정
    updateRABP(params: any) {
        return fetch.put("/ui/ra/Update_BPRA", params)
    },
    // 작업관리 - 협력사위험성평가 - 삭제
    deleteRABP(params: any) {
        return fetch.delete("/ui/ra/BPRA", params)
    },
    // 작업관리 - 위험성평가점검 - 목록 조회
    getRAInspection(params: any) {
        return fetch.get("/ui/ra/RAInspection", params)
    },
    // 작업관리 - 위험성평가점검 - 등록
    insertRAInspection(params: any) {
        return fetch.post("/ui/ra/Insert_RAInspection", params)
    },
    // 작업관리 - 위험성평가점검 - 등록 - 위험성평가 목록 불러오기
    getFactors(params: any) {
        return fetch.get("/ui/ra/Factors", params)
    },
    // 작업관리 - 위험성평가점검 - 등록 - 위험성평가 목록 Checked 후 등록 다이얼로그에 조회
    getRAFactorTree(params: any) {
        return fetch.post("/ui/ra/factortree", params)
    },
    // 작업관리 - 위험성평가점검 - 상세 데이터 조회
    getRAInspectionDetail(params: any) {
        return fetch.post("/ui/ra/RAInspection_Web", params)
    },
    // 작업관리 - 위험성평가점검 - 상세 - 수정
    updateRAInspection(params: any) {
        return fetch.put("/ui/ra/Rains", params)
    },
    // 작업관리 - 위험성평가점검 - 삭제
    deleteRAInspection(params: any) {
        return fetch.delete("/ui/ra/RAins", params)
    },

    // ----------------------------------------------------------------------------------------------------

    // 작업관리 - 작업허가서 - 목록 조회
    getWorkPermitList(params: any) {
        return fetch.get("/dp/list", params)
    },
    // 작업관리 - 작업허가서 - 현장소장 목록 조회
    getConstructionManagers(params: any) {
        return fetch.get("/dp/construction-managers", params)
    },
    // 작업관리 - 작업허가서 - 관리감독자 목록 조회
    getSafetyManagers(params: any) {
        return fetch.get("/dp/safety-managers", params)
    },
    // 작업관리 - 작업허가서 - 조치사항 목록 조회
    getDPWorkList(params: any) {
        return fetch.get("/ctgo/dp-work-list", params)
    },
    // 작업관리 - 작업허가서 - 조치사항 세부목록 조회
    getDPWorkDetail(params: any, id: number) {
        return fetch.get(`/ctgo/dp-work/${id}`, params)
    },
    // 작업관리 - 작업허가서 - 장비 조치사항 CheckBox 데이터 조회
    getDPWorkEquipList(params: any) {
        return fetch.get("/ctgo/dp-work-list/equip", params)
    },
    // 작업관리 - 작업허가서 - 등록
    insertWorkPermit(params: any) {
        return fetch.post("/dp/register", params)
    },
    // 작업관리 - 작업허가서 - 상세 조회
    getWorkPermitDetail(params: any, id: number) {
        return fetch.get(`/dp/details/${id}`, params)
    },
    // 작업관리 - 작업허가서 - 수정
    updateWorkPermit(params: any) {
        return fetch.put("/dp/update", params)
    },
    // 작업관리 - 작업허가서 - 삭제
    deleteWorkPermit(params: any) {
        return fetch.delete("/dp/delete", params)
    },

    // ----------------------------------------------------------------------------------------------------

    // 작업관리 - TBM - 목록 조회
    getTBMList(params: any) {
        return fetch.post("/TBM/Get_TBMList", params)
    },
    // 작업관리 - TBM - 등록
    insertTBM(params: any) {
        return fetch.post("/TBM/Insert_TBM", params)
    },
    // 작업관리 - TBM - 상세 조회
    getTBMDetail(params: any) {
        return fetch.post("/TBM/Get_TBMDetail", params)
    },
    // 작업관리 - TBM - 삭제
    deleteTBM(params: any) {
        return fetch.post("/TBM/Delete_TBM", params)
    },
    // 작업관리 - TBM - 수정
    updateTBM(params: any) {
        return fetch.post("/TBM/Update_TBM", params)
    },

    // ----------------------------------------------------------------------------------------------------

    // 작업관리 - MSDS 목록 조회
    getMSDSList(params: any) {
        return fetch.post("/MSDS/Get_MSDSList", params)
    },
    // 작업관리 - MSDS ctogo 구분 dropdown list
    getCtgoMSDS(params: any) {
        return fetch.post("/ctgo/Get_CtgoMSDS", params)
    },
    // 작업관리 - MSDS 등록
    insertMSDS(params: any) {
        return fetch.post("/MSDS/Insert_MSDS", params)
    },
    // 작업관리 - MSDS 상세
    getMSDSDetail(params: any) {
        return fetch.post("/MSDS/Get_MSDSData", params)
    },
    // 작업관리 - MSDS 삭제
    deleteMSDS(params: any) {
        return fetch.post("/MSDS/Delete_MSDS", params)
    },
    // 작업관리 - MSDS 수정
    updateMSDS(params: any) {
        return fetch.post("/MSDS/Update_MSDS", params)
    },

    // ----------------------------------------------------------------------------------------------------

    // 설정/관리 - 현장세부정보설정
    // 설정/관리 - 현장세부정보설정 - 공중목록 조회
    getCtgoConstructionList(params: any) {
        return fetch.post("/ctgo/Get_CtgoConstruction_List", params)
    },
    // 설정/관리 - 현장세부정보설정 - 공종목록 등록
    insertCtgoConstruction(params: any) {
        return fetch.post("/ctgo/Insert_CtgoConstruction", params)
    },
    // 설정/관리 - 현장세부정보설정 - 공종목록 삭제
    deleteCtgoConstruction(params: any) {
        return fetch.post("/ctgo/Delete_CtgoConstruction", params)
    },
    // 설정/관리 - 현장세부정보설정 - 공중목록 수정
    updateCtgoConstruction(params: any) {
        return fetch.post("/ctgo/Update_CtgoConstruction", params)
    },
    // 설정/관리 - 현장세부정보설정 - 직종목록 조회
    getCtgoOccupationList(params: any) {
        return fetch.post("/ctgo/Get_CtgoOccupation_List", params)
    },
    // 설정/관리 - 현장세부정보설정 - 직종목록 등록
    insertCtgoOccupation(params: any) {
        return fetch.post("/ctgo/Insert_CtgoOccupation", params)
    },
    // 설정/관리 - 현장세부정보설정 - 직종목록 삭제
    deleteCtgoOccupation(params: any) {
        return fetch.post("/ctgo/Delete_CtgoOccupation", params)
    },
    // 설정/관리 - 현장세부정보설정 - 직종목록 수정
    updateCtgoOccupation(params: any) {
        return fetch.post("/ctgo/Update_CtgoOccupation", params)
    },
    // 현장관리/기준설정 - 현장세부정보설정 - 직책목록 조회
    getCtgoDutyList(params: any) {
        return fetch.post("/ctgo/Get_CtgoDuty_List", params)
    },
    // 설정/관리 - 현장세부정보설정 - 직책목록 등록
    insertCtgoDuty(params: any) {
        return fetch.post("/ctgo/Insert_CtgoDuty", params)
    },
    // 설정/관리 - 현장세부정보설정 - 직책목록 삭제
    deleteCtgoDuty(params: any) {
        return fetch.post("/ctgo/Delete_CtgoDuty", params)
    },
    // 설정/관리 - 현장세부정보설정 - 직책목록 수정
    updateCtgoDuty(params: any) {
        return fetch.post("/ctgo/Update_CtgoDuty", params)
    },
    // 설정/관리 - 현장세부정보설정 - 위치목록 등록
    insertCtgoArea(params: any) {
        return fetch.post("/ctgo/Insert_CtgoArea", params)
    },
    // 설정/관리 - 현장세부정보설정 - 위치목록 삭제
    deleteCtgoArea(params: any) {
        return fetch.post("/ctgo/Delete_CtgoArea", params)
    },
    // 설정/관리 - 현장세부정보설정 - 위치목록 수정
    updateCtgoArea(params: any) {
        return fetch.post("/ctgo/Update_CtgoArea", params)
    },
    // 설정/관리 - 현장세부정보설정 - 작업 및 중장비
    // 설정/관리 - 현장세부정보설정 - 작업허가서 조치사항 가져오기
    getCtgoDpWorkList(params: any) {
        return fetch.get("/ctgo/dp-work-list", params)
    },
    // 설정/관리 - 현장세부정보설정 - 장비 목록 가져오기
    getCtgoDpEquipList(params: any) {
        return fetch.get("/ctgo/dp-work-list/equip", params)
    },
    // 설정/관리 - 현장세부정보설정 - 작업허가서/장비 상세
    getCtgoDpEquipData(params: any, dp_work_id: number) {
        return fetch.get(`/ctgo/dp-work/${dp_work_id}`, params)
    },
    // 설정/관리 - 현장세부정보설정 - 작업허가서/장비 조치사항 수정
    updateDpWorkEquip(params: any) {
        return fetch.post("/ctgo/Update_DpWorkEquip", params)
    },
    // 설정/관리 - 현장세부정보설정 - 장비 조치사항 추가
    insertDpWorkEquip(params: any) {
        return fetch.post("/ctgo/Insert_DpWorkEquip", params)
    },
    // 설정/관리 - 현장세부정보설정 - 장비 조치사항 삭제
    deleteDpWorkEquip(params: any) {
        return fetch.post("/ctgo/Delete_CtgoEquip", params)
    },
    // 설정/관리 - 현장세부정보설정 - 중장비(대분류) 조회
    getCtgoEquipList(params: any) {
        return fetch.post("/ctgo/Get_Ctgo_Equip_List", params)
    },
    // 설정/관리 - 현장세부정보설정 - 중장비(대분류) 등록
    insertCtgoEquip(params: any) {
        return fetch.post("/ctgo/Insert_CtgoEquip", params)
    },
    // 설정/관리 - 현장세부정보설정 - 중장비(대분류) 삭제
    deleteCtgoEquip(params: any) {
        return fetch.post("/ctgo/Delete_CtgoEquip", params)
    },
    // 설정/관리 - 현장세부정보설정 - 중장비(대분류) 수정
    updateCtgoEquip(params: any) {
        return fetch.post("/ctgo/Update_CtgoEquip", params)
    },
    // 설정/관리 - 현장세부정보설정 - 중장비(소분류) 조회
    getCtgoEquipSubList(params: any) {
        return fetch.post("/ctgo/Get_Ctgo_EquipSub_List", params)
    },
    // 설정/관리 - 현장세부정보설정 - 중장비(소분류) 등록
    insertCtgoEquipSub(params: any) {
        return fetch.post("/ctgo/Insert_CtgoEquipSub", params)
    },
    // 설정/관리 - 현장세부정보설정 - 중장비(소분류) 삭세
    deleteCtgoEquipSub(params: any) {
        return fetch.post("/ctgo/Delete_CtgoEquipSub", params)
    },
    // 설정/관리 - 현장세부정보설정 - 중장비(소분류) 수정
    updateCtgoEquipSub(params: any) {
        return fetch.post("/ctgo/Update_CtgoEquipSub", params)
    },
    // 설정/관리 - 현장세부정보설정 - 교육자료 카테고리 리스트
    getCtgoEdu(params: any) {
        return fetch.get("/ctgo/CtgoEdu", params)
    },
    // 설정/관리 - 현장세부정보설정 - 교육자료 카테고리 등록
    insertCTGOEdu(params: any) {
        return fetch.post("/ctgo/Insert_CtgoEdu", params)
    },
    // 설정/관리 - 현장세부정보설정 - 교육자료 카테고리 삭제
    deleteCtgoEdu(params: any) {
        return fetch.delete("/ctgo/CtgoEdu", params)
    },
    // 설정/관리 - 현장세부정보설정 - 위험성평가 각 항목 등록
    insertCtgoRiskAssessment(params: any) {
        return fetch.post("/ui/ra/Insert_Ctgo_RiskAssessment", params)
    },
    // 설정/관리 - 현장세부정보설정 - 위험성평가 각 항목 삭제
    deleteCtgoRiskAssessment(params: any) {
        return fetch.post("/ui/ra/Delete_Ctgo_RiskAssessment", params)
    },
    // 설정/관리 - 현장세부정보설정 - 위험성평가 각 항목 수정
    updateCtgoRiskAssessment(params: any) {
        return fetch.post("/ui/ra/Update_Ctgo_RiskAssessment", params)
    },

    // ----------------------------------------------------------------------------------------------------

    // 부적합
    // 부적합 - 안전점검부적합
    // 부적합 - 안전점검부적합 - 목록 조회
    getIncongruityList(params: any) {
        return fetch.post("/incongruity/Get_Incongruity_List", params)
    },
    // 부적합 - 안전점검부적합 - 상세
    getIncongruity(params: any) {
        return fetch.post("/incongruity/Get_Incongruity", params)
    },
    // 부적합 - 안전점검부적합 - 등록
    insertIncongruity(params: any) {
        return fetch.post("/incongruity/Insert_Incongruity", params)
    },
    // 부적합 - 안전점검부적합 - 수정
    updateIncongruity(params: any) {
        return fetch.post("/incongruity/Update_Incongruity_Complete", params)
    },
    // 부적합 - 안전점검부적합 - 삭제
    deleteIncongruity(params: any) {
        return fetch.post("/incongruity/Delete_Incongruity", params)
    },

    // ----------------------------------------------------------------------------------------------------

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

    // 결재모듈 (추후 작업 관리 쪽 결재 API 따로 분리하기)
    // 결재 - 결재선 재상신(초기화)
    resetApprovalRequest(params: any) {
        return fetch.delete("/ui/Approval/Reset_Approval", params)
    },
    // 결재 - 회수
    withdrawApproval(params: any) {
        return fetch.post("/ui/Approval/Update_ApprovalCancel", params)
    },

    // -----------------------------------
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
