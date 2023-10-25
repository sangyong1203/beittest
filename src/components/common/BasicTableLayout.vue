<template>
    <div class="table">
        <!-- 리스트 메뉴 -->
        <div class="table__header">
            <div class="table__header__index" :style="{ width: `8%` }">NO</div>
            <div v-for="label in menuList" :key="label" class="table__header__menu" :style="{ width: `${width}%` }">
                {{ label }}
            </div>
        </div>
        <!-- 리스트 -->
        <div v-for="(item, index) in data" :key="index" class="table__body">
            <div class="table__body__column" :style="{ width: `8%` }">{{ index + 1 }}</div>
            <slot></slot>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, toRefs } from "vue"

interface Props {
    menuList: string[]
    data?: any[]
}

const props = defineProps<Props>()
const { menuList, data } = toRefs(props)

// Prop 받은 MenuList 길이에 따른 Dynamic Width
const width = computed((): string => {
    const res = String(100 / menuList.value.length + 1)
    return res
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
        display: flex;
        align-items: center;
        justify-content: space-between;

        width: 100%;
        height: 48px;

        border-bottom: 1px solid $color-white-200;

        &__column {
            display: flex;
            align-items: center;
            justify-content: center;

            cursor: pointer;
        }
    }
}
</style>
