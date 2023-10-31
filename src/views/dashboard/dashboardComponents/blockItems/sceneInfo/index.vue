<template>
    <Teleport to="#sceneInfo">
        <BasicLayout class="block-item" 
            :label="label" 
            :show-button="button"  
            @open-click="openDialog"
        >
            <div class="body">
                <div class="scene-info">
                    <div class="scene-info__basic-info">
                        <div class="scene-info__basic-info__current-date">
                            <div class="today">
                               {{ current }}
                            </div>
                            <div class="calendar">
                                <img v-if="store.darkMode" src="@assets/icons/calendarWhite.svg" alt="" class="calendar__icon" />
                                <img v-else src="@assets/icons/calendarBlue.svg" alt="" class="calendar__icon" />
                                D-{{ Math.floor(diffInDays) }}
                            </div>
                        </div>
                        <div class="scene-info__basic-info__detail-date">
                            <div class="item">
                                <span class="item__chip">착공일</span>
                                {{ formattedStartDate }}
                            </div>
                            <div class="item">
                                <span class="item__chip">준공일</span>
                                {{ formattedEndDate }}
                            </div>
                        </div>
                    </div>
                    <div class="scene-info__weather-info">
                        <div class="scene-info__weather-info__label">기상 정보</div>
                        <div class="scene-info__weather-info__data-box">
                            <div v-for="item in weatherList" :key="item.label" class="data">
                                <span class="data__label">{{ item.label }}</span>
                                <span>
                                    <span class="data__value">{{ item.value }}</span>
                                    <span v-if="item.label === '온도'"> &#8451;</span>
                                    <span v-if="item.label === '풍속'"> m/s</span>
                                    <span v-if="item.label === '적설'"> %</span>
                                    <span v-if="item.label === '강수량'"> mm</span>
                                    <span v-if="item.label === '미세먼지'"> mm</span>
                                    <span v-if="item.label === '초미세먼지'"> mm</span>

                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </BasicLayout>
    </Teleport>
</template>

<script setup lang="ts">
import BasicLayout from "@components/common/layout/BlockBasicLayout.vue"

import { computed, reactive, toRefs, ref, onUnmounted } from "vue"
import dayjs from "dayjs"
import "dayjs/locale/ko" //한국어
import { useStore } from "@stores/index"

dayjs.locale("ko")

const store = useStore()

interface Props {
    label?: string
    button: boolean
    data: any
}
const props = defineProps<Props>()
const { label, button, data } = toRefs(props)

const current = ref<string>(dayjs(new Date()).format("YYYY년 MM월 DD일 (dd) hh:mm:ss"))

let timer = setInterval(()=>{
  current.value = dayjs(new Date()).format("YYYY년 MM월 DD일 (dd) hh:mm:ss")

})
onUnmounted(() => {
    clearInterval(timer)
})
// 다이얼로그 열기
const emit = defineEmits(["send-event"])
const openDialog = (): void => {
    const datas = {
        label: label?.value,
        isVisible: true,
    }
    emit("send-event", datas)
}

// Dashboard 현장정보 데이터
const SIObj:any = reactive({
    Scene_data: [],
    Weather: [],
})
const sceneInfo = computed(() => {
    SIObj.Scene_data = data.value.Scene_data
    SIObj.Weather = data.value.weather

    return SIObj
})


const diffInDays = computed(() => {
    return getDateDiff(sceneInfo.value.Scene_data.scene_end_date)
})

const formattedStartDate = computed(() => {
    const date = new Date(sceneInfo.value.Scene_data.scene_start_date)
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()

    return `${year}-${month < 10 ? "0" + month : month}-${day < 10 ? "0" + day : day}`
})
const formattedEndDate = computed(() => {
    const date = new Date(sceneInfo.value.Scene_data.scene_end_date)
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()

    return `${year}-${month < 10 ? "0" + month : month}-${day < 10 ? "0" + day : day}`
})

const weatherList = computed(() => {
    const weatherData = [
        {
            label: "온도",
            value: sceneInfo.value.Weather.weather_temp,
        },
        {
            label: "풍속",
            value: sceneInfo.value.Weather.weather_speed,
        },
        {
            label: "적설",
            value: sceneInfo.value.Weather.weather_snow,
        },
        {
            label: "강수량",
            value: sceneInfo.value.Weather.weather_rain,
        },
        {
            label: "미세먼지",
            value: sceneInfo.value.Weather.weather_rain,
        },
        {
            label: "초미세먼지",
            value: sceneInfo.value.Weather.weather_rain,
        },
    ]
    return weatherData
})

