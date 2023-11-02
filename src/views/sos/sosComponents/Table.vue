<template>
    <!-- SOS 요청이력 -->
    <div class="table">
        <div class="table__label-box">
            <span class="table__label-box__label">{{ label }} 목록</span>
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
            <div v-else v-for="(item, index) in data" :key="index" class="table__body__list-box">
                <div class="list" :style="{ width: `8%` }">
                    {{ index + 1 + filteredIndex }}
                </div>
                <div class="list" :style="{ width: `${width}%` }">
                    {{ item.push_title }}
                </div>
                <div class="list" :style="{ width: `${width}%` }">
                    {{ item.company_name }}
                </div>
                <div class="list" :style="{ width: `${width}%` }">
                    {{ item.ctgo_construction_name }}
                </div>
                <div class="list" :style="{ width: `${width}%` }">
                    {{ item.user_name }}
                </div>
                <div class="list" :style="{ width: `${width}%` }">
                    {{ item.ctgo_occupation_name }}
                </div>
                <div class="list" :style="{ width: `${width}%` }">
                    {{ item.user_phone.replace(/[^0-9]/g, "").replace(/^(\d{2,3})(\d{3,4})(\d{4})$/, `$1-$2-$3`) }}
                </div>
                <div class="list" :style="{ width: `${width}%` }">
                    {{ item.sos_date }}
                </div>
                <div class="list" :style="{ width: `${width}%` }">
                    {{ item.reg_time }}
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
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

        // // /* Hide scrollbar for IE, Edge and Firefox */
        // -ms-overflow-style: none; /* IE and Edge */
        // scrollbar-width: none; /* Firefox */

        // // /* Hide scrollbar for Chrome, Safari and Opera */
        // &::-webkit-scrollbar {
        //     display: none;
        // }
        &::-webkit-scrollbar {
            width: 6px;
            height: 6px;
            background-color: transparent;
        }
        &::-webkit-scrollbar-thumb {
            border-radius: 6px;
            background-color: transparent;
        }
        &:hover::-webkit-scrollbar-thumb {
            background-color: rgba(0, 0, 0, 0.262);
        }

        // @include laptop() {
        //     height: 242px;
        // }
        // @include desktop() {
        //     height: 100%;
        //     height: 400px;
        // }

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
