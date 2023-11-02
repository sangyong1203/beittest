/*  
 * 전역 변수와 함수을 여기에 쓰세요
*/
import { mapActions, mapState } from 'vuex'
export default {
  data() {
    return {
      defaultImg: '../assets/img/noImg.png',
    }
  },
  computed: {
		// vuex，state
    ...mapState({
      loginData: ({ login }) => login.loginData, // 로그인 데이타
			commonData: ({ common }) => common.commonData // 공통데이타
    }),
  },
  methods: {
    
    /**
     * mixin function
     * 업체 list 데이터 세팅 */
    setCompanyList() {
      let params = this.$store.state.headerParams
      this.$api.getCtgoCompanyListUser(params).then((res) => {
        if ( res && res.data?.rsCode === 0 ) {
          this.$store.commit("COMPANY_LIST", res.data.rsMap)
        }
      })
    },
    /**
     * mixin function
     * msds구분 list 데이터 세팅 */
    setCtgoMsdsList() {
      let params = this.$store.state.headerParams
      this.$api.getCtgoMsds(params).then((res) => {
        if ( res && res.data?.rsCode === 0 ) {
          this.$store.commit("CTGO_MSDS_LIST", res.data.rsMap)
        }
      })
    },
    /**
     * mixin function
     * 공종 list 데이터 세팅 */
    setCtgoConstructionList() {
      let params = this.$store.state.headerParams
      this.$api.getCtgoConstructionList(params).then((res) => {
        if ( res && res.data?.rsCode === 0 ) {
          this.$store.commit("CTGO_CONSTRUCTION_LIST", res.data.rsMap)
        }
      })
    },
    /**
     * mixin function
     * 직종 list 데이터 세팅 */
    setCtgoOccupationList() {
      let params = this.$store.state.headerParams
      this.$api.getCtgoOccupationList(params).then((res) => {
        if ( res && res.data?.rsCode === 0 ) {
          this.$store.commit("CTGO_OCCUPATION_LIST", res.data.rsMap)
        }
      })
    },
    /**
     * mixin function
     * 국적 list 데이터 세팅 */
    setCtgoNatioinList() {
      let params = this.$store.state.headerParams
      this.$api.getCtgoNationList(params).then((res) => {
        if ( res && res.data?.rsCode === 0 ) {
          this.$store.commit("CTGO_NATION_LIST", res.data.rsMap)
        }
      })
    },
    /**
     * mixin function
     * 권한 list 데이터 세팅 */ 
    setAdminPermission() {
      let params = {
        scene_id: 1,
        scene_ids: JSON.stringify([1]),
      }
      
      this.$api.getAdminPermission(params).then((res) => {
        if ( res && res.data?.rsCode === 0 ) {
          this.$store.commit("ADMIN_PERMISSION", res.data.rsMap)
        }
      })
    },
    /**
     * mixin function
     * 현장 list 데이터 세팅 */ 
    setSceneList() {
      let params = {
        scene_id: 1,
        scene_ids: JSON.stringify([1]),
      }
      
      this.$api.getSceneComboList(params).then((res) => {
        if ( res && res.data?.rsCode === 0 ) {
          this.$store.commit("SCENE_LIST", res.data.rsMap)
        }
      })
    },
    /** 
     * mixin function
     * 장비 list 데이터 세팅 */ 
    setCtgoEquipList() {
      let params = {
        scene_id: 1,
        scene_ids: JSON.stringify([1]),
      }
      
      this.$api.getCtgoEquipList(params).then((res) => {
        if ( res && res.data?.rsCode === 0 ) {
          this.$store.commit("CTGO_EQUIP_LIST", res.data.rsMap)
        }
      })
    },
    /**
     * mixin function
     * 교육종류 list 데이터 세팅 */ 
    setCtgoEducationClass() {
      let params = {}
      
      this.$api.getCtgoEducationClass(params).then((res) => {
        if ( res && res.data?.rsCode === 0 ) {
          this.$store.commit("CTGO_EDUCATION_CLASS", res.data.rsMap)
        }
      })
    },
    /** 
     * mixin function
     * 공도구 세팅 */ 
    setCtgoToolList() {
      let params = {
        scene_id: 1,
        scene_ids: JSON.stringify([1]),
      }
      
      this.$api.getCtgoToolList(params).then((res) => {
        if ( res && res.data?.rsCode === 0 ) {
          this.$store.commit("CTGO_TOOL_LIST", res.data.rsMap)
        }
      })
    },
    /** 
     * mixin function
     * 직책 세팅 
     */ 
    setCtgoDutyList() {
      let params = {
        scene_id: 1,
      }
      
      this.$api.getCtgoDutyList(params).then((res) => {
        if ( res && res.data?.rsCode === 0 ) {
          this.$store.commit("CTGO_DUTY_LIST", res.data.rsMap)
        }
      })
    },
    /**
     * mixin function
     * 요일을 반환 function
     * @returns 요일을 반환
     */
    getDay(){
      let date = Number(this.$dayjs().get("day"))
      let day = ""
      switch(date){
        case 0 :
        day = "일"
        break
        case 1 :
        day = "월"
        break
        case 2 :
        day = "화"
        break
        case 3 :
        day = "수"
        break
        case 4 :
        day = "목"
        break
        case 5 :
        day = "금"
        break
        case 6 :
        day = "토"
        break
      }
      return day
    },
    /** 
     * mixin function
     * 검색 버튼 
     */ 
    searchBtn(){
      this.getList()
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    validateAuthToken(rule, value){
      return value == this.form.auth_token
    },
    /**
     * mixin function
     * 전화번호 점검
     * @param {*} rule 
     * @param {*} value - 전화번호
     * @returns 
     */
    validatePhone(rule, value){
        const regex = /^0[0-9]{2}-?([0-9]{3,4})-?[0-9]{4}$/
        if(regex.test(value)=== true) return true
        return false
    },
    /**
     * mixin function
     * ID 점검
     * @param {*} rule 
     * @param {*} value -id 갑
     * @returns 
     */
    validateId(rule, value){
        const regex = /^[0-9a-zA-Z가-힣]+$/
        if(regex.test(value)) return true
        return false
    },
    /**
     * mixin function
     * 수자 점검
     * @param {*} rule 
     * @param {*} value -수자
     * @returns 
     */
    validateNumber(rule, value){
      if(!value) return true
      const regex = /^[0-9.]+$/
      if(regex.test(value)) return true
      return false
    },
    /**
     * mixin function
     * money 수자 점검
     * @param {*} rule 
     * @param {*} value -수자
     * @returns 
     */
    validateCurrencyNumber(rule, value){
      const regex = /^[0-9.,]+$/
      if(regex.test(value)) return true
      return false
    },
    /**
     * mixin function
     * 운전면호번호 점검
     * @param {*} rule 
     * @param {*} value 운전면호번호 
     * @returns 
     */
    validateUserLicenseNo(rule, value){
        const regex = /^[ㄱ-ㅎ|가-힣|0-9|]{9}$/;
        if(regex.test(value)) return true
        return false
    },
    /**
     * mixin function
     * password 점검
     * @param {*} rule 
     * @param {*} value - 비밀번호
     * @returns 
     */
    validatePassword(rule, value){
        const regex = /(?=.*\d{1,50})(?=.*[~`!@#$%\^&*()-+=]{1,50})(?=.*[a-zA-Z]{2,50}).{8,50}$/
        if(regex.test(value)) return true
        return false
    },
    /**
     * mixin function
     * put prop name in this argument
     * @param {*} field 
     */
    clearValidate(filed){
      this.$refs.ruleFormRef.clearValidate(filed)
    },
    // verify form 폼 검정
    verifyForm(form){
      let verified = true
      console.log(form.fileList)
      if(form.fileList !== false && form.fileList.length == 0 && form.uploaded_file_data.length == 0){
        this.$hint.warn('파일을 첨부하세요')
        verified = false
      }else {
        Object.entries(form).forEach( ([key, item]) => {
          if(item == "" || item ==  null || item == []){
            switch(key){
              case "notice_title":
                  this.$hint.warn('제목을 입력하세요')
                  verified = false
                  break
              case "notice_text":
                  this.$hint.warn('내용을 입력하세요')
                  verified = false
                  break
              case "msds_name":
                  this.$hint.warn('제품명을 입력하세요')
                  verified = false
                  break
              case "msds_text":
                  this.$hint.warn('내용을 입력하세요')
                  verified = false
                  break
              case "ctgo_msds_id":
                  this.$hint.warn('구분을 선택하세요')
                  verified = false
                  break
              case "user_name":
                  this.$hint.warn('성명을 입력하세요')
                  verified = false
                  break
              case "user_phone":
                  this.$hint.warn('전화번호를 입력하세요')
                  verified = false
                  break
              case "ctgo_nation_id":
                this.$hint.warn('국적을 선택하세요')
                verified = false
                break
              case "user_phone":
                this.$hint.warn('전화를 입력하세요')
                verified = false
                break
              case "company_ids":
                this.$hint.warn('업체를 선택하세요')
                verified = false
                break
              case "permission_data":
                this.$hint.warn('현장정보를 입력하세요')
                verified = false
                break
              case "permission_data":
                this.$hint.warn('현장정보를 입력하세요')
                verified = false
                break
                  
            }
          } 
        })
      }
      return verified
    }, 
    /**
     * input에 클릭할때 아내 내용 지우다
     * @param {*} event 
     */
    clearZero(event){
      if(event.target.value == 0){
        event.target.value = null
      }
    },
    /**
     * input에 blur할때 0 추가
     * @param {*} event 
     */
    inputZero(event){
      if(event.target.value === null || event.target.value === ""){
        event.target.value = 0
      }
    },
    /**
     * 
     * @param {Object} row - scope.row 혹은 Object
     * @param {string} propName - 객체안에 속성 이름
     */
    onlyNumber(row, propName){
      const regex = /^[0-9]+$/
      if(!regex.test(row[propName])){
        row[propName] = row[propName].replace(/[^0-9]/g, '');
        this.$message.error('숫자만 입력하세요');
      }
    },
    /**
     * 검색어 검색하기. 검색한 결과를 반환.
     * @param {string} searchText - 검색어
     * @param {Array} data  - 검색할 데이타
     * @param {Array} keys  - 검색할 table data의 property를 string array로 담는다. ex: ["name","age"]
     * @returns 
     */
    searchTextFillter(searchText="", data, keys=[]){
      if(searchText ==="" || !Array.isArray(data)) return  data
      console.log(typeof searchText)
      let newData = []
      data.forEach( item => {
        if(keys.some( key => item[key].includes(searchText) )){
          newData.push(item)   
        }
      })
      return newData
    },
    // when api responsed rsCode is not 0, then call this function for notation of problem
    rsAlert(rsCode = "None", rsMsg = "None"){
      switch(rsCode){
          case 1002:
              this.$alert(
                  '<p style="font-size:18px">다시 로그인 하세요</p>',
                  'Note:', 
                  {type:'warning',dangerouslyUseHTMLString: true,}
              )
              store.dispatch("logout")
              break
          default:
          this.$alert(
                  '<p style="font-size:18px">Unknow problem. Please contect IT support for help.</p>' + 
                  '<span>rscode: </span>' + rsCode +", msg: " + rsMsg,
                  'Note:', 
                  {type:'warning',dangerouslyUseHTMLString: true,}
          )
      }
    },
    getCompanyType(){
      return this.loginData?.user_main_company?.company_type
    },
    /**
     * mixin function
     * table NO골롬의 index방식
     * @param {number} index 
     * @returns 
     */
    indexMethod(index) {
      return index + 1 + (this.currentPage - 1) * this.pageSize
    },

    /**
     * mixin function
     * data list를 불러와서 pagination하는 방법
     * @param {*} data 
     * @returns 
     */
    paginationFilter(data){
      if(data == null || data == [] || data == undefined) return []
      let arr = []
      let i = (this.currentPage -1) * this.pageSize
      let end = this.currentPage * this.pageSize 
      for(i; i < end; i++){
        if(data[i]){
          arr.push(data[i])
        }
      }
      return arr
    },

    /**
     * mixin function
     * upload한 사진 url를 array로 가져오기
     * @param {*} file_data - 불로온 파일 데이타
     * @returns 
     */
    getPicSrcList(file_data){
      let urls = file_data.map(item=>{
          return item.full_url
      })
      return urls
    },
    /** 한국 currency 격식 return 있읍 */
    currency(number){
      let result
      if(number){
        number = number.toString().replaceAll(",","")
        const regex = /\B(?=(\d{3})+(?!\d))/g
        result = number.toString().replaceAll(regex, ",") 
      }
      return result
    },
    /** mixin function - 결재 my turn 판단 */
    setMyturn(data) {
      data.line_data.forEach((item) => {
        if (
          this.loginData.user_data.user_id == item.user_id &&
          item.approval_state == "결재대기"
        ) {
          this.form.my_turn = 1
        } 
      })
    },
    /**
     * mixin function
     * 대표/일반을 구분
     * @param {*} val - main_state
     * @returns 
     */
    mainState(val){
        const state = {
            1 : "대표",
            0 : "일반"
        }
        return state[val]
    },

    /**
     * mixin function
     * 권한 level에 대응한 권한명
     * @param {*} val - permission_level
     * @returns 
     */
    permissionName(val){
      let permission_name = this.$store.state.adminPermission.filter(item=>{
        return item.permission_level == val
      })[0]?.permission_name
      return permission_name
    },

    /**
     * mixin function
     * while pagination page size changed
     */
    handleSizeChange(){
      this.tableData = this.paginationFilter(this.data, this.total)
    },

    /**
     * mixin function
     * while pagination current page changed
     */
    handleCurrentChange(){
      this.tableData =  this.paginationFilter(this.data, this.total)
      this.$refs.tableRef.setScrollTop(0)
    },
    /**
     * mixin function
     * set dialog scroll to top
     * @param string formDialogRef 
     */
    setDiallogScrollToTop(formDialogRef){
      const dialogEl =  this.$refs[formDialogRef]?.dialogContentRef?.$el?.querySelector('.el-dialog__body')
      if (dialogEl) {
        dialogEl.scrollTop = 0
      }
    },
    /**
     * mixin function
     * 교육컨탠트에 자동입력
     * @param {*} val - education_class_id
     */
    getEducationContent(val){
      let selected = this.$store.state.ctgoEducationClass.filter( item => {
          return item.education_class_id == val
      })[0]??""
      if(selected){
        this.form.education_contents = selected.education_class_contents.split('.').map(item=>{
            return item.trim()
        }).join('.\n')
      }
    },
    /**
     * mixin function
     * 작업구간/부적합 위치 dropdown list
     */
    getArealist(){
      let params = this.$store.state.headerParams 
      this.$api.getCtgoAreaList(params).then( res => {
        if(res && res.data?.rsCode === 0){
          this.areaList = res.data.rsMap
        }
      })
    },
    /** 
     * mixin function
     * 파일 타입 판단
    */
    getFileType(fileName) {
      let suffix = ''; // 后缀获取
      let result = ''; // 获取类型结果
      if (fileName) {
        const flieArr = fileName.split('.'); // 根据.分割数组
        suffix = flieArr[flieArr.length - 1]; // 取最后一个
      }
      if (!suffix) return false; // fileName无后缀返回false
      suffix = suffix.toLocaleLowerCase(); // 将后缀所有字母改为小写方便操作
      // 匹配图片
      const imgList = ['png', 'jpg', 'jpeg', 'bmp', 'gif']; // 图片格式
      result = imgList.find(item => item === suffix);
      if (result) return 'image';
      // 匹配txt
      const txtList = ['txt'];
      result = txtList.find(item => item === suffix);
      if (result) return 'txt';
      // 匹配excel
      const excelList = ['xls', 'xlsx'];
      result = excelList.find(item => item === suffix);
      if (result) return 'excel';
      // 匹配word
      const wordList = ['doc', 'docx'];
      result = wordList.find(item => item === suffix);
      if (result) return 'word';
      // 匹配pdf
      const pdfList = ['pdf'];
      result = pdfList.find(item => item === suffix);
      if (result) return 'pdf';
      // 匹配ppt
      const pptList = ['ppt', 'pptx'];
      result = pptList.find(item => item === suffix);
      if (result) return 'ppt';
      // 匹配zip
      const zipList = ['rar', 'zip', '7z'];
      result = zipList.find(item => item === suffix);
      if (result) return 'zip';
      // 匹配视频
      const videoList = ['mp4', 'm2v', 'mkv', 'rmvb', 'wmv', 'avi', 'flv', 'mov', 'm4v'];
      result = videoList.find(item => item === suffix);
      if (result) return 'video';
      // 匹配音频
      const radioList = ['mp3', 'wav', 'wmv'];
      result = radioList.find(item => item === suffix);
      if (result) return 'radio';
      // 其他文件类型
      return 'other';
    }
  }
}
