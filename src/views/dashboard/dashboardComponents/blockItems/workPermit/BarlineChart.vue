<template>
    <div class="chart-box">
        <canvas ref="chartRef" style="width:100%; height:100%;position: absolute; z-index: 3;"></canvas>
        <div class="todayBox"></div>

    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, inject, toRefs } from "vue"
import { useStore } from "@stores/index"
import dayjs from "dayjs"

const store = useStore()

interface Props {
    data: any
}

const props = defineProps<Props>()
const { data } = toRefs(props)

const Chart:any = inject('Chart')
let instanceChart:any = null
onMounted(() => {
    fillData()
    instanceChart = createChart()
})

watch(data, ()=>{
    if(instanceChart) {
        instanceChart.data.datasets[0].data = data.value.map( (row:any) => row.special_cnt)
        instanceChart.data.datasets[1].data = data.value.map( (row:any) => row.safety_cnt)
        instanceChart.data.datasets[2].data = data.value.map( (row:any) => row.special_cnt)
        instanceChart.update()
    }
})

// 차트의 모양이 안깨지기 위해 7개이상 데이터가 필요함, 빈 데이터 추가하기
function fillData(){
    if(data.value && data.value.length < 7){
        let item = {
            safety_cnt: 0,
            special_cnt: 0,
            date: "  ",
        }
        let addNum = 7 - data.value.length
        while(addNum){
            data.value.push(item)
            addNum -- 
        }
    }
}

// 차트 생성
const chartRef: any = ref(null)
if(store.darkMode){
    Chart.defaults.borderColor = "#ffffff2b"
}
// 날짜 리스트 설정
function getDateList(dataList:any){
    let today =  dayjs().format("YYYY-MM-DD")
    let arrDate:any = []
    dataList.forEach( (item:any) => {
        if(item.date === today) {
            arrDate.push("Today")
        } else {
            arrDate.push(item.date.slice(5))
        }
    })
    return arrDate
}

const config = {
    type: 'bar',
    options: {
        plugins: {
            legend: {
                display: true,
                labels: {
                    font: {
                        size: 10
                    },
                    boxWidth: 30,
                    boxHeight: 9
                }
            },
            tooltip: {
                enabled: true,
                titleFont:{
                    size: 12
                },
                bodyFont:{
                    size: 12
                }
            }
        },
        scales: {
            x: {                          
                ticks: {
                    font: {
                        size: 11
                    }
                }
            },
            y: {
                ticks: {
                    font: {
                        size: 9
                    }
                }
            }
        } ,
    },
    data: {
        labels: data.value && getDateList(data.value),
        datasets: [
            {
                type: 'line',
                label: '특별 추세선',
                data: data.value && data.value.map( (row:any) => row.special_cnt),
                backgroundColor: '#f9708c',
                borderColor: '#f9708c',
                borderWidth: 2,
                animations: {
                    y: {
                        easing: 'easeInOutElastic',
                        from: (ctx:any) => {
                            if (ctx.type === 'data') {
                                if (ctx.mode === 'default' && !ctx.dropped) {
                                ctx.dropped = true;
                                return 0;
                                }
                            }
                        },
                        duration: 2000,
                    }
                },
            },
            {
                type: 'bar',
                label: '일반',
                data: data.value && data.value.map( (row:any) => row.safety_cnt),
                backgroundColor: '#78c8ff',

                animations: {
                    y: {
                        easing: 'easeInOutElastic',
                        from: (ctx:any) => {
                            if (ctx.type === 'data') {
                                if (ctx.mode === 'default' && !ctx.dropped) {
                                ctx.dropped = true;
                                return 0;
                                }
                            }
                        },
                        duration: 1500,
                    }
                },
            },
            {
                type: 'bar',
                label: '특별',
                data: data.value && data.value.map( (row:any) => row.special_cnt),
                backgroundColor: '#fba3b5',
                animations: {
                    y: {
                        easing: 'easeInOutElastic',
                        from: (ctx:any) => {
                            if (ctx.type === 'data') {
                                if (ctx.mode === 'default' && !ctx.dropped) {
                                ctx.dropped = true;
                                return 0;
                                }
                            }
                        },
                        duration: 1200,
                    }
                },
            },
        ]
    }
}
function createChart() {
    return new Chart(chartRef.value, config)
}
</script>

<style lang="scss" scoped>
@import "@assets/styles/main.scss";
.chart-box {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    box-sizing: border-box;
    zoom:calc(1/0.67);
    position: relative;
    @include laptop() {
        zoom:calc(1/0.55);
    }
    &.active {
        border: 15px solid rgb(100, 114, 211) !important;
    }
}
.todayBox{
    position: absolute;
    width: 13.4%;
    height: calc(100% - 30px);
    right: 0;
    bottom: 0;
    margin-right: 6px;
    background: linear-gradient(#30a8f982, #17152c00);
    z-index: 0;
}
</style>

