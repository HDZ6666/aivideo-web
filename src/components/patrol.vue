<template>  
    <div class="app">  
        <div class="container">  
            <div class="route-container">  
                <form @submit.prevent="routesubmit">  
                    <label for="routeName">巡逻路线名称:</label>  
                    <input type="text" id="routeName" v-model="routeName" /><br><br>  
                
                    <label>选择摄像头:</label><br><br>  
                    <div class="camera-and-button-container">  
                        <el-tree
                            ref="groupTree"
                            node-key="id"
                            default-expand-all
                            :data="deviceGroupList"
                            :props="treeProps"
                            :expand-on-click-node="false"
                            highlight-current
                            @node-click="handleNodeClick"
                            show-checkbox
                            > 
                        </el-tree>
                        <button type="submit">添加路线</button> 
                    </div>  
                </form><br><br><br><br><br><br><br><br><br>
            </div>  
            
            <div class="task-container">  
                <form @submit.prevent="tasksubmit">  
                    <el-table
                        :data="routeList"
                        style="width: 100%;font-size: 12px;"    
                        header-row-class-name="table-header"
                        >
                        <el-table-column prop="routeID" label="路线编号" min-width="100" ></el-table-column>
                        <el-table-column prop="routename" label="路线名称" min-width="160" ></el-table-column>
                        <el-table-column prop="createTime" label="创建时间"  width="140"></el-table-column>
                        <el-table-column prop="updateTime" label="更新时间"  width="140"></el-table-column>

                        <el-table-column label="操作" min-width="250" fixed="right">
                            <template slot-scope="scope">
                            <el-divider direction="vertical"></el-divider>
                            <el-button size="medium" icon="el-icon-edit" type="text" @click="edit(scope.row)">编辑</el-button>
                            <el-divider direction="vertical"></el-divider>
                            <el-button
                                size="medium"
                                icon="el-icon-delete"
                                type="text"
                                @click="deleteroute(scope.row)"
                                style="color: #f56c6c"
                            >删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table><br>

                    <label>设置任务日期:</label>
                    <label for="startDate">从</label>  
                    <input type="date" v-model="startDate" /> 
                    <label for="endDate">到</label>  
                    <input type="date" v-model="endDate" /> 
                    <label for="unlimited">无限期</label><br>
                
                    <label>设置任务时间:</label>
                    <div class="time-and-button-container">  
                        <Day/>  
                        <button type="submit">添加任务</button>  
                    </div>
                </form>
            </div>
        </div>  
        
        <div class="table-container">  
            <el-table
                :data="taskList"
                style="width: 100%;font-size: 12px;"
                header-row-class-name="table-header"
                >
                <el-table-column prop="taskID" label="任务编号" min-width="100" ></el-table-column>
                <el-table-column prop="routename" label="路线名称" min-width="300" ></el-table-column>
                <el-table-column prop="excuteStatus" label="执行状态"  width="150"></el-table-column>
                <el-table-column prop="excuteTime" label="执行时间"  width="200"></el-table-column>
                <el-table-column prop="abnormality" label="是否有异常"  width="100"></el-table-column>
                <el-table-column prop="patrolReport" label="巡逻报告"  width="150"></el-table-column>

            </el-table>
            <br><br><br><br><br>
        </div> 

        <el-pagination
            style="float: right"
            @size-change="handleSizeChange"
            @current-change="currentChange"
            :current-page="currentPage"
            :page-size="count"
            :page-sizes="[15, 25, 35, 50]"
            layout="total, sizes, prev, pager, next"
            :total="total"
        ></el-pagination>
        <routeEdit ref="routeEdit"></routeEdit> <!--存在错误，未定义该组件-->
        <syncChannelProgress ref="syncChannelProgress"></syncChannelProgress>  <!--存在错误，未定义该组件-->
    </div> 
</template>  
        
<script>  
import { ref,onMounted } from 'vue'; 
import axios from 'axios';
import Day from "./Day.vue";
// import routeEdit from "./dialog/routeEdit.vue"; //待新增vue
    
