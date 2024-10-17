<template>  
  <div id="showReport">  
    <el-dialog  
      :visible.sync="dialogVisible"  
      title="巡逻报告"  
      width="60%"  
      @close="handleClose"  
    >  
      <el-form :model="reportForm" ref="reportForm" overflow-y="auto">  
        <el-row>  
          <el-col :span="12">  
            <el-form-item label="报告编号" :label-width="formLabelWidth">  
              <el-input v-model="reportForm.reportID" readonly></el-input>  
            </el-form-item>  
          </el-col>  
          <el-col :span="12">  
            <el-form-item label="路线名称" :label-width="formLabelWidth">  
              <el-input v-model="reportForm.routename" readonly></el-input>  
            </el-form-item>  
          </el-col>  
        </el-row>  
        <el-row>  
          <el-col :span="12">  
            <el-form-item label="执行时间" :label-width="formLabelWidth">  
              <el-input v-model="reportForm.excuteTime" readonly></el-input>  
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
                <el-table-column prop="camerasName" label="摄像头名称" width="180"></el-table-column>  
                <el-table-column label="巡逻拍照图片">  
                  <template slot-scope="scope">  
                    <img 
                      :src="scope.row.imageUrl" 
                      style="width: 100px; height: 75px; cursor: pointer;"
                      @click="handleClick(scope.row.imageUrl)"  
                       />  
                  </template>  
                </el-table-column>  
                <el-table-column label="是否有告警">  
                  <template slot-scope="scope">  
                    <el-tag type="success" v-if="!scope.row.hasAlert">无</el-tag>  
                    <el-tag type="danger" v-else>有</el-tag>  
                  </template>  
                </el-table-column>  
                <el-table-column label="告警类型">  
                  <template slot-scope="scope">  
                    <el-tag type="success" v-if="!scope.row.alertType">无</el-tag>  
                    <el-tag type="danger" v-else>{{ scope.row.alertType }}</el-tag>  
                  </template>  
                </el-table-column>  
                <el-table-column label="告警名称">  
                  <template slot-scope="scope">  
                    <el-tag type="success" v-if="!scope.row.alertName">无</el-tag>  
                    <el-tag type="danger" v-else>{{ scope.row.alertName }}</el-tag>  
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
export default {  
  name: 'ShowReport',  
  methods: {  
    // 打开对话框并传入报告数据  
    openDialog(report, callback) {  
      this.originalReport = { ...report }; // 存储原始数据  
      this.reportForm = { ...report }; // 填充表单数据  
      this.filteredReportList = this.reportList.filter(item => item.reportID === report.reportID); // 筛选报告列表  
      this.dialogVisible = true;  
      this.$nextTick(() => {  
        this.$refs.reportForm.clearValidate(); // 清除表单验证  
      });  
      callback && callback(); // 回调，可用于关闭可能已打开的其他对话框  
    },  
    // 关闭对话框  
    handleClose() {  
      this.dialogVisible = false;  
    },  

    // 点击图片时打开查看图片对话框  
    handleClick(imageUrl) {  
      this.imageSrc = imageUrl;  
      this.showImageDialogVisible = true;  
    },  
    // 关闭查看图片对话框  
    handleImageClose() {  
      this.showImageDialogVisible = false;  
    },  
  },  
  data() {  
    return {  
      dialogVisible: false,  // 是否显示报告对话框  
      formLabelWidth: '120px',
      showImageDialogVisible: false,  // 是否显示查看图片对话框  
      imageSrc: '',  // 查看图片的URL  
      reportForm: {  
        reportID: '',  
        routename: '',  
        excuteTime: '',  
        abnormality: '',  
      },  
      originalReport: {}, // 用于存储原始数据，以便在取消时恢复  
      reportList: [  
        { reportID: 1, routename: '路线1', camerasName: '摄像头1', imageUrl: 'https://ai-monitor-qy.eos-dongguan-8.cmecloud.cn/1006/20240707/photo-gathering-20240707165058-e633b322792f10b237869e9320a6ee67.jpeg', hasAlert: false, alertType: '', alertName: '' },  
        { reportID: 1, routename: '路线1', camerasName: '摄像头2', imageUrl: 'https://ai-monitor-qy.eos-dongguan-8.cmecloud.cn/1006/20240707/photo-gathering-20240707161201-ac69968c5c6e5082eb60de5f83a307fe.jpeg', hasAlert: true, alertType: '人体', alertName: '人体检测告警' },  
        { reportID: 1, routename: '路线1', camerasName: '摄像头2', imageUrl: 'https://ai-monitor-qy.eos-dongguan-8.cmecloud.cn/1006/20240705/photo-gathering-20240705193811-f2c6f38066fdcaed202226dde57a27ed.jpeg', hasAlert: true, alertType: '环境', alertName: '环境异常告警' },  
        { reportID: 2, routename: '路线2', camerasName: '摄像头3', imageUrl: 'https://ai-monitor-qy.eos-dongguan-8.cmecloud.cn/1006/20240707/photo-gathering-20240707153308-46cbf264ad75820f44bb7999d3037d96.jpeg', hasAlert: true, alertType: '人体', alertName: '人体检测告警' },  
        { reportID: 2, routename: '路线2', camerasName: '摄像头4', imageUrl: 'https://ai-monitor-qy.eos-dongguan-8.cmecloud.cn/1006/20240707/photo-gathering-20240707151542-7c2c8af40c96b71fb6f86dbc2c4ba0d7.jpeg', hasAlert: true, alertType: '环境', alertName: '环境异常告警' },  
        { reportID: 3, routename: '路线3', camerasName: '摄像头5', imageUrl: 'https://ai-monitor-qy.eos-dongguan-8.cmecloud.cn/1006/20240707/photo-gathering-20240707143138-63a1045ab1cf7f82b8b5b2745b82f553.jpeg', hasAlert: false, alertType: '', alertName: '' },  
        { reportID: 3, routename: '路线3', camerasName: '摄像头6', imageUrl: 'https://ai-monitor-qy.eos-dongguan-8.cmecloud.cn/1006/20240707/photo-gathering-20240707134437-753ab7d12f34ef3a4e201da81d83c0f5.jpeg', hasAlert: false, alertType: '', alertName: '' },  
      ],  
      filteredReportList: [], // 用于存储筛选后的报告列表  
    };  
  },  
};  
</script>