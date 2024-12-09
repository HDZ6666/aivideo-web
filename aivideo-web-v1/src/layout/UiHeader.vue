<template>
  <div id="UiHeader" style="text-align: left">
    <el-menu
      router
      :default-active="activeIndex"
      background-color="#001529"
      text-color="#fff"
      active-text-color="#1890ff"
      mode="horizontal"
      style="display: flex"
    >
      <sidebar-item
        v-for="(route, index) in sidebarRouters"
        :key="route.path + index"
        :item="route"
        :base-path="route.path"
      />
      <!-- <el-submenu>
        <template slot="title">数据大屏</template>
        <el-menu-item index="/videoCockpitV1">V1</el-menu-item>
        <el-menu-item index="/videoCockpitV2">V2</el-menu-item>
      </el-submenu>
      <el-menu-item index="/aiView" v-if="aiType">AI视界</el-menu-item>
      <el-menu-item index="/live">分屏监控</el-menu-item>
      <el-submenu index="1">
        <template slot="title">国标对接</template>
        <el-menu-item index="/deviceList">设备列表</el-menu-item>
        <el-menu-item index="/deviceGroup">分组</el-menu-item>
      </el-submenu>
      <el-menu-item index="/streamProxyList">非国标对接</el-menu-item>
      <el-submenu index="3">
        <template slot="title">系统管理</template>
        <el-menu-item index="/console">控制台</el-menu-item>
        <el-menu-item index="/cloudRecord">云端录像</el-menu-item>
        <el-menu-item index="/mediaServerManger">节点管理</el-menu-item>
        <el-menu-item index="/parentPlatformList/15/1">国标级联</el-menu-item>
        <el-menu-item index="/userManager">用户管理</el-menu-item>
        <el-menu-item index="/roleManager">角色管理</el-menu-item>
        <el-menu-item index="/menuManager">菜单管理</el-menu-item>
        <el-menu-item index="/logManager">日志管理</el-menu-item>
      </el-submenu> -->
      <el-submenu index style="float: right; position: absolute; right: 0px">
        <template slot="title">欢迎，{{ username }}</template>
        <el-menu-item @click="openDoc">在线文档</el-menu-item>
        <el-menu-item @click="changePassword">修改密码</el-menu-item>
        <el-menu-item @click.native="setting = true">布局设置</el-menu-item>
        <el-menu-item @click="loginout">注销</el-menu-item>
      </el-submenu>
    </el-menu>
    <changePasswordDialog ref="changePasswordDialog"></changePasswordDialog>
  </div>
</template>

