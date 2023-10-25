<template>
    <!-- 안전교육 -->
    <div class="table">
        <div class="table__label-box">
            <span class="table__label-box__label">{{ label }} 목록</span>
            <div class="table__label-box__button-box">
                <BasicButton :label="'등록'" :theme="'fill'" @click="openDialog" />
            </div>
        </div>
        <!-- 리스트 메뉴 -->
        <div class="table__header">
            <div class="table__header__index" :style="{ width: `8%` }">NO</div>
            <div v-for="label in menuList" :key="label" class="table__header__menu" :style="{ width: `${width}%` }">
                {{ label }}
            </div>
        </div>
        <!-- 리스트 -->
        <div class="table__body">
            <div v-if="!data" class="table__body__noData">
                <img src="@assets/images/logo.svg" alt="" class="logo" />
                <span class="inform">등록된 {{ label }} 목록이 없습니다.</span>
            </div>
            <div v-for="(item, index) in data" :key="index" class="table__body__list-box" @click="openDetailDialog(item)">
                <div class="list" :style="{ width: `8%` }">
                    {{ index + 1 + filteredIndex }}
                </div>
                <div class="list" :style="{ width: `${width}%` }">
                    {{ item.company_name }}
                </div>
                <div class="list" :style="{ width: `${width}%` }">
                    {{ item.ctgo_construction_name }}
                </div>
                <div class="list" :style="{ width: `${width}%` }">
                    {{ item.education_class_name }}
                </div>
                <div class="list" :style="{ width: `${width}%` }">
                    {{ item.lecturer_name }}
                </div>
                <div class="list" :style="{ width: `${width}%` }">
                    {{ item.education_date.slice(0, 10) }}
                </div>
                <div class="list" :style="{ width: `${width}%` }">
                    {{ item.education_start_time + " ~ " + item.education_end_time }}
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import BasicButton from "@components/common/button/BasicButton.vue"
import { computed, toRefs } from "vue"

interface Props {
    label: string
    menuList: string[]
    data?: any[]
    limit: number
    selectedPage: number
}

const props = defineProps<Props>()
const { label, menuList, data, limit, selectedPage } = toRefs(props)

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

// 부모컴포넌트로 다이얼로그 Open을 위한 이벤트 전달
const emit = defineEmits(["open-dialog", "open-detail"])
const openDialog = (): void => {
    emit("open-dialog", true)
}

const openDetailDialog = (data: any): void => {
    emit("open-detail", data)
}
</script>

<style lang="scss" scoped>
@import "@assets/styles/main.scss";

.table {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;

    width: 100%;
    height: calc(100% - 80px);

    &__label-box {
        display: flex;
        align-items: center;
        justify-content: space-between;

        width: 100%;

        gap: 12px;

        margin-bottom: 24px;

        &__label {
            font-weight: 600;
            font-size: 20px;
            line-height: 29px;
        }
        &__button-box {
            display: flex;
            align-items: center;

            gap: 10px;
        }
    }

    &__header {
        display: flex;
        align-items: center;
        justify-content: space-between;

        width: 100%;
        height: 48px;

        background-color: $color-white-100;
        border-top: 1px solid $color-white-200;
        border-bottom: 1px solid $color-white-200;

        &__index {
            display: flex;
            align-items: center;
            justify-content: center;
        }
        &__menu {
            display: flex;
            align-items: center;
            justify-content: center;
        }
    }
    &__body {
        width: 100%;
        height: calc(100% - 48px);

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

            .list {
                display: flex;
                align-items: center;
                justify-content: center;

                cursor: pointer;
            }
        }
        &__noData {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;

            width: 100%;
            height: 100%;

            .logo {
                width: 25%;
                opacity: 0.6;
            }
            .inform {
                font-size: 20px;
                font-weight: 700;
                color: $color-white-400;
            }
        }
    }
}
</style>
