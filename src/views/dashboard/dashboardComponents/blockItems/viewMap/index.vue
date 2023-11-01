<template>
    <Teleport to="#viewMap">
        <div class="view-map">

            
            <div class="workers">
                <div class="title">작업자( 총: {{dataList.length}}명 )</div>
                <div class="workers-content">
                    <div class="workers-name" v-for="item in dataList">
                        <span class="area-num" :style="{backgroundColor: getColor(item.area_id)}">{{ item.area_id }}</span>
                        <span class="item-name">{{ item.worker_name }}</span>
                    </div>
                </div>
            </div>

            <!-- 작업자 -->
            <!-- <div class="equips1" >
                <div class="title">작업자( 총: {{dataList.length}}명 )</div>
                <div class="equips-content">
                    <div class="equips-number" v-for="(item, index) in workerList">
                        <span class="area-num">{{ (index + 1) + workerListCounter*10  }}</span>
                        <span class="item-name">{{ item.worker_name }}</span>
                    </div>
                </div>
            </div> -->
            
            <!-- --------- -->

            <!-- 장비 -->
            <div class="equips1">
                <div class="title">장비( 총: {{carNumberList.length}}대 )</div>
                <div class="equips-content">
                    <div class="equips-number" v-for="(item, index) in carNumberList">
                        <span class="area-num">{{ index+1 }}</span>
                        <span class="item-name">{{ item.equip_name }}</span>
                    </div>
                </div>
            </div>
            <div class="mapZone">
                <div class="mapZone-title">
                    <div class="zone-title" style="background: #296436;">200m(구역1)</div>
                    <div class="zone-title" style="background: #717a1a;">400m(구역2)</div>
                    <div class="zone-title" style="background: #76650c;">600m(구역3)</div>
                    <div class="zone-title" style="background: #763e0c;">800m(구역4)</div>
                    <div class="zone-title" style="background: #933344;">1000m(구역5)</div>
                    <div class="zone-title" style="background: #760c61;">1200m(구역6)</div>
                    <div class="zone-title" style="background: #561c9b;">1400m(구역7)</div>
                    <div class="zone-title" style="background: #0c3276;">1600m(구역8)</div>
                    <div class="zone-title" style="background: #0c6476;">1800m(구역9)</div>
                </div>
                <div class="mapZone-box " style="border: 8px solid #d5e30752;">
                    <div class="zone" v-for="areaNum in 9">
                        <div class="zone-content" >
                            <template v-for="item in inAreaWorkerList">
                                <div v-if="item.area_id === areaNum" class="zone-item">
                                    <div v-if="item.equip_name" class="zone-name equip-item">
                                        <div style="background: #efff0029;">{{ item.equip_name  }}</div>
                                        <div>{{ item.worker_name  }}</div>
                                    </div>
                                    <div v-else class="zone-name worker-item">
                                        {{ item.worker_name  }}
                                    </div>
                                </div>
                            </template>
                        </div>
                    </div>
                </div>
                <div class="mapZone-box " style="border: 8px solid #337633b0; ">
                    <div class="zone" v-for="areaNum in 9">
                        <div class="zone-content" >
                            <template v-for="item in inAreaWorkerList">
                                <div v-if="item.area_id === areaNum" class="zone-item">
                                    <div v-if="item.equip_name" class="zone-name equip-item">
                                        <div style="background: #efff0029;">{{ item.equip_name  }}</div>
                                        <div>{{ item.worker_name  }}</div>
                                    </div>
                                    <div v-else class="zone-name worker-item">
                                        {{ item.worker_name  }}
                                    </div>
                                </div>
                            </template>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </Teleport>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue"
import {useStore} from "@stores/index" 
import { getCarNumber } from "./carnumber";
import { getWorkerName } from "./workernames";
const store = useStore()
interface Props {
    data: any
}
const { data } = defineProps<Props>()
const dataList = getWorkerName()
const carNumberList = getCarNumber().slice(0, 20)
const inAreaWorkerList:any = ref([])

onMounted(()=>{
    setInAreaWorkerList(dataList)
})
function setInAreaWorkerList(list:any){
    let arr:any = []
    list.forEach((item:any)=>{
        if(item.equip_name){
            arr.unshift(item)
        }else{
            arr.push(item)
        }
    })
    inAreaWorkerList.value = arr
}

function getColor(area_id:number){
    let color =""
    switch(area_id){
        case 1:
            color = "#296436"
            break
        case 2:
            color = "#717a1a"
            break
        case 3:
            color = "#76650c"
            break
        case 4:
            color = "#763e0c"
            break
        case 5:
            color = "#933344"
            break
        case 6:
            color = "#760c61"
            break
        case 7:
            color = "#561c9b"
            break
        case 8:
            color = "#0c3276"
            break
        case 9:
            color = "#0c6476"
            break
    }
    return color
}
</script>

<style lang="scss" scoped>
@import "@assets/styles/main.scss";

// $bordercolor: #518fb461;
$bordercolor: #2d3438;
// $bordercolor: #15202c;
.view-map {
    gap: 5px;
    display: flex;
    align-items: center;
    overflow: hidden;
    border-radius: 6px;
    &__image {
        width: 100%;
        height: 100%;
    }
    width:100%;
    height: 100%;
    position: relative;
    box-shadow: 0px 0px 5px #518fb461;
    border: 2px solid #18283261;
    box-sizing: border-box;
}
.workers{
    width: 300px;
    height: 100%;
    border: 1px solid $bordercolor;
    border-radius: 5px;

    .title{
        color: #dddddd;
        height: 40px;
        font-size: 20px;
        display: flex;
        justify-content: center;
        align-items: center;
        border-bottom: 1px solid $bordercolor;
        background: #141e29;

    }
    .workers-content{
        display: flex;
        flex-wrap: wrap;
        gap: 0px;
        height: calc(100% - 45px);
        overflow: hidden;
        padding: 3px 0;
        justify-content: flex-start;
    }
    .workers-name{
        width: 33.3%;
        color: #dddddd;
        font-size: 18px;
        border: 1px solid $bordercolor;
        display: flex;
        justify-content: center;
        align-items: center;
        white-space: nowrap; 
        text-overflow: ellipsis;
        overflow: hidden;
        gap: 3px;
        background: #070b0e;
        .area-num{
            width: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
        }
    }
}

