<template>
    <!-- 근로자 관리 edit page -->
    <el-dialog
        :title="title"
        v-model="dialogFormVisible"
        :close-on-click-modal="false"
        :align-center="true"
        style="height: 85%"
         
        @closed="close">
        <el-form
            :model="form"
            class="editForm"
            label-position="left"
            label-width="86px">
            <el-form-item label="사진 :" class="avatar">
                <el-upload
                    class="avatar-uploader"
                    ref="avatarUploadRef"
                    v-model:file-list="form.avatarFile"
                    accept="image/png, image/jpeg, image/webp"
                    :show-file-list="false"
                    :auto-upload="false"
                    :on-change="onChangeAvatar"
                    :disabled="!isEdit">
                    <img v-if="imageUrl"
                        :src="imageUrl"
                        class="avatar"
                        alt="avatar" />
                    <el-icon v-else class="avatar-uploader-icon"><Plus/></el-icon>
                    
                </el-upload>
                <div v-if="imageUrl"  class="avatar-cover">
                    <el-button class="avatar-delete" @click="deleteAvatar" :disabled="!isEdit">
                        <el-icon><Delete /></el-icon>
                    </el-button>
                </div>
                
            </el-form-item>
            <el-form-item label="성명 :">
                <el-input v-model="form.user_name" :disabled="!isEdit" />
            </el-form-item>
            <el-form-item label="ID :">
                <el-input v-model="form.auth_id" disabled />
            </el-form-item>
            <el-form-item label="연락처 :">
                <el-input v-model="form.user_phone" :disabled="!isEdit" />
            </el-form-item>
            <el-form-item label="생년월일 :">
                <el-date-picker
                    v-model="form.user_birthday"
                    value-format="YYYY-MM-DD"
                    clearable
                    :disabled-date="disabledDate"
                    placeholder="생년월일을 선택하세요"
                    :disabled="!isEdit" />
            </el-form-item>
            <el-form-item label="국적 : ">
                <el-select
                    v-model="form.ctgo_nation_id"
                    id="ctgoNationList"
                    placeholder="국적을 선택하세요"
                    filterable
                    :disabled="!isEdit">
                    <el-option
                        v-for="item in $store.state.ctgoNationList"
                        :key="item.ctgo_nation_id"
                        :label="item.ctgo_nation_name"
                        :value="item.ctgo_nation_id" />
                </el-select>
            </el-form-item>
            <el-form-item label="연령 :">
                <el-input v-model="form.user_age" autocomplete="off" disabled />
            </el-form-item>
            <el-form-item label="비상연락처 :">
                <el-input
                    v-model="form.user_sos_phone"
                    autocomplete="off"
                    :disabled="!isEdit" />
            </el-form-item>
            <el-form-item label="운전자면허 번호 :" label-width="110px">
                <el-input
                    v-model="form.user_license_no"
                    autocomplete="off"
                    :disabled="!isEdit" />
            </el-form-item>
            <el-row style="width: 100%; padding: 20px">
                <el-tabs
                    v-model="activeName"
                    style="width: 100%"
                    class="inside-tabs-boxs">
                    <el-tab-pane label="현장정보" name="sceneInfo">
                        <!-------현장정보---------->
                        <el-table :data="form.company_data">
                            <!-- <el-table-column label="구분" >
                                <template #default="scope">
                                    {{ mainState(scope.row.main_state) }}
                                </template>
                            </el-table-column> -->
                            <el-table-column
                                label="현장"
                                property="scene_name" />
                            <el-table-column
                                label="업체"
                                property="company_name" />
                            <el-table-column
                                label="공종"
                                property="ctgo_construction_name" />
                            <el-table-column
                                label="직종"
                                property="ctgo_occupation_name" />
                            <el-table-column>
                                <template #default="scope">
                                    <el-button
                                        type="primary"
                                        size="small"
                                        @click.prevent="
                                            editSceneInfo(
                                                scope.row,
                                                scope.$index
                                            )
                                        "
                                        :disabled="!isEdit">
                                        수정
                                    </el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                    </el-tab-pane>
                    <el-tab-pane label="교육이력" name="eduHistory">
                        <!---------교육이력---------->
                        <el-upload
                            v-model:file-list="form.certificateFile"
                            :auto-upload="false"
                            :disabled="!isEdit">
                            <template #trigger>
                                <el-button type="primary" :disabled="!isEdit"
                                    >파일첨부</el-button
                                >
                            </template>
                        </el-upload>
                        <el-table class="uploadTable" :data="certificateFile">
                            <el-table-column
                                label="No"
                                type="index"
                                width="50px" />
                            <el-table-column label="파일명">
                                <template v-slot="scope">
                                    <el-link
                                        :href="scope.row.file_url_full"
                                        target="_blank">
                                        {{ scope.row.file_name }}
                                    </el-link>
                                </template>
                            </el-table-column>
                            <el-table-column width="100px">
                                <template #default="scope">
                                    <el-button
                                        plain
                                        @click.prevent="
                                            deleteCertificateFileRow(
                                                scope.$index
                                            )
                                        "
                                        :disabled="!isEdit">
                                        삭제
                                    </el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                        <el-divider content-position="left"
                            >교육 이수 현황(내부)</el-divider
                        >
                        <el-table :data="form.edu_data">
                            <el-table-column
                                label="No"
                                type="index"
                                width="50px" />
                            <el-table-column
                                label="교육종류"
                                property="education_class_name" />
                            <el-table-column
                                label="교육이수일"
                                property="education_date" />
                            <el-table-column
                                label="교육이수시간"
                                property="education_time" />
                            <el-table-column fixed="right" width="70"/>
                        </el-table>
                        <el-divider content-position="left"
                            >교육 이수 현황(외부)</el-divider
                        >
                        <el-table
                            :data="form.education_data"
                            style="width: 100%"
                            max-height="250">
                            <el-table-column
                                label="No"
                                type="index"
                                width="50px" />
                            <el-table-column
                                label="교육종류"
                                property="education_class_name">
                                <template #default="{ row }">
                                    <el-input
                                        v-model="row.education_class_name"
                                        :disabled="!isEdit"
                                        ></el-input>
                                </template>
                            </el-table-column>
                            <el-table-column
                                label="교육이수일"
                                width="150"
                                property="education_date">
                                <template #default="{ row }">
                                    <el-date-picker
                                        v-model="row.education_date"
                                        value-format="YYYY-MM-DD"
                                        format="YYYY-MM-DD"
                                        type="date"
                                        placeholder="날짜 선택" 
                                        :disabled="!isEdit"
                                        />
                                </template>
                            </el-table-column>
                            <el-table-column
                                label="교육이수시간"
                                class="eduTime"
                                property="education_time">
                                <template #default="{ row }">
                                    <el-time-select
                                        v-model="row.start_time"
                                        :max-time="row.end_time"
                                        placeholder="시작시간"
                                        start="00:00"
                                        step="00:30"
                                        end="23:30"
                                        editable
                                        :disabled="!isEdit"
                                        clearable />
                                    <el-time-select
                                        v-model="row.end_time"
                                        :min-time="row.start_time"
                                        placeholder="종료시간"
                                        start="00:00"
                                        step="00:30"
                                        end="23:30"
                                        editable
                                        :disabled="!isEdit"
                                        clearable />
                                </template>
                            </el-table-column>
                            <el-table-column fixed="right" width="70">
                                <template #default="scope">
                                    <el-button
                                        plain
                                        type="info"
                                        size="small"
                                        :disabled="!isEdit"
                                        @click.prevent="
                                            deleteRow(scope.$index)
                                        ">
                                        삭제
                                    </el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                        <el-button style="width: 100%" @click="onAddItem" :disabled="!isEdit">
                          추가
                        </el-button>
                    </el-tab-pane>
                    <el-tab-pane label="건강검진" name="health">
                        <!---------건강검진---------->
                        <el-upload
                            v-model:file-list="form.healthFile"
                            :auto-upload="false"
                            :disabled="!isEdit">
                            <template #trigger>
                                <el-button type="primary" :disabled="!isEdit"
                                    >파일첨부</el-button
                                >
                            </template>
                        </el-upload>
                        <el-table class="uploadTable" :data="healthFile">
                            <el-table-column
                                label="No"
                                type="index"
                                width="50px" />
                            <el-table-column label="파일명">
                                <template v-slot="scope">
                                    <el-link
                                        :href="scope.row.file_url_full"
                                        target="_blank">
                                        {{ scope.row.file_name }}
                                    </el-link>
                                </template>
                            </el-table-column>
                            <el-table-column width="100px">
                                <template #default="scope">
                                    <el-button
                                        type="primary"
                                        size="small"
                                        @click.prevent="
                                            deleteHealthFileRow(scope.$index)
                                        "
                                        :disabled="!isEdit">
                                        삭제
                                    </el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                        <!-- 건강검진 현황 -->
                        <el-divider content-position="left"
                            >건강검진 현황 </el-divider
                        >
                        <el-table
                            :data="form.health_data"
                            style="width: 100%"
                            max-height="250">
                            <el-table-column
                                label="No"
                                type="index"
                                width="50px" />
                            <el-table-column
                                label="건강검진 종류"
                                property="health_type">
                                <template #default="{ row }">
                                    <el-input
                                        :disabled="!isEdit"
                                        v-model="
                                            row.health_type
                                        "></el-input>
                                </template>
                            </el-table-column>
                            <el-table-column
                                label="검진일"
                                width="150"
                                property="health_date">
                                <template #default="{ row }">
                                    <el-date-picker
                                        v-model="row.health_date"
                                        value-format="YYYY-MM-DD"
                                        format="YYYY-MM-DD"
                                        type="date"
                                        :disabled="!isEdit"
                                        placeholder="검진일 선택" />
                                </template>
                            </el-table-column>
                            <el-table-column
                                label="기타 특이사항"
                                property="health_etc">
                                <template #default="{ row }">
                                    <el-input
                                        :disabled="!isEdit"
                                        v-model="
                                            row.health_etc
                                        "></el-input>
                                </template>
                            </el-table-column>
                            <el-table-column fixed="right" width="70">
                                <template #default="scope">
                                    <el-button
                                        plain
                                        type="info"
                                        size="small"
                                        :disabled="!isEdit"
                                        @click.prevent="
                                            deleteHealthRow(scope.$index)
                                        ">
                                        삭제
                                    </el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                        <el-button style="width: 100%" @click="onAddHealth" :disabled="!isEdit">
                          추가
                        </el-button>
                    </el-tab-pane>
                </el-tabs>
            </el-row>
        </el-form>

        <template #footer>
            <span class="dialog-footer">
                <el-button v-if="isEdit" @click="dialogFormVisible = false">
                    취소
                </el-button>
                <el-button v-if="!isEdit" type="primary" @click="toEdit">
                    수정
                </el-button>
                <el-button v-else type="primary" :loading="isLoading" @click="toSave">
                    저장
                </el-button>
                <el-button v-if="!isEdit" type="info" @click="toDelete">
                    삭제
                </el-button>
            </span>
        </template>
        <SceneDialog
            ref="sceneDialogRef"
            @toSaveScene="toSaveScene"></SceneDialog>
    </el-dialog>
