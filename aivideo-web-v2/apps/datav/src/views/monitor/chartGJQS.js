var gjqsId=null;
var gjqsOption = null;
var gjqsChart = null;
const gjqsResize=function(){
  if(gjqsChart!=null){
    if(document.getElementById(gjqsId)!=null){
      gjqsChart.resize();   
    }
  }
}
const gjqsReload=function(){
  if(gjqsChart!=null){
    if(document.getElementById(gjqsId)!=null){
      gjqsChart.setOption(gjqsOption);
    }
  }
}
const gjqsChartCreate=function($echart,id,themeColor='0052d9'){
  gjqsId=id;
  gjqsOption={
    tooltip: {
        trigger: 'axis',
        backgroundColor: '#fff',
        textStyle: {
          color: '#000'
        },
        axisPointer: {
            lineStyle: {
                color: {
                    type: 'linear',
                    x: 0,
                    y: 0,
                    x2: 0,
                    y2: 1,
                    colorStops: [{
                        offset: 0,
                        color: 'rgba(255, 224, 144, 0)'
                    }, {
                        offset: 0.5,
                        color: 'rgba(255, 224, 144, 1)',
                    }, {
                        offset: 1,
                        color: 'rgba(255, 224, 144, 0)'
                    }],
                    global: false
                }
            }
        }
    },
    grid: {
        top: '25',
        left: '55',
        right: '20',
        bottom: '20',
        // containLabel: true
    },
    xAxis: [{
        type: 'category',
        axisTick:{
          show:false
        },
        axisLine:{
          show:true,  //这里的show用于设置是否显示y轴那一条线 默认为true
          lineStyle:{ //lineStyle里面写y轴那一条线的样式
            color:'#3F4F5E',
            width:1,    //轴线的粗细 我写的是2 最小为0，值为0的时候线隐藏
          }
        },
        splitArea: {
            show: false,
            color: '#f00',
            lineStyle: {
              show:false,
              color: '#fff'
            },
        },
        axisLabel: {
            color: '#B4C0CC'
        },
        splitLine: {
            show: false
        },
        boundaryGap: false,
        data: ['2024-11-19','2024-11-20','2024-11-21'],

    }],
    yAxis: [{
        type: 'value',
        //name:'单位：件',
        nameTextStyle: {
          color: "#fff"
        },
        // min: 21,
        // max: 140,
        splitNumber: 4,
        splitLine: {
            show: true,
            lineStyle: {
                color: 'rgba(255,255,255,0.1)'
            }
        },
        axisLine: {
            show: false,
            lineStyle:{
              color:'#0a79a6'
            }
        },
        axisLabel: {
            show: true,
            margin: 15,
            textStyle: {
                color: '#B4C0CC',
            },
        },
        axisTick: {
            show: false,
        },
    }],
    series: [{
            name: '数量',
            type: 'line',
            smooth: true, //是否平滑
            showAllSymbol: true,
            symbol: 'circle',
            symbolSize: 0,
            lineStyle: {
                normal: {
                    color: "#FFE090",
                    shadowColor: 'rgba(255, 224, 144, .3)',
                    shadowBlur: 0,
                    shadowOffsetY: 0,
                    shadowOffsetX: 0,
                },
            },
          //   label: {
          //       show: true,
          //       position: 'top',
          //       textStyle: {
          //           color: '#6c50f3',
          //       }
          //   },
            itemStyle: {
                color: "#FFE090",
                borderColor: "#FFE090",
                borderWidth: 1,
                shadowColor: 'rgba(255, 224, 144, .3)',
                shadowBlur: 0,
                shadowOffsetY: 0,
                shadowOffsetX: 0,
            },
            tooltip: {
                show: true
            },
            areaStyle: {
                normal: {
                    color: new $echart.graphic.LinearGradient(0, 0, 0, 1, [{
                            offset: 0,
                            color: 'rgba(255, 224, 144, .3)'
                        },
                        {
                            offset: 1,
                            color: 'rgba(255, 224, 144, 0)'
                        }
                    ], false),
                    shadowColor: 'rgba(2, 191, 239, 0.9)',
                    shadowBlur: 100
                }
            },
            data: [332,434,454]
        }
    ]
  };
  // 获取DOM元素并且进行初始化
  gjqsChart = $echart.init(document.getElementById(id));
  gjqsChart.setOption(gjqsOption);
  //窗口大小变化自适应
  window.addEventListener("resize", gjqsResize);
  return gjqsChart;
}
const gjqsDestroy=function(){
  window.removeEventListener("resize",gjqsResize);
}
  
export { gjqsOption, gjqsChartCreate, gjqsResize, gjqsReload, gjqsDestroy }
  