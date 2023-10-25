<template>
  <el-dialog
    :title="sceneTitle"
    v-model="sceneDialogVisible"
    :close-on-click-modal="false"
    :align-center="true"
    width="300px"
     
    @closed="closeSceneDialog"
  >
    <el-form v-model="form">
      <el-form-item label="현장: ">
        <el-input v-model="form.scene_name" disabled></el-input>
      </el-form-item>
      <el-form-item label="구분  : " v-show="false">
        <el-select
          v-model="form.main_state"
          id="selectMainState"
          placeholder="선택하세요"
        >
          <el-option label="대표" :value="1" />
          <el-option label="일반"  :value="0"/>
        </el-select>
      </el-form-item>
      <el-form-item label="업체 : ">
        <el-select
          v-model="form.company_id"
          id="selectCompany"
          @change="companyChange"
          placeholder="업체를 선택하세요"
        >
          <el-option
            v-for="item in $store.state.companyList"
            :key="item.company_id"
            :label="item.company_name"
            :value="item.company_id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="공종  : ">
        <el-select
          v-model="form.ctgo_construction_id"
          id="ctgoConstructionList"
          @change="constructionChange"
          placeholder="공종을 선택하세요"
        >
          <el-option
            v-for="item in $store.state.ctgoConstructionList"
            :key="item.ctgo_construction_id"
            :label="item.ctgo_construction_name"
            :value="item.ctgo_construction_id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="직종  : ">
        <el-select
          v-model="form.ctgo_occupation_id"
          id="ctgoOccupationList"
          @change="occupationChange"
          placeholder="직종을 선택하세요"
        >
          <el-option
            v-for="item in $store.state.ctgoOccupationList"
            :key="item.ctgo_occupation_id"
            :label="item.ctgo_occupation_name"
            :value="item.ctgo_occupation_id"
          />
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="sceneDialogVisible = false">취소</el-button>
        <el-button type="primary" @click="toSaveScene"> 저장 </el-button>
      </span>
    </template>
  </el-dialog>
</template>
<script>
export default {
  data() {
    return {
      sceneTitle: "",
      sceneDialogVisible: false,
      form: {},
    }
  },
  methods: {
    open(row, index, user_name) {
      console.log("---row---", row)
      this.index = index
      this.sceneTitle = user_name + "님의 현장정보"
      this.sceneDialogVisible = true
      this.form.scene_name = row.scene_name
      this.form.company_id = row.company_id
      this.form.main_state = row.main_state
      this.form.ctgo_construction_id = row.ctgo_construction_id
      this.form.ctgo_occupation_id = row.ctgo_occupation_id
      this.form.company_name = row.company_name
      this.form.ctgo_construction_name = row.ctgo_construction_name
      this.form.ctgo_occupation_name = row.ctgo_occupation_name
    },
    toSaveScene() {
      this.$emit("toSaveScene", this.form, this.index)
      this.closeSceneDialog()
    },
    companyChange() {
      let name = ""
      this.$store.state.companyList.forEach((item) => {
        if (item.company_id == this.form.company_id) {
          name = item.company_name
        }
      })
      this.form.company_name = name
    },
    constructionChange() {
      let name = ""
      this.$store.state.ctgoConstructionList.forEach((item) => {
        if (item.ctgo_construction_id == this.form.ctgo_construction_id) {
          name = item.ctgo_construction_name
        }
      })
      this.form.ctgo_construction_name = name
    },
    occupationChange() {
      let name = ""
      this.$store.state.ctgoOccupationList.forEach((item) => {
        if (item.ctgo_occupation_id == this.form.ctgo_occupation_id) {
          name = item.ctgo_occupation_name
        }
      })
      this.form.ctgo_occupation_name = name
    },

    closeSceneDialog() {
      this.form = {}
      this.sceneTitle = ""
      this.sceneDialogVisible = false
    },
  },
}
</script>
