<template>
    <FormDialog :title="'결재선 지정'" @close-dialog="closeDialog" @submit="onSubmit">
        <div class="container">
            <div class="container__search-box">
                <SearchBar :data="searchText" @send-event="search" @change="changeSearchText" />
                <div class="container__search-box__company-box">
                    <span class="label">업체별</span>
                    <div class="tree-box">
                        <div v-for="(item, index) in treeData" :key="index" class="company-list">
                            <div class="company-list__company" @click.prevent="openDutyList(index)">
                                <div class="company-list__company__item">
                                    <button class="button" :class="{ active: item.isActive }">
                                        <img src="@assets/icons/arrowDown.svg" alt="" />
                                    </button>
                                    <img src="@assets/icons/apartment.svg" alt="" class="icon" />
                                    <span class="name">{{ item.company_name }}</span>
                                </div>
                                <!-- 데이터가 없을 때 0으로 표시할 지 '-'로 표시할 지 추후 결정 -->
                                <span class="company-list__company__total">{{ item.total ? item.total : '-' }} </span>
                            </div>
                            <div v-for="(duty, subIndex) in item.duty" :key="subIndex" class="company-list__dropdown" :class="{ active: item.isActive }">
                                <div class="company-list__dropdown__list" @click.prevent="openUserList(index, subIndex)">
                                    <div class="item">
                                        <img v-if="duty.isActive === true" src="@assets/icons/folder_open.svg" alt="" class="item__icon" />
                                        <img v-else src="@assets/icons/folder.svg" alt="" class="item__icon" />
                                        <span class="item__name">{{ duty.ctgo_duty_name }}</span>
                                    </div>
                                    <span class="value">{{ duty.user?.length }}</span>
                                </div>
                                <div v-for="(user, index) in duty.user" :key="index" class="company-list__sub-dropdown" :class="{ active: duty.isActive }">
                                    <div class="company-list__sub-dropdown__list">
                                        <div class="item" :class="{ active: user.isSelected }" @click.prevent="selected(user)">
                                            <img src="@assets/icons/user.svg" alt="" class="item__icon" :class="{ active: user.isSelected }" />
                                            <span class="item__name" :class="{ active: user.isSelected }">{{ user.user_name }}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="container__search-box__user-list">
                    <template v-if="userList.length">
                        <div  v-for="item in userList" :key="item.user_id" class="user-data">
                        <img src="@assets/icons/user.svg" alt="" class="user-data__icon" />
                        <span class="user-data__name">{{ item.user_name }} ({{ item.ctgo_duty_name }})</span>
                        <button class="user-data__button" @click.prevent="removeList(item.user_id)">
                            <img src="@assets/icons/close.svg" alt="" />
                        </button>
                    </div>
                    </template>
                    
                    <div v-else class="user-noData">
                        <img src="@assets/images/logo.svg" alt="" class="user-noData__image" />
                        <span class="user-noData__title">지정된 결재가능자가 없습니다.</span>
                    </div>
                </div>
            </div>
            <div class="container__button-box">
                <CommonIconButton :icon="'doubleArrowLeft'" :theme="'normal'" @click.prevent="deleteApprover" />
                <CommonIconButton :icon="'doubleArrowRight'" :theme="'normal'" @click.prevent="addApprover" />
            </div>
            <div class="container__approval-line">
                <div class="container__approval-line__top">
                    <FormApprovalDropdown :dropdownLabel="'사용자 결재선'" :button-label="'삭제'" :data="userApprovalLine" @send-event="getTableData" @delete="init" />
                    <FormCheckTable :drafter="drafter" :data="tableData" @send-event="removeRow" />
                </div>
                <FormApprovalInput ref="ApprovalInputyRef" :inputLabel="'사용자 결재선명'" :buttonLabel="'등록'" @send-event="insertApprovalLine" />
            </div>
        </div>
    </FormDialog>
</template>

