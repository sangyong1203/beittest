<template>
    <DialogLayout :label="label" @close-dialog="closeDialog" @submit="onSubmit">
        <div class="select-box">
            <div class="select-box__filter-box">
                <button class="select-box__filter-box__filter" :class="{ active: companyMenu }" @click="getAdminData">관리자</button>
                <!-- <button  class="select-box__filter-box__filter" :class="{ active: sceneMenu }" @click="getUserData">근로자</button> -->
            </div>
            <div class="select-box__search-box">
                <SearchBar class="select-box__search-box__search-bar" @send-event="getSearchText" />
                <div class="select-box__search-box__data-box">
                    <div class="label-box">
                        <span class="label-box__label">업체</span>
                        <span class="label-box__label">출역 인원</span>
                    </div>
                    <div class="data-list">
                        <div v-for="item in companyList" :key="item.company_name" class="data-list__data" @click="searchCompany(item)">
                            <span class="data-list__data__label">{{ item.company_name }}</span>
                            <span class="data-list__data__value">{{ item.cnt }} 명</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div v-if="userList.length === 0" class="no-data">
            <img src="@assets/images/logo.svg" alt="" class="no-data__image" />
            <span class="no-data__title">조회 가능한 출역 인원이 없습니다.</span>
        </div>
        <div v-else class="userList-box">
            <CheckUserCard v-for="(item, index) in userList" :key="index" :data="item" @send-event="collect" />
        </div>
    </DialogLayout>
</template>

<script setup lang="ts">
import DialogLayout from "@components/common/layout/OneButtonLayout.vue"
import SearchBar from "@components/common/SearchBar.vue"
import CheckUserCard from "@components/common/form/CheckUserCard.vue"

import { ref } from "vue"
import { useStore } from "@stores/index"
import api from "@apis/selfApi"

interface CompanyList {
    cnt: number
    company_id: number
    company_name: string
}
interface UserList {
    company_name: string
    ctgo_construction_name: string
    ctgo_occupation_name: string
    full_url: string
    user_id: number
    user_name: string
    user_phone: string

    [prop: string]: any
}
interface Props {
    label: any
}
const { label } = defineProps<Props>()

const companyMenu = ref<boolean>(true)
const sceneMenu = ref<boolean>(false)
const dataType = ref<string>("ADMIN")
const searchText = ref<string>("")

const companyList = ref<CompanyList[]>([])
const userList = ref<UserList[]>([])
let selectedUsers: any = []
let attendeesList: any = [] // 이미 선택한 참석인원
// 다이얼로그 닫기
const emit = defineEmits(["close-dialog", "send-event", "submit"])
const closeDialog = (): void => {
    emit("close-dialog", false)
    selectedUsers = []
    attendeesList = []
    userIds.value = []
    userList.value.forEach((item) => {
        item.isChecked = false
    })
}
const onSubmit = () => {
    emit("send-event", selectedUsers)
    closeDialog()
}

// 출역현황 상세보기 필터
const getAdminData = (attendees: any): void => {
    sceneMenu.value = false
    companyMenu.value = true
    dataType.value = "ADMIN"

    attendeesList = attendees
    RACompanyCount(dataType.value)
    RAUser(dataType.value)
}
// const getUserData = (): void => {
//     sceneMenu.value = true
//     companyMenu.value = false
//     dataType.value = "USER"

//     RACompanyCount(dataType.value)
//     RAUser(dataType.value)
// }

// 인원선택 - 업체 Count 조회
const RACompanyCount = (dataType: string) => {
    const store = useStore()
    const headerRarams = store.headerParams

    let params = {
        company_ids: JSON.stringify(["전체"]),
        user_type: dataType,
    }
    params = Object.assign({}, params, headerRarams)
    api.getRACompanyCount(params).then((res:any) => {
        const rsCode = res.data.rsCode
        const data = res.data.rsMap

        if (rsCode === 0) {
            companyList.value = data
        }
    })
}
// 인원선택 - 유저데이터 조회
const RAUser = (dataType: string, companyId?: any) => {
    const store = useStore()
    const headerRarams = store.headerParams

    let params = {
        company_ids: JSON.stringify([companyId ?? "전체"]),
        user_type: dataType,
    }
    params = Object.assign({}, params, headerRarams)
    api.getRAUser(params).then((res:any) => {
        const rsCode = res.data.rsCode
        const data = res.data.rsMap

        if (rsCode === 0) {
            data.forEach((item: UserList) => {
                item.isChecked = false
            })

            userList.value = data

            if (attendeesList.length > 0) {
                userList.value.forEach((item: UserList) => {
                    attendeesList.forEach((itemA: any) => {
                        if (item.user_id === itemA.user_id) {
                            item.isChecked = true
                        }
                    })
                })
            }
        }
    })
}
// 인원선택 - 선택된 데이터 수집
const userIds = ref<number[]>([])
const collect = (data: any) => {
    // 인자로 받은 id : 자식 컴포넌트에서 전달받은 user_id
    data.isChecked = !data.isChecked
    let isInAttendeesList = false
    let attendeendex = null
    attendeesList.forEach((item: any, index: number) => {
        if (item.user_id === data.user_id) {
            isInAttendeesList = true
            attendeendex = index
        }
    })
    if (isInAttendeesList && data.isChecked === true) {
        return
    } else if (data.isChecked === false && isInAttendeesList) {
        attendeesList.splice(attendeendex, 1)
    } else if (data.isChecked) {
        userIds.value.push(data.user_id)
        selectedUsers.push(data)
    } else {
        const index = userIds.value.findIndex((item) => item === data.user_id)
        userIds.value.splice(index, 1)
        selectedUsers.splice(index, 1)
    }
}
const searchCompany = (value: any) => {
    RAUser(dataType.value, value.company_id)
}
const getSearchText = (value: any) => {
    searchText.value = value
}
const openDialog = (attendees: any) => {
    getAdminData(attendees)
}
defineExpose({
    openDialog,
})
</script>

<style lang="scss" scoped>
@import "@assets/styles/main.scss";

.select-box {
    display: flex;
    flex-direction: column;
    align-items: center;

    max-width: 340px;
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
        flex: 1;

        padding: 10px;
        gap: 24px;

        background: #f6f7f9;
        border-radius: 6px;

        box-shadow: inset 0px 0px 3px rgba(0, 0, 0, 0.15);
        overflow: hidden;
        
        &__search-bar {
            width: calc(96% + 2px);
            margin-left: -2px;
        }

        &__data-box {
            display: flex;
            flex-direction: column;

            width: 100%;
            height: calc(100% - 75px);

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
                &__data:hover {
                    cursor: pointer;
                }
                &__data {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;

                    width: 100%;

                    margin-top: 18px;

                    &__label {
                        display: flex;
                        align-items: center;
                        justify-content: center;

                        width: 50%;
                    }
                    &__value {
                        display: flex;
                        align-items: center;
                        justify-content: flex-end;

                        width: calc(50% - 60px);

                        padding-right: 60px;

                        color: $color-blue-800;
                    }
                }
            }
        }
    }
}
.userList-box {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-template-rows: 180px;
    align-items: flex-start;
    height: 100%;
    width: 100%;
    gap: 16px;
    overflow-y: scroll;

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

    width: 100%;
    height: 100%;

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
