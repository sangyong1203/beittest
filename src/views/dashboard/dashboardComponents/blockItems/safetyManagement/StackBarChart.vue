<template>
    <div class="chart-box">
        <canvas ref="chartRef"  style="width:100%; height: 100%;"></canvas>
    </div>
</template>

<script setup lang="ts">
import {  ref, onMounted, watch, inject, toRefs } from "vue"
import { useStore } from "@stores/index"

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
        instanceChart.data.datasets[0].data = data.value.map( (row:any) => row.action_cnt)
        instanceChart.data.datasets[1].data = data.value.map( (row:any) => row.inaction_cnt)
        instanceChart.update()
    }
})
// 차트의 모양이 안깨지기 위해 7개이상 데이터가 필요함, 빈 데이터 추가하기
function fillData(){
    if(data.value && data.value.length < 7){
        let item = {
            action_cnt: 0,
            comapny_name: "  ",
            inaction_cnt: 0
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
                stacked: true,
                ticks: {
                    font: {
                        size: 9
                    }
                }
            },
            y: {
                stacked: true,
                ticks: {
                    font: {
                        size: 9
                    }
                }
            }
        } ,
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
    data: {
        labels: data.value && data.value.map( (row:any) => row.company_name),
        datasets: [
        {
            label: '조치',
            data: data.value && data.value.map( (row:any) => row.action_cnt),
            backgroundColor: '#78c8ff',
        },
        {
            label: '미조치',
            data: data.value && data.value.map( (row:any) => row.inaction_cnt),
            backgroundColor: '#fba3b5',
        }
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
    padding: 5px 10px;
    display: flex;
    align-items: center;
    box-sizing: border-box;
    position: relative;
    zoom:calc(1/0.67);
    @include laptop() {
        zoom:calc(1/0.55);
    }
    canvas {
        width: 100%;
        height: 100%; 
    }
    &.active {
        border: 15px solid rgb(100, 114, 211) !important;
    }
}
.todayBox{
    position: absolute;
    width: 73px;
    height: calc(100% - 42px);
    border: 1px solid yellow;
    right: 13px;
    bottom: 0;
    margin-bottom: 10px;
}
</style>