</template>
<script>
import SceneDialog from "./sceneDialog.vue"
export default {
    components: {
        SceneDialog,
    },
    data() {
        return {
            isLoading: false,
            title: "",
            dialogFormVisible: false,
            isEdit: false,
            fileName: "",
            imageUrl: "",
            activeName: "sceneInfo",
            user_file: [],
            avatarFile: [],
            healthFile: [],
            certificateFile: [],
            form: {},
        }
    },
    methods: {
        // 다이어로그 창 열기
        open(val, row) {
            this.dialogFormVisible = true
            this.title = val
            if (val == "상세") {
                // 상세 페이지
                this.form = {
                    user_json: { insert: [], update: [], delete: [] },
                    fileList: [],
                    tableList: [],
                    avatarFile: [],
                    healthFile: [],
                    certificateFile: [],
                    education_data: [],
                    health_data:[]
                }
                this.getFormData(row)
                this.isEdit = false
            }
        },
        // 폼 데이터 가져오기
        getFormData(row) {
            let params = {
                view_user_id: row.user_id,
            }

            this.$api.getWorkerDetail(params).then((res) => {
                let data = res.data.rsObj
                data.user_data.edu_data = JSON.parse(data.user_data.edu_data)??[]
                data.user_data.health_data = JSON.parse(data.user_data.health_data)??[]
                data.user_data.education_data = JSON.parse(data.user_data.education_data)??[]
                this.form = Object.assign(this.form, data.user_data, {
                    company_data: data.user_company,
                })
                this.form.education_data.forEach( item => {
                    let time = []
                    time = item.education_time.split("~")
                    item.start_time = time[0]
                    item.end_time = time[1]
                })
                this.user_file = data.user_file !== null ? data.user_file : []
                this.user_file.map((item) => {
                    switch (item.view_type) {
                        case "profile":
                            this.avatarFile.push(item)
                            this.imageUrl = item.file_url_full
                            break
                        case "health":
                            this.healthFile.push(item)
                            break
                        case "certificate":
                            this.certificateFile.push(item)
                            break
                    }
                })
            })
        },

        // 저장
        toSave() {
            let orderNo = 0

            if (this.form.avatarFile?.length > 0) {
                this.form.user_json.insert.push({
                    order_no: orderNo++,
                    view_type: "profile",
                })
                this.form.fileList.push(this.form.avatarFile[0])
            }
            if (this.form.healthFile?.length > 0) {
                let length = this.form.healthFile.length
                for (let i = 0; i < length; i++) {
                    this.form.user_json.insert.push({
                        order_no: orderNo++,
                        view_type: "health",
                    })
                }
                this.form.fileList.push(...this.form.healthFile)
            }
            if (this.form.certificateFile?.length > 0) {
                let length = this.form.certificateFile.length
                for (let i = 0; i < length; i++) {
                    this.form.user_json.insert.push({
                        order_no: orderNo++,
                        view_type: "certificate",
                    })
                }
                this.form.fileList.push(...this.form.certificateFile)
            }
            this.setEducationTime(this.form.education_data)
            
            console.log("---education_data-", this.form.education_data)
            // console.log("---form-", this.form.fileList, this.form.user_json)
            let params = {
                bad_note: "",
                bad_push: 0,
                company_data: JSON.stringify(this.form.company_data),
                ctgo_nation_id: this.form.ctgo_nation_id,
                user_birthday: this.form.user_birthday,
                fileName: "user_file",
                files: this.form.fileList,
                user_json: JSON.stringify(this.form.user_json),
                user_license_no: this.form.user_license_no,
                user_license_state:
                    this.form.user_license_state == 1 ? true : false,
                user_name: this.form.user_name,
                user_phone: this.form.user_phone,
                user_sos_phone: this.form.user_sos_phone,
                view_user_id: this.form.user_id,
                edu_data: JSON.stringify(this.form.edu_data ?? ""),
                education_data: JSON.stringify(this.form.education_data ?? ""),
                health_data: JSON.stringify(this.form.health_data??"")
                
            }
            // if verify return false, it will not go ahead.
            this.form.fileList = false // false means files are not required
            if (!this.verifyForm(this.form)) {
                return
            }
            this.isLoading = true
            if (this.title == "상세") {
                this.$api.updateUserInfoUser(params).then((res) => {
                    this.isLoading = false
                    if (res && res.data?.rsCode == 0) {
                        this.$hint.warn("수정 성공!")
                        this.$parent.getList()
                    }
                    this.close()
                })
            }
        },
        // 수정
        toEdit() {
            this.isEdit = true
        },
        // 삭제
        toDelete() {
            this.$confirm("근로자 정보를 삭제하겠습니까?")
                .then(() => {
                    let params = {
                        scene_ids: JSON.stringify([this.$parent.sceneId]),
                        scene_id: this.$parent.sceneId,
                        view_user_ids: JSON.stringify([this.form.user_id]),
                    }

                    this.$api.deleteUserInfo(params).then((res) => {
                        if ( res && res.data?.rsCode === 0 ) {
                            this.$hint.success("삭제 성공!")
                            this.$parent.getList()
                            this.close()
                        }
                    })
                })
                .catch((action) => {
                    if (action == "cancel") {
                    } else {
                        this.$hint.error("삭제 실패!")
                    }
                })
        },
        // el-date-picker 오늘까지만 선택가능하게 제한
        disabledDate(time) {
            return time.getTime() > Date.now()
        },
        // 현장정보수정
        editSceneInfo(row, index) {
            this.$refs.sceneDialogRef.open(row, index, this.form.user_name)
        },
        // 현장정보 저장
        toSaveScene(data, index) {
            this.form.company_data[index] = Object.assign(
                this.form.company_data[index],
                data
            ) // 현장이 여러개 들어갈때 사용
        },

        // upload한 healthFile파일 삭제
        deleteHealthFileRow(index) {
            this.form.user_json.delete.push({
                seq_no: this.healthFile[index].seq_no,
            })
            this.healthFile.splice(index, 1)
        },
        // upload한 certificateFile파일 삭제
        deleteCertificateFileRow(index) {
            this.form.user_json.delete.push({
                seq_no: this.certificateFile[index].seq_no,
            })
            this.certificateFile.splice(index, 1)
        },
        // 대표/일반 구분
        mainState(val) {
            const state = {
                1: "대표",
                0: "일반",
            }
            return state[val]
        },
        onChangeAvatar(uploadfile) {
            // this.avatarFile = [uploadfile]
            console.log("this.avatarFile", this.avatarFile)
            this.avatarFile.forEach((item) => {
                this.form.user_json.delete.push({ seq_no: item.seq_no })
            })
            this.imageUrl = URL.createObjectURL(uploadfile.raw)
        },
        // avatar 삭제
        deleteAvatar(){
            // console.log("deleteAvatar------",this.avatarFile)
            this.avatarFile.forEach((item) => {
                this.form.user_json.delete.push({ seq_no: item.seq_no })
            })
            this.imageUrl = ""
        },
        // 교육이수현황(외부) 행
        createEducationData() {
            return {
                education_class_name: "",
                education_date: "",
                education_time:""

            }
        },
      
        onAddHealth(){
            let item = this.createHealthData()
            console.log("health_data",this.form,item)
            this.form.health_data.push(item)
        },
        deleteHealthRow(index) {
            this.form.health_data.splice(index, 1)
        },
        // 건강현황 행 
        createHealthData(){
          return {
            health_type:"",
            health_date:"",
            health_etc:"",
          }
        },

        // 교육이수현황(외부) 추가
        onAddItem() {
            let item = this.createEducationData()
            this.form.education_data.push(item)
        },
        
        // 교육이수현황(외부) 삭제
        deleteRow(index) {
            this.form.education_data.splice(index, 1)
        },
        // 교육 이수 현황(외부) 교육시간할당
        setEducationTime(data){
          console.log(data,"------data-----")
          data.forEach( item => {
            let startTime = item.start_time
            let endTime = item.end_time
            item.education_time  = startTime + "~"  + endTime
          })
        },
        // 다이어로그 창 닫기
        close() {
            this.form = {
                user_json: { insert: [], update: [], delete: [] },
            }
            this.healthFile = []
            this.activeName = "sceneInfo"
            this.certificateFile = []
            this.imageUrl = ""
            this.title = ""
            this.dialogFormVisible = false
            this.isEdit = false
            this.user_file= []
            this.avatarFile = []
            this.isLoading = false
        },
    },
}
</script>
<style lang="scss" scoped>
.editForm {
    width: 100%;
    display: inline-block;
    justify-content: space-around;
    .el-form-item {
        width: 50%;
        float: left;
        padding: 0 20px;
    }
    :deep(.el-form-item__label){
        white-space: nowrap;
    }
    :deep(.el-date-editor.el-input){
        width: 100%;
    }
    .tableList {
        width: 100%;
        padding: 0 20px;
        margin-top: 30px;
    }

    .el-form-item__content div {
        width: 100%;
    }
    .uploader {
        width: 100%;
        padding: 0 20px;
    }
    :deep(.avatar-uploader) {
        width: 180px !important;
        height: 180px;
        display: block;
        border: 1px dashed #dddddd !important;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
        transition: var(--el-transition-duration-fast);
        .el-upload {
            width: 100%;
            height: 100%;
        }
        img {
            max-height: 100%;
            max-width: 100%;
            margin: 0 auto;
        }
    }
    :deep(.avatar-uploader):hover {
        border-color: #ababab !important;
    }

    .el-icon.avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 178px;
        height: 178px;
        text-align: center;
    }
    :deep(.el-table td.el-table__cell div){
      display: flex;
      justify-content: center;
    }
    
}
/* avatar delete button*/
.avatar-cover:hover{
    opacity: 1;
}
.avatar-cover{
    position: absolute;
    width: 180px !important;
    height: 180px;
    border-radius: 6px;
    display: flex;
    justify-content: center;
    align-items: center;
    opacity: 0;
    font-size: 20px;
    background-color: var(--el-overlay-color-lighter);
    transition: opacity var(--el-transition-duration);
    .avatar-delete{
        position: absolute;
        background-color: transparent;
        width: 30px;
        height: 30px;
        border: none;
    }
    .el-icon {
        color: #fff;
        width: 100%;
        height: 100%;
        svg{
            width: 20px;
            height: 20px;
        }
    }
}
</style>
