<template>
    <div class="mapbox">
        <div id="container" onload="initMap()"></div>
        <div id="toolControlDraw" v-show="workMode=='DRAW'">
            <!-- <div class="toolItem active" id="marker" v-show="workMode=='DRAW'" title="点标记"></div>
            <div class="toolItem" id="polyline" v-show="workMode=='DRAW'" title="折线"></div>
            <div class="toolItem" id="polygon" v-show="workMode=='DRAW'" title="多边形"></div>
            <div class="toolItem" id="circle" v-show="workMode=='DRAW'" title="圆形"></div>
            <div class="toolItem" id="rectangle" v-show="workMode=='DRAW'" title="矩形"></div>
            <div class="toolItem" id="ellipse" v-show="workMode=='DRAW'" title="椭圆"></div> -->
            <div v-for="item,index in toolTipList" :class="index==0?'active':''" :key="item.id" class="toolItem" :id="item.id" :title="item.title">

            </div>
            
        </div>
        <div id="toolControlInteract" v-show="workMode=='INTERACT'">
          <div class="toolItem" id="delete"  @click="editor.delete();" title="删除"></div>
            <div class="toolItem" id="split" @click="editor.split();" title="拆分"></div>
            <div class="toolItem" id="union" @click="editor.union();" title="合并"></div>
        </div>
        <el-button class="changeMode" type="primary" @click="changeMode">切换{{workMode=='DRAW'?'编辑模式':'绘画模式'}}</el-button>
        <div v-show="workMode=='DRAW'">
            绘制：鼠标左键点击及移动即可绘制图形
            <br />
            结束绘制：鼠标左键双击即可结束绘制折线、多边形会自动闭合；圆形、矩形、椭圆单击即可结束
            <br />
            中断：绘制过程中按下esc键可中断该过程
        </div>
        <div v-show="workMode=='INTERACT'">
            单选：鼠标左键点击图形<br/>
            多选：按下ctrl键后点击多个图形<br/>
            删除：选中图形后按下delete键或点击删除按钮可删除图形<br/>
            编辑：选中图形后出现编辑点，拖动编辑点可移动顶点位置，双击实心编辑点可删除顶点<br/>
            拆分：选中单个多边形后可绘制拆分线，拆分线绘制完成后自动进行拆分<br/>
            合并：选中多个相邻多边形后可进行合并，飞地形式的多边形不支持合并<br/>
            中断：按下esc键可中断当前操作，点选的图形将取消选中，编辑过程将中断
	      </div>
        <!-- <div id="panel">
          <input id='keyword' type="text" value='' @input="getSuggestions"><input id="search" type="button" class="btn" value="搜索" @click="searchByKeyword()" />
          <ul id="suggestionList">
            <li v-for="item,index in suggestionList.list"><a href="#" @click="setSuggestion(index)">{{item.title}}<span class="item_info">{{item.address}}</span></a></li>
          </ul>
        </div> -->
        <!-- <div>
          区域面积:{{shapeArea}}平方米
        </div> -->
        <div>
	</div>
    </div>
