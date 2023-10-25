<template>
  <!-- 근로자 관리-->
  <div class="content-top">
    <el-form :inline="true">
      <el-form-item class="searchItem" label="업체 : ">
        <el-select
          v-model="form.company_id"
          id="selectCompany"
          placeholder="업체를 선택하세요"
          clearable
        >
          <el-option label="전체" value="전체" />
          <el-option
            v-for="item in $store.state.companyList"
            :key="item.company_id"
            :label="item.company_name"
            :value="item.company_id"
          />
        </el-select>
      </el-form-item>
      <el-form-item class="searchItem" label="국적  : ">
        <el-select
          v-model="form.ctgo_nation_id"
          id="ctgoNationList"
          filterable
          placeholder="국적을 선택하세요"
          clearable
        >
          <el-option label="전체" value="0" />
          <el-option
            v-for="item in $store.state.ctgoNationList"
            :key="item.ctgo_nation_id"
            :label="item.ctgo_nation_name"
            :value="item.ctgo_nation_id"
          />
        </el-select>
      </el-form-item>
      <el-form-item class="searchItem" label="검색 : ">
        <el-input
          id="searching"
          v-model="form.search_text"
          placeholder="검색어를 입력하세요"
          @keyup.enter="searchBtn"
          clearable
        >
          <template #prefix>
            <el-icon class="el-input__icon"><search /></el-icon>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item class="topButtons">
        <el-button type="primary" @click="searchBtn">검색</el-button>
        <el-button type="primary" @click="downloadProtect"
          >보호구지급대장출력</el-button
        >
      </el-form-item>
    </el-form>
  </div>
  <div class="content-body">
    <el-table
      class="tableList"
      ref="tableRef"  
      :data="tableData"
      height="100%"
      empty-text="데이터가 없습니다."
      @row-click="toDetail"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="30" />
      <el-table-column
        type="index"
        :index="indexMethod"
        label="NO"
        width="50"
      />
      <el-table-column property="company_name" label="업체" width="200" />
      <el-table-column property="user_name" label="성명" />
      <el-table-column property="ctgo_nation_name" label="국적" />
      <el-table-column property="reg_date" label="등록일" />
      <el-table-column property="certificate_state" label="안전교육증" />
      <el-table-column property="health_state" label="건강검진표" />
    </el-table>
    <el-pagination
      v-model:currentPage="currentPage"
      v-model:page-size="pageSize"
      :page-sizes="[10, 20, 50, 200]"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>

  <EditPage ref="editPageRef"></EditPage>
