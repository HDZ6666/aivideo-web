<template>  
  <div id="showReport">  
    <el-dialog  
      :visible.sync="dialogVisible"  
      title="巡逻报告"  
      width="60%"  
      @close="handleClose"  
    >  
      <el-form :model="reportForm" overflow-y="auto">  
        <el-row>  
          <el-col :span="12">  
            <el-form-item label="报告编号" :label-width="formLabelWidth">  
              <el-input v-model="reportForm.reportId" readonly></el-input>  
            </el-form-item>  
          </el-col>  
          <el-col :span="12">  
            <el-form-item label="路线名称" :label-width="formLabelWidth">  
              <el-input v-model="reportForm.routeName" readonly></el-input>  
            </el-form-item>  
          </el-col>  
        </el-row>  
        <el-row>  
          <el-col :span="12">  
            <el-form-item label="执行时间" :label-width="formLabelWidth">  
              <el-input v-model="reportForm.createTime" readonly></el-input>  
            </el-form-item>  
          </el-col>  
          <el-col :span="12">  
            <el-form-item label="是否有告警" :label-width="formLabelWidth">  
              <el-input v-model="reportForm.abnormality" readonly></el-input>  
            </el-form-item>  
          </el-col>  
        </el-row>  
        <el-row>  
          <el-col :span="24">  
            <el-form-item label="具体情况" :label-width="formLabelWidth">  
              <el-table  
                :data="filteredReportList"  
                style="width: 100%;height:300px;font-size: 12px;overflow-y: auto;"  
                header-row-class-name="table-header"  
              >  
                <el-table-column prop="cameraName" label="摄像头名称" width="180"></el-table-column>  
                <el-table-column label="巡逻拍照图片" width="180">  
                  <template slot-scope="scope">  
                    <img 
                      :src="scope.row.imageUrl" 
                      style="width: 100px; height: 75px; cursor: pointer;"
                      @click="handleClick(scope.row.imageUrl)"  
                       />  
                  </template>  
                </el-table-column>  
                <!-- <el-table-column label="告警类型" width="120">  
                  <template slot-scope="scope">  
                    <el-tag type="danger">{{ scope.row.alarmType }}</el-tag>  
                  </template>  
                </el-table-column>   -->
                <el-table-column label="告警名称" width="130">  
                  <template slot-scope="scope">  
                    <el-tag type="danger">{{ scope.row.alarmName }}</el-tag>  
                  </template>  
                </el-table-column>  
                <el-table-column label="告警时间" width="180">  
                  <template slot-scope="scope">  
                    <el-tag type="danger">{{ scope.row.createTime }}</el-tag>  
                  </template>  
                </el-table-column>
              </el-table>  
            </el-form-item> 
          </el-col>  
        </el-row> 
      </el-form>  
    </el-dialog> 
    
    <el-dialog  
      title="查看图片"  
      :visible.sync="showImageDialogVisible"  
      width="80%" 
      top="5vh"  
      :before-close="handleImageClose"  
    >  
      <img :src="imageSrc" style="width: 100%; height: 100%;margin-top: -20px;" />  
    </el-dialog>  
  </div>  
</template>  
  
<script>  
import { ref, nextTick } from 'vue';

export default {  
  name: 'ShowReport', 
  
  setup() {
    const dialogVisible = ref(false);  // 是否显示报告对话框  
    const showImageDialogVisible = ref(false);  // 是否显示查看图片对话框  
    const imageSrc = ref('');  // 查看图片的URL  
    const reportForm = ref({
      reportId: '',
      routeName: '',
      createTime: '', 
      abnormality: '',
      detailList: [],
    });  
    const originalReport = ref({}); // 用于存储原始数据，以便在取消时恢复  
    const filteredReportList = ref([]);  // 用于存储筛选后的报告列表  
    const formLabelWidth = '120px';  // 表单项的label宽度  

    //打开对话框时，传入报告数据  
    const openDialog =  (reportData) => { 
      dialogVisible.value = true;
      reportForm.value = { ...reportData }; // 填充表单数据  
      filteredReportList.value = reportData.detailList;  // detailList列表 
      originalReport.value = {...reportData }; // 存储原始数据，以便在取消时恢复 
      console.log(reportForm.value);
    };  

    // 点击图片时打开查看图片对话框  
    const handleClick = (imageUrl) => {  
      imageSrc.value = imageUrl;  
      showImageDialogVisible.value = true;  
    };

    // 关闭查看图片对话框  
    const handleImageClose = () => {  
      showImageDialogVisible.value = false;  
    };  

    // 关闭对话框  
    const handleClose = () => {  
      dialogVisible.value = false;  
    };  

    return { 
      dialogVisible, showImageDialogVisible, imageSrc, reportForm, originalReport, filteredReportList, formLabelWidth, 
      openDialog, handleClick, handleImageClose, handleClose
    }; 
  },   
};  
</script>