<script>
import { Notification } from "element-ui";
import { mapGetters } from "vuex";
import changePasswordDialog from "../components/dialog/changePassword.vue";
import userService from "../components/service/UserService";
import { mixin } from "../utils/mixin";
import SidebarItem from "./SidebarItem";
export default {
  name: "UiHeader",
  components: { Notification, changePasswordDialog, SidebarItem },
  mixins: [mixin],
  data() {
    const user = userService.getUser() || {};
    return {
      window: null,
      sseSource: null,
      username: user.username || "",
      activeIndex: this.$route.path,
      editUser: user.role ? user.role.id === 1 : false,
    };
  },
  computed: {
    ...mapGetters(["sidebarRouters", "sidebar"]),
    setting: {
      get() {
        return this.$store.state.settings.showSettings;
      },
      set(val) {
        this.$store.dispatch("settings/changeSetting", {
          key: "showSettings",
          value: val,
        });
      },
    },
  },
  created() {
    // console.log(JSON.stringify(userService.getUser()));
    if (this.$route.path.startsWith("/channelList")) {
      this.activeIndex = "/deviceList";
    }
  },
  mounted() {
    // console.log(!localStorage.getItem("alarmSwitchStatus"));
    console.log(this.sidebarRouters);
    // debugger
    console.log(localStorage.getItem("alarmSwitchStatus"));
    // this.window = window;
    // window.addEventListener("beforeunload", e => this.beforeunloadHandler(e));
    // this.alarmNotify = this.getAlarmSwitchStatus() === "true";
    // // TODO: 此处延迟连接 sse, 避免 sse 连接时 browserId 还未生成, 后续待优化
    // setTimeout(() => {
    //   this.sseControl();
    // }, 3000);
  },
  methods: {
    loginout() {
      this.$axios({
        method: "get",
        url: "/api/user/logout",
      })
        .then((res) => {
          // 删除用户信息，回到登录页面
          userService.clearUserInfo();
          this.$store.dispatch("LogOut");
          this.$router.push("/login");
          if (this.sseSource != null) {
            this.sseSource.close();
          }
        })
        .catch((error) => {
          console.error("登出失败");
          console.error(error);
        });
    },
    changePassword() {
      this.$refs.changePasswordDialog.openDialog();
    },
    openDoc() {
      console.log("url:" + process.env.BASE_API);
      // window.open(!!process.env.BASE_API ? process.env.BASE_API + "/doc.html" : "/doc.html")
      window.open(
        !!process.env.BASE_API
          ? process.env.BASE_API + "/doc.html"
          : "/doc.html"
      );
    },
    alarmNotifyChannge() {
      localStorage.setItem("alarmSwitchStatus", this.alarmNotify);
      this.$message.success(
        `${this.alarmNotify ? "开启" : "关闭"}订阅告警成功`
      );
    },
    // beforeunloadHandler() {
    //   this.sseSource.close();
    // },
    // alarmNotifyChannge() {
    //   this.setAlarmSwitchStatus();
    //   this.sseControl();
    // },
    // sseControl() {
    //   let that = this;
    //   if (this.alarmNotify) {
    //     console.log("申请SSE推送API调用，浏览器ID: " + this.$browserId);
    //     this.sseSource = new EventSource(
    //       "/api/emit?browserId=" + this.$browserId
    //     );
    //     this.sseSource.addEventListener("message", function(evt) {
    //       that.$notify({
    //         title: "报警信息",
    //         dangerouslyUseHTMLString: true,
    //         message: evt.data,
    //         type: "warning",
    //         position: "bottom-right",
    //         duration: 3000
    //       });
    //       console.log("收到信息：" + evt.data);
    //     });
    //     this.sseSource.addEventListener(
    //       "open",
    //       function(e) {
    //         console.log("SSE连接打开.");
    //       },
    //       false
    //     );
    //     this.sseSource.addEventListener(
    //       "error",
    //       function(e) {
    //         if (e.target.readyState == EventSource.CLOSED) {
    //           console.log("SSE连接关闭");
    //         } else {
    //           console.log(e.target.readyState);
    //         }
    //       },
    //       false
    //     );
    //   } else {
    //     if (this.sseSource != null) {
    //       this.sseSource.removeEventListener("open", null);
    //       this.sseSource.removeEventListener("message", null);
    //       this.sseSource.removeEventListener("error", null);
    //       this.sseSource.close();
    //     }
    //   }
    // },
    // getAlarmSwitchStatus() {
    //   if (localStorage.getItem("alarmSwitchStatus") == null) {
    //     localStorage.setItem("alarmSwitchStatus", false);
    //   }
    //   return localStorage.getItem("alarmSwitchStatus");
    // },
    // setAlarmSwitchStatus() {
    //   localStorage.setItem("alarmSwitchStatus", this.alarmNotify);
    // }
  },
  // destroyed() {
  //   window.removeEventListener("beforeunload", e =>
  //     this.beforeunloadHandler(e)
  //   );
  //   if (this.sseSource != null) {
  //     this.sseSource.removeEventListener("open", null);
  //     this.sseSource.removeEventListener("message", null);
  //     this.sseSource.removeEventListener("error", null);
  //     this.sseSource.close();
  //   }
  // }
};
</script>
<style>
#UiHeader .el-switch__label {
  color: white;
}
.el-menu--popup .el-menu-item .el-switch .el-switch__label {
  color: white !important;
}

/* #UiHeader .el-switch__label.is-active {
  color: #409eff;
}

#UiHeader .el-menu-item.is-active {
  color: #fff !important;
  background-color: #1890ff !important;
} */
</style>