</template>
<script setup>
import { onMounted ,computed,defineProps,ref,reactive} from "vue"
/* import { recordArea,addShapeArea } from "./index" */
      const { LatLng ,mapData} = defineProps({
        LatLng:{
            type:Array,
            default:[23.10452, 113.802605]
        },
        mapData:{

        }
      })
      let map; // 地图
      let editor; // 编辑器
      let measureTool; // 测量工具
      let activeType = 'marker'; // 激活的图形编辑类型
      let workMode = ref('DRAW');
      let search; // 搜索对象
      let markers;
      let suggest;
      let recordArea = reactive({list:[]})
      let toolTipList = [{
        title:"点标记",
        id:'marker'
      },{
        title:"折线",
        id:"polyline"
      },{
        title:"多边形",
        id:"polygon"
      },{
        title:"圆形",
        id:"circle"
      },{
        title:"矩形",
        id:"rectangle"
      },{
        title:"椭圆",
        id:"ellipse"
      }]
      let infoWindowList = Array(10);
      let suggestionList = reactive({
        list:[]
      });
      const shapeArea = computed(()=>{
        let result = 0;
        if(recordArea.list.length<=0){
          return result
        }
        recordArea.list.map((item)=>{
          result += item?.area||0
        })
        return result.toFixed(2)
      }) 
      // 切换工作工作模式
      const changeMode = ()=>{
        workMode.value = workMode.value=='DRAW'?"INTERACT":'DRAW';
        //initMap()
        //editor.setActiveOverlay('polygon');
        editor.setActionMode(TMap.tools.constants.EDITOR_ACTION[workMode.value])
      }
      // 添加计算区域面积
      const addShapeArea = (geometry,area,type)=>{
        const result = recordArea.list.find((item)=>item.geometry.id==geometry.id); // 之前没有绘制这个图形
            if(result){
            recordArea.list.map((item)=>{
              if(item.geometry.id==geometry.id){
                item.area = area
              }
            })
            }else{
            recordArea.list.push({
              geometry,
              area,
              type
            })
        }
      }
      onMounted(()=>{
        // 切换激活图层
        document.getElementById('toolControlDraw').addEventListener('click', (e) => {
            var id = e.target.id;
            if (id !== 'toolControlDraw') {
            document.getElementById(activeType).className = 'toolItem';
            document.getElementById(id).className = 'toolItem active';
            activeType = id;
            editor.setActiveOverlay(id);
          }
        });
        nextTick(()=>{
          //debugger
          initMap()
        })
      })
      const initMap = ()=> {
        // 初始化地图
        console.log(mapData)
        map = new TMap.Map('container', {
                zoom: 17, // 设置地图缩放级别
                center: new TMap.LatLng(LatLng[0],LatLng[1]), // 设置地图中心点坐标
        });
        search = new TMap.service.Search({ pageSize: 10 }); // 新建一个地点搜索类
        suggest = new TMap.service.Suggestion({
          // 新建一个关键字输入提示类
          pageSize: 10, // 返回结果每页条目数
          //region: '北京', // 限制城市范围
          regionFix: false, // 搜索无结果时是否固定在当前城市
        });
        
        let markerGeometries = [];
        let circleGeometries = reactive([]);
        let rectangleGeometries = reactive([]);
        let polygonGeometries = reactive([])
        if(mapData.latitudeLongitude){
            const geometriesData = mapData.latitudeLongitude&&JSON.parse(mapData.latitudeLongitude);
            geometriesData&&geometriesData.map((item)=>{  
            if(item.type=='circle'){  
              circleGeometries.push(item.geometry);
              addShapeArea(item.geometry,item.area,item.type)
            }else if(item.type=='rectangle'){
              rectangleGeometries.push(item.geometry);
              addShapeArea(item.geometry,item.area,item.type)
            }else if(item.type=='polygon'){
              /* polygonGeometries.push({
                paths:item.geometry.paths
              }) */
              polygonGeometries.push(item.geometry)
              addShapeArea(item.geometry,item.area,item.type)
            }
          })
        }
        debugger
        // 初始化几何图形及编辑器
        var marker = new TMap.MultiMarker({
          map: map,
          //geometries: [],
        });
        markers = new TMap.MultiMarker({
          map: map,
          geometries: [],
        });
        var polyline = new TMap.MultiPolyline({
          map: map,
        });
        var polygon = new TMap.MultiPolygon({
          map: map,
          geometries:polygonGeometries
        });
        var circle = new TMap.MultiCircle({
          map: map,
          geometries:circleGeometries
        });
        var rectangle = new TMap.MultiRectangle({
          map: map,
          geometries:rectangleGeometries
        });
        var ellipse = new TMap.MultiEllipse({
          map: map,
        });
        // 创建测量工具
        /* measureTool = new TMap.tools.MeasureTool({
          // TMap.tools.MeasureTool文档地址：https://lbs.qq.com/webApi/javascriptGL/glDoc/glDocEditor#5F
          map: map,
        });
        measureTool.measureArea().then((AreaMeasurementInfo) => {
          console.log(AreaMeasurementInfo)
            debugger
        }); */
        editor = new TMap.tools.GeometryEditor({
          // TMap.tools.GeometryEditor 文档地址：https://lbs.qq.com/webApi/javascriptGL/glDoc/glDocEditor
          map: map, // 编辑器绑定的地图对象
          overlayList: [
            // 可编辑图层 文档地址：https://lbs.qq.com/webApi/javascriptGL/glDoc/glDocEditor#4
            {
              overlay: new TMap.MultiMarker({
                map,
                styles: {
                    highlight: new TMap.MarkerStyle({
                        color: 'rgba(255, 255, 0, 0.6)'
                    })
                },
                geometries: marker.geometries
              }),
              id: 'marker',
              selectedStyleId: 'highlight'
            },
            {
              overlay: new TMap.MultiPolyline({
                map,
                styles: {
                    highlight: new TMap.PolylineStyle({
                        color: 'rgba(255, 255, 0, 0.6)'
                    })
                },
                geometries: polyline.geometries
              }),
              //overlayList: 
              id: 'polyline',
              selectedStyleId: 'highlight'
            },
            {
              overlay:new TMap.MultiPolygon({
                map,
                styles: {
                    highlight: new TMap.PolygonStyle({
                        color: 'rgba(255, 255, 0, 0.6)'
                    })
                },
                geometries: polygon.geometries
              }),
              id: 'polygon',
              selectedStyleId: 'highlight'
            },
            {
              overlay: new TMap.MultiCircle({
                map,
                styles: {
                    highlight: new TMap.CircleStyle({
                        color: 'rgba(255, 255, 0, 0.6)'
                    })
                },
                geometries: circle.geometries
              }),
              id: 'circle',
              selectedStyleId: 'highlight'
            },
            {
              overlay: new TMap.MultiRectangle({
                map,
                styles: {
                    highlight: new TMap.RectangleStyle({
                        color: 'rgba(255, 255, 0, 0.6)'
                    })
                },
                geometries: rectangle.geometries
              }),
              id: 'rectangle',
              selectedStyleId: 'highlight'
            },
            {
              overlay: new TMap.MultiEllipse({
                map,
                styles: {
                    highlight: new TMap.EllipseStyle({
                        color: 'rgba(255, 255, 0, 0.6)'
                    })
                },
                geometries: ellipse.geometries
              }),
              id: 'ellipse',
            },
          ],
          actionMode: TMap.tools.constants.EDITOR_ACTION[workMode.value], // 编辑器的工作模式
          activeOverlayId: 'marker', // 激活图层
          snappable: true, // 开启吸附
          selectable: true, // 开启点选功能
        });
        // changeMode()
        // 监听绘制结束事件，获取绘制几何图形
        editor.on('draw_complete', (geometry) => {
          console.log(geometry)
          console.log(rectangle)
          let type = editor.getActiveOverlay().id
          //var area = TMap.geometry.computeArea(geometry.paths);
          // 判断当前处于编辑状态的图层id是否是overlayList中id为rectangle（矩形）图层
          if (type === 'rectangle') {
            // 获取矩形顶点坐标
            console.log(rectangle)
            var id = geometry.id;
            var geo = rectangle.geometries.filter(function (item) {
              return item.id === id;
            });
            let area = geometry.width*geometry.height;
            addShapeArea(geometry,area,type)
            //console.log('绘制的矩形定位的坐标：', geo[0].paths);
          }else if(type === 'circle'){
            let area = geometry.radius*geometry.radius*Math.PI
            addShapeArea(geometry,area,type)
          }else if(type === 'ellipse'){
            let area = geometry.majorRadius*geometry.minorRadius*Math.PI
            addShapeArea(geometry,area,type)
          }else{
            let area = TMap.geometry.computeArea(geometry.paths); //计算多边形
            addShapeArea(geometry,area,type)
          }
        });
        let evtList = ['delete', 'adjust', 'split', 'union'];
        evtList.forEach(evtName => {
            //console.log()
            editor.on(evtName + '_complete', evtResult => {
              if(evtName=='delete'){
                recordArea.list = recordArea.list.filter(item=>item.geometry.id != evtResult[0].id)
              }
              
              console.log(evtName, evtResult);
            });
        });

        // 监听拆分失败事件，获取拆分失败原因
        editor.on('split_fail', (res) => { 
            alert(res.message);
        });
        // 监听合并失败事件，获取合并失败原因
        editor.on('union_fail', (res) => { 
            alert(res.message);
        });
      }
      const setSuggestion = (index)=> {
        // 点击输入提示后，于地图中用点标记绘制该地点，并显示信息窗体，包含其名称、地址等信息
        infoWindowList.forEach((infoWindow) => {
          infoWindow.close();
        });
        infoWindowList.length = 0;
        //keyword = suggestionList.list[index].title;
        //document.getElementById('suggestionList').innerHTML = '';
        markers.setGeometries([]);
        markers.updateGeometries([
          {
            id: '0', // 点标注数据数组
            position: suggestionList.list[index].location,
          },
        ]);
        var infoWindow = new TMap.InfoWindow({
          map: map,
          position: suggestionList.list[index].location,
          content: `<h3>${suggestionList.list[index].title}</h3><p>地址：${suggestionList.list[index].address}</p>`,
          offset: { x: 0, y: -50 },
        });
        infoWindowList.push(infoWindow);
        map.setCenter(suggestionList.list[index].location);
        markers.on('click', (e) => {
          infoWindowList[Number(e.geometry.id)].open();
        });
      }

      const getSuggestions = (keyword)=> {
        // 使用者在搜索框中输入文字时触发
        //var suggestionListContainer = document.getElementById('suggestionList');
        //suggestionListContainer.innerHTML = '';
        
        // var keyword = document.getElementById('keyword').value;
        // debugger
        if (keyword) {
          suggest
            .getSuggestions({ keyword: keyword, location: map.getCenter() })
            .then((result) => {
              // 以当前所输入关键字获取输入提示
              // suggestionListContainer.innerHTML = '';
              // debugger
              suggestionList.list = result.data;
              /* suggestionList.forEach((item, index) => {
                suggestionListContainer.innerHTML += `<li><a href="#" onclick="setSuggestion(${index})">${item.title}<span class="item_info">${item.address}</span></a></li>`;
              }); */
            })
            .catch((error) => {
              console.log(error);
            });
        }
      }

      const searchByKeyword = (keyword)=> {
        // 关键字搜索功能
        infoWindowList.forEach((infoWindow) => {
          infoWindow.close();
        });
        infoWindowList.length = 0;
        markers.setGeometries([]);
        search
          .searchRectangle({
            keyword,
            bounds: map.getBounds(),
          })
          .then((result) => {
            //debugger
            result.data.forEach((item, index) => {
              var geometries = markers.getGeometries();
              var infoWindow = new TMap.InfoWindow({
                map: map,
                position: item.location,
                content: `<h3>${item.title}</h3><p>地址：${item.address}</p><p>电话：${item.tel}</p>`,
                offset: { x: 0, y: -50 },
              });
              infoWindow.close();
              infoWindowList[index] = infoWindow;
              geometries.push({
                id: String(index),
                position: item.location,
              });
              markers.updateGeometries(geometries);
              markers.on('click', (e) => {
                infoWindowList[Number(e.geometry.id)].open();
              });
            });
          });
      }
      // removeOverlay没有生效
      const closeShape = ()=>{
        //changeMode()
        //editor.setActionMode(TMap.tools.constants.EDITOR_ACTION[workMode.value])
        recordArea.list.map((item)=>{
          editor.removeOverlay(item.geometry.id)
        })
        //changeMode()
      }
      const destroy = ()=>{
        map.destroy()
        initMap()
      }
      
      defineExpose({shapeArea,searchByKeyword,getSuggestions,suggestionList,setSuggestion,recordArea,destroy,closeShape})