// 착공일과 준공일 날짜 차이
const getDateDiff = (d1: string) => {
    const date1 = new Date(dayjs().format("YYYY.MM.DD"))
    const date2 = new Date(d1)
    const diffDate = date1.getTime() - date2.getTime()

    return Math.floor(Math.abs(diffDate / (1000 * 60 * 60 * 24))) // 밀리세컨 * 초 * 분 * 시 = 일
}

</script>

<style lang="scss" scoped>
@import "@assets/styles/main.scss";

$HEIGHT: 54px; // 헤더 Height 값
.header {
    display: flex;
    align-items: center;

    width: 100%;
    height: $HEIGHT;

    position: relative;

    &__label {
        position: absolute;
        left: 0;

        font-weight: 700;
        font-size: 17px;
        line-height: 20px;

        @include laptop() {
            font-weight: 700;
            font-size: 16px;
            line-height: 20px;
        }
    }
    &__button {
        display: flex;
        align-items: center;
        justify-content: center;

        gap: 6px;

        position: absolute;
        right: 0;

        outline: none;
        border: none;

        color: $color-blue-600;
        background-color: transparent;

        cursor: pointer;

        @include laptop() {
            font-weight: 700;
            font-size: 15px;
            line-height: 20px;
        }

        &__icon {
            width: 16px;
            height: 16px;

            @include laptop() {
                width: 14px;
                height: 14px;
            }
        }
    }
}
.emergen-button{
    background-color: #de3e47;
    border-radius: 5px;
    padding: 5px 8px;
    color: white;
}
.body {
    width: 100%;
    height: calc(100% - 54px);
    display: flex;
    padding: 20px;
    box-sizing: border-box;
}

.scene-info {
    display: flex;
    flex-direction: column;
    align-items: center;

    width: 100%;

    gap: 28px;

    @include desktop() {
        gap: 12px;
    }

    @include laptop() {
        gap: 8px;
    }
    @include tablet() {
        gap: 8px;
    }

    &__basic-info {
        display: flex;
        align-items: center;
        justify-content: space-between;

        width: calc(100% - 48px);

        gap: 40px;

        @include desktop() {
            width: 100%;

            gap: 0px;
        }
        @include laptop() {
            width: 100%;

            padding: 0;
            gap: 8px;
        }
        @include tablet() {
            flex-direction: column;

            gap: 12px;
        }

        &__current-date {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: flex-start;

            gap: 12px;

            @include laptop() {
                gap: 8px;
            }

            .today {
                font-size: 20px;
                color: $color-black-600;
            }
            .calendar {
                display: flex;
                align-items: center;

                gap: 12px;

                font-weight: 700;
                font-size: 28px;
                line-height: 34px;

                color: $color-blue-600;

                &__icon {
                    width: 30px;
                    height: 30px;
                    margin-bottom: 2px;
                }
            }
        }
        &__detail-date {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: flex-start;

            gap: 10px;
            .item {
                display: flex;
                align-items: center;

                gap: 12px;

                font-weight: 400;
                font-size: 18px;
                line-height: 22px;

                color: $color-black-600;

                &__chip {
                    display: flex;
                    flex-direction: row;
                    align-items: flex-start;

                    padding: 6px 10px;

                    border-radius: 3px;
                    background-color: #afd2e952;

                    font-size: 18px;
                    font-weight: 700;
                    color: #294e92;

                }
            }
        }
    }
    &__weather-info {
        width: 100%;

        &__label {
            padding: 6px 10px;

            background-color: #afd2e952;
            border-radius: 3px;

            line-height: 20px;
            color: $color-blue-600;

            font-size: 20px;
            font-weight: 700;
            line-height: 24px;

        }
        &__data-box {
            display: grid;
            grid-template-columns: repeat(2, 1fr);

            gap: 0 32px;

            .data {
                display: flex;
                flex-direction: row;
                justify-content: space-between;
                align-items: center;

                width: 100%;
                padding: 12px 8px;

                border-bottom: 1px solid #e6e8ed;

                
                &__label {
                    font-weight: 500;
                    font-size: 20px;
                    color: $color-black-600;
                    flex-grow: 1;
                }
                &__value {
                    font-weight: 700;
                    font-size: 20px;
                    color: $color-blue-600;
                }
            }
        }
    }
}
</style>