</template>
<script>
import EditPage from "./editPage/index.vue"
import Excel from "@common/Excel.module.js"
export default {
  components: {
    EditPage,
  },
  data() {
    return {
      currentPage: 1,
      pageSize: 20,
      total: 0,
      sceneId: "전체",
      data: [],
      tableData: [],
      multipleSelection: [],
      form: {
        ctgo_nation_id: "",
        ctgo_construction_id: "",
        ctgo_occupation_id: "",
        search_text: "",
        company_id: "",
        dateRange: [],
      },
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    getList() {
      let params = {
        company_ids: JSON.stringify([
          this.form.company_id == "" ? "전체" : this.form.company_id,
        ]),
        ctgo_nation_id: this.form.ctgo_nation_id == "" ? 0 : this.form.ctgo_nation_id
        ,
        ctgo_construction_id: 
          this.form.ctgo_construction_id == ""
            ? 0
            : this.form.ctgo_construction_id
        ,
        ctgo_occupation_id: JSON.stringify(
          this.form.ctgo_occupation_id == "" ? 0 : this.form.ctgo_occupation_id
        ),
        scene_ids: JSON.stringify([this.sceneId]),
        start_date:
          this.form.dateRange?.length > 0
            ? this.form.dateRange[0]
            : this.$dayjs("1900-01-01").format("YYYY-MM-DD"),
        end_date:
          this.form.dateRange?.length > 1
            ? this.form.dateRange[1]
            : this.$dayjs().format("YYYY-MM-DD"),
        search_text: this.form.search_text??"",
        bad_push: "전체",
      }
      
      this.$api.getWorkerList(params).then((res) => {
        if (res && res.data?.rsCode === 0) {
          this.data = res.data.rsMap ?? []
          this.total = this.data.length
          this.tableData = this.paginationFilter(this.data)
        } else {
          //this.rsAlert(res.data?.rsCode, res.data.rsMsg)
        }
      })
    },
    // table data seleted
    handleSelectionChange(val) {
      this.multipleSelection = val
      console.log("---table selected ----", val)
    },
    // table list를 더블 클릭할때 상세페지열기
    toDetail(row) {
      this.$refs.editPageRef.open("상세", row)
    },
    // 보호구지급대장출력
    async downloadProtect() {

      let listWorker = this.multipleSelection ?? []
      var bodyStyle = {
        textAlign: "center",
        border: "1px solid #000000",
        verticalAlign: "middle",
        height: 60,
      }

      var bodyStyle2 = {
        verticalAlign: "middle",
        border: "1px solid #000000",
        textAlign: "center",
        fontSize: 25,
        height: 80,
      }

      var bodyStyle3 = {
        textAlign: "center",
        border: "1px solid #000000",
        backgroundColor: "#d3d3d3",
        verticalAlign: "middle",
      }

      var bodyStyle4 = {
        textAlign: "center",
        border: "1px solid #000000",
        backgroundColor: "#fff5f5f5",
        verticalAlign: "middle",
        width: 92,
      }

      var sheet = {
        name: "보호구 지급 대장",
        data: [
          [],
          [
            {
              text: "보호구지급대장",
              colspan: 11,
              style: Object.assign(bodyStyle2),
            },
          ],
          [],
          [
            {
              text: "NO",
              rowspan: 4,
              style: Object.assign({ width: 92 }, bodyStyle3),
            },
            {
              text: "소속",
              rowspan: 4,
              style: Object.assign({ width: 184 }, bodyStyle3),
            },
            {
              text: "공종",
              rowspan: 4,
              style: Object.assign({ width: 92 }, bodyStyle3),
            },
            {
              text: "안전보호구",
              rowspan: 2,
              colspan: 5,
              style: Object.assign(bodyStyle3),
            },
            {
              text: "성명",
              rowspan: 4,
              style: Object.assign({ width: 92 }, bodyStyle3),
            },
            {
              text: "서명",
              rowspan: 4,
              style: Object.assign({ width: 92 }, bodyStyle3),
            },
            {
              text: "비고(지급일)",
              rowspan: 4,
              style: Object.assign({ width: 92 }, bodyStyle3),
            },
          ],
          [],
          [
            { text: "안전모", rowspan: 2, style: Object.assign(bodyStyle4) },
            { text: "안전화", rowspan: 2, style: Object.assign(bodyStyle4) },
            { text: "안전대", rowspan: 2, style: Object.assign(bodyStyle4) },
            { text: "각반", rowspan: 2, style: Object.assign(bodyStyle4) },
            { text: "기타 (보안경, 방진마스크 등)", rowspan: 2, style: Object.assign(bodyStyle4) },
          ],
          [],
        ],
      }

      var body = []
      listWorker.forEach(function (worker, index) {
        var protection = JSON.parse(worker.user_protection || "{}")
        console.log("-----protection---",protection)
        if(worker.user_sign_file){
          body.push([
            { text: index + 1, style: bodyStyle },
            { text: worker.company_name, style: bodyStyle },
            { text: worker.ctgo_construction_name, style: bodyStyle },
            { text: protection.helmet ? "○" : "", style: bodyStyle },
            { text: protection.shoes  ? "○" : "", style: bodyStyle },
            { text: protection.belt ? "○" : "",  style: bodyStyle },
            { text: protection.gaiters ? "○" : "", style: bodyStyle },
            { text: protection.vest ? "○" : "", style: bodyStyle },
            { text: worker.user_name, style: bodyStyle },
            { img: {src:worker.user_sign_file, top: 5, left: 25, width: 50, height: 50 }, style: bodyStyle },
            { text: worker.reg_date, style: bodyStyle },
          ])
        } else {
          body.push([
            { text: index + 1, style: bodyStyle },
            { text: worker.company_name, style: bodyStyle },
            { text: worker.ctgo_construction_name, style: bodyStyle },
            { text: protection.helmet ? "○" : "", style: bodyStyle },
            { text: protection.shoes  ? "○" : "",  style: bodyStyle },
            { text: protection.belt  ? "○" : "",  style: bodyStyle },
            { text: protection.gaiters ? "○" : "", style: bodyStyle },
            { text: protection.vest ? "○" : "", style: bodyStyle },
            { text: worker.user_name, style: bodyStyle },
            { text: "", style: bodyStyle },
            { text: worker.reg_date, style: bodyStyle },
          ])
        }
      })
      body.push([{ text: "" },])

      sheet.data = sheet.data.concat(body)
      Excel.make([sheet], "보호구 지급 대장")
    },
  },
}
</script>

<style lang="scss" scoped></style>