</script>
<style scoped>
    .mapbox {
      height: 100%;
      margin: 0px;
      padding: 0px;
      position: relative;
      z-index: 2;
    }

    #container {
      width: 100%;
      height: 80%;
    }

    #toolControlDraw{
      position: absolute;
      top: 10px;
      left: 0px;
      right: 0px;
      margin: auto;
      width: max-content;
      z-index: 1001;
    } 
    #toolControlInteract{
      position: absolute;
      top: 10px;
      left: 0px;
      right: 0px;
      margin: auto;
      width: max-content;
      z-index: 1001;
    }
    #panel {
        position: absolute;
      /*   background: #FFF; */
        width:350px;
        padding: 20px;
        z-index: 9999;
        top: 30px;
        left: 30px;
    }

    #suggestionList {
        list-style-type: none;
        padding: 0px;
        margin: 0;
        background: #ffffff;
        border-radius: 5px;
        box-shadow: 0px 0px 12px rgba(0, 0, 0, .12);
    }
    
    #suggestionList li a {
        margin-top: -1px; 
        background-color: #f6f6f6;  
        text-decoration: none;
        line-height: 40px;
        font-size: 18px; 
        color: black; 
        display: block; 
    }

    #suggestionList li .item_info{
        font-size: 12px;
        color:grey;
        
    }
    
    #suggestionList li a:hover:not(.header) {
        background-color: #789cff;
    }
    .changeMode{
        position: absolute;
        top: 10px;
        /* left: 20px; */
        right: 120px;
       /*  margin: auto; */
        width: max-content;
        z-index: 1001;
    }
    .toolItem {
      width: 40px;
      height: 40px;
      float: left;
      margin: 1px;
      padding: 4px;
      border-radius: 3px;
      background-size: 30px 30px;
      background-position: 4px 4px;
      background-repeat: no-repeat;
      box-shadow: 0 1px 2px 0 #e4e7ef;
      background-color: #ffffff;
      border: 1px solid #ffffff;
    }

    .toolItem:hover {
      border-color: #789cff;
    }

    .active {
      border-color: #d5dff2;
      background-color: #d5dff2;
    }

    #marker {
      background-image: url('https://mapapi.qq.com/web/lbs/javascriptGL/demo/img/marker_editor.png');
    }

    #polyline {
      background-image: url('https://mapapi.qq.com/web/lbs/javascriptGL/demo/img/polyline.png');
    }

    #polygon {
      background-image: url('https://mapapi.qq.com/web/lbs/javascriptGL/demo/img/polygon.png');
    }

    #circle {
      background-image: url('https://mapapi.qq.com/web/lbs/javascriptGL/demo/img/circle.png');
    }

    #rectangle {
      background-image: url('https://mapapi.qq.com/web/lbs/javascriptGL/demo/img/rectangle.png');
    }

    #ellipse {
      background-image: url('https://mapapi.qq.com/web/lbs/javascriptGL/demo/img/ellipse.png');
    }
    #delete {
		background-image: url('https://mapapi.qq.com/web/lbs/javascriptGL/demo/img/delete.png');
	}
	#split {
		background-image: url('https://mapapi.qq.com/web/lbs/javascriptGL/demo/img/split.png');
	}
	#union {
		background-image: url('https://mapapi.qq.com/web/lbs/javascriptGL/demo/img/union.png');
	}
  </style>