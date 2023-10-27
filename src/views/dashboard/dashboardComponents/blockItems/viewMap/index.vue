<template>
    <Teleport to="#viewMap">
        <div class="view-map">
            <img v-if="map==='조감도'" src="@assets/images/viewMap.png" alt="" class="view-map__image" />
            <img v-if="map==='드론'" :src="data.scene_file" alt="" class="view-map__image" />
            <img v-if="map==='도면'" style="width:100%; height: 100%;background: #151f27a6;" src="@assets/images/viewMap3.png" alt="" class="view-map__image" />
            <!-- <img v-if="map==='도면'" style="width:100%; height: 100%;" src="@assets/images/viewMap3.png" alt="" class="view-map__image" /> -->

            <div v-if="map==='도면'" class="mapZone">

                <div class="zone-box">
                    <div class="zone" v-for="zone in areaData" :id="'area'+ zone.area_id">
                        <span>{{ zone.area_main }} </span>
                        <span class="workCount">{{ zone.work_cnt }}명</span>
                    </div>
                    <div class="zone" id="area126">수처리/페수처리건물</div>
                    <div class="zone" id="area127">페수처리건물</div>
                    <div class="zone" id="area128">종합창고건물</div>
                    <div class="zone" id="area129">종합창사무실</div>
                    <div class="zone" id="area130">페수처리시설</div>
                    <div class="zone" id="area131">기계<br/>공작실</div>
                    <div class="zone" id="area132">순수저장탱크</div>
                    <div class="zone" id="area133">응죽수<br/>저장탱크</div>
                    <div class="zone" id="area134">방호벽</div>
                    <div class="zone" id="area135">서비스<br/>가스장소</div>
                    <div class="zone" id="area136">15KV GIS</div>
                    <div class="zone" id="area137">Area27</div>
                    <div class="zone" id="area138">LNG GS</div>
                    <div class="zone" id="area139">Area39</div>
                    <div class="zone" id="area140">가열공간</div>
                    <div class="zone" id="area141">종합사무실</div>
                    <div class="zone" id="area142">보일러</div>
                    <div class="zone" id="area143">소방펌프</div>


                </div>
            </div>


            <div class="map-buttons" :class="{'dark-mode':store.darkMode}">

                <div class="mapBtn" @click="changeView('조감도')">조감도</div>|
                <div class="mapBtn" @click="changeView('드론')">드론</div>|
                <div class="mapBtn" @click="changeView('도면')">도면</div>
            </div>
    
        </div>
    </Teleport>
</template>

<script setup lang="ts">
import { ref } from "vue"
import {useStore} from "@stores/index" 

const store = useStore()
interface Props {
    data: any
    areaData: any
}
const {} = defineProps<Props>()
const map:any = ref('조감도')
function changeView( type:string) {
        map.value = type
}
</script>

<style lang="scss" scoped>
@import "@assets/styles/main.scss";

.view-map {
    display: flex;
    align-items: center;
    overflow: hidden;
    border-radius: 6px;
    &__image {
        width: 100%;
    }
    width:100%;
    height: 100%;
    position: relative;

    // box-shadow: 0px 0px 5px #15202c;
    // border: 1px solid #15202cae;
    box-shadow: 0px 0px 5px #518fb461;
    border: 2px solid #18283261;
    box-sizing: border-box;
}

.map-buttons{
    width: 260px;
    height: 35px;
    position: absolute;
    background: #00132191;
    display: flex;
    align-items: center;
    // border: 2px solid #c3c2c2;
    border-radius: 6px;
    right: 2px;
    bottom: 2px;
    margin: 5px;
    // background-color: #9ad0f5;
    // color: #dddddd;
    font-size: 22px;  
    color: #dddddd;
}
.mapBtn{
    flex: 1;
    display: flex;
    justify-content: center;
    cursor: pointer;
    color: #ffffff;
    font-size: 19px;
    align-items: center;
    border-radius: 6px;

}
.mapBtn:hover {
    background-color: #15202c;
    height: 100%;
    color: white;
}

