<template>
  <div class="alarmCarousel-container">
    <el-carousel :interval="3000" type="card" height="180px" indicator-position="none">
      <el-carousel-item v-for="item in 6" :key="item">
        <div class="medium">
          <div class="img-box"></div>
          <div class="medium-content">
            <el-descriptions :column="1" size="mini">
              <el-descriptions-item label="告警时间">2024-1-10 10:55:22</el-descriptions-item>
              <el-descriptions-item label="告警地点">佛山中医院</el-descriptions-item>
              <el-descriptions-item label="告警类型">人脸识别</el-descriptions-item>
              <el-descriptions-item label="处理情况">
                <el-tag size="small">待处理</el-tag>
              </el-descriptions-item>
              <el-descriptions-item label="处理情况">
                <el-button size="mini" type="danger">待处理</el-button>
              </el-descriptions-item>
            </el-descriptions>
          </div>
        </div>
      </el-carousel-item>
    </el-carousel>
  </div>
</template>

<script>
export default {
  name: "alarmCarousel"
};
</script>

<style scoped>
.alarmCarousel-container {
  width: 100%;
  height: 180px;
}

.alarmCarousel-container /deep/.el-carousel__item h3 {
  color: #475669;
  font-size: 14px;
  opacity: 0.75;
  line-height: 200px;
  margin: 0;
}
.alarmCarousel-container /deep/ .el-descriptions__body {
  color: #fff;
  background: transparent;
}

.medium {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  box-sizing: border-box;
  justify-content: center;
  align-items: center;
  background: #486487;
  padding: 5px;
}
.img-box {
  width: 150px;
  height: 150px;
  background: #000;
  background-image: url("/static/images/catch.jpg");
  background-size: 100% 100%;
  background-repeat: no-repeat;
}
.medium-content {
  flex: 1;
  display: inline-block;
  margin-left: 10px;
}
</style>
