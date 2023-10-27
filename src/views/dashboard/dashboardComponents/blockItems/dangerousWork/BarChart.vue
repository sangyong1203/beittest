<template>
    <div class="chart-box">
        <canvas ref="chartRef" style="width:100%; height:100%"></canvas>
    </div>
</template>

<script setup lang="ts">
// import Chart from "chart.js/auto"
import { ref, onMounted, watch, inject, toRefs } from "vue"
import { useStore } from "@stores/index"

const store = useStore()

interface Props {
    data: any
}

const props= defineProps<Props>()
const { data } = toRefs(props)

const Chart:any = inject('Chart')
let instanceChart:any = null
onMounted(() => {
    instanceChart = createChart()
})

watch(data, ()=>{
    if(instanceChart) {
        instanceChart.data.datasets[0].data = data.value.map( (row:any) => row.hyp_cnt)
        instanceChart.data.datasets[1].data = data.value.map( (row:any) => row.old_cnt)
        instanceChart.data.datasets[2].data = data.value.map( (row:any) => row.new_cnt)
        instanceChart.update()
    }
})

// 차트 생성
const chartRef: any = ref(null)
if(store.darkMode){
    Chart.defaults.borderColor = "#ffffff2b"
}
data.value.forEach( (item:any) => {
    item.date = item.date.slice(5)
})

const config = {
    type: 'line',
    options: {
        plugins: {
            legend: {
                display: true,
                labels: {
                    font: {
                        size: 10
                    },
                    boxWidth: 30,
                    boxHeight: 6
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
        labels: data.value.map( (row:any) => row.date),
        datasets: [
            {
                type: 'line',
                label: '고혈압',
                data: data.value && data.value.map( (row:any) => row.hyp_cnt),
                backgroundColor: '#fba3b5',
                borderColor: '#fba3b5',
                
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
                // fill: 1,
                tension: 0.5
            },
            {
                type: 'line',
                label: '고령자',
                data: data.value && data.value.map( (row:any) => row.old_cnt),
                backgroundColor: '#78c8ff',
                borderColor: '#78c8ff',
                
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
                tension: 0.5
            },
            {
                type: 'line',
                label: '신규 인원',
                data: data.value && data.value.map( (row:any) => row.new_cnt),
                backgroundColor: '#ffde90',
                borderColor: '#ffde90',
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
                // fill: 1,
                tension: 0.5
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
    padding: 5px 10px;
    display: flex;
    align-items: center;
    box-sizing: border-box;
    zoom:calc(1/0.67);
    @include laptop() {
        zoom:calc(1/0.55);
    }

    &.active {
        border: 15px solid rgb(100, 114, 211) !important;
    }
}

</style>
