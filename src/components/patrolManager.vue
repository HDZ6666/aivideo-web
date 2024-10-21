<template>  
    <div class="app">  
        <div class="container">  
            <div class="camera-container">  
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
            
            <div class="route-container">  
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
                    <el-button
                        icon="el-icon-refresh-right"
                        circle
                        size="mini"
                        :loading="refreshRouteListLoading"
                        @click="refreshRouteList()"
                        style="float: right ;margin-top: 1px"
                    ></el-button>
                    <el-pagination
                        style="float: right"  
                        @size-change="handleSizeChange_route"  
                        @current-change="handleCurrentChange_route"  
                        :current-page="currentPage_route"  
                        :page-size="count_route"  
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
        
        <div class="task-container">  
            <el-table
                :data="paginatedtaskList"
                style="width: 100%;height:170px;font-size: 12px;overflow-y: auto; /* 允许垂直滚动 */  "    
                header-row-class-name="table-header"
                @selection-change="handleSelectionChange"  
                >
                <el-table-column prop="taskID" label="任务编号" width="70" align="center"></el-table-column>
                <el-table-column prop="routename" label="路线名称" width="90" align="center"></el-table-column>
                <el-table-column prop="selectedCameras" label="所选摄像头"  width="200" align="center"></el-table-column>
                <el-table-column prop="startDate" label="开始日期"  width="100" align="center"></el-table-column>
                <el-table-column prop="endDate" label="结束日期"  width="100" align="center"></el-table-column>
                <el-table-column prop="selectedHours" label="所选时间段"  width="350" align="center"></el-table-column>
                <el-table-column prop="createTime" label="创建时间"  width="130" align="center"></el-table-column>
                <el-table-column prop="updateTime" label="更新时间"  width="130" align="center"></el-table-column>
                <el-table-column label="操作" width="180" align="center">
                    <template slot-scope="scope">
                    <el-divider direction="vertical"></el-divider>
                    <el-button size="medium" icon="el-icon-edit" type="text" @click="edittask(scope.row)">编辑</el-button>
                    <el-divider direction="vertical"></el-divider>
                    <el-button size="medium" icon="el-icon-delete" type="text" @click="deletetask(scope.row)"
                        style="color: #f56c6c">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-button
                icon="el-icon-refresh-right"
                circle
                size="mini"
                :loading="refreshRouteListLoading"
                @click="refreshTaskList()"
                style="float: right ;margin-top: 1px"
            ></el-button>
            <el-pagination
                style="float: right"  
                @size-change="handleSizeChange_task"  
                @current-change="handleCurrentChange_task"  
                :current-page="currentPage_task"  
                :page-size="count_task"  
                :page-sizes="[2, 20, 30, 50]"  
                layout="total, sizes, prev, pager, next"  
                :total="taskList.length" 
            ></el-pagination><br>
            <br><br><br><br><br>
        </div> 

        <routeEdit ref="routeEdit"></routeEdit> 
        <taskEdit ref="taskEdit"></taskEdit> 
    </div> 
</template>  
        
<script>  
import { reactive, ref,onMounted } from 'vue'; 
import axios from 'axios';
import Day from "./Day.vue";
import { Pagination } from 'element-ui';  
import routeEdit from "./dialog/routeEdit.vue"; 
import taskEdit from "./dialog/taskEdit.vue"; 
    
