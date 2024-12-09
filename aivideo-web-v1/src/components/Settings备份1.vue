<template>

    <div id="app" style="width: 100%">
      <div class="page-header">
  
        <div class="page-title">系统配置</div>
        <div class="page-header-btn">
          <el-button icon="el-icon-plus" size="mini" style="margin-right: 1rem;" type="primary" @click="addmb">
            新建模板
          </el-button>
          
        </div>
      </div>
        <!--模板列表-->
        <el-table :data="mbList" style="width: 100%;font-size: 12px;" :height="winHeight">
          <el-table-column prop="title" label="标题" />
          <el-table-column  align="center" label="logo" min-width="100">
            <template slot-scope="scope">
              <el-image
              style="width: 100px; height: 100px"
              :src="scope.row.logoBase64"
              :preview-src-list="[scope.row.logoBase64]"
              ></el-image>
            </template>
          </el-table-column>
          <!-- <el-table-column  align="center" label="顶部背景图片" min-width="100">
            <template slot-scope="scope">
              <el-image
              style="width: 100px; height: 100px"
              :src="scope.row.backgroundBase64"
              :preview-src-list="[scope.row.backgroundBase64]"
              ></el-image>
            </template>
          </el-table-column>
          <el-table-column  align="center" label="设备背景图片" min-width="100">
            <template slot-scope="scope">
              <el-image
              style="width: 100px; height: 100px"
              :src="scope.row.deviceBackgroundBase64"
              :preview-src-list="[scope.row.deviceBackgroundBase64]"
              ></el-image>
            </template>
          </el-table-column>
          <el-table-column  align="center" label="页面容器背景图片" min-width="140">
            <template slot-scope="scope">
              <el-image
              style="width: 100px; height: 100px"
              :src="scope.row.backgroundContentBase64"
              :preview-src-list="[scope.row.backgroundContentBase64]"
              ></el-image>
            </template>
          </el-table-column>
          <el-table-column  align="center" label="卡片容器背景图片" min-width="140">
            <template slot-scope="scope">
              <el-image
              style="width: 100px; height: 100px"
              :src="scope.row.cardBoxBase64"
              :preview-src-list="[scope.row.cardBoxBase64]"
              ></el-image>
            </template>
          </el-table-column>
          <el-table-column  align="center" label="卡片容器顶部背景图片" min-width="150">
            <template slot-scope="scope">
              <el-image
              style="width: 100px; height: 100px"
              :src="scope.row.cardTitleBase64"
              :preview-src-list="[scope.row.cardTitleBase64]"
              ></el-image>
            </template>
          </el-table-column>
          <el-table-column  align="center" label="警告容器背景" min-width="100">
            <template slot-scope="scope">
              <el-image
              style="width: 100px; height: 100px"
              :src="scope.row.warnBoxBase64"
              :preview-src-list="[scope.row.warnBoxBase64]"
              ></el-image>
            </template>
          </el-table-column>
          <el-table-column  align="center" label="警告容器顶部背景" min-width="140">
            <template slot-scope="scope">
              <el-image
              style="width: 100px; height: 100px"
              :src="scope.row.warnTitleBase64"
              :preview-src-list="[scope.row.warnTitleBase64]"
              ></el-image>
            </template>
          </el-table-column>
          <el-table-column  align="center" label="容器图标" min-width="100">
            <template slot-scope="scope">
              <el-image
              style="width: 100px; height: 100px"
              :src="scope.row.boxIcon"
              :preview-src-list="[scope.row.boxIcon]"
              ></el-image>
            </template>
          </el-table-column>
          <el-table-column  align="center" label="监控视频顶部背景图片" min-width="170">
            <template slot-scope="scope">
              <el-image
              style="width: 100px; height: 100px"
              :src="scope.row.cameraTitleBoxBase64"
              :preview-src-list="[scope.row.cameraTitleBoxBase64]"
              ></el-image>
            </template>
          </el-table-column> -->
          <el-table-column align="center" label="状态"  width="100">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.status"
              :active-value="0"
              :inactive-value="1"
              @change="handleStatusChange(scope.row)"
            ></el-switch>
          </template>
          </el-table-column>
          <el-table-column label="操作" min-width="450" fixed="right">
            <template slot-scope="scope">
              <el-button size="medium" icon="el-icon-edit" type="text" @click="handleUpdate(scope.row)">修改</el-button>
              <el-divider direction="vertical"></el-divider>
              <el-button size="medium" icon="el-icon-delete" type="text" @click="deleteUser(scope.row)"
                        style="color: #f56c6c">删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      <el-pagination
          style="float: right"
          @size-change="handleSizeChange"
          @current-change="currentChange"
          :current-page="currentPage"
          :page-size="count"
          :page-sizes="[15, 25, 35, 50]"
          layout="total, sizes, prev, pager, next"
          :total="total">
      </el-pagination>
      <el-dialog :title="title" :visible.sync="open" class="dialog-from" append-to-body>
            <el-form ref="form" :model="form" label-width="120px">
            <el-row>
              <el-col :span="24">
                <el-form-item label="标题名称：" label-width="100px">
                    <el-input v-model="form.title"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="状态：" label-width="100px">
                  <el-radio-group v-model="form.status">
                    <el-radio
                      v-for="dict in dicts"
                      :key="dict.value"
                      :label="dict.value"
                    >{{dict.label}}</el-radio>
                  </el-radio-group>
              </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <el-form-item label="logo：" label-width="100px" style="width: max-content;">
                  <!-- <el-upload
                  action="#"
                  list-type="picture-card"
                  :multiple="false"
                  :before-upload="handleBeforeUpload"
                  accept="image/png,image/jpg"
                  :file-list="fileList"
                  :on-preview="handlePictureCardPreview"
                  :on-remove="handleRemove"
                  :http-request="customUpload"
                  :on-exceed="handleOnexceed"
                  :limit="1"
                  >
                  <i class="el-icon-plus"></i>
                  </el-upload>
                  <el-dialog :visible.sync="form.logoDialogVisible">
                      <img width="100%" :src="form.logoBase64" alt="">
                  </el-dialog> -->
                  <my-upload
                  :fileList="logoFileList"
                  @changeImgUrl="changeLogoImgUrl"
                  > 
                  </my-upload>
              </el-form-item>
              </el-col>
              <!-- <el-col :span="12">
                <el-form-item label="顶部背景图片：" label-width="170px" style="width: max-content;">
                  <my-upload
                  :fileList="backgroudFileList"
                  @changeImgUrl="changeBackgroundImgUrl"
                  > 
                  </my-upload>
                </el-form-item>
              </el-col> -->
            </el-row>
            <el-row>
              <el-col :span="24">
                <el-form-item label="主题颜色：" label-width="140px" style="width: max-content;">
                  <my-theme-picker style="float: right;height: 26px;margin: 10px 8px 0 0;" :themeColor="form.themeColor" @change="themeChange" />
              </el-form-item>
              </el-col>
            </el-row>
            <!-- <el-row>
              <el-col :span="12">
                <el-form-item label="页面容器背景图片：" label-width="140px" style="width: max-content;">
                  <my-upload
                  :fileList="backgroundContentFileList"
                  @changeImgUrl="changeBackgroundContentImgUrl"
                  > 
                  </my-upload>
              </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="设备背景图片：" label-width="170px" style="width: max-content;">
                  <my-upload
                  :fileList="deviceBackgroundFileList"
                  @changeImgUrl="changeDeviceImgUrl"
                  > 
                  </my-upload>
              </el-form-item>
              </el-col>
            </el-row>  
            <el-row>
              <el-col :span="12">
                <el-form-item label="卡片容器背景图片：" label-width="140px" style="width: max-content;">
                  <my-upload
                  :fileList="cardBoxFileList"
                  @changeImgUrl="changeCardBoxImgUrl"
                  > 
                  </my-upload>
              </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="卡片容器顶部背景图片：" label-width="170px" style="width: max-content;">
                  <my-upload
                  :fileList="cardTitleFileList"
                  @changeImgUrl="changeCardTitleImgUrl"
                  > 
                  </my-upload>
              </el-form-item>
              </el-col>
            </el-row>    
            <el-row>
              <el-col :span="12">
                <el-form-item label="警告容器背景：" label-width="140px" style="width: max-content;">
                  <my-upload
                  :fileList="warnBoxlist"
                  @changeImgUrl="changeWarnBoxImgUrl"
                  > 
                  </my-upload>
              </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="警告容器顶部背景：" label-width="170px" style="width: max-content;">
                  <my-upload
                  :fileList="warnTitleList"
                  @changeImgUrl="changeWarnTitleImgUrl"
                  > 
                  </my-upload>
              </el-form-item>
              </el-col>
            </el-row>     
            <el-row>
              <el-col :span="12">
                <el-form-item label="容器左侧图标：" label-width="140px" style="width: max-content;">
                  <my-upload
                  :fileList="boxIconlist"
                  @changeImgUrl="changeBoxIconImgUrl"
                  > 
                  </my-upload>
              </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="监控视频顶部背景图片：" label-width="170px" style="width: max-content;">
                  <my-upload
                  :fileList="cameraTitleBoxlist"
                  @changeImgUrl="changeCameraTitleBoxImgUrl"
                  > 
                  </my-upload>
              </el-form-item>
              </el-col>
            </el-row>     
            <el-row>
              <el-col :span="12">
                <el-form-item label="主题颜色：" label-width="140px" style="width: max-content;">
                  <my-theme-picker style="float: right;height: 26px;margin: 10px 8px 0 0;" :themeColor="form.themeColor" @change="themeChange" />
              </el-form-item>
              </el-col>
            </el-row>     -->
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="submitForm">保存</el-button>
            <el-button @click="cancel">取消</el-button>
        </div>
      </el-dialog>
    </div>
  </template>
  
  <script>
  import uiHeader from '../layout/UiHeader.vue'
  import { mapGetters } from "vuex";
  import myUpload from "../components/myUpload/index.vue"
  import MyThemePicker from '@/components/myThemePicker/index.vue'
  export default {
    name: 'userManager',
    components: {
      uiHeader,
      myUpload,
      MyThemePicker 
    },
    data() {
      return {
        form:{
            id:"",
            title:"",
            logoBase64:"", 
            backgroundBase64:"", // 顶部背景图片
            deviceBackgroundBase64:"", // 设备背景图片
            backgroundContentBase64:"", // 页面容器背景图片
            cardBoxBase64:"", // 卡片容器背景图片
            cardTitleBase64:"", // 卡片容器顶部背景图片
            warnBoxBase64:"", // 警告容器背景
            warnTitleBase64:"", // 警告容器顶部背景
            boxIcon:"", // 容器图标
            cameraTitleBoxBase64:"", // 监控视频顶部背景图片
            themeColor:"", // 主题颜色
            status:0
        },
        // 弹出层标题
        title: "",
        // 是否显示弹出层
        open: false,
        winHeight: window.innerHeight - 200,
        dicts:[{
          label:"启用",
          value:0
        },{
          label:"停用",
          value:1
        }],
        //backgroudDialogVisible:false,
       
        //logoDialogVisible: false,
        backgroudFileList:[],
        logoFileList:[],
        deviceBackgroundFileList:[],
        backgroundContentFileList:[],
        cardBoxFileList:[],
        cardTitleFileList:[],
        warnBoxlist:[],
        warnTitleList:[],
        boxIconlist:[],
        cameraTitleBoxlist:[],
        mbList:[], //模板列表数据
        currentPage: 1,
        count: 15,
        total: 0,
      };
    },
    computed:{
 
    },
    mounted() {
      this.initData();
    },
    methods: {
        addmb(){
          this.reset();
          this.open = true;
          this.title = "新增模板"
            // 新增模板
        },
        getmbList(){
          let that = this;
          this.$axios({
            method: 'get',
            url: `/modelSettings/list`,
            params: {
              page: that.currentPage,
              count: that.count
            }
          }).then( (res)=> {
            if (res.data.code === 0) {
              that.total = res.data.data.total;
              that.mbList = res.data.data.list;
            }
            
          }).catch( (error)=> {
           
          });
        },
        initData(){
          this.getmbList();
        },
        // handleBeforeUpload(file) {
        // // 可以在这里进行文件类型的检查
        // debugger
        // const isImage = file.type.startsWith('image/');
        // if (!isImage) {
        //     this.$message.error('只能上传图片文件!');
        //     return false;
        // }
        //     return true;
        // },
        // handleRemove(file, fileList) {
        //     console.log(file, fileList);
        //     this.form.logoBase64 = "";
        //     this.form.logoDialogVisible = false;
        // },
        // handlePictureCardPreview(file) {
        //     this.form.logoBase64 = file.url;
        //     this.form.logoDialogVisible = true;
        // },
        // customUpload(options) {
        //     const reader = new FileReader();
        //     reader.onload = (e) => {
        //         this.form.logoBase64 = e.target.result;
        //         // 这里可以将 base64 字符串发送到服务器
        //         console.log(this.imageBase64);
        //         this.$message.success("上传成功")
        //     };
        //     reader.readAsDataURL(options.file);
        // },
        // handleOnexceed(){
        //     this.$message.error("最多只能上传一张图片")
        // },
        changeBackgroundImgUrl(val){
          this.form.backgroundBase64 = val
        },
        changeLogoImgUrl(val){
          this.form.logoBase64 = val
        },
        changeBackgroundContentImgUrl(val){
          this.form.backgroundContentBase64 = val
        },
        changeDeviceImgUrl(val){
          this.form.deviceBackgroundBase64 = val
        },
        changeCardBoxImgUrl(val){
          this.form.cardBoxBase64 = val
        },
        changeCardTitleImgUrl(val){
          this.form.cardTitleBase64 = val
        },
        changeWarnBoxImgUrl(val){
          this.form.warnBoxBase64 = val
        },
        changeWarnTitleImgUrl(val){
          this.form.warnTitleBase64 = val
        },
        changeBoxIconImgUrl(val){
          this.form.boxIcon = val
        },
        changeCameraTitleBoxImgUrl(val){
          this.form.cameraTitleBoxBase64 = val
        },
        // 取消按钮
        cancel() {
          this.open = false;
          this.reset();
        },
        reset(){
          this.form = {
            id:"",
            title:"",
            logoBase64:"",
            backgroundBase64:"",
            backgroundContentBase64:"",
            deviceBackgroundBase64:"",
            cardBoxBase64:"",
            cardTitleBase64:"",
            warnBoxBase64:"", // 警告容器背景
            warnTitleBase64:"", // 警告容器顶部背景
            boxIcon:"", // 容器图标
            cameraTitleBoxBase64:"",
            themeColor:"",
            status:0
          };
          this.logoFileList = []
          this.backgroudFileList = []
          this.deviceBackgroundFileList = [];
          this.backgroundContentFileList = [];
          this.cardBoxFileList = [];
          this.cardTitleFileList = [];
          this.warnBoxlist = [];
          this.warnTitleList = [];
          this.boxIconlist = [];
          this.cameraTitleBoxlist = []
          console.log(this.form)
          this.resetForm('form');
        },
        submitForm () {
          this.$refs["form"].validate(valid => {
          if (valid) {
            console.log(this.form)
            debugger
            if (this.form.id != "") {
              this.$axios({
                method:"post",
                url: `/modelSettings/update`,
                data: this.form
              }).then(response => {
                //this.$modal.msgSuccess("修改成功");
                this.$message({
                  showClose: true,
                  message: '修改成功',
                  type: 'success',
                });
                this.open = false;
                this.getmbList();
              });
            } else {
              this.$axios({
                method:"post",
                url:"/modelSettings/add",
                data: this.form
              }).then(response => {
                // this.$modal.msgSuccess("新增成功");
                this.$message({
                  showClose: true,
                  message: '新增成功',
                  type: 'success',

                });
                this.open = false;
                this.getmbList();
              });
            }
          }
        });
        },
        themeChange(val){
          this.form.themeColor = val
        },
        deleteUser (row) {
          let msg = `确定删除${row.title}？`
          this.$confirm(msg, '提示', {
            dangerouslyUseHTMLString: true,
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            center: true,
            type: 'warning'
          }).then(() => {
            this.$axios({
              method: 'post',
              url: `/modelSettings/delete/${row.id}`,
            }).then((res) => {
              this.$message({
                message:"删除成功",
                type:"success"
              })
              this.getmbList();
            }).catch((error) => {
              console.error(error);
            });
          }).catch(() => {
    
          });
        },
        handleUpdate(row) {
          this.reset();
          // row.themeColor = "red"
          this.form = JSON.parse(JSON.stringify(row));
          this.open = true;
          this.title = "修改模板"
          //this.form.themeColor = 'red'
          console.log(this.form.themeColor)
          debugger
          this.logoFileList.push({
            name:"text.png",
            url:row.logoBase64
          })
          this.backgroudFileList.push({
            name:"text.png",
            url:row.backgroundBase64
          })
          this.deviceBackgroundFileList.push({
            name:"text.png",
            url:row.deviceBackgroundBase64
          });
          this.backgroundContentFileList.push({
            name:"text.png",
            url:row.backgroundContentBase64
          });
          this.cardBoxFileList.push({
            name:"text.png",
            url:row.cardBoxBase64
          });
          this.cardTitleFileList.push({
            name:"text.png",
            url:row.cardTitleBase64
          });
          this.warnBoxlist.push({
            name:"text.png",
            url:row.warnBoxBase64
          })
          this.warnTitleList.push({
            name:"text.png",
            url:row.warnTitleBase64
          })
          this.boxIconlist.push({
            name:"text.png",
            url:row.boxIcon
          })
          // this.$axios({
          //   method:"get",
          //   url:`/api/role/getInfo/${roleId}`
          // }).then((response)=>{
          //   this.form = response.data.data;
          //   this.open = true;
          //   this.title = "修改角色";
          // })
        },
        handleStatusChange(row) {
          let text = row.status === 0 ? "启用" : "停用";
          debugger
          this.$confirm('确认要"' + text + '""' + row.title + '"角色吗？').then(()=> {
            //return changeRoleStatus(row.roleId, row.status);
            this.$axios({
              method:"post",
              url:"/modelSettings/changeStatus",
              data:{
                id:row.id,
                status:row.status
              }
            }).then(() => {
              this.$message({
                showClose: true,
                message: `修改成功`,
                type: 'success',
              });
            }).catch(()=>{
              row.status = row.status === "0" ? "1" : "0";
            });
          })
        },
        currentChange(val){
          this.currentPage = val;
          this.getmbList();
        },
        handleSizeChange(){
          this.count = val;
          this.getmbList();
        }
    }
  }
  </script>
  <style>
  .form-box{
    width: 100%;
    margin: auto;
  }
  </style>
  
  