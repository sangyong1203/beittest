<template>
    <div class="chart-box">
        <canvas ref="chartRef" style="width: 100%; height: 100%; box-sizing: content-box;"></canvas>
        <span class="chart-box__total"><span>{{ totalNum }}</span>대</span>
    </div>
</template>

<script setup lang="ts">
import { computed, ref, toRefs, onMounted, watch, inject } from "vue"
import { useStore } from "@stores/index"

const store = useStore()

interface Props {
    data: any
}
const props = defineProps<Props>()
const { data } = toRefs(props)

// const backgroundColor = store.colors
const backgroundColor = ['#fba3b5', '#78c8ff', '#93d9d9', '#f8c089', '#ffde90', '#dcb3ff', '#ba98fb',   '#f77f96', '#ffcf9f', '#8fc3cf', '#e4e5e7']

const Chart:any = inject('Chart')
let instanceChart:any = null
onMounted(() => {
    instanceChart = createChart()
})
watch(data,()=>{
    changeTotal()
    if(instanceChart) {
        let newData = data.value.map( (row:any) => row.cnt)
        instanceChart.data.datasets[0].data = newData
        instanceChart.update()
    }
})

let totalCount:any = computed(()=>{
    const initialValue = 0;
    let res = data.value.map( (item:any) => item.cnt)
                  .reduce((accumulator:number, currentValue:number) => accumulator + currentValue, initialValue);
    return res
})

const totalNum:any = ref(totalCount.value)
let interval:any = null
// 수자 변한는 효과
function changeTotal(){
    if(totalCount.value > totalNum.value){
        let count = totalCount.value - totalNum.value
        interval = setInterval(()=>{
            if(count === 0){
                clearInterval(interval)
                return
            }
            totalNum.value++
            count--
        }, 1)
    }
    if(totalCount.value < totalNum.value){
        let count = totalNum.value - totalCount.value
        interval = setInterval(()=>{

            if(count === 0 || totalNum.value < 0){
                clearInterval(interval)
                return
            }
            totalNum.value--
            count--
        }, 1)
    }
}

// 차트 생성
const chartRef: any = ref(null)
const config = {
    type: 'doughnut',
    options: {
        plugins: {
            legend: {
                display: false,
                labels: {
                    font: {
                        size: 12
                    }
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
        responsive: true,
    },
    data: {
        labels: data.value && data.value.map( (row:any) => row.ctgo_equip_name),
        datasets: [
            {
                data: data.value && data.value.map( (row:any) => row.cnt),
                backgroundColor: backgroundColor,
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
    height: 100%;
    max-height: 240px;
    zoom:calc(1/0.67);
    @include laptop() {
        zoom:calc(1/0.55);
    }

    &__total {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        font-weight: 700;
        font-size: 1.5vh;
        span{
            font-size: 2.3vh;
            font-weight: 700;
            width: 4vh;
            display: inline-block;
            text-align: right;
            padding-right: 3px;
        }
    }


    &.active {
        border: 15px solid rgb(100, 114, 211) !important;
    }
}
</style>
