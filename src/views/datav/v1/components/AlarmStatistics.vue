<template>
    <div class="box box1">
        <div class="box-header">
            <span class="box-title">告警统计</span>
            <span class="box-more" @click="handleMoreClick">详情</span>
        </div>
        <div class="box-content">
            <div class="warn_stat_box" v-for="(item, index) in statistics" :key="index">
                <div class="warn_stat_title">
                    <img src="@/assets/datav/v1/warnstat1.png" alt="" />
                    <span class="title title1">{{ item.alarmTypeName }}</span>
                </div>
                <div class="warn_stat">
                    <div class="warn_stat_content">
                        <div class="warn_frame">
                            <p>{{ item.curDateAlarmCount }}</p>
                            <span>当日告警数</span>
                        </div>
                        <div class="warn_frame">
                            <p class="untreated">{{ item.curDateAlarmNoHandleCount }}</p>
                            <span>当日未处理</span>
                        </div>
                        <div class="warn_frame">
                            <p>{{ item.sevenDayAlarmCount }}</p>
                            <span>近7天告警数</span>
                        </div>
                        <div class="warn_frame">
                            <p>{{ item.sevenDayAlarmNoHandleCount }}</p>
                            <span>近7天未处理</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>


    </div>
</template>

<script setup>
import { ref } from 'vue'


defineProps({
    statistics: {
        type: Array,
        default: () => []
    }
})


const emit = defineEmits(['more-click', 'show-detail'])


const handleMoreClick = () => {
    emit('more-click')
}
</script>

<style lang="scss" scoped>
.box {
    position: relative;
    background: url("@/assets/datav/v1/card_box_bg.png") no-repeat center;
    background-size: 100% 100%;
    display: flex;
    flex-direction: column;
}

.box1 {
    flex: 1.5;
}

.box-header {
    position: relative;
    width: 100%;
    height: 45px;
    background: url("@/assets/datav/v1/card_title_bg.png") no-repeat center;
    background-size: 100% 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-left: 40px;
    box-sizing: border-box;

    &::before {
        content: '';
        position: absolute;
        width: 21px;
        height: 27px;
        top: 10px;
        left: 10px;
        background: url("@/assets/datav/v1/box_title_icon.png") no-repeat;
        background-size: 100% 100%;
    }
}

.box-title {
    color: #fff;
    text-shadow: 0px 0px 4px rgba(21, 142, 255, 0.70);
    font-family: ysbthFont;
    font-size: 21px;
    font-weight: 400;
}

.box-more {
    color: #7cbfff;
    font-family: "PingFang SC";
    font-size: 17px;
    font-weight: 400;
    padding-right: 10px;
    cursor: pointer;

    &:hover {
        color: #fff;
    }
}

.box-content {
    position: absolute;
    top: 50px;
    bottom: 10px;
    left: 10px;
    right: 10px;
    overflow: hidden;
}

.warn_stat_box {
    width: 100%;
    height: 50%;
}

.warn_stat_title {
    height: 40%;
    display: flex;
    align-items: center;

    img {
        width: 23px;
    }

    .title {
        font-family: ysbthFont;
        font-weight: 400;
        font-size: 19px;
        padding-top: 4px;
        padding-left: 15px;
        letter-spacing: 0.04em;
    }

    .title1 {
        background: linear-gradient(180deg, #ffa06b 0%, #ff3426 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
    }
}

.warn_stat {
    position: relative;
    padding: 19px;
    width: 100%;
    height: 60%;
    background: linear-gradient(90deg, #0953bc 0%, #042656 100%);
}

.warn_stat_content {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: space-between;
}

.warn_frame {
    width: 25%;
    display: flex;
    align-items: center;
    flex-direction: column;
    justify-content: center;

    p {
        color: #00a0e9;
        font-family: DINPro, sans-serif;
        font-size: 25px;
        font-weight: 700;
        line-height: 29px;
        margin: 0;
    }

    p.untreated {
        color: #ff6b6b;
    }

    span {
        color: #c6d1db;
        font-size: 15px;
    }
}

.warn_stat::before,
.warn_stat::after,
.warn_stat_content::before,
.warn_stat_content::after {
    content: "";
    position: absolute;
    width: 12px;
    height: 12px;
}

.warn_stat::before {
    top: 0;
    left: 0;
    border-top: 1px solid #00d4ff;
    border-left: 1px solid #00d4ff;
}

.warn_stat::after {
    top: 0;
    right: 0;
    border-top: 1px solid #00d4ff;
    border-right: 1px solid #00d4ff;
}

.warn_stat_content::before {
    bottom: 0;
    right: 0;
    border-bottom: 1px solid #00d4ff;
    border-right: 1px solid #00d4ff;
}

.warn_stat_content::after {
    bottom: 0;
    left: 0;
    border-bottom: 1px solid #00d4ff;
    border-left: 1px solid #00d4ff;
}
</style>
