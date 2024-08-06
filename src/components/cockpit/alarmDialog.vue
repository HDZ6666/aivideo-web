<template>
  <transition
    enter-active-class="animate__animated animate__fadeInTopRight"
    leave-active-class="animate__animated animate__fadeOutBottomLeft"
  >
    <div v-if="dialogObj.showDialog" class="alarm-dialog">
      <div class="close-box">
        <span v-if="!dialogObj.showClose">{{ dialogObj.count }}</span>
        <i v-else class="el-icon-close" @click="handleClose"></i>
      </div>
      <dv-border-box-11
        class="dialog-border"
        :title="dialogObj.showAlarmObj.modelname"
        backgroundColor="rgba(67,79,103,0.9)"
      >
        <div
          class="dialog-content"
          v-loading="dialogObj.handleLoading"
          element-loading-background="rgba(0, 0, 0, 0.4)"
        >
          <div class="content-left">
            <dv-decoration-2 style="width:350px;height:5px;" />
            <div class="img-box" id="alarmImg">
              <!-- <img
              :src="item.alarmImg"
              alt
              v-for="item in dialogObj.alarmShowList"
              :key="item.id"
              style="width: 100%; height: 100%;object-fit: contain;"
              v-show="item.id === dialogObj.showAlarmObj.id"
              />-->
              <img
                :src="dialogObj.showAlarmObj.alarmImg"
                alt
                style="width: 100%; height: 100%;object-fit: contain;"
                fit="contain"
              />
              <!-- <el-image
              style="width: 100%; height: 100%"
              :src="dialogObj.showAlarmObj.alarmImg"
              fit="contain"
              ></el-image>-->
            </div>
          </div>
          <dv-decoration-2 :reverse="true" style="width:5px;height:300px;" />
          <div class="medium-content">
            <dv-decoration-3 style="width:250px;height:30px;" />
            <el-descriptions :column="1" size="medium">
              <el-descriptions-item label="告警时间">{{ dialogObj.showAlarmObj.alarmTime || '' }}</el-descriptions-item>
              <el-descriptions-item label="分组名称">某大厦</el-descriptions-item>
              <el-descriptions-item label="设备名称">{{ dialogObj.showAlarmObj.deviceName }}</el-descriptions-item>
              <el-descriptions-item label="告警ID">{{ dialogObj.showAlarmObj.alarmId }}</el-descriptions-item>
              <el-descriptions-item label="置信度">95%</el-descriptions-item>
              <el-descriptions-item label="处理情况">
                <el-tag size="small" :color="{ 0: '#F56C6C', 1: '#67C23A', 2: '#E6A23C' }[dialogObj.showAlarmObj.status]" effect="dark" class="handleStatus"> {{ { 0: '未处理', 1: '已处理', 2: '误报' }[dialogObj.showAlarmObj.status]}}</el-tag>
              </el-descriptions-item>
              <el-descriptions-item label="通知人员">
                <div class="notifePeople-box">
                  <el-tag size="small" class="notifePeople">曾广在</el-tag>
                  <el-tag size="small" class="notifePeople">吴广</el-tag>
                </div>
              </el-descriptions-item>
            </el-descriptions>
            <div class="handleButtons">
              <dv-border-box-8 class="handleButton">
                <div @click=" (1)">处理</div>
              </dv-border-box-8>
              <dv-border-box-8 class="handleButton" :reverse="true">
                <div @click="handleState(2)">误报</div>
              </dv-border-box-8>
            </div>
          </div>
        </div>
      </dv-border-box-11>
    </div>
  </transition>
</template>

