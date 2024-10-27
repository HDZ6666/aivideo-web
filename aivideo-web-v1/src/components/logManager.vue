<template>

    <div id="app" style="width: 100%">
      <div class="page-header">
  
        <div class="page-title">日志列表</div>
        <!-- <div class="page-header-btn">
          <el-button icon="el-icon-plus" size="mini" style="margin-right: 1rem;" type="primary" @click="handleAdd">
            添加
          </el-button>
  
        </div> -->
      </div>
      <div class="flex">
        <!-- 左侧数状选择 -->
        <div class="leftchoose">
            <el-card class="box-card">
            <div v-for="item in leftList" :key="$route.path+item.name" class="box-card-text box-card-item">
              <span :style="{color: $route.path==item.url?'#1890FF':'',cursor:'pointer'}" @click="$route.path!=item.url&&$router.push(item.url)">{{item.name }}</span> 
            </div>
            </el-card>
          </div>
        <!--权限列表-->
        <el-table :data="roleList" style="width: 100%;font-size: 12px;" :height="winHeight">
          <el-table-column prop="username" label="用户名称" max-width="160"/>
          <el-table-column prop="name" label="请求名称" max-width="100"/>
          <el-table-column prop="timing" label="请求时间" max-width="100"/>
          <el-table-column label="请求方式" prop="type" max-width="100" />
          <el-table-column label="请求地址" prop="uri" min-width="100" />
          <el-table-column label="请求结果" prop="result" min-width="100" />
          <el-table-column label="创建时间" align="center" prop="createTime" min-width="180">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.createTime) }}</span>
          </template>
        </el-table-column>
          <!-- <el-table-column label="操作" min-width="450" fixed="right">
            <template slot-scope="scope">
              <el-button size="medium" icon="el-icon-edit" type="text" @click="handleUpdate(scope.row)">修改</el-button>
              <el-divider direction="vertical"></el-divider>
              <el-button size="medium" icon="el-icon-delete" type="text" @click="deleteUser(scope.row)"
                        style="color: #f56c6c">删除
              </el-button>
            </template>
          </el-table-column> -->
        </el-table>
      </div>
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
      <!-- 添加或修改角色配置对话框 -->
      <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
        <el-form ref="form" :model="form" :rules="rules" label-width="100px">
          <el-form-item label="角色名称" prop="roleName">
            <el-input v-model="form.roleName" placeholder="请输入角色名称" />
          </el-form-item>
          <el-form-item prop="roleKey">
            <span slot="label">
              <el-tooltip content="控制器中定义的权限字符，如：@PreAuthorize(`@ss.hasRole('admin')`)" placement="top">
                <i class="el-icon-question"></i>
              </el-tooltip>
              权限字符
            </span>
            <el-input v-model="form.roleKey" placeholder="请输入权限字符" />
          </el-form-item>
          <el-form-item label="角色顺序" prop="roleSort">
            <el-input-number v-model="form.roleSort" controls-position="right" :min="0" />
          </el-form-item>
          <el-form-item label="状态">
            <el-radio-group v-model="form.status">
              <el-radio
                v-for="dict in dicts"
                :key="dict.value"
                :label="dict.value"
              >{{dict.label}}</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="菜单权限">
            <el-checkbox v-model="menuExpand" @change="handleCheckedTreeExpand($event, 'menu')">展开/折叠</el-checkbox>
            <el-checkbox v-model="menuNodeAll" @change="handleCheckedTreeNodeAll($event, 'menu')">全选/全不选</el-checkbox>
            <el-checkbox v-model="form.menuCheckStrictly" @change="handleCheckedTreeConnect($event, 'menu')">父子联动</el-checkbox>
            <el-tree
              class="tree-border"
              :data="menuOptions"
              show-checkbox
              ref="menu"
              node-key="id"
              :check-strictly="!form.menuCheckStrictly"
              empty-text="加载中，请稍候"
              :props="defaultProps"
            ></el-tree>
          </el-form-item>
          <el-form-item label="备注">
            <el-input v-model="form.remark" type="textarea" placeholder="请输入内容"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </el-dialog>
    </div>
  </template>
  
  <script>
  import uiHeader from '../layout/UiHeader.vue'
  
  export default {
    name: 'userManager',
    components: {
      uiHeader,
    },
    dicts: ['sys_normal_disable'],
    data() {
      return {
        roleList: [], // 权限列表
        currentUser: {}, // 当前操作设备对象
  
        videoComponentList: [],
        updateLooper: 0, //数据刷新轮训标志
        currentUserLenth: 0,
        winHeight: window.innerHeight - 200,
        currentPage: 1,
        count: 15,
        total: 0,
        getLogListLoading: false,
        // 弹出层标题
        title: "",
        // 是否显示弹出层
        open: false,
        //表单参数
        form:{

        },
        menuExpand: false,
        menuNodeAll: false,
        deptExpand: true,
        deptNodeAll: false,
        // 菜单列表
        menuOptions: [],
        defaultProps: {
          children: "children",
          label: "label"
        },
        dicts:[{
          label:"正常",
          value:"0"
        },{
          label:"停用",
          value:"1"
        }],
        // 表单校验
        rules: {
          roleName: [
            { required: true, message: "角色名称不能为空", trigger: "blur" }
          ],
          roleKey: [
            { required: true, message: "权限字符不能为空", trigger: "blur" }
          ],
          roleSort: [
            { required: true, message: "角色顺序不能为空", trigger: "blur" }
          ]
        },
        leftList:[{
          name:"用户管理",
          url:"/userManager"
        },{
          name:"角色管理",
          url:"/roleManager"
        },{
          name:"菜单管理",
          url:"/menuManager"
        },{
          name:"日志管理",
          url:"/logManager"
        }]
      };
    },
    mounted() {
      this.initData();
      //this.updateLooper = setInterval(this.initData, 10000);
    },
    destroyed() {
      this.$destroy('videojs');
      clearTimeout(this.updateLooper);
    },
    methods: {
      initData: function () {
        this.getLogList();
      },
      // 树权限（展开/折叠）
      handleCheckedTreeExpand(value, type) {
        if (type == 'menu') {
          let treeList = this.menuOptions;
          for (let i = 0; i < treeList.length; i++) {
            this.$refs.menu.store.nodesMap[treeList[i].id].expanded = value;
          }
        } else if (type == 'dept') {
          let treeList = this.deptOptions;
          for (let i = 0; i < treeList.length; i++) {
            this.$refs.dept.store.nodesMap[treeList[i].id].expanded = value;
          }
        }
      },
      // 树权限（全选/全不选）
      handleCheckedTreeNodeAll(value, type) {
        if (type == 'menu') {
          this.$refs.menu.setCheckedNodes(value ? this.menuOptions: []);
        } else if (type == 'dept') {
          this.$refs.dept.setCheckedNodes(value ? this.deptOptions: []);
        }
      },
      // 树权限（父子联动）
      handleCheckedTreeConnect(value, type) {
        if (type == 'menu') {
          this.form.menuCheckStrictly = value ? true: false;
        } else if (type == 'dept') {
          this.form.deptCheckStrictly = value ? true: false;
        }
      },
      currentChange: function (val) {
        this.currentPage = val;
        this.getLogList();
      },
      handleSizeChange: function (val) {
        this.count = val;
        this.getLogList();
      },
      getLogList: function () {
        let that = this;
        this.getLogListLoading = true;
        this.$axios({
          method: 'get',
          url: `/api/log/all`,
          params: {
            page: that.currentPage,
            count: that.count
          }
        }).then(function (res) {
          if (res.data.code === 0) {
            that.total = res.data.data.total;
            that.roleList = res.data.data.list;
          }
          that.getLogListLoading = false;
        }).catch(function (error) {
          that.getLogListLoading  = false;
        });
  
      },
      deleteUser: function (row) {
        let msg = `确定删除${row.roleName}？`
        if (row.online !== 0) {
          msg = `<strong>确定删除${row.roleName}？</strong>`
        }
        this.$confirm(msg, '提示', {
          dangerouslyUseHTMLString: true,
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          center: true,
          type: 'warning'
        }).then(() => {
          this.$axios({
            method: 'delete',
            url: `/api/role/delete?id=${row.id}`
          }).then((res) => {
            this.getLogList();
          }).catch((error) => {
            console.error(error);
          });
        }).catch(() => {
  
        });
  
  
      },
      /** 根据角色ID查询菜单树结构 */
      getRoleMenuTreeselect(roleId) {
        let response = '';
        return this.$axios({
          method:"get",
          url:`/api/menu/roleMenuTreeselect/${roleId}`
        }).then((res)=>{
          this.menuOptions = res.data.data.menus;
          response = res;
          return response
        })
        
      },
      // 角色状态修改
      handleStatusChange(row) {
        let text = row.status === "0" ? "启用" : "停用";
        debugger
        this.$confirm('确认要"' + text + '""' + row.roleName + '"角色吗？').then(()=> {
          //return changeRoleStatus(row.roleId, row.status);
          this.$axios({
            method:"get",
            url:"/api/role/changeStatus",
            params:{
              id:row.id,
              status:row.status
            }
          }).then(() => {
            this.$message({
              showClose: true,
              message: `${text}成功`,
              type: 'success',
            });
          }).catch(()=>{
            row.status = row.status === "0" ? "1" : "0";
          });
        })
      },
      /** 修改按钮操作 */
      handleUpdate(row) {
        this.reset();
        const roleId = row.id || this.ids
        const roleMenu = this.getRoleMenuTreeselect(roleId);
        this.$axios({
          method:"get",
          url:`/api/role/getInfo/${roleId}`
        }).then((response)=>{
           this.form = response.data.data;
           this.open = true;
           this.$nextTick(() => {
            roleMenu.then(res => {
                let checkedKeys = res.data.data.checkedKeys
                checkedKeys.forEach((v) => {
                    this.$nextTick(()=>{
                        this.$refs.menu.setChecked(v, true ,false);
                    })
                })
              });
            });
           this.title = "修改角色";
        })
        // getRole(roleId).then(response => {
        //   this.form = response.data;
        //   this.open = true;
        //   this.$nextTick(() => {
        //     roleMenu.then(res => {
        //       let checkedKeys = res.checkedKeys
        //       checkedKeys.forEach((v) => {
        //           this.$nextTick(()=>{
        //               this.$refs.menu.setChecked(v, true ,false);
        //           })
        //       })
        //     });
        //   });
        //   this.title = "修改角色";
        // });
      },
       /** 新增按钮操作 */
      handleAdd() {
        this.reset();
        this.getMenuTreeselect();
        this.open = true;
        this.title = "添加角色";
      },
      // 取消按钮
      cancel() {
        this.open = false;
        this.reset();
      },
      // 表单重置
      reset() {
        if (this.$refs.menu != undefined) {
          this.$refs.menu.setCheckedKeys([]);
        }
        this.menuExpand = false,
        this.menuNodeAll = false,
        this.deptExpand = true,
        this.deptNodeAll = false,
        this.form = {
          roleId: undefined,
          roleName: undefined,
          roleKey: undefined,
          roleSort: 0,
          status: "0",
          menuIds: [],
          deptIds: [],
          menuCheckStrictly: true,
          deptCheckStrictly: true,
          remark: undefined
        };
        console.log(this.form)
        this.resetForm('form');
      },
      /** 提交按钮 */
      submitForm: function() {
        this.$refs["form"].validate(valid => {
          if (valid) {
            if (this.form.roleId != undefined) {
              this.form.menuIds = this.getMenuAllCheckedKeys();
              this.$axios({
                method:"put",
                url: `/api/role/edit`,
                data: this.form
              }).then(response => {
                //this.$modal.msgSuccess("修改成功");
                this.$message({
                  showClose: true,
                  message: '修改成功',
                  type: 'success',
                });
                this.open = false;
                this.getLogList();
              });
            } else {
              this.form.menuIds = this.getMenuAllCheckedKeys();
              this.$axios({
                method:"post",
                url:"/api/role/add",
                data: this.form
              }).then(response => {
                // this.$modal.msgSuccess("新增成功");
                this.$message({
                  showClose: true,
                  message: '新增成功',
                  type: 'success',

                });
                this.open = false;
                this.getLogList();
              });
            }
          }
        });
      },
      getMenuAllCheckedKeys() {
        // 目前被选中的菜单节点
        let checkedKeys = this.$refs.menu.getCheckedKeys();
        // 半选中的菜单节点
        let halfCheckedKeys = this.$refs.menu.getHalfCheckedKeys();
        checkedKeys.unshift.apply(checkedKeys, halfCheckedKeys);
        return checkedKeys;
      },
       /** 查询菜单树结构 */
      getMenuTreeselect() {
        this.$axios({
          method: 'get',
          url: `/api/menu/treeselect`,
        }).then((res)=>{
          debugger
          if(res.data.code==0){
            this.menuOptions = res.data.data;
          }
        }).catch(()=>{
          
        })
      },
    }
  }
  </script>
  <style>
  .videoList {
    display: flex;
    flex-wrap: wrap;
    align-content: flex-start;
  }
  .tree-border {
    margin-top: 5px;
    border: 1px solid #e5e6e7;
    background: #FFFFFF none;
    border-radius:4px;
    width: 100%;
}
  .video-item {
    position: relative;
    width: 15rem;
    height: 10rem;
    margin-right: 1rem;
    background-color: #000000;
  }
  
  .video-item-img {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    margin: auto;
    width: 100%;
    height: 100%;
  }
  
  .video-item-img:after {
    content: "";
    display: inline-block;
    position: absolute;
    z-index: 2;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    margin: auto;
    width: 3rem;
    height: 3rem;
    background-image: url("../assets/loading.png");
    background-size: cover;
    background-color: #000000;
  }
  
  .video-item-title {
    position: absolute;
    bottom: 0;
    color: #000000;
    background-color: #ffffff;
    line-height: 1.5rem;
    padding: 0.3rem;
    width: 14.4rem;
  }
  .leftchoose{
  width: calc(10% - 20px);
  margin-right: 20px;
  min-height: 100%;
  
}
.box-card{
    height: 100%;
}
.flex{
  display: flex;
}
.box-card-text {
    font-size: 14px;
}

.box-card-item {
  padding: 18px 0;
}
  </style>
  