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
                        :data="paginatedrouteList"
                        style="width: 100%;height:170px;font-size: 12px;overflow-y: auto; /* 允许垂直滚动 */  "    
                        header-row-class-name="table-header"
                        @selection-change="handleSelectionChange"  
                        >
                        <el-table-column type="selection" width="55" ></el-table-column> 
                        <el-table-column prop="routeID" label="路线编号" width="70" align="center"></el-table-column>
                        <el-table-column prop="routename" label="路线名称" width="90" align="center"></el-table-column>
                        <el-table-column prop="selectedCameras" label="所选摄像头"  width="300" align="center"></el-table-column>
                        <el-table-column prop="createTime" label="创建时间"  width="130" align="center"></el-table-column>
                        <el-table-column prop="updateTime" label="更新时间"  width="130" align="center"></el-table-column>
                        <el-table-column label="操作" width="180" align="center">
                            <template slot-scope="scope">
                            <el-divider direction="vertical"></el-divider>
                            <el-button size="medium" icon="el-icon-edit" type="text" @click="editroute(scope.row)">编辑</el-button>
                            <el-divider direction="vertical"></el-divider>
                            <el-button size="medium" icon="el-icon-delete" type="text" @click="deleteroute(scope.row)"
                                style="color: #f56c6c">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                    <el-pagination
                        style="float: right"  
                        @size-change="handleSizeChange_route"  
                        @current-change="handleCurrentChange_route"  
                        :current-page="currentPageRoute"  
                        :page-size="countRoute"  
                        :page-sizes="[2, 20, 30, 50]"  
                        layout="total, sizes, prev, pager, next"  
                        :total="routeList.length" 
                    ></el-pagination><br>

                    <label>设置任务日期:</label>
                    <label for="startDate">从</label>  
                    <input type="date" v-model="startDate" /> 
                    <label for="endDate">到</label>  
                    <input type="date" v-model="endDate" /> 
                    <label for="unlimited">
                        <input type="checkbox" id="unlimited" v-model="Unlimited" /> 无限期
                    </label><br>
                
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
                :data="paginatedtaskList"
                style="width: 100%;font-size: 12px;height: 140px;overflow-y: auto; /* 允许垂直滚动 */ "
                header-row-class-name="table-header"
                >
                <el-table-column prop="taskID" label="任务编号" width="100" align="center"></el-table-column>
                <el-table-column prop="routename" label="路线名称" width="250" align="center"></el-table-column >
                <el-table-column prop="excuteTime" label="执行时间"  width="250" align="center"></el-table-column>
                <el-table-column prop="abnormality" label="是否有异常"  width="250" align="center"></el-table-column>
                <el-table-column prop="patrolReport" label="巡逻报告"  width="250" align="center"></el-table-column>
            </el-table>
            <el-pagination
                style="float: right"
                @size-change="handleSizeChange_task"
                @current-change="handleCurrentChange_task"
                :current-page="currentPage_task"
                :page-size="count_task"
                :page-sizes="[2, 20, 30, 50]"
                layout="total, sizes, prev, pager, next"
                :total="taskList.length"
            ></el-pagination>
            <br><br><br><br><br>
        </div> 

        <routeEdit ref="routeEdit"></routeEdit> 
        <syncChannelProgress ref="syncChannelProgress"></syncChannelProgress>  <!--存在错误，未定义该组件-->
    </div> 
</template>  
        
