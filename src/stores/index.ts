import { defineStore } from "pinia"
import api from "@apis/categoryApi"

export const useStore = defineStore("main", () => {
        return {
            loginData: {
                platform_type: 0,
                platform_key: "",
                user_session: "",
                user_data: {
                    user_id: 0,
                    user_name: "",
                },
                user_main_company: {
                    company_id: 0,
                    company_name: "",
                    company_type: "",
                    ctgo_construction_id: 0,
                    ctgo_construction_name: "",
                },
                user_permission: {
                    ctgo_duty_id: 0,
                    ctgo_duty_name: "",
                    permission_level: 0,
                    scene_id: 0,
                    scene_name: "",
                    user_id: 0,
                },
            },
            headerParams: {
                platform_key: "",
                platform_type: 0,
                scene_id: 1,
                user_id: 0,
                user_session: "",
            },
            companyList: [],
            constructionList: [],
            occupationList: [],
            nationList: [],
            equipList: [],
            eduClassList: [],
            dutyList: [],
            msdsList: [],
            sceneList:[],
            heatwaveAlarmTimeoutState: false,

            async initUseStore() {
                useStore()
            },

            async setLoginData(data: any) {
                this.loginData = data
            },

            async setHeaderParams() {
                const params = {
                    platform_type: this.loginData.platform_type,
                    platform_key: this.loginData.platform_key,
                    user_id: this.loginData.user_data.user_id,
                    user_session: this.loginData.user_session,
                    scene_id: 1,
                }
                this.headerParams = params
            },

            async setCompanyList() {
                const res = await api.getCtgoCompanyListUser(this.headerParams)
                this.companyList = res.data.rsMap
            },

            async setCtgoMsdsList() {
                const res = await api.getCtgoMsds(this.headerParams)
                this.msdsList = res.data.rsMap
            },

            async setCtgoConstructionList() {
                const res = await api.getCtgoConstructionList(this.headerParams)
                this.constructionList = res.data.rsMap
            },

            async setCtgoOccupationList() {
                const res = await api.getCtgoOccupationList(this.headerParams)
                this.occupationList = res.data.rsMap
            },

            async setCtgoNatioinList() {
                const res = await api.getCtgoNationList(this.headerParams)
                this.nationList = res.data.rsMap
            },

            async setSceneList() {
                const res = await api.getSceneComboList(this.headerParams)
                this.sceneList = res.data.rsMap
            },

            async setCtgoEquipList() {
                const res = await api.getCtgoEquipList(this.headerParams)
                this.equipList = res.data.rsMap
            },

            async setCtgoEducationClass() {
                const res = await api.getCtgoEducationClass(this.headerParams)
                this.eduClassList = res.data.rsMap
            },

            async setCtgoDutyList() {
                const res = await api.getCtgoDutyList(this.headerParams)
                this.dutyList = res.data.rsMap
            },
            async setHeatwaveAlarmTimeoutState( value :boolean) {
                this.heatwaveAlarmTimeoutState = value
            },
            persist: {
                enabled: true,
                strategies: [{ storage: localStorage }],
            }
        }
    })