.equips1{
    width: 230px;
    height: 100%;
    border: 1px solid $bordercolor;
    border-radius: 5px;

    // background: #2d3438;
    .title{
        color: #dddddd;
        height: 40px;
        font-size: 20px;
        display: flex;
        justify-content: center;
        align-items: center;
        border-bottom: 1px solid $bordercolor;
        background: #141e29;
    }
    .equips-content{
        display: flex;
        flex-wrap: wrap;
        gap: 0px;
        height: calc(100% - 36px);
        overflow: hidden;
        padding: 3px 0;
        justify-content: space-evenly;
    }
    .equips-number{
        width: 100%;
        height: 5%;
        border: 1px solid $bordercolor;
        display: flex;
        justify-content: space-evenly;
        align-items: center;
        white-space: nowrap; 
        text-overflow: ellipsis;
        overflow: hidden;

        background: #070b0e;
        span{
            color: #dddddd;
            font-size: 22px;
        }
        .area-num{
            width: 20%;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            border-right: 2px solid #2d3438;
        }
        .item-name{
            flex: 1;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
        }
    }
}
.equips{
    width: 230px;
    height: 100%;
    border: 3px solid $bordercolor;
    border-radius: 5px;

    background: #2d3438;

    .title{
        color: #dddddd;
        height: 40px;
        font-size: 22px;
        display: flex;
        justify-content: center;
        align-items: center;
        border-bottom: 3px solid $bordercolor;
    }
    .equips-content{
        display: flex;
        flex-wrap: wrap;
        gap: 3px;
        height: calc(100% - 45px);
        padding: 4px;
        overflow: hidden;
    }
    .equips-number{
        width: 100%;
        color: white;
        font-size: 22px;
        border: 1px solid $bordercolor;
        display: flex;
        justify-content: center;
        align-items: center;
        white-space: nowrap; 
        text-overflow: ellipsis;
        overflow: hidden;
        background: #070b0e;

    }
}
.map-buttons{
    width: 260px;
    height: 35px;
    position: absolute;
    background: #00132191;
    display: flex;
    align-items: center;
    border-radius: 6px;
    right: 2px;
    bottom: 2px;
    margin: 5px;
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
    color: #dddddd;
}

.mapZone{
    flex: 1;
    height: 100%;
    box-sizing: border-box;
    // padding: 5px;
    // border: 1px solid $bordercolor;
    // border-radius: 5px;
    display: flex;
    flex-direction: column;
    gap: 5px;
    .mapZone-box{
        display: flex;
        border: 1px solid $bordercolor;
        border-radius: 5px;
        height: calc(50% - 27px);
    }
    .mapZone-title{
        display: flex;
        border: 1px solid $bordercolor;
        border-radius: 5px;
        height: 44px;


        .zone-title{
            color: #dddddd;
            display: flex;
            justify-content: center;
            align-items: center;
            border: 1px solid $bordercolor;
            width: 100%;
            font-size: 20px;
            font-weight: 600;
            background-color: #296436;
        }
    }


    .zone{
        display: flex;
        flex: 1;
        height: 100%;
        border: 1px solid $bordercolor;
        flex-direction: column;
        align-items: center;
        overflow: hidden;
       .zone-content{
            // display: flex;
            // flex-wrap: wrap;
            // align-content: flex-start;

            gap: 3px;
            height: 100%;
            width: 100%;
            padding: 5px;

        }
        .zone-item{
            max-width: 31.5%;
            min-width: 23%;
            float: left;
            margin: 2px;
        }
        .zone-name{
            color: #dddddd;
            font-size: 18px;
            background: #586c71;
            display: flex;
            justify-content: center;
            align-items: center;
            border-radius: 4px;
            padding: 2px;
            overflow: hidden;
            flex-direction: column;
            div{
                color: #dddddd;
                padding: 2px;
            }
        }
        .equip-item{
            border: 1px solid;
            width: 100%;
            padding: 2px;
            font-size: 18px;
            div{
                white-space: nowrap;
                overflow: hidden;
            }
        }
        .worker-item{

        }

    }
}

#구역1{
    position: absolute;
    top: 82%;
    left: 4%;
    z-index: 11;
}
#구역2{
    position: absolute;
    top: 72%;
    left: 16%;
    z-index: 12;
}
#구역3{
    position: absolute;
    top: 29%;
    left: 9%;
    z-index: 16;

}
#구역4{
    position: absolute;
    top: 8%;
    left: 15%;
    z-index: 14;
}
#구역5{
    position: absolute;
    top: 20%;
    left: 25%;
    z-index: 15;
}   
#구역6{
    position: absolute;
    top: 37%;
    left: 29%;
    z-index: 16;
}
#구역7{
    position: absolute;
    top: 84%;
    left: 29%;
    z-index: 17;
}
// 페수처리건물
#구역8{
    position: absolute;
    top: 77%;
    left: 66%;
    z-index: 18;
}
// 페수처리건물
#구역9{
    position: absolute;
    top: 65%;
    left: 65%;
    z-index: 19;
}
// 종합창고건물
#구역10{
    position: absolute;
    top: 53%;
    left: 58%;
    z-index: 20;
}
</style>
./workernames