<script>  
import { ref,onMounted } from 'vue'; 
import axios from 'axios';
import Day from "./Day.vue";
import { Pagination } from 'element-ui';  
import routeEdit from "./dialog/routeEdit.vue"; 
    
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
        const taskList = ref([]);   
        
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

        return { routeName, selectedCameras, routesubmit};  

        const tasksubmit = async () => {  
            try {  
                const response = await axios.post('/api/patrol/addtask', //假设接口为api/patrol/addtask
                {  
                routeName: routeName.value,  
                selectedCameras: selectedCameras.value,  
                startDate: startDate.value,  
                endDate: endDate.value,  
                frequency: frequency.value,  
                }); 
                taskList.value.push(response.data);   
                console.log('添加任务成功:', response.data);  
            } catch (error) {  
                console.error('添加任务失败:', error);  
            }  
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

        return { routeName, cameras, selectedCameras,refreshRouteAndTaskList };  
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
            multipleSelection: [], // 用于存储选中的行  
            startDate: "",
            endDate: "",
            Unlimited: false,
            // 巡逻时间列表，从0到23  
            allHours: Array.from({ length: 24 }, (_, i) => i),  
            // 选中的时间  
            selectedHours: [], 
            frequency: "",
              // 设置样例数据  
              routeList: [  
                { routeID: 1, routename: '路线1', selectedCameras: '摄像头1,摄像头2', createTime: '2023-04-01 10:00', updateTime: '2023-04-02 15:00' },  
                { routeID: 2, routename: '路线2', selectedCameras: '摄像头1,摄像头3,摄像头4', createTime: '2023-03-25 08:30', updateTime: '2023-03-25 10:00' },  
                { routeID: 3, routename: '路线3', selectedCameras: '摄像头5,摄像头6', createTime: '2023-03-20 12:00', updateTime: '2023-03-20 14:00' },  
                { routeID: 4, routename: '路线4', selectedCameras: '摄像头7,摄像头8', createTime: '2023-03-15 14:30', updateTime: '2023-03-15 16:00' },
                { routeID: 5, routename: '路线5', selectedCameras: '摄像头9,摄像头10', createTime: '2023-03-10 16:30', updateTime: '2023-03-10 18:00' }
            ],  
            taskList: [  
                { taskID:1, routename: '路线1', excuteStatus: '已完成', excuteTime: '2023-04-01 10:00', abnormality: '无异常', patrolReport: '任务报告1' },  
                { taskID:2, routename: '路线2', excuteStatus: '进行中', excuteTime: '2023-04-02 09:00', abnormality: '有异常', patrolReport: '任务报告2' }, 
                { taskID:3, routename: '路线3', excuteStatus: '未开始', excuteTime: '2023-04-03 12:00', abnormality: '无异常', patrolReport: '任务报告3' },  
            ],  
            paginatedrouteList: [], // 当前页显示的路线列表
            paginatedtaskList: [], // 当前页显示的任务列表  
            currentPage_route: 1,
            count_route: 2,
            total_route: 0,
            currentPage_task: 1,
            count_task: 2,
            total_task: 0,
        };  
    },  

    methods: {  
        // 获取路线列表  
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
            return this.$refs.groupTree.getNode(id);
        },
        handleNodeClick(data) {
            this.$emit("changeGroup", data);
        },

        //处理选中的routeList
        handleSelectionChange(val) {  
            this.multipleSelection = val;  
            console.log(this.multipleSelection); // 打印选中的行数据  
        },  
        
        // 巡逻路线操作 //
        editroute: function(row) {
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

        // 格式化小时为更易于阅读的格式（例如，将0显示为00）  
        formatHour(hour) {  
            return hour.toString().padStart(2, '0')+ ':00';  
        },

        // 处理分页  
        handleSizeChange_route(newSize) {  
            this.count_route = newSize;  
            this.fetchData(); // 重新获取数据，确保分页正确 
        },  
        handleSizeChange_task(newSize) {  
            this.count_task = newSize;  
            this.fetchData(); 
        },  
        handleCurrentChange_route(newPage) { 
            this.currentPage_route = newPage;
            this.fetchData(); 
        },
        handleCurrentChange_task(newPage) {  
            this.currentPage_task = newPage;  
            this.fetchData(); 
        },  
        fetchData() {  
            // 这里用静态数据代替,正常情况下发送一个请求到服务器，根据currentPage和count来获取数据  
            // 例如：axios.get('/api/tasks', { params: { page: this.currentPage, limit: this.count } })  
        
            // 使用当前页码和每页数量来计算分页后的数据  
            const start_route = (this.currentPage_route - 1) * this.count_route;  
            const end_route = this.currentPage_route * this.count_route;  
            const start_task = (this.currentPage_task - 1) * this.count_task;  
            const end_task = this.currentPage_task * this.count_task;  
            this.paginatedrouteList = this.routeList.slice(start_route, end_route);  
            this.paginatedtaskList = this.taskList.slice(start_task, end_task);  
        },  
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
     
    mounted() {
        this.getDeviceGroup();
        this.fetchData();   
    },  

    components: {
        Day,
        routeEdit,
        'el-pagination': Pagination  
    }
       
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
        max-width: 1390px; 
    } 

    /* 文本和表单样式 */  
    .route-container {  
        position: relative;   
        width: 400px;
        padding: 10px;  
        background-color: #f9f9f9; /* 轻微背景色增加可读性 */  
        border-radius: 8px; /* 圆角边框 */  
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); /* 阴影效果 */  
        text-align: left; /* 左对齐 */ 
        max-height: 470px;
    } 

    .camera-and-button-container .el-tree {  
        height: 375px; /* 设置固定高度 */ 
        width: 250px; 
        overflow-y: auto; /* 允许垂直滚动 */  
        border: 1px solid #ccc; /* 添加方框 */  
        background-color: #f9f9f9; /* 设置背景色 */  
    }

    .task-container {  
        position: relative;   
        width: 950px; 
        padding: 10px;  
        background-color: #f9f9f9; /* 轻微背景色增加可读性 */  
        border-radius: 8px; /* 圆角边框 */  
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); /* 阴影效果 */  
        text-align: left; /* 左对齐 */ 
        max-height: 470px;
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
        height:360px; 
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
        width: 1380px; 
        height: 170px; 
        padding: 10px;  
        background-color: #f9f9f9; /* 轻微背景色增加可读性 */  
        border-radius: 8px; /* 圆角边框 */  
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); /* 阴影效果 */  
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
    