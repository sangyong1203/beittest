<template>
    <div class="check-table">
        <div class="check-table__header">
            <div class="check-table__header__check-box" style="margin: 0 4px">
                <input type="checkbox" v-model="selected" @click="selectAll" />
            </div>
            <div class="check-table__header__list" :style="{ width: `8%` }">
                <span class="label">NO</span>
            </div>
            <div v-for="label in menuList" :key="label" class="check-table__header__list" :style="{ width: `${width}%` }">
                <span class="label">{{ label }}</span>
            </div>
        </div>
        <!-- Prop 받은 Type이 위험성평가일 경우 -->
        <div v-if="type === '위험성평가'" class="check-table__body">
            <div v-for="(item, index) in data" :key="index" class="check-table__body__list-box">
                <div class="check-box" @click="setRAIds(item)">
                    <input type="checkbox" v-model="item.isChecked" />
                </div>
                <div @click="openRA(item.ra_id, item.approval_id)" style="display: flex; align-items: center; width: calc(100% - 50px)">
                    <div class="list" :style="{ width: `8%` }">
                        {{ index + 1 + filteredIndex }}
                    </div>
                    <div class="list" :style="{ width: `${width}%` }">
                        <Chip :label="item.ra_type" />
                    </div>
                    <div class="list" :style="{ width: `${width}%` }">
                        {{ item.company_name ? item.company_name : "-" }}
                    </div>
                    <div class="list" :style="{ width: `${width}%` }">
                        {{ item.ctgo_construction_name ? item.ctgo_construction_name : "-" }}
                    </div>
                    <div class="list" :style="{ width: `${width}%` }">
                        {{ item.user_name ? item.user_name : "-" }}
                    </div>
                    <div class="list" :style="{ width: `${width}%` }">
                        {{ item.reg_date ? item.reg_date : "-" }}
                    </div>
                    <div class="list" :style="{ width: `${width}%` }">
                        <img v-if="item.cnt_approval_state === '결재대기'" src="@assets/icons/wait.svg" alt="" class="list__icon" />
                        <img v-if="item.cnt_approval_state === '결재요청'" src="@assets/icons/ing.svg" alt="" class="list__icon" />
                        <img v-if="item.cnt_approval_state === '결재완료'" src="@assets/icons/complete.svg" alt="" class="list__icon" />
                        <img v-if="item.cnt_approval_state === '반려'" src="@assets/icons/reject.svg" alt="" class="list__icon" />
                    </div>
                </div>
            </div>
        </div>

        <!-- Prop 받은 데이터가 Type이 작업허가서일 경우 -->
        <div v-if="type === '작업허가서'" class="check-table__body">
            <div v-if="!data" class="check-table__body__list-box" style="justify-content: center">등록된 {{ type }} 항목이 없습니다.</div>
            <div v-else v-for="(item, index) in data" :key="index" class="check-table__body__list-box">
                <div class="check-box" @click="setDPIds(item)">
                    <input type="checkbox" v-model="item.isChecked" />
                </div>
                <div @click="openDP(item.dp_id, item.approval_id)" style="display: flex; align-items: center; width: calc(100% - 50px)">
                    <div class="list" :style="{ width: `8%` }">
                        {{ index + 1 + filteredIndex }}
                    </div>
                    <div class="list" :style="{ width: `${width}%` }">
                        {{ item.dp_typename ? item.dp_typename : "-" }}
                    </div>
                    <div class="list" :style="{ width: `${width}%` }">
                        {{ item.company_name ? item.company_name : "-" }}
                    </div>
                    <div class="list" :style="{ width: `${width}%` }">
                        {{ item.ctgo_construction_name ? item.ctgo_construction_name : "-" }}
                    </div>
                    <div class="list" :style="{ width: `${width}%` }">
                        {{ item.dp_title ? item.dp_title : "-" }}
                    </div>
                    <div class="list" :style="{ width: `${width}%` }">
                        {{ item.dp_date ? item.dp_date : "-" }}
                    </div>
                    <div class="list" :style="{ width: `${width}%` }">
                        {{ item.user_name ? item.user_name : "-" }}
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import Chip from "@components/common/chip/Chip.vue"
import { toRefs, ref, computed } from "vue"

type RAList = {
    approval_id: number
    cnt_approval_state?: string
    company_id: number
    company_name: string
    ctgo_construction_id: number
    ctgo_construction_name?: string
    evaluation_detail?: string
    ra_id: number
    ra_tag: string
    ra_type: string
    reg_date: string
    scene_id: number
    user_id: number
    user_name: string
    isChecked?: boolean
}

type DPList = {
    approval_id: number
    company_id: number
    company_name: string
    current_approval_state: string
    ctgo_construction_name: string
    dp_date: string
    dp_id: number
    dp_title: string
    dp_typename: string
    reg_by: number
    scene_id: number
    scene_name: string
    user_name: string
    isChecked?: boolean
}

type List = RAList & DPList

