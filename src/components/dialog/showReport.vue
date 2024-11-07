<template>  
  <div id="showReport">  
    <el-dialog  
      :visible.sync="dialogVisible"  
      title="巡逻报告"  
      width="70%"  
      top="4rem"  
      @close="handleClose"  
    >  
      <el-form :model="reportForm" overflow-y="auto">  
        <el-row>  
          <el-col :span="7">  
            <el-form-item label="报告编号" :label-width="formLabelWidth">  
              <el-input v-model="reportForm.reportId" readonly></el-input>  
            </el-form-item>  
          </el-col>  
          <el-col :span="7">  
            <el-form-item label="路线名称" :label-width="formLabelWidth">  
              <el-input v-model="reportForm.routeName" readonly></el-input>  
            </el-form-item>  
          </el-col>   
          <el-col :span="10">  
            <el-form-item label="执行时间" :label-width="formLabelWidth">  
              <el-input v-model="reportForm.createTime" readonly></el-input>  
            </el-form-item>  
          </el-col>
        </el-row>  
        <el-row>  
          <el-col :span="24">  
            <el-form-item label="巡逻总结" :label-width="formLabelWidth"> 
              <el-input v-model="reportForm.summarize" readonly>    
              </el-input> 
            </el-form-item>  
          </el-col>  
        </el-row>  
        <el-row>  
          <el-col :span="24">  
            <el-form-item label="具体情况" :label-width="formLabelWidth">  
              <el-table  
                :data="filteredReportList"  
                style="width: 100%;height:350px;font-size: 12px;overflow-y: auto;"  
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
                <el-table-column label="是否有告警" width="120">  
                  <template slot-scope="scope">  
                    <el-tag type="danger">{{ scope.row.abnormality }}</el-tag>  
                  </template>  
                </el-table-column>  
                <el-table-column label="告警名称" width="150">  
                  <template slot-scope="scope">  
                    <el-tag type="danger">{{ scope.row.alarmName }}</el-tag>  
                  </template>  
                </el-table-column>  
                <el-table-column label="告警时间" width="150">  
                  <template slot-scope="scope">  
                    <el-tag type="danger">{{ scope.row.createTime }}</el-tag>  
                  </template>  
                </el-table-column>
              </el-table>  
            </el-form-item> 
          </el-col>  
        </el-row> 
      </el-form> 
      <div slot="footer" class="dialog-footer">  
        <el-button type="primary" @click="exportReport">导出报告</el-button>  
      </div>   
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
import { emit } from 'node-notifier';
import { ref } from 'vue';

export default {  
  name: 'ShowReport', 
  
  setup() {
    const dialogVisible = ref(false); 
    const showImageDialogVisible = ref(false);  
    const imageSrc = ref('');  
    const reportForm = ref({
      reportId: '',
      routeName: '',
      createTime: '', 
      abnormality: '',
      detailList: [],
    });  
    const originalReport = ref({}); 
    const filteredReportList = ref([]); 
    const formLabelWidth = '120px'; 
 

    //打开对话框时，传入报告数据  
    const openDialog =  (reportData) => { 
      dialogVisible.value = true;
      reportForm.value = { ...reportData }; 
      filteredReportList.value = reportData.detailList; 
      originalReport.value = {...reportData };
      handleSummarize(); 
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

    // 处理总结并调整输入框高度  
    const handleSummarize = () => {  
      const abnormalityCount = reportForm.value.detailList.filter(item => item.abnormality === '是').length;
      const cameraCount = reportForm.value.detailList.length;  
      let summarize = '';  
      if (abnormalityCount > 0) {  
        const uniqueAlarmNames = new Set(reportForm.value.detailList.filter(item => item.abnormality === '是').map(item => item.alarmName));  
        const alarmNameList = Array.from(uniqueAlarmNames); // 将 Set 转换回数组  
        const alarmName = alarmNameList.join('、');   
        summarize = `本次成功对${cameraCount}个摄像头进行自动巡逻，其中${abnormalityCount}个摄像头发现告警，告警内容包括${alarmName}等，请速通知负责人前往现场核实确认。`;  
      } else {  
        summarize = `本次成功对${cameraCount}个摄像头进行自动巡逻，未发现告警。`;  
      }  
      reportForm.value.summarize = summarize;  
    }; 

    // 导出报告保存为wrod文档  
    const exportReport = () => {  
      const doc = new window.Blob([JSON.stringify(reportForm.value)], { type: 'text/plain;charset=utf-8' });  
      const url = window.URL.createObjectURL(doc);  
      const a = document.createElement('a');  
      a.download = `${'巡逻报告'}_${reportForm.value.reportId}.docx`;  
      a.href = url;  
      a.click();  
      window.URL.revokeObjectURL(url);  
    };

    return { 
      dialogVisible, showImageDialogVisible, imageSrc, reportForm, originalReport, filteredReportList, formLabelWidth, 
       openDialog, handleClick, handleImageClose, handleClose, handleSummarize, exportReport 
    };
  }  
};  
</script>
