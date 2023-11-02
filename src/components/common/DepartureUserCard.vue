<template>
    <div class="user-card" :class="{'red-border':!tbm}">
        <div class="user-card__image" @click="onImageClick(data.photo)" @click.stop>
            <img v-if="data.photo !== ''" :src="data.photo" alt="" class="user-card__image__icon" style="width: 100%; height: 100%" />
            <img v-else src="/assets/icons/lineUser.svg" alt="" class="user-card__image__icon" style="width: 48px; height: 48px" />
        </div>
        <div class="user-card__data-box" >
            <div class="user-card__data-box__data">
                <span>{{ data.company_name }}</span>
                <span>{{ data.ctgo_construction_name }}</span>
                <span>{{ data.user_name }} / {{ data.duty }}</span>
                <span v-if="tbm">{{ "참석 "}}</span>
                <span v-else style="color: #de3e47;">{{ "미참석 "}}</span>
                <span style="font-size: 14px; ">{{healthCare}}</span>
            </div>
            <div class="user-card__data-box__time">{{ data.place }} {{ data.time }}</div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, toRefs, onMounted  } from "vue"

interface Props {
    data: {
        company_name: string
        ctgo_construction_name: string
        user_name: string
        duty: string
        photo: string
        place: string
        time: string
        tbm_state?: any 
        high_blood_state: number
        after_care_state: number
        diabetes_state: number
        etc_state: number
    }
}
const props = defineProps<Props>()
const { data } = toRefs(props)

let tbm:any = ref(true)
if(data.value.tbm_state === 1) {
    tbm.value = true
} else {
    tbm.value = false
}
const healthCare:any = ref("")
onMounted(()=>{
    setHealthCare()
})
function setHealthCare(){
    healthCare.value = data.value.high_blood_state === 1 ? "/고혈압 " : ""
    healthCare.value += data.value.diabetes_state === 1 ? "/당뇨 " : ""
    healthCare.value += data.value.after_care_state === 1 ? "/사후관리 " : ""
    healthCare.value += data.value.etc_state === 1 ? "/기타" : ""
}
const onImageClick = (url: string) => {
    if (url != null && url != "") {
        window.open(url, "_blank")
    } else {
        return
    }
}
</script>

<style lang="scss" scoped>
@import "@assets/styles/main.scss";

.user-card {
    display: flex;
    align-items: center;
    justify-content: flex-start;

    width: calc(100% - 40px);

    padding: 20px;
    gap: 16px;

    border: 1px solid $color-white-400;
    border-radius: 6px;

    cursor: pointer;

    &__image {
        display: flex;
        align-items: center;
        justify-content: center;

        width: 140px;
        min-width: 140px;
        height: 140px;

        background-color: $color-white-100;
        border-radius: 8px;

        &__icon {
            width: 28px;
            height: 28px;

            border-radius: 4px;
        }
    }
    &__data-box {
        display: flex;
        flex-direction: column;
        align-items: space-between;
        justify-content: space-between;

        min-height: 142px;
        max-height: 144px;
        gap: 8px;

        &__data {
            display: flex;
            flex-direction: column;
            justify-content: flex-start;
            
            gap: 7px;
        }
        &__time {
            color: $color-blue-900;
        }
    }
}

.user-card__image {
    border: 1px solid $color-white-300;
}
.red-border{
    border-color: #de3e47 !important;
}
</style>