interface Props {
    type: string
    menuList: string[]
    data: any
    limit: number
    selectedPage: number
}
const props = defineProps<Props>()
const { type, menuList, data, limit, selectedPage } = toRefs(props)

// Prop 받은 MenuList 길이에 따른 Dynamic Width
const width = computed((): string => {
    const res = String(100 / menuList.value.length + 1)
    return res
})

// 게시물 인덱스 번호
const filteredIndex = computed(() => {
    if (data?.value && data?.value.length === 10) {
        const res = selectedPage.value * 10 - 10
        return res
    } else if (data?.value && data?.value.length > 10) {
        const res = selectedPage.value * data.value.length - data.value.length
        return res
    } else if (data?.value && data?.value.length <= 10) {
        const res = selectedPage.value * limit.value - limit.value
        return res
    } else {
        return 1
    }
})

// 체크박스 전체 선택 및 부모컴포넌트로 즉각적으로 데이터 바인딩(모델링)
const selected = ref<boolean>(false)
const emit = defineEmits(["send-event", "send-RAIds", "send-DPIds", "open-RA", "open-DP"])
const selectAll = () => {
    selected.value = !selected.value

    if (selected.value) {
        data.value.forEach((item: any) => {
            item.isChecked = true
        })
    } else {
        data.value.forEach((item: any) => {
            item.isChecked = false
        })
    }
    emit("send-event", data.value)
}
const openRA = (ra_id: number, approval_id: number): void => {
    const value = {
        ra_id: ra_id,
        approval_id: approval_id,
        isVisible: true,
    }
    emit("open-RA", value)
}
const openDP = (dp_id: number, approval_id: number): void => {
    const value = {
        dp_id: dp_id,
        approval_id: approval_id,
        isVisible: true,
    }
    emit("open-DP", value)
}

// 선택한 위험성평가 ID 리스트
const newRAIDs = ref<List[]>([])
const setRAIds = (data: List) => {
    data.isChecked = !data.isChecked

    if (data.isChecked) {
        newRAIDs.value.push(data)
        const res = newRAIDs.value.map((item: any) => {
            return item.ra_id
        })
        emit("send-RAIds", res)
    } else {
        const index = newRAIDs.value.findIndex((item: any) => item === data.ra_id)
        const res = newRAIDs.value.splice(index, 1)

        emit("send-RAIds", res)
    }
}

// 선택한 작업허가서 ID 리스트
const newDPIDs = ref<List[]>([])
const setDPIds = (data: List) => {
    data.isChecked = !data.isChecked

    if (data.isChecked) {
        newDPIDs.value.push(data)
        const res = newDPIDs.value.map((item: any) => {
            return item.dp_id
        })

        emit("send-DPIds", res)
    } else {
        const index = newDPIDs.value.findIndex((item: any) => item === data.dp_id)
        const res = newDPIDs.value.splice(index, 1)

        emit("send-DPIds", res)
    }
}
</script>

<style lang="scss" scoped>
@import "@assets/styles/main.scss";
.check-table {
    display: flex;
    flex-direction: column;

    width: 100%;
    height: 100%;
    // max-height: 420px;

    overflow-y: scroll;

    // /* Hide scrollbar for IE, Edge and Firefox */
    -ms-overflow-style: none; /* IE and Edge */
    scrollbar-width: none; /* Firefox */

    // /* Hide scrollbar for Chrome, Safari and Opera */
    &::-webkit-scrollbar {
        display: none;
    }

    &__header {
        display: flex;
        align-items: center;

        width: 100%;
        min-height: 48px;
        height: 48px;

        background-color: $color-white-100;
        border-top: 1px solid $color-white-400;
        border-bottom: 1px solid $color-white-400;

        &__check-box {
            display: flex;
            align-items: center;
            justify-content: center;

            width: 50px;
            height: 100%;

            input {
                width: 18px;
                height: 18px;
            }
        }
        &__list {
            display: flex;
            align-items: center;
            justify-content: center;
        }
    }
    &__body {
        width: 100%;
        height: 100%;

        overflow-y: scroll;

        // /* Hide scrollbar for IE, Edge and Firefox */
        -ms-overflow-style: none; /* IE and Edge */
        scrollbar-width: none; /* Firefox */

        // /* Hide scrollbar for Chrome, Safari and Opera */
        &::-webkit-scrollbar {
            display: none;
        }

        &__list-box {
            display: flex;
            align-items: center;
            justify-content: space-between;

            width: 100%;
            height: 48px;

            border-bottom: 1px solid $color-white-200;

            .check-box {
                display: flex;
                align-items: center;
                justify-content: center;

                width: 50px;
                height: 100%;

                input {
                    width: 18px;
                    height: 18px;

                    cursor: pointer;
                }
            }

            .list {
                display: flex;
                align-items: center;
                justify-content: center;

                cursor: pointer;

                &__icon {
                    width: 32px;
                    height: 32px;
                }
            }
        }
    }
}
</style>