<script>
import moment from "moment";
import { mixin } from "../../utils/mixin";
export default {
  name: "alarmDialog",
  mixins: [mixin],
  data() {
    return {
      dialogObj: {
        showDialog: false, // 是否显示
        // 告警数据
        requestTimer: null, // 告警请求定时器
        page: 1, // 当前页
        pageSize: 9999, // 每页条数
        total: 0, // 总条数
        getListLoading: false, // 是否加载中
        alarmShowList: [], // 远程加载全部告警列表
        alarmMap: {}, // 告警数据对象,用于判断是否重复
        // 弹窗
        domTimer: null, // 弹窗定时器
        showTime: 10, // 弹窗显示时间
        hideTime: 3, // 弹窗隐藏时间
        showAlarmObj: {}, // 当前显示的告警对象
        // 倒计时
        countDownTimer: null, // 倒计时定时器
        count: 0, // 倒计时
        handleLoading: false, // 处理中
        showClose: false // 是否显示关闭
        // showTimes: 0
      }
    };
  },
  watch: {
    alarmNotify: {
      handler(newVal, oldVal) {
        console.log(newVal);
        if (newVal) {
          this.getAlarmList();
          this.handleShowDialog();
        } else {
          clearTimeout(this.dialogObj.domTimer);
          clearInterval(this.dialogObj.countDownTimer);
          clearInterval(this.dialogObj.requestTimer);
          this.dialogObj.showDialog = false;
          this.resetAlarmListState(); // 重置告警状态
        }
      },
      immediate: true
    }
  },
  methods: {
    getAlarmList() {
      const dialogObj = this.dialogObj;
      if (!dialogObj.getListLoading) {
        dialogObj.getListLoading = true;
        this.$axios({
          method: "get",
          url: `/ai/api/alarm/alarmCameraListAll`,
          params: {
            page: this.dialogObj.page,
            pageSize: this.dialogObj.pageSize,
            status: 0, // 未处理
            todayTime: moment(new Date()).format("YYYY-MM-DD") // 今天
          }
        })
          .then(res => {
            if (res.data.code === 0) {
              const { list } = res.data.data;
              const _list = [];
              list.forEach(item => {
                if (!dialogObj.alarmMap.hasOwnProperty(item.id)) {
                  item.showDialog = false;
                  dialogObj.alarmMap[item.id] = item;
                  _list.push(item);
                  // if (!item.imgload && item.alarmImg) {
                  //   item.img = new Image();
                  //   item.img.onload = function() {
                  //     console.log(item.img)
                  //     item.imgload = true;
                  //   };
                  //   item.img.src = item.alarmImg;
                  // }
                }
              });
              dialogObj.alarmShowList = [..._list, ...dialogObj.alarmShowList];
            }
          })
          .finally(() => {
            dialogObj.getListLoading = false;
          });
      }
      if (dialogObj.requestTimer) clearInterval(this.dialogObj.requestTimer);
      dialogObj.requestTimer = setInterval(() => {
        this.getAlarmList();
      }, 5000);
    },
    handleShowDialog() {
      const dialogObj = this.dialogObj;
      let _timeout = 1; // 默认1秒检测一次
      if (dialogObj.alarmShowList.length === 0) {
        dialogObj.showDialog = false; //展示的长度没有就关闭弹窗
        _timeout = 1; //没有数组的话 1秒检测一次
      } else {
        if (dialogObj.showDialog) {
          if (dialogObj.countDownTimer) clearInterval(dialogObj.countDownTimer);
          if (dialogObj.alarmShowList.every(item => item.showDialog)) {
            // 全部都展示过就重置
            this.resetAlarmListState();
          }
          _timeout = dialogObj.hideTime;
          this.dialogObj.showDialog = false;
        } else {
          const showItem = dialogObj.alarmShowList.filter(
            item => !item.showDialog
          )[0]; // 拿第一个没有展示的值
          _timeout = 0.5; // 500毫秒检测一次看图片加载完没有
          // 图片已经加载了
          if (showItem) {
            _timeout = dialogObj.showTime;
            showItem.showDialog = true; // 开始展示
            dialogObj.showAlarmObj = showItem;
            this.countDown(_timeout);
            this.dialogObj.showDialog = true;
          }
        }
      }
      if (dialogObj.domTimer) clearTimeout(dialogObj.domTimer);
      dialogObj.domTimer = setTimeout(() => {
        this.handleShowDialog();
      }, _timeout * 1000);
    },
    resetAlarmListState() {
      this.dialogObj.alarmShowList.map(item => {
        item.showDialog = false;
        return item;
      });
    },
    countDown(time) {
      const dialogObj = this.dialogObj;
      dialogObj.count = time;
      dialogObj.showClose = false;
      if (dialogObj.countDownTimer) clearInterval(dialogObj.countDownTimer);
      dialogObj.countDownTimer = setInterval(() => {
        dialogObj.count--;
      }, 1000);
    },
    handleClose() {
      if (this.dialogObj.handleLoading) {
        this.$message.info("请等待处理完成");
      } else {
        this.handleShowDialog();
      }
    },
    handleState(state) {
      // console.log(state);
      const dialogObj = this.dialogObj;
      dialogObj.showClose = true;
      const ID = dialogObj.showAlarmObj.id;
      if (dialogObj.domTimer) clearTimeout(dialogObj.domTimer); //清除当前的定时器
      if (dialogObj.countDownTimer) clearInterval(dialogObj.countDownTimer); //清除当前的定时器
      dialogObj.handleLoading = true;
      this.$axios({
        method: "get",
        url: `/ai/api/alarm/handle`,
        params: {
          alarmId: ID,
          status: state
        }
      })
        .then(res => {
          if (res.data.code === 0) {
            const list = dialogObj.alarmShowList.filter(item => item.id !== ID);
            dialogObj.alarmShowList = [...list];
            delete dialogObj.alarmMap[ID];
            this.$message.success("处理成功");
            this.handleShowDialog();
          } else {
            this.$message.error(e.msg || "处理失败");
          }
        })
        .catch(error => {
          this.$message.error(error.message || "处理失败");
        })
        .finally(() => {
          dialogObj.handleLoading = false;
        });
    }
  },
  destroyed() {
    clearTimeout(this.dialogObj.domTimer);
    clearInterval(this.dialogObj.countDownTimer);
    clearInterval(this.dialogObj.requestTimer);
  }
};
</script>

