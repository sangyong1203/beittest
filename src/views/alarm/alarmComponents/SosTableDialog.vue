<template>
    <DialogLayout :label="label + ' 목록'"  @close-dialog="closeDialog">
        <div class="table">
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
                <div v-else 
                    v-for="(item, index) in data" 
                    :key="index" 
                    class="table__body__list-box"
                    @click="selectItem(item)"
                    >
                    <div class="list" :style="{ width: `8%` }">
                        {{ index + 1 }}
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
    </DialogLayout>
</template>

<script setup lang="ts">
import DialogLayout from "@components/common/CommonDialog.vue"
import { computed, ref } from 'vue'

// 다이얼로그 닫기
const emit = defineEmits(["close-dialog", "open-detail", "on-selected"])
const isShowDialog:any = ref(false)
function openDialog( value: any) {
    console.log("sos table")
    isShowDialog.value = true
    data.value = value
}
defineExpose({ openDialog })
const closeDialog = () => {
    isShowDialog.value = false
    emit("close-dialog", false)
}

const label:any = "SOS 이력"
const menuList: string[] = ["구분", "업체", "공종", "성명", "직종/직책", "전화번호", "요청일자", "요청시간"]
const  data: any = ref([])

const width = computed((): string => {
    const res = String(100 / menuList.length + 1)
    return res
})


function selectItem( item:any ){
    console.log("item",item)
    emit("on-selected", item)
    closeDialog()

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
    flex: 1;
    overflow: hidden;
    padding-bottom: 50px;

    &__header {
        display: flex;
        align-items: center;
        justify-content: space-between;

        width: 100%;
        height: 50px;

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
        flex: 1;

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
            height: 50px;

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
