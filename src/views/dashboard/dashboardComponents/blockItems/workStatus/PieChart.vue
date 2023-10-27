<template>
    <div  class="chart-box">
        <canvas ref="chartRef" style="width: 100%; height: 100%; box-sizing: content-box;"></canvas>
    </div>
</template>

<script setup lang="ts">
// import Chart from "chart.js/auto"
import { ref, onMounted, watch, toRefs, inject } from "vue"
import { useStore } from '@stores/index'

const store = useStore()

interface Props {
    data: any
}
const props = defineProps<Props>()
const { data }= toRefs(props)

const Chart:any = inject('Chart')
let instanceChart:any = null
onMounted(() => {
    instanceChart = createChart()
})

watch(data, ()=>{
    if(instanceChart) {
        let newData = data.value.map( (row:any) => row.cnt)
        instanceChart.data.datasets[0].data = newData
        instanceChart.update()
    }
})

const colors = ['#fba3b5', '#78c8ff', '#93d9d9', '#f8c089', '#ffde90', '#ba98fb', '#a3c1ff']
// 차트 생성
const chartRef: any = ref(null)
Chart.defaults.font.weight = 600
if(store.darkMode){
    Chart.defaults.borderColor = store.darkModeColor.borderColor
    Chart.defaults.color = store.darkModeColor.fontColor
    Chart.defaults.scale.ticks.backdropColor = 'transparent'
}

let delayed: any = null
const config = {
    type: 'polarArea',
    options: {
        responsive: true,
        plugins: {
            legend: {
                display: true,
                position: 'bottom',
                labels: {
                    font: {
                        size: 9
                    },
                    boxWidth: 30,
                    boxHeight: 9,
                    border: "none"
                },
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
        animations: {
            y: {
                easing: 'easeInOutElastic',
                onComplete: () => {
                    delayed = true;
                },
                delay: (context:any) => {
                    let delay = 0;
                    if (context.type === 'data' && context.mode === 'default' && !delayed) {
                    delay = context.dataIndex * 50;
                    }
                    return delay;
                },
            }
        }
    },
    data: {
        labels: data.value && data.value.map( (row:any) => row.name),
        datasets: [
            {
                data: data.value && data.value.map( (row:any) => row.cnt),
                backgroundColor: colors.map( (item:any) => item+'d9'),
                borderWidth: 1,
                borderColor: '#ffffff20'
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
    position: relative;
    width: 100%;
    height: 100%;
    // padding: 5px 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    zoom:calc(1/0.67);
    @include laptop() {
        zoom:calc(1/0.55);
    }

    &__total {
        position: absolute;
        top: 45%;
        left: 50%;
        transform: translate(-50%, -50%);
        font-weight: 700;
        font-size: 90px;
        line-height: 90px;
    }
    
}
</style>
