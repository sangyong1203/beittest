<template>
    <DialogLayout :label="label" @close-dialog="closeDialog">
        <div class="select-box">
            <div class="select-box__search-box">
                <SearchBar class="select-box__search-box__search-bar" :data="searchText" @change="changeSearchText" @send-event="getSearchText" />
                <div class="select-box__search-box__data-box">
                    <div class="label-box">
                        <span class="label-box__label">{{ dataType }}</span>
                        <span class="label-box__label">출역 인원</span>
                    </div>
                    <div v-show="dataType === '업체'" class="data-list">
                        <div v-for="item in companyList" :key="item.company_name" class="data-list__data" @click="searchCompany(item.company_name)">
                            <span class="data-list__data__label">{{ item.company_name }}</span>
                            <span class="data-list__data__value">{{ item.cnt }} 명</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="userList-box">
            <UserCard v-for="item in companyUserData" :key="item.user_id" :data="item" @click="selectUser(item)" />
            <div v-if="companyUserData.length === 0" class="no-data">
                <img src="@assets/images/logo.svg" alt="" class="no-data__image" />
                <span class="no-data__title">조회 가능한 출역 인원이 없습니다.</span>
            </div>
        </div>
    </DialogLayout>
</template>

<script setup lang="ts">
import DialogLayout from "@components/common/ReleaseDialog.vue"
import SearchBar from "@components/common/SearchBar.vue"
import UserCard from "@components/common/DepartureUserCard.vue"

import { ref } from "vue"
import { useStore } from "@stores/index"
import api from "@apis/selfApi"
const store = useStore()
const headerRarams = store.getHeaderParams

interface props {
    label: string
}
const { label } = defineProps<props>()

const dataType = ref<string>("업체")
const searchText = ref<string>("")

const companyList:any = ref([])
const companyUserData:any = ref([])
const allComapnyUserData:any = ref([])


// 서브 다이얼로그 열기
const emit = defineEmits(["send-event", "close-dialog"])

// 출역현황 상세보기 데이터 조회
const getSearchText = (value: string): void => {
    searchText.value = value
    if(searchText.value){
        let dataMap:any = []
        allComapnyUserData.value.forEach( (item:any) => {
            if(item.company_name.includes(searchText.value) || item.user_name.includes(searchText.value)){
                dataMap.push(item) 
            }
        })
        companyUserData.value = dataMap
    } else {
        companyUserData.value = allComapnyUserData.value
    }
    
}

const changeSearchText = (value: any): void => {
    searchText.value = value
}

const searchCompany = (company_name: string) => {
    getSearchText(company_name)
}

const closeDialog = (): void => {
    searchText.value = ""
    companyList.value = []
    companyUserData.value = []
    allComapnyUserData.value = []
    emit("close-dialog", false)
}

const getData = (dataType: string) => {

    let params = {
        area_id: 0,
        company_ids: JSON.stringify(["전체"]),
        scene_ids: JSON.stringify(["전체"]),
        search_text: searchText.value ? searchText.value : "",
    }
    params = Object.assign({}, params, headerRarams)

    if (dataType === "업체") {
        api.getUserMoveNfcData(params).then((res: any) => {
            try {
                const rsCode = res.data.rsCode
                const data = res.data.rsMap

                if (rsCode === 0) {
                    companyList.value = res.data.rsObj.company_cnt
                    
                    if(searchText.value) {
                        companyUserData.value = data
                    } else {
                        companyUserData.value = data
                        allComapnyUserData.value = data
                    }

                }
            } catch (error) {
                console.log(error)
            }
        })
    }
    
}

defineExpose({ getData })

const selectUser = (item:any) => {
    console.log("selecte user", item)
    emit("send-event", item)
    closeDialog()
}
</script>

<style lang="scss" scoped>
@import "@assets/styles/main.scss";

.select-box {
    display: flex;
    flex-direction: column;
    align-items: center;

    min-width: 320px;
    height: 100%;

    gap: 10px;

    &__filter-box {
        display: flex;
        flex-direction: row;
        align-items: flex-start;

        width: calc(100% - 20px);

        padding: 10px;
        gap: 10px;

        background-color: $color-white-100;
        box-shadow: inset 0px 0px 3px rgba(0, 0, 0, 0.15);
        border-radius: 6px;

        &__filter {
            display: flex;
            align-items: center;
            justify-content: center;

            width: 50%;
            padding: 12px 48px;

            background: transparent;
            color: $color-white-800;

            outline: none;
            border: none;
            cursor: pointer;

            &.active {
                color: $color-blue-700;
                background-color: $color-white-000;
                box-shadow: 0px 0px 3px rgba(0, 0, 0, 0.15);
                border-radius: 6px;
            }
        }
    }
    &__search-box {
        display: flex;
        flex-direction: column;
        align-items: flex-start;

        width: calc(100% - 20px);
        height: 100%;
        padding: 10px;
        gap: 24px;

        background: #f6f7f9;
        border-radius: 6px;

        box-shadow: inset 0px 0px 3px rgba(0, 0, 0, 0.15);

        &__search-bar {
            width: calc(96% + 2px);
            margin-left: -2px;
        }

        &__data-box {
            display: flex;
            flex-direction: column;

            width: 100%;

            .label-box {
                display: flex;
                align-items: center;
                justify-content: space-between;

                padding-bottom: 18px;

                border-bottom: 1px solid $color-white-400;

                &__label {
                    display: flex;
                    align-items: center;
                    justify-content: center;

                    width: 50%;

                    font-weight: 600;
                    font-size: 17px;
                    line-height: 20px;
                }
            }
            .data-list {
                display: flex;
                flex-direction: column;

                width: 100%;

                gap: 6px;

                overflow-y: scroll;

                -ms-overflow-style: none; /* IE and Edge */
                scrollbar-width: none; /* Firefox */

                &::-webkit-scrollbar {
                    display: none; /* Chrome, Safari, Opera*/
                }

                &__data {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;

                    width: 100%;

                    margin-top: 18px;
                    cursor: pointer;

                    &__label {
                        display: flex;
                        align-items: center;
                        justify-content: center;

                        width: 50%;
                    }
                    &__value {
                        display: flex;
                        align-items: center;
                        justify-content: center;

                        width: 50%;
                        color: $color-blue-800;
                    }
                }
            }
        }
    }
}
.userList-box {
    display: grid;
    grid-template-rows: 184px;
    grid-template-columns: repeat(2, 1fr);
    align-items: flex-start;

    width: calc(100% - 320px);
    height: 100%;

    padding-right: 8px;
    gap: 16px;

    overflow-y: scroll;
    max-height: 540px;

    // /* Hide scrollbar for IE, Edge and Firefox */
    -ms-overflow-style: none; /* IE and Edge */
    scrollbar-width: none; /* Firefox */

    // /* Hide scrollbar for Chrome, Safari and Opera */
    &::-webkit-scrollbar {
        display: none;
    }
}
.no-data {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    width: 200%;
    height: 100%;
    min-height: 540px;

    padding-right: 2px;

    background-color: $color-white-000;
    border-radius: 6px;

    box-shadow: inset 0px 0px 3px rgba(0, 0, 0, 0.15);

    &__image {
        opacity: 0.6;
    }
    &__title {
        font-size: 18px;
        font-weight: 700;
        color: $color-white-400;
    }
}
</style>
