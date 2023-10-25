<template>
    <div class="check-table">
        <div class="check-table__header">
            <div class="check-table__header__check-box">
                <input type="checkbox" v-model="selected" @click="selectAll" />
            </div>
            <div class="check-table__header__item sm">
                <span class="label">NO</span>
            </div>
            <div class="check-table__header__item md">
                <span class="label">상신</span>
            </div>
            <div class="check-table__header__item lg">
                <span class="label">업체</span>
            </div>
            <div class="check-table__header__item lg">
                <span class="label">이름</span>
            </div>
            <div class="check-table__header__item lg">
                <span class="label">직책</span>
            </div>
        </div>
        <div class="check-table__body">
            <!-- 기안자는 Default로 설정이 되어야 한다. -->
            <div class="check-table__body__data">
                <!-- 기안자 데이터 -->
                <div class="list">
                    <div class="list__check-box">
                        <input type="checkbox" disabled />
                    </div>
                    <div class="list__item sm">
                        <span class="label">1</span>
                    </div>
                    <div class="list__item md">
                        <span class="label">기안</span>
                    </div>
                    <div class="list__item lg">
                        <span class="label">{{ drafter.company_name }}</span>
                    </div>
                    <div class="list__item lg">
                        <span class="label">{{ drafter.user_name }}</span>
                    </div>
                    <div class="list__item lg">
                        <span class="label">{{ drafter.ctgo_duty_name ? drafter.ctgo_duty_name : "-" }}</span>
                    </div>
                </div>
                <!-- 결재가능자 -->
                <div v-for="(item, index) in subtract" :key="index" class="list">
                    <div class="list__check-box">
                        <input type="checkbox" v-model="item.isChecked" />
                    </div>
                    <div class="list__item sm">
                        <span class="label">{{ index + 2 }}</span>
                    </div>
                    <div class="list__item md">
                        <span v-if="subtract.length !== 0 && index === subtract.length - 1" class="label">승인</span>
                        <span v-else class="label">검토</span>
                    </div>
                    <div class="list__item lg">
                        <span class="label">{{ item.company_name }}</span>
                    </div>
                    <div class="list__item lg">
                        <span class="label">{{ item.user_name }}</span>
                    </div>
                    <div class="list__item lg">
                        <span class="label">{{ item.ctgo_duty_name }}</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { toRefs, ref, computed } from "vue"

interface Props {
    drafter: any
    data: any[]
}
const props = defineProps<Props>()
const { drafter, data } = toRefs(props)

// 체크박스 전체 선택 및 부모컴포넌트로 즉각적으로 데이터 바인딩(모델링)
const selected = ref<boolean>(false)
const emit = defineEmits(["send-event"])
const selectAll = () => {
    selected.value = !selected.value

    if (selected.value) {
        data.value.forEach((item) => {
            item.isChecked = true
        })
    } else {
        data.value.forEach((item) => {
            item.isChecked = false
        })
    }
    emit("send-event", data.value)
}

// 결재선에서 제외할 리스트
const subtract = computed(() => {
    emit("send-event", data.value)
    return data.value
})
</script>

<style lang="scss" scoped>
@import "@assets/styles/main.scss";

.check-table {
    display: flex;
    flex-direction: column;

    width: 100%;
    max-height: 341px;

    overflow-y: scroll;

    &__header {
        display: flex;
        align-items: center;

        width: 100%;
        min-height: 50px;
        height: 50px;

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
        &__item {
            display: flex;
            align-items: center;
            justify-content: center;

            font-weight: 600;
            font-size: 17px;
            line-height: 18px;

            &.sm {
                width: 50px;
                height: 100%;
            }
            &.md {
                width: 87px;
                height: 100%;
            }
            &.lg {
                width: 130px;
                height: 100%;
            }
        }
    }
    &__body {
        display: flex;
        align-items: center;

        width: 100%;

        background-color: $color-white-000;

        &__data {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;

            width: 100%;

            .list {
                display: flex;
                align-items: center;
                justify-content: center;

                width: 100%;
                height: 50px;

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
                &__item {
                    display: flex;
                    align-items: center;
                    justify-content: center;

                    font-weight: 600;
                    font-size: 17px;
                    line-height: 18px;

                    &.sm {
                        width: 50px;
                        height: 100%;
                    }
                    &.md {
                        width: 87px;
                        height: 100%;
                    }
                    &.lg {
                        width: 130px;
                        height: 100%;
                    }
                }
            }
        }
    }
}
</style>
