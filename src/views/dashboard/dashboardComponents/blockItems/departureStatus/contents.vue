<template>
    <div class="content">
        <!-- <div class="content__label-box">
            <span class="content__label-box__label">{{ label }}</span>
        </div> -->
        <div class="content__list-box">
            <span v-if="data.length === 0" class="content__list-box__no-data">출역 인원이 없습니다.</span>
            <div v-for="item in data" :key="item.company" class="content__list-box__list">
                <div class="name-box">
                    <div class="name-box__chip" :style="{ background: item.color }"></div>
                    <span class="name-box__name">{{ item.company_name }}</span>
                </div>
                <div class="value-box">
                    <span class="value-box__value">{{ item.cnt }}</span>
                    <span style="margin-left: 2px">명</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { watch, toRefs, onBeforeMount, } from "vue"
interface Props {
    label: string
    data: any
}
const props = defineProps<Props>()
const { label, data } = toRefs(props)
const colors = ['#fba3b5', '#78c8ff', '#93d9d9', '#f8c089', '#ffde90', '#ba98fb', '#dcb3ff',   '#ffd0d9', '#b2e0ff', '#ffcf9f', '#ccb2ff', '#e4e5e7']

onBeforeMount(()=>{
    addColortoContent()
})
watch(data, ()=>{
    addColortoContent()
})
function addColortoContent(){
    let colorIndex = 0
    data.value.forEach( (item:any) => {
        if(colorIndex === colors.length ){
            colorIndex = 0
        }
        item.color = colors[colorIndex]
        colorIndex ++
    })
}
</script>

<style lang="scss" scoped>
@import "@assets/styles/main.scss";

.content {
    display: flex;
    flex-direction: column;
    gap: 15px;
    height: 100%;

    &__label-box {
        display: flex;
        flex-direction: column;
        align-items: flex-start;

        width: 184px; // 수정 必
        height: 34px; // 수정 必
        min-height: 34px;

        border-bottom: 1px solid #e6e8ed;

        &__label {
            font-weight: 700;
            font-size: 19px;
            line-height: 19px;
        }
    }
    &__list-box {
        display: flex;
        flex-direction: column;
        flex-direction: flex-start;

        width: 100%;
        height: 100%;
        gap: 8px;
        margin-top: 5px;

        overflow-y: scroll;

        // /* Hide scrollbar for IE, Edge and Firefox */
        -ms-overflow-style: none; /* IE and Edge */
        scrollbar-width: none; /* Firefox */
        overflow-y: scroll;

        // /* Hide scrollbar for Chrome, Safari and Opera */
        &::-webkit-scrollbar {
            display: none;
        }

        &__list {
            display: flex;
            align-items: center;
            justify-content: space-between;
            font-size: 22px;
            gap: 15px;
            .name-box {
                display: flex;
                align-items: center;
                font-size: inherit;
                gap: 12px;
                max-width: 180px;
                white-space: nowrap;

                &__chip {
                    width: 12px;
                    height: 12px;

                    border-radius: 3px;
                }
                &__name {
                    font-size: inherit;
                }
            }
            .value-box {
                &__value {
                    font-size: 20px;
                    color: $color-blue-600;
                }
            }
        }
        &__no-data {
            color: $color-white-500;

            @include laptop() {
                font-size: 14px;
            }
        }
    }
}
</style>
