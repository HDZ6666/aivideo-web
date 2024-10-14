<template>
    <div class="pie" ref="target">
        
    </div>
</template>
<script setup>
import { ref ,onMounted,inject,markRaw} from 'vue';
import { setFontSize } from "@/utils/setFontSize";
import { setHeight,setWeigth } from "@/utils/setSize"
const { data ,color} = defineProps({
    title:{
        type:String,
        default:''
    },
    data:{
        type:Array,
        default:()=>[{
            value:12,
            name:"考勤异常"
        },{
            value:88,
            name:"考勤正常"
        }]
    },
    color:{
        type:Array,
        default:()=>['#ff3335', '#2555f4']
    }
})
const echarts = inject('$echarts');
const target = ref(null);
let myChart = ref();
onMounted(()=>{
    renderChart()
    window.addEventListener('resize', () => {
        myChart.resize();
    });
})
const renderChart = () => {
    const myChart = markRaw(echarts.init(target.value));;
    let option = {
        tooltip: {
            trigger: 'item'
        },
        legend: {
            top: 'center',
            right: '5%',
            orient:"vertical",
            icon:"circle",
            itemGap:setHeight(20),
            textStyle:{
                color:"#fff",
                fontSize:setFontSize(16)
            },
            itemStyle:{
                borderRadius: 50,
            },
            label:{
                formatter:(value)=>{
                    console.log(value,'value')
                    debugger
                    //return `{a|${value.name}}\n{b|${value.percent}%}`
                },
                // rich:{
                //     a:{
                //         color:"#fff",
                //         fontSize:setFontSize(16),
                //         lineHeight:setHeight(30)
                //     },
                //     b:{
                //         color:"#fff",
                //         fontSize:setFontSize(16),
                //         lineHeight:setHeight(30)
                //     }
                // }
            }
        },
        color,
        series: [
            {
            name: '考勤统计',
            type: 'pie',
            radius: ['30%', '40%'],
            avoidLabelOverlap: false,
            label: {
                show: false,
                position: 'center',
                formatter:(value)=>{
                    console.log(value,'value')
                    return `{a|${value.name}}\n{b|${value.percent}%}`
                    //return `{a|${value.name}}\n{b|${value.percent}%}`
                },
                rich:{
                    a:{
                        color:"#fff",
                        fontSize:setFontSize(16),
                        lineHeight:setHeight(30)
                    },
                    b:{
                        color:"rgba(191,231,249)",
                        fontSize:setFontSize(16),
                        lineHeight:setHeight(30)
                    }
                }
            },
            emphasis: {
                label: {
                    show: true,
                    fontSize: setFontSize(20),
                    fontWeight: 'bold'
                }
            },
            labelLine: {
                show: false
            },
            data
            }
        ]
    };
    myChart&&myChart.setOption(option);
}
</script>
<style scoped lang="scss">
.pie{
    width: 100%;
    height: 100%;
}
</style>