<script setup lang="ts">
import SearchBar from '@components/common/SearchBar.vue'
import CommonIconButton from '@components/common/button/IconButton.vue'
import FormDialog from '@components/common/layout/FormDialogLayout.vue'
import FormApprovalDropdown from '@components/common/approval/ApprovalDropdown.vue'
import FormApprovalInput from '@components/common/approval/ApprovalInput.vue'
import FormCheckTable from '@components/common/form/CheckTable.vue'

import { ref, toRefs } from 'vue'
import { toast } from 'vue3-toastify'
import { useStore } from '@stores/index'
import api from '@apis/selfApi'

interface Props {
    drafter: any
}

const props = defineProps<Props>()
const {drafter } = toRefs(props)

// Store 접근
const store = useStore()

const searchText = ref<string>('') // 검색어
const treeData:any = ref([]) // 업체별 결재가능자 리스트
const userList:any = ref([]) // 결재선에 추가할 리스트
const tableData:any = ref([]) // 결재선 테이블 데이터
const userApprovalLine:any = ref([])
const ApprovalInputyRef = ref<InstanceType<typeof FormApprovalInput> | null>(null)

const id = ref<number>(0)

function openDialog(value:any){
    id.value = value.id
    getApprovalList()
    search("")
}
defineExpose({openDialog})

const search = (searchInput: string) => {
    if (searchInput !== null && searchInput !== '') {
        if (treeData.value === null) {
            return // 빈 처리 또는 오류 처리
        }

        const filteredData = treeData.value.filter((item:any) => {
            if (!item.duty || !Array.isArray(item.duty)) {
                return false
            }

            const filteredDuty = item.duty.filter((duty:any) => {
                return (
                    duty.user &&
                    duty.user.some((user:any) => {
                        const userName = user.user_name.toLowerCase()
                        return userName.includes(searchInput.toLowerCase())
                    })
                )
            })

            if (filteredDuty.length > 0) {
                item.isActive = true // 필터링된 상위 요소의 isActive 값을 변경
                item.duty.forEach((dutyItem:any) => {
                    const isDutyItemIncluded = filteredDuty.some((duty:any) => duty.ctgo_duty_id === dutyItem.ctgo_duty_id)
                    dutyItem.isActive = isDutyItemIncluded // 해당 하위 요소의 isActive 값을 변경
                })
            } else {
                item.isActive = false // 필터링되지 않은 상위 요소의 isActive 값을 변경
            }
            return filteredDuty.length > 0 // user_name을 가진 duty가 있는 경우에만 필터링
        })
        treeData.value = filteredData
    } else {
        getData('')
    }
}

// 업체별 트리구조 데이터 조회
const getData = (searchInput: string) => {
    if (searchInput != null) {
        searchText.value = searchInput

        const headerParams = store.headerParams

        let params = {}
        params = Object.assign({}, params, headerParams)
        console.log("getApprovalLineUserList params", params)
        api.getApprovalLineUserList(params).then((res:any) => {
            const rsCode = res.data.rsCode
            const data = res.data.rsMap

            if (rsCode === 0) {
                try {
                    data.forEach((item: any, index: number) => {
                        // 업체별 드랍다운을 위한 property 추가
                        item.isActive = false
                        // 관리자별 드랍다운을 위한 property 추가
                        item.duty = JSON.parse(item.duty)

                        if (item.duty !== null) {
                            item.duty.forEach((list: any) => {
                                list.isActive = false

                                if (list.user === null) {
                                    list.total = 0
                                } else {
                                    list.user.forEach((user:any) => {
                                        // 등록 중복 방지를 위한 property 추가
                                        user.isSelected = false
                                    })
                                    list.total = list.user.length
                                }
                            })
                            item.total = item.duty
                                .map((item: any) => {
                                    return item.total
                                })
                                .reduce((acc: number, value: number) => {
                                    return acc + value
                                }, 0)
                        } else {
                            return
                        }
                    })
                    treeData.value = data
                } catch (error) {
                    console.log(error)
                }
            }
        })
    }
}

