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
const gjqsChartCreate=function($echart,id){
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
                        color: 'rgba(131, 210, 253,0)'
                    }, {
                        offset: 0.5,
                        color: 'rgba(131, 210, 253,1)',
                    }, {
                        offset: 1,
                        color: 'rgba(131, 210, 253,0)'
                    }],
                    global: false
                }
            }
        }
    },
    grid: {
        top: '25',
        left: '40',
        right: '8',
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
            color:'#0a79a6',
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
            color: '#fff'
        },
        splitLine: {
            show: false
        },
        boundaryGap: false,
        data: [],

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
            show: true,
            lineStyle:{
              color:'#0a79a6'
            }
        },
        axisLabel: {
            show: true,
            margin: 15,
            textStyle: {
                color: '#fff',
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
                    color: "#02bfef",
                    shadowColor: 'rgba(0, 0, 0, .3)',
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
                color: "#02bfef",
                borderColor: "#02bfef",
                borderWidth: 1,
                shadowColor: 'rgba(0, 0, 0, .3)',
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
                            color: 'rgba(2, 191, 239,0.3)'
                        },
                        {
                            offset: 1,
                            color: 'rgba(2, 191, 239,0)'
                        }
                    ], false),
                    shadowColor: 'rgba(2, 191, 239, 0.9)',
                    shadowBlur: 100
                }
            },
            data: []
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
  