export default {  
    name: 'SmartPatrol',  
    setup() {
        const routeName = ref('');  
        const cameras = ref([]);  
        const selectedCameras = ref([]); 
        const routeList = ref([]);  
        const startDate = ref(null);  
        const endDate = ref(null);  
        const frequency = ref(null);  
        
        const routesubmit = async () => {  
            try {  
                const response = await axios.post('/api/patrol/addroute', //假设接口为api/patrol/addroute
                {  
                routeName: routeName.value,  
                selectedCameras: selectedCameras.value,  
                }); 
                routeList.value.push(response.data);   
                console.log('添加路线成功:', response.data);  
            } catch (error) {  
                console.error('添加路线失败:', error);  
            }  
        };

        const tasksubmit = () => {  
            console.log('Submit form:', {  
            routeName: routeName.value,  
            selectedCameras: selectedCameras.value,  
            startDate: startDate.value,  
            endDate: endDate.value,  
            frequency: frequency.value,  
            });  
            // 这里可以添加提交到服务器的逻辑  
        };  
        
        return { routeName, selectedCameras, startDate, endDate, frequency, tasksubmit };  

        const refreshRouteAndTaskList = async () => {  
            try {  
                // 获取最新的路线列表  
                const routeListResponse = await axios.get('/api/patrol/getroutes');  
                routeList.value = routeListResponse.data; // 假设后端返回的是路线列表数据  

                // 获取最新的任务列表  
                const taskListResponse = await axios.get('/api/patrol/gettasks');  
                taskList.value = taskListResponse.data; // 假设后端返回的是任务列表数据  
            } catch (error) {  
                console.error('Failed to refresh route and task lists:', error);  
            }  
        };

        return { routeName, cameras, selectedCameras, routesubmit, refreshRouteAndTaskList };  
    },  

    data() {  
        return {  
            getDeviceGroupLoading: false,
            deviceGroupList: [],
            treeProps: {
                children: "children",
                label: "group_name"
            },
            routeName: "",
            selectedCameras: [],
            routeList: [],
            startDate: "",
            endDate: "",
            // 巡逻时间列表，从0到23  
            allHours: Array.from({ length: 24 }, (_, i) => i),  
            // 选中的时间  
            selectedHours: [], 
            frequency: "",
            taskList: [],
            currentPage: 1,
            count: 15,
            total: 0,
        };  
    },  

    methods: {  
        addGroup: function() {
            this.$refs.groupTree.setCurrentKey(null);
            this.$emit("changeGroup", { id: 0 });
            // this.$router.push("/deviceGroup");
        },
        getDeviceGroup: function() {
            this.getDeviceGroupLoading = true;
            this.$axios({
                method: "get",
                url: `/ai/api/device/group/cameraGroupList`
            })
                .then(res => {
                if (res.data.code === 0) {
                    this.deviceGroupList = res.data.data;
                }
                this.getDeviceGroupLoading = false;
                })
                .catch(error => {
                console.error(error);
                this.getDeviceGroupLoading = false;
                });
        },
        getGroup: function() {
            return [...this.deviceGroupList];
        },
        getNode: function(id) {
            return this.$refs.deviceGroupTree.getNode(id);
        },
        handleNodeClick(data) {
            this.$emit("changeGroup", data);
        },
        handleCheckChange(data, checked, indeterminate) {  
            console.log(data, checked, indeterminate);  
            // 这里可以添加逻辑来处理节点的选择或取消选择  
            // 例如，将选中的节点ID存储在一个数组中  
            if (checked) {  
            this.selectedCameras.push(data.id); // 假设每个节点都有一个唯一的id属性  
            } else {  
            const index = this.selectedCameras.indexOf(data.id);  
            if (index > -1) {  
                this.selectedCameras.splice(index, 1);  
            }  
            }  
        },  
        
        // 格式化小时为更易于阅读的格式（例如，将0显示为00）  
        formatHour(hour) {  
            return hour.toString().padStart(2, '0')+ ':00';  
        },

        // 处理分页  
        handleSizeChange(newSize) {  
            this.count = newSize;  
            console.log('每页显示条目数改变:', newSize);  
        },  
        currentChange(newPage) {  
            this.currentPage = newPage;   
            console.log('当前页改变:', newPage);  
        },  
    },
 
    mounted() {
        this.getDeviceGroup();
        this.fetchData(); //不存在该函数   
    },

    computed: {  
        // 将巡逻时间分组，每组8个  
        groupedHours() {  
        return this.allHours.reduce((groups, hour, index) => {  
            const groupIndex = Math.floor(index / 8);  
            if (!groups[groupIndex]) {  
            groups[groupIndex] = [];  
            }  
            groups[groupIndex].push(hour);  
            return groups;  
        }, []);  
        }  
    },  

    /* 巡逻路线操作 */
    edit: function(row) {
      this.$refs.routeEdit.openDialog(row, () => {
        this.$refs.routeEdit.close();
        this.$message({
          showClose: true,
          message: "路线修改成功",
          type: "success"
        });
        setTimeout(this.getrouteList, 200);
      });
    },

    deleteroute: function(row) {
      let msg = "确定删除此路线？";
      this.$confirm(msg, "提示", {
        dangerouslyUseHTMLString: true,
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        center: true,
        type: "warning"
      })
        .then(() => {
          this.$axios({
            method: "delete",
            url: `/api/device/query/devices/${row.deviceId}/delete` //API待确认
          })
            .then(res => {
              this.getrouteList();
            })
            .catch(error => {
              console.error(error);
            });
        })
        .catch(() => {});
    },

    components: {Day}
       
};  
</script>  
    