export default {  
    name: 'patrolManager', 
    components: {
        Day,
        routeEdit,
        taskEdit,
        'el-pagination': Pagination,
    },
     
    setup() {
        const deviceGroupList = ref([]); 
        const getDeviceGroupLoading = ref(false); 
        const treeProps = {
            children: "children",
            label: "group_name"
        }; 
        const routeName = ref('');   
        const selectedCameras = ref([]); 
        const routeList = ref([]);  
        const startDate = ref(null);  
        const endDate = ref(null);  
        const multipleSelection = ref([]); 
        const Unlimited = ref(false); 
        const allHours = ref([]); 
        const selectedHours = ref([]); 
        const taskList = ref([]);   
        const paginatedrouteList = ref([]); 
        const paginatedtaskList = ref([]); 
        const currentPage_route = ref(1);
        const count_route = ref(2);
        const total_route = ref(0);
        const currentPage_task = ref(1);
        const count_task = ref(2);
        const total_task = ref(0);
    
        const routesubmit = async () => {  
            try {  
                const response = await axios.post('http://36.133.15.158/ai_video/api/patrol/route/add', 
                {  
                routeName: routeName.value,  
                selectedCameras: selectedCameras.value,  
                }, {headers: {
                    'Content-Type': 'application/json;charset=UTF-8'
                }}); 
                withCredentials: true;
                routeList.value.push(response.data);   
                console.log('添加路线成功:', response.data);  
            } catch (error) {  
                console.error('添加路线失败:', error);  
            }  
        };

        const tasksubmit = async () => {  
            try {  
                const response = await axios.post('http://36.133.15.158/ai_video/api/patrol/route_task/add', 
                {  
                routeName: routeName.value,  
                selectedCameras: selectedCameras.value,  
                startDate: startDate.value,  
                endDate: endDate.value,  
                }); 
                taskList.value.push(response.data);   
                console.log('添加任务成功:', response.data);  
            } catch (error) {  
                console.error('添加任务失败:', error);  
            }  
        };

        const refreshList = async () => {  
            try {  
                // 获取最新的路线列表  
                const routeListResponse = await axios.get('http://36.133.15.158/ai_video/api/patrol/route/list');  
                routeList.value = routeListResponse.data; // 假设后端返回的是路线列表数据  

                // 获取最新的任务列表  
                const taskListResponse = await axios.get('http://36.133.15.158/ai_video/api/patrol/route_task/list');  
                taskList.value = taskListResponse.data; // 假设后端返回的是任务列表数据  
            } catch (error) {  
                console.error('Failed to refresh route and task lists:', error);  
            }  
        };

        return { deviceGroupList, getDeviceGroupLoading, treeProps, 
            routeName, selectedCameras, routeList, startDate, endDate, multipleSelection, Unlimited, allHours, selectedHours, taskList, 
            paginatedrouteList, paginatedtaskList, currentPage_route, count_route, total_route, currentPage_task, count_task, total_task, 
            routesubmit,tasksubmit,refreshList};  
    },  

    data() {  
        return {  
            refreshRouteListLoading: false,  
            refreshTaskListLoading: false,  

            // 设置样例数据  
            routeList: [  
                { routeID: 1, routename: '路线1', selectedCameras: '摄像头1,摄像头2', createTime: '2023-04-01 10:00', updateTime: '2023-04-02 15:00' },  
                { routeID: 2, routename: '路线2', selectedCameras: '摄像头1,摄像头3,摄像头4', createTime: '2023-03-25 08:30', updateTime: '2023-03-25 10:00' },  
                { routeID: 3, routename: '路线3', selectedCameras: '摄像头5,摄像头6', createTime: '2023-03-20 12:00', updateTime: '2023-03-20 14:00' },  
                { routeID: 4, routename: '路线4', selectedCameras: '摄像头7,摄像头8', createTime: '2023-03-15 14:30', updateTime: '2023-03-15 16:00' },
                { routeID: 5, routename: '路线5', selectedCameras: '摄像头9,摄像头10', createTime: '2023-03-10 16:30', updateTime: '2023-03-10 18:00' }
            ],  
            taskList: [  
                { taskID:1, routename: '路线1', selectedCameras: '摄像头1,摄像头2', startDate: '2023-04-01', endDate: '2023-04-02', selectedHours: '08:00-10:00,10:00-12:00,12:00-14:00,14:00-16:00,16:00-18:00,18:00-20:00,20:00-22:00', createTime: '2023-04-01 10:00', updateTime: '2023-04-02 15:00' },  
                { taskID:2, routename: '路线2', selectedCameras: '摄像头1,摄像头3,摄像头4', startDate: '2023-03-25', endDate: '2023-03-25', selectedHours: '08:00-10:00,10:00-12:00,12:00-14:00,14:00-16:00,16:00-18:00,18:00-20:00,20:00-22:00', createTime: '2023-03-25 08:30', updateTime: '2023-03-25 10:00' },  
                { taskID:3, routename: '路线3', selectedCameras: '摄像头5,摄像头6', startDate: '2023-03-20', endDate: '2023-03-20', selectedHours: '08:00-10:00,10:00-12:00,12:00-14:00,14:00-16:00,16:00-18:00,18:00-20:00,20:00-22:00', createTime: '2023-03-20 12:00', updateTime: '2023-03-20 14:00' },  
            ],  
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
                url: `http://36.133.15.158/ai_video/api/patrol/route/del` 
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

        // 巡逻任务操作 //
        edittask: function(row) {
            this.$refs.taskEdit.openDialog(row, () => {
                this.$refs.taskEdit.close();
                this.$message({
                showClose: true,
                message: "任务修改成功",
                type: "success"
                });
                setTimeout(this.gettaskList, 200);
            });
            },
        deletetask: function(row) {
            let msg = "确定删除此任务？";
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
                url: `http://36.133.15.158/ai_video/api/patrol/route_task/del` 
            })
                .then(res => {
                this.gettaskList();
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
            // 使用当前页码和每页数量来计算分页后的数据  
            const start_route = (this.currentPage_route - 1) * this.count_route;  
            const end_route = this.currentPage_route * this.count_route;  
            const start_task = (this.currentPage_task - 1) * this.count_task;  
            const end_task = this.currentPage_task * this.count_task;  
            this.paginatedrouteList = this.routeList.slice(start_route, end_route);  
            this.paginatedtaskList = this.taskList.slice(start_task, end_task);  
        },

        // 刷新路线列表  
        refreshRouteList: function() {  
            this.refreshRouteListLoading = true;  
            this.$axios({   
                method: "get",  
                url: "http://36.133.15.158/ai_video/api/patrol/route/list"  
            })  
                .then(res => {  
                this.routeList = res.data;  
                this.refreshRouteListLoading = false;  
                })  
                .catch(error => {  
                console.error(error);  
                this.refreshRouteListLoading = false;  
                });  
        },

        // 刷新任务列表  
        refreshTaskList: function() {  
            this.refreshTaskListLoading = true;  
            this.$axios({   
                method: "get",  
                url: "http://36.133.15.158/ai_video/api/patrol/route_task/list"  
            })  
                .then(res => {  
                this.taskList = res.data;  
                this.refreshTaskListLoading = false;  
                })  
                .catch(error => {  
                console.error(error);  
                this.refreshTaskListLoading = false;  
                });  
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
    .camera-container {  
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

    .route-container {  
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
    .task-container {  
        position: relative;
        top: 0px;  
        width: 1380px; 
        height: 190px; 
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
    