<style scoped>
.alarm-dialog {
  position: absolute;
  width: 800px;
  height: 500px;
  inset: 0;
  margin: auto;
  z-index: 9999;
  /* border-radius: 10px; */
}

.close-box {
  width: 40px;
  height: 40px;
  position: absolute;
  right: 2px;
  top: 12px;
  text-align: center;
  line-height: 40px;
  color: #fff;
  font-size: 20px;
  font-weight: bold;
  border-radius: 50%;
  border: 2px solid #809fe9;
  background: #434f67;
  cursor: pointer;
  z-index: 777;
}

.dialog-border {
  width: 100%;
  height: 100%;
  padding: 60px 20px 20px;
  position: relative;
  box-sizing: border-box;
}

.dialog-content {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
}
.content-left {
  margin-right: 30px;
}

.img-box {
  width: 400px;
  height: 350px;
  background: #000;
  margin-top: 10px;
}

.medium-content {
  flex: 1;
  display: inline-block;
  margin-left: 30px;
}
.handleStatus {
  color: #fff;
}

.notifePeople-box {
  flex: 1;
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
}
.notifePeople {
  margin-right: 5px;
  margin-bottom: 5px;
  color: #000;
}

.handleButtons {
  position: absolute;
  bottom: 20px;
  right: 20px;
  width: 300px;
  display: flex;
  justify-content: flex-end;
  color: #fff;
}

.handleButton {
  width: 100px;
  height: 40px;
  line-height: 40px;
  text-align: center;
  margin-left: 20px;
  cursor: pointer;
}

.medium-content /deep/ .el-descriptions__body {
  color: #fff;
  background: transparent;
}
</style>