<style scoped>  
    body, html { 
        margin: 0;  
        padding: 0;  
        width: 100%;  
        height: 100%;  
        font-family: Arial, sans-serif; /* 设置统一的字体 */  
    }   
    
    .container {  
        display: flex; /* 使用 flex 布局 */  
        justify-content: space-between; /* 子元素之间的空间平均分布 */  
        align-items: flex-start; /* 子元素顶部对齐（可选，根据需要调整） */  
        width:  120%; /* 或指定具体宽度，根据需要 */  
        padding: 10px; /* 根据需要添加内边距 */  
        max-width: 1430px; 
    } 

    /* 文本和表单样式 */  
    .route-container {  
        position: relative;   
        width: 28%;
        padding: 10px;  
        background-color: #f9f9f9; /* 轻微背景色增加可读性 */  
        border-radius: 8px; /* 圆角边框 */  
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); /* 阴影效果 */  
        text-align: left; /* 左对齐 */ 
        max-height: 410px;
    } 

    .camera-and-button-container .el-tree {  
        top:25px;
        height: 325px; /* 设置固定高度 */ 
        width: 250px; 
        overflow-y: auto; /* 允许垂直滚动 */  
        border: 1px solid #ccc; /* 添加方框 */  
        background-color: #f9f9f9; /* 设置背景色 */  
    }

    .task-container {  
        position: relative;   
        width: 68%;
        padding: 10px;  
        background-color: #f9f9f9; /* 轻微背景色增加可读性 */  
        border-radius: 8px; /* 圆角边框 */  
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); /* 阴影效果 */  
        text-align: left; /* 左对齐 */ 
        max-height: 410px;
    } 
    label {  
        font-size: 16px; /* 增大标签字体大小 */  
        color: #333; /* 深色字体，提高对比度 */  
        margin-bottom: 5px; /* 标签与输入框间距 */ 
        text-align: left; /* 左对齐 */  
    }  
    
    input[type="text"],  
    input[type="date"],  
    select,  
    input[type="radio"] + label {  
        font-size: 14px; /* 输入框和选择框字体大小 */  
        padding: 8px; /* 输入框内边距 */  
        border: 1px solid #ccc; /* 边框颜色 */  
        border-radius: 4px; /* 圆角边框 */  
        color: #333; /* 字体颜色 */ 
        text-align: left; /* 左对齐 */   
    }  
    
    input[type="checkbox"] + label {  
        font-size: 14px; /* 复选框标签字体大小 */  
        margin-left: 5px; /* 复选框与标签间距 */  
    }  

    /* 摄像头选择和按钮容器的样式 */    
    .camera-and-button-container {  
        display: flex; /* 启用Flexbox */  
        justify-content: space-between; /* 子元素在主轴上的分布方式 */  
        align-items: center; /* 子元素在交叉轴上的对齐方式 */  
        width: 100%; 
        height:250px; 
    }
    
    .fixed-height-select {  
        height: 250px; 
        flex: 1; /* 允许<select>元素占据剩余空间 */  
    }  
    
    .camera-and-button-container button[type="submit"] {  
        margin-right: 20px;
        margin-top: 330px; 
    }  

    /* 时间选择和按钮容器的样式 */  
    .time-and-button-container {  
        display: flex; /* 启用Flexbox */  
        justify-content: space-between; /* 子元素在主轴上的分布方式 */  
        align-items: center; /* 子元素在交叉轴上的对齐方式 */  
        width: 100%; /* 根据需要设置宽度 */ 
        height:250px; /* 设置高度 */  
        margin-top: -10px; 
    }  
    
    .time-and-button-container button[type="submit"] {  
        margin-right: 20px;
        margin-top: 160px; 
    }  

    /* 表格样式 */
    .table-container {  
        position: relative;  
        top: 0px;  
        width: 120%; 
        max-width: 1420px; 
        padding: 10px;  
        background-color: #f9f9f9; /* 轻微背景色增加可读性 */  
        border-radius: 8px; /* 圆角边框 */  
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); /* 阴影效果 */  
    } 

    table {  
        width: 100%;  
        border-collapse: collapse;  
        margin-top: 10px;  
    }  
    
    th, td {  
        border: 1px solid #ddd;  
        padding: 12px; /* 增大单元格内边距 */  
        text-align: center; /* 文本居中 */  
        font-size: 14px; /* 单元格字体大小 */  
        color: #555; /* 字体颜色 */  
    }  
    
    th {  
        background-color: #f2f2f2; /* 表头背景色 */  
    }  
    
    /* 时间选择样式 */  
    .hour-row {  
        display: flex;  
        justify-content: space-between;  
        margin-bottom: 10px; /* 分组之间的间距 */  
    }  
    
    .hour-item {  
        display: inline-block;  
        margin-right: 10px;  
    }  
    
    /* 按钮样式 */  
    button[type="submit"] {  
        font-size: 16px; /* 按钮字体大小 */  
        padding: 10px 20px; /* 按钮内边距 */  
        border: none; /* 去除边框 */  
        border-radius: 4px; /* 圆角边框 */  
        background-color: #007bff; /* 按钮背景色 */  
        color: white; /* 按钮字体颜色 */  
        cursor: pointer; /* 鼠标悬停时显示指针 */ 
    }  
    
    button[type="submit"]:hover {  
        background-color: #0056b3; /* 按钮悬停背景色 */  
    }  

</style>
    