// [결재선 - 조회]
const getApprovalList = () => {
    const headerParams = store.headerParams

    let params = {}
    params = Object.assign({}, params, headerParams)

    try {
        api.getUserApprovalLine(params).then((res:any) => {
            const rsCode = res.data.rsCode
            const data = res.data.rsMap

            if (rsCode === 0) {
                userApprovalLine.value = data
            }
        })
    } catch (error) {
        console.log(error)
    }
}

// 업체별 관리자 목록 드랍다운
const openDutyList = (index: number) => {
    // 클릭한 항목의 index 번호와 비교
    treeData.value[index].isActive = !treeData.value[index].isActive
}

// 업체별 관리자별 유저 목록 드랍다운
const openUserList = (index: number, subIndex: number) => {
    const data = treeData.value

    if (data[index].isActive === true) {
        data[index].duty[subIndex].isActive = !data[index].duty[subIndex].isActive
    }
}

// 결재가능자 리스트 추가
const selected = (data:any) => {
    if (drafter.value.user_id === data.user_id) {
        toast.warn('기안자는 선택할 수 없습니다.')
    } else {
        data.isSelected = true
        userList.value.push(data)

        const initial = userList.value
        const res = initial.filter((item:any, itemIndex:any) => {
            return (
                initial.findIndex((list:any, listIndex:any) => {
                    return item.user_id === list.user_id
                }) === itemIndex
            )
        })
        userList.value = [...res]
    }
}

// 결재가능자 리스트 제거
const removeList = (id: number) => {
    userList.value.forEach((item:any, index: number) => {
        if (item.user_id === id) userList.value.splice(index, 1)
        item.isSelected = false
    })
}

// 결재가능자 테이블 추가
const addApprover = () => {
    tableData.value = [...tableData.value, ...userList.value]
    const res = tableData.value.filter((item:any, index:any) => {
        return tableData.value.findIndex((list:any) => list.user_id === item.user_id) === index
    })
    tableData.value = res
}

// 결재가능자 테이블 제거
const subtract:any = ref([])
const removeRow = (data:any) => {
    subtract.value = data
}

const deleteApprover = () => {
    const userIds = subtract.value
        .map((item:any) => {
            if (item.isChecked === true) return item.user_id
        })
        .filter((element:any) => element)

    userIds.forEach((id:any) => {
        userList.value.forEach((item:any, index:any) => {
            if (id === item.user_id) userList.value.splice(index, 1)
            item.isChecked = false
            item.isSelected = false
        })
    })

    if (tableData.value.length > 0) tableData.value = [...userList.value]
}

// 결재선 지정 다이얼로그 닫기
const emit = defineEmits(['close-dialog', 'send-event'])
const closeDialog = () => {
    init()
    emit('close-dialog', false)
}

// ----------------------------------------------------------------------------------------------------

// 사용자 결재선 리스트 등록
const insertApprovalLine = (value: string) => {
    const store = useStore()
    const headerParams = store.headerParams

    // 기안자 데이터 먼저 삽입
    let userIds = []
    const drafterData = {
        order_no: 1,
        user_id: drafter.value.user_id,
        company_id: store.loginData.user_main_company.company_id,
        ctgo_duty_id: store.loginData.user_permission.ctgo_duty_id,
    }
    userIds.push(drafterData)

    // 다음 결재자 데이터 삽입
    const res = []
    for (let i = 0; i < userList.value.length; i++) {
        let userData = {
            user_id: userList.value[i].user_id,
            order_no: i + 2,
        }
        res.push(userData)
    }
    userIds = [...res]

    let params = {
        // Required
        line_name: value,
        user_ids: JSON.stringify(userIds),
    }

    params = Object.assign({}, params, headerParams)
    api.insertApprovalLine(params).then((res:any) => {
        try {
            const rsCode = res.data.rsCode

            if (rsCode === 0) {
                toast.success('결재선 등록을 성공하였습니다.')
                closeDialog()
            }
        } catch (error) {
            console.log(error)
            toast.error(res.data.rsMsg)
        }
    })
}