.mapZone{
    width: 100%;
    height: 100%;
    position: absolute;
    box-sizing: border-box;
    padding: 5px;
    // border: 1px solid #ffffff;
    border-radius: 6px;
    
    .zone-box{
        // background-image: url("@assets/images/viewMap3.jpg");
        opacity: 0.8;
        width: 100%;
        height: 100%;
        border-radius: 4px;
        // border: 1px solid #b7b7b7;
        box-sizing: border-box;
    }
    .zone{
        // border: 1px solid #b7b7b7;
        color: #ffffff;
        border-radius: 10px;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 20px;
        text-align: center;
        // background-color: #15202c;
        background-color: #14449c;
        display: flex;
        flex-direction: column;
        gap:5px;
        span {
            font-size: 20px;
            color: #ffffff;
            text-align: center;
        }
        .workCount{
            font-size: 24px;
            color: #ff6161 !important;
            font-weight: 700;
        }
    }
}

//ST
#area119{
    position: absolute;
    width: 10.5%;
    height: 10.5%;
    bottom: 28.5%;
    left: 51%;
}
// GT
#area120{
    position: absolute;
    width: 8.5%;
    height: 12%;
    top: 35%;
    left: 53%;
}
// HRSG 
#area121{
    position: absolute;
    width: 8%;
    height: 13%;
    top: 36%;
    left: 40%;
}
// 송전선로 
#area122{
    position: absolute;
    width: 6.5%;
    height: 27.5%;
    top: 13.5%;
    left: 77.5%;
}
// 냉각탑 
#area123{
    position: absolute;
    width: 4%;
    height: 41%;
    top: 26%;
    left: 27.5%;
}
// 주제어동 
#area124{
    position: absolute;
    width: 5.5%;
    height: 10.5%;
    bottom: 5%;
    left: 41.5%;
}
// 현장내
#area125{
    position: absolute;
    width: 5.5%;
    height: 7%;
    bottom: 39%;
    left: 9.5%;
}
// 페수처리건물
#area126{
    position: absolute;
    width: 16%;
    height: 13%;
    bottom: 4%;
    left: 55%;
}
// 페수처리건물
#area127{
    position: absolute;
    width: 13.5%;
    height: 11.5%;
    bottom: 7.5%;
    left: 18.5%;
}
// 종합창고건물
#area128{
    position: absolute;
    width: 2.8%;
    height: 19%;
    bottom: 5.5%;
    left: 89%;
}
// 종합창사무실
#area129{
    position: absolute;
    width: 4%;
    height: 10%;
    bottom: 32%;
    left: 88%;
}
// 페수처리시설
#area130{
    position: absolute;
    width: 5%;
    height: 2%;
    top: 80.5%;
    left: 74.5%;
}
// 기계공작실
#area131{
    position: absolute;
    width: 3.5%;
    height: 8%;
    top: 58%;
    left: 77.5%;
}
// 순수저장탱크
#area132{
    position: absolute;
    width: 7%;
    height: 1%;
    top: 48%;
    left: 77.5%;
}


// Zone14
#area133{
    position: absolute;
    width: 5%;
    height: 4%;
    top: 46%;
    left: 66%;
}

// Zone6
#area134{
    position: absolute;
    width: 4%;
    height: 2%;
    top: 34%;
    left: 67%;
}

// Zone26
#area135{
    position: absolute;
    width: 4.5%;
    height: 2%;
    top: 23%;
    left: 67%;
}

// Zone9
#area136{
    position: absolute;
    width: 11%;
    height: 6%;
    top: 8%;
    left: 49%;
}

// Zone27
#area137{
    position: absolute;
    width: 4%;
    height: 2%;
    top: 12%;
    left: 40%;
}

// Zone34
#area138{
    position: absolute;
    width: 5.6%;
    height: 3.5%;
    top: 38%;
    left: 11%;
}
// Zone
#area139{
    position: absolute;
    width: 2%;
    height: 5%;
    top: 21%;
    left: 19.5%;
}
// Zone
#area140{
    position: absolute;
    width: 5%;
    height: 1.5%;
    top: 25%;
    left: 56%;
}
// 종합사무실
#area141{
    position: absolute;
    width: 6%;
    height: 9.5%;
    top: 78%;
    left: 7%;
}
// 보일러
#area142{
    position: absolute;
    width: 4.5%;
    height: 1%;
    top: 56%;
    left: 39%;
}
// 보일러
#area143{
    position: absolute;
    width: 2.5%;
    height: 1%;
    top: 14%;
    left: 71%;
}
</style>
