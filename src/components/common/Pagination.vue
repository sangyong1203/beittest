<template>
    <div class="pagination">
        <select class="pagination__select-box" @change="changeOption">
            <option v-for="item in options" :key="item" :value="item">{{ item }}</option>
        </select>
        <div class="pagination__number-box">
            <button class="pagination__number-box__button" @click="moveToPage(1)">
                <img :src="doubleLeftArrow" alt="" />
            </button>
            <button class="pagination__number-box__button" @click="moveToPrev">
                <img :src="singleLeftArrow" alt="" />
            </button>
            <button v-for="index in pages[step]" :key="index" @click="moveToPage(index)" class="pagination__number-box__button" :class="{ active: index === page }">
                {{ index }}
            </button>
            <button class="pagination__number-box__button" @click="moveToNext">
                <img :src="singleRightArrow" alt="" />
            </button>
            <button class="pagination__number-box__button" @click="moveToPage(totalPage)">
                <img :src="doubleRightArrow" alt="" />
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { toRefs, computed, ref } from 'vue'
import doubleLeftArrow from "@assets/icons/doubleLeftArrow.svg"
import singleLeftArrow from "@assets/icons/singleLeftArrow.svg"
import doubleRightArrow from "@assets/icons/doubleRightArrow.svg"
import singleRightArrow from "@assets/icons/singleRightArrow.svg"

interface Props {
    totalPage: number
    selectedPage: number
}
const props = defineProps<Props>()
const { totalPage, selectedPage } = toRefs(props)

// Select-Box Options
const options = [10, 20, 50, 100]

// 페이지 갯수 10개로 쪼개기
const step = ref<number>(0)
const pages = computed(() => {
    const newArr: number[] = new Array()

    for (let i = 1; i <= totalPage.value; i++) {
        newArr.push(i)
    }

    const length = newArr.length
    const divide = Math.floor(length / 10) + (Math.floor(length % 10) > 0 ? 1 : 0)
    const res = new Array()

    for (let i = 0; i <= divide; i++) {
        // 배열 0부터 n개씩 잘라 새 배열에 넣기
        res.push(newArr.splice(0, 10))
    }

    return res
})

// 페이지네이션 버튼 Active Class 기능
const page = computed(() => {
    return selectedPage.value
})
const emit = defineEmits(['send-event', 'send-data'])
const changeOption = (event: any) => {
    emit('send-data', event.target.value)
}

const moveToPage = (index: any) => {
    if (index === 1) {
        moveToPrev()
    }
    if (index === totalPage.value) {
        moveToNext()
    }
    emit('send-event', index)
}
const moveToPrev = () => {
    if (step.value === 0) {
        return
    } else {
        step.value--
    }
}
const moveToNext = (): void => {
    if (step.value < pages.value.length - 2) {
        step.value++
    } else {
        return
    }
}
</script>

<style lang="scss" scoped>
@import '@assets/styles/main.scss';

.pagination {
    display: flex;
    align-items: center;
    justify-content: center;

    width: 100%;
    height: 60px;

    &__select-box {
        padding: 8px 16px;
        margin-right: 36px;

        background: $color-white-000;
        border: 1px solid $color-white-400;
        border-radius: 3px;

        // How to Change Select-Box-Arrow Shape & Position
        appearance: none;
        -webkit-appearance: none;
        -moz-appearance: none;
        -ms-appearance: none;
        background-position: calc(100% - 12px) center !important;
        background: url("data:image/svg+xml,<svg height='10px' width='10px' viewBox='0 0 16 16' fill='%23000000' xmlns='http://www.w3.org/2000/svg'><path d='M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z'/></svg>")
            no-repeat;
        padding: 8px 32px 8px 16px;
    }
    &__number-box {
        display: flex;
        align-items: center;

        &__button {
            outline: none;
            border: none;
            background: transparent;

            width: 40px;
            height: 40px;

            border-radius: 3px;
            background-color: $color-white-000;
            cursor: pointer;

            &.active {
                background: $color-white-100;
            }
            &:hover {
                background: $color-white-100;
            }
        }
    }
}
</style>
