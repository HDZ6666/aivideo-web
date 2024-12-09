<template>

    <div id="app" style="width: 100%">
      <div class="page-header">
  
        <div class="page-title">系统配置</div>
        <!-- <div class="page-header-btn">
          <el-button icon="el-icon-plus" size="mini" style="margin-right: 1rem;" type="primary" @click="addmb">
            新建模板
          </el-button>
          
        </div> -->
      </div>
      <div style="background: #fff;height: 100%;">
        <el-form ref="form" :model="form" label-width="160px" style="width: 50%;margin: 0 auto;padding-top: 20px;">
            <el-form-item label="背景风格:" style="text-align: left;margin-bottom: 40px;">
                <el-radio-group v-model="form.themeColor">
                <el-radio :label="item.color" style="margin-right: 50px;" v-for="item in themeColorList" :key="item.color">
                    <span>{{item.name}}</span>
                    <my-theme-picker :isDisabled="item.isDisabled" :themeColor="item.color"  />
                </el-radio>
                <!-- <el-radio label="背景1">背景1<my-theme-picker :themeColor="form.themeColor1" /></el-radio>
                <el-radio label="背景2">背景2<my-theme-picker :themeColor="form.themeColor2" /></el-radio>
                <el-radio label="背景3">背景3<my-theme-picker  :themeColor="form.themeColor3" /></el-radio> -->
                </el-radio-group>
            </el-form-item>
            <el-form-item label="大屏标题:" style="margin-bottom: 40px;">
                <el-input v-model="form.title"></el-input>
            </el-form-item>
            <el-form-item label="logo:" style="margin-bottom: 40px;">
                <my-upload
                  style="text-align: left;"
                  :fileList="logoFileList"
                  @changeImgUrl="changeLogoImgUrl"
                  > 
                  </my-upload>
            </el-form-item>
            <el-form-item>
                <el-button style="text-align: left;" type="primary" @click="submitForm">保存</el-button>
                <!-- <el-button>取消</el-button> -->
            </el-form-item>
        </el-form>
      </div>
     
       
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
            themeColor:"",
            status:0
        },
        themeColorList:[{
            color:"#0052d9", // 默认
            name:"默认",
            isDisabled:true
        },{
            color:"#0B8ECB",
            name:"背景1", // 蓝色3
            isDisabled:true
        },{
            color:"#1C71FC", // 蓝色2
            name:"背景2",
            isDisabled:true
        },{
            color:"#8F1FFF", // 紫色
            name:"背景3",
            isDisabled:true
        }],
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
              if(that.mbList[0].logoBase64&&!that.form.logoBase64){
                this.logoFileList.push({
                  name:"text.png",
                  url:that.mbList[0].logoBase64
                })
              }
              
              // that.form = {
              //   themeColor:that.mbList[0].themeColor,
              //   title:that.mbList[0].title
              // }
              that.form = that.mbList[0]
            }
            
          }).catch( (error)=> {
           
          });
        },
        initData(){
          this.getmbList();
        },
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
  <style scoped>
  .form-box{
    width: 100%;
    margin: auto;
  }
  /deep/ .el-color-picker{
    position: absolute !important;
    top: -5px;
  }
  </style>
  
  