// 사용자 결재선 리스트 조회 - 테이블 데이터
const getTableData = (id: number) => {
    const res = userApprovalLine.value
        .map((item:any) => {
            if (item.id === id) {
                return item
            }
        })
        .filter((element:any) => element)
    tableData.value = res[0].line
    userList.value = [...tableData.value]
}

// 사용자 결재선 리스트 등록 + UI 처리까지
const onSubmit = () => {
    // 기안자 데이터 먼저 삽입
    let userIds = []
    const drafterData = {
        order_no: 1,
        user_id: drafter.value.user_id,
        company_id: store.loginData.user_main_company.company_id,
        ctgo_duty_id: store.loginData.user_permission.ctgo_duty_id,
    }
    userIds.push(drafterData)

    for (let i = 0; i < tableData.value.length; i++) {
        let userData = {
            user_id: tableData.value[i].user_id,
            order_no: i + 2,
            company_id: tableData.value[i].company_id,
            ctgo_duty_id: tableData.value[i].ctgo_duty_id,
        }
        userIds.push(userData)
    }

    const headerParams = store.headerParams
    let params = {
        approval_id: id.value,
        line_info: JSON.stringify(userIds),
    }
    params = Object.assign({}, params, headerParams)

    api.insertApprovalRequestLine(params).then((res:any) => {
        const rsCode = res.data.rsCode

        if (rsCode === 0) {
            tableData.value.forEach((item:any, index:any) => {
                item.approval_state = '-'
                item.update_date = '-'
            })

            closeDialog()
        }
    })
}

// 초기화
const init = (): void => {
    searchText.value = ''
    userApprovalLine.value = []
    userList.value = []
    tableData.value = []

    ApprovalInputyRef.value?.initApprovalName()
}

const changeSearchText = (value: any): void => {
    if (value.length === 0) {
        getData(searchText.value)
    } else {
        searchText.value = value
    }
}

</script>

<style lang="scss" scoped>
@import '@assets/styles/main.scss';

.container {
    display: flex;
    align-items: center;

    width: 100%;

    gap: 20px;

    &__search-box {
        display: flex;
        flex-direction: column;

        width: 266px;

        padding: 10px;

        background: $color-white-000;
        border: 1px solid $color-white-400;
        border-radius: 6px;

        &__company-box {
            display: flex;
            flex-direction: column;

            width: calc(100% - 20px);

            padding: 24px 10px;
            gap: 16px;

            border-bottom: 1px solid $color-white-400;

            .label {
                font-weight: 600;
                font-size: 17px;
                line-height: 20px;
            }
            .tree-box {
                height: 266px;

                overflow-y: scroll;

                // /* Hide scrollbar for IE, Edge and Firefox */
                -ms-overflow-style: none; /* IE and Edge */
                scrollbar-width: none; /* Firefox */

                // /* Hide scrollbar for Chrome, Safari and Opera */
                &::-webkit-scrollbar {
                    display: none;
                }

                .company-list {
                    width: 100%;

                    margin-bottom: 4px;

                    &__company {
                        display: flex;
                        align-items: center;
                        justify-content: space-between;

                        &__item {
                            display: flex;
                            align-items: center;

                            gap: 4px;

                            cursor: pointer;

                            .button {
                                width: 20px;
                                height: 20px;

                                outline: none;
                                border: none;
                                background: transparent;

                                cursor: pointer;

                                transition: all 0.3s ease;

                                &.active {
                                    transform: rotate(180deg);
                                }
                            }
                            .name {
                                font-weight: 600;
                                font-size: 17px;
                                line-height: 20px;
                            }
                        }
                        &__total {
                            color: $color-blue-900;
                            font-weight: 600;
                            font-size: 17px;
                            line-height: 20px;
                        }
                    }
                    &__dropdown {
                        display: none;

                        &.active {
                            display: flex;
                            flex-direction: column;
                            align-items: flex-start;
                            justify-content: center;

                            margin-left: 52px;
                        }

                        &__list {
                            display: flex;
                            align-items: center;
                            justify-content: space-between;

                            gap: 8px;

                            cursor: pointer;

                            .item {
                                display: flex;
                                align-items: center;
                                justify-content: space-between;

                                gap: 8px;

                                &__icon {
                                    margin-bottom: 2px;
                                }
                                &__name {
                                    font-weight: 500;
                                    font-size: 17px;
                                    line-height: 20px;

                                    // 추후 수정 - 동시다발적으로 active 되는 거 방지하는 기능 고민해봐야함
                                    // &.active {
                                    //     background-color: $color-blue-050;
                                    // }
                                }
                            }
                            .value {
                                color: $color-blue-900;

                                font-weight: 500;
                                font-size: 17px;
                                line-height: 20px;
                            }
                        }
                        &__value {
                            display: flex;
                            align-items: center;
                            justify-content: center;
                        }
                    }
                    &__sub-dropdown {
                        display: none;

                        &.active {
                            display: flex;
                            flex-direction: column;
                            align-items: flex-start;
                            justify-content: center;

                            margin-left: 28px;
                        }

                        &__list {
                            display: flex;
                            align-items: center;
                            justify-content: space-between;

                            gap: 8px;

                            .item {
                                display: flex;
                                align-items: center;
                                justify-content: space-between;

                                gap: 8px;

                                cursor: pointer;

                                &__icon {
                                    margin-bottom: 2px;

                                    &.active {
                                        color: $color-blue-900;
                                    }
                                }
                                &__name {
                                    font-weight: 500;
                                    font-size: 17px;
                                    line-height: 20px;

                                    &.active {
                                        color: $color-blue-900;
                                    }
                                }
                            }
                            .value {
                                color: $color-blue-900;

                                font-weight: 500;
                                font-size: 17px;
                                line-height: 20px;
                            }
                        }
                        &__value {
                            display: flex;
                            align-items: center;
                            justify-content: center;
                        }
                    }
                }
            }
        }
        &__user-list {
            display: flex;
            flex-direction: column;
            align-items: flex-start;

            width: calc(100% - 20px);
            height: 80px;

            padding: 24px 10px;
            gap: 16px;

            overflow-y: scroll;

            // /* Hide scrollbar for IE, Edge and Firefox */
            -ms-overflow-style: none; /* IE and Edge */
            scrollbar-width: none; /* Firefox */

            // /* Hide scrollbar for Chrome, Safari and Opera */
            &::-webkit-scrollbar {
                display: none;
            }

            .user-data {
                display: flex;
                align-items: center;

                width: 100%;
                height: 20px;

                gap: 8px;

                position: relative;

                &__icon {
                    width: 28px;
                    height: 28px;
                }
                &__name {
                    font-weight: 500;
                    font-size: 17px;
                    line-height: 20px;
                }
                &__button {
                    display: flex;
                    align-items: center;
                    justify-content: center;

                    width: 24px;
                    height: 24px;

                    padding: 4px;

                    margin-right: 4px;

                    outline: none;
                    border: none;
                    background: transparent;

                    position: absolute;
                    right: 0;

                    cursor: pointer;

                    &:hover {
                        background-color: $color-white-050;
                        border-radius: 6px;
                    }
                }
            }
            .user-noData {
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;

                width: 100%;

                &__image {
                    width: 78%;
                    opacity: 0.6;
                }
                &__title {
                    font-size: 15px;
                    font-weight: 700;
                    color: $color-white-400;
                }
            }
        }
    }
    &__button-box {
        display: flex;
        flex-direction: column;

        gap: 16px;
    }
    &__approval-line {
        display: flex;
        flex-direction: column;

        justify-content: space-between;

        min-height: 508px;
        height: 100%;

        padding: 20px;
        gap: 20px;

        background: $color-white-000;
        border: 1px solid $color-white-400;
        border-radius: 6px;

        &__top {
            display: flex;
            flex-direction: column;

            gap: 20px;
        }
    }
}
</style>
