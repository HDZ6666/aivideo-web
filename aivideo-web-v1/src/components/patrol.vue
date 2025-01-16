<template>
    <div class="container">
        <div class="menu-container">
            <el-menu class="el-menu-demo custom-menu" mode="vertical" default-active="1">
                <div class="menu-title" style="text-align: center; font-size: 20px; padding: 20px 0px;">
                    <span>智慧</span><span>巡逻</span>
                </div>
                <el-menu-item index="1">
                    <template slot="title"> 
                        <div @click.prevent="currentComponent='patrolManagerVue'">
                            <el-icon class="el-icon-setting" color="#000"></el-icon>
                            <span>任务管理</span>
                        </div>
                        
                    </template>
                   
                    <!-- <router-link to="/patrol" @click.prevent="currentComponent='patrolManagerVue'">任务管理</router-link> -->
                    
                </el-menu-item>
                <el-menu-item index="2">
                    <template slot="title"> 
                        <div @click.prevent="currentComponent='patrolReportVue'">
                            <el-icon class="el-icon-document"></el-icon>
                            <span>巡逻结果</span>
                        </div>
                        
                    </template>
                   
                    <!-- <router-link to="/patrolReport" @click.prevent="currentComponent='patrolReportVue'">巡逻结果</router-link> -->
                    
                </el-menu-item>
            </el-menu>
        </div>
        <div class="manager-container">
            <!-- <router-view>
            </router-view> -->
            <component :is="currentComponent">

            </component>
        </div>
    </div>
</template>

<script>
import patrolManagerVue from './patrolManager.vue';
import patrolReportVue from './patrolReport.vue';
export default {
    name: 'patrol',
    components:{
        patrolManagerVue,
        patrolReportVue
    },
    data(){
        return{
            currentComponent:"patrolManagerVue",
            menuList:[{
                name:"任务管理",
                className:"el-icon-setting",
                component:'patrolManagerVue',
                color:"#000"
            },{
                name:"巡逻结果",
                className:"el-icon-document",
                component:'patrolReportVue',
                color:""
            }]
        }
    }
};
</script>

<style scoped>
.container {
    display: flex;
    align-items: stretch;
    padding: 10px;
    height: 100%;
    background-color: #f5f7fa;
}

.menu-container {
    background-color: #ffffff;
    padding: 0;
    border-right: 1px solid #dcdcdc;
    box-shadow: 4px 0 10px rgba(0, 0, 0, 0.1);
    width: 180px;
}

.custom-menu {
    background-color: transparent;
    border: none;
}

.menu-title {
    font-weight: 700;
    padding: 20px;
    text-align: center;
    border-bottom: 1px solid #dcdcdc;
    background-color: #f9f9f9;
}
.menu-title span:first-child {
    color: #0782fe;
}

.el-menu-item, .el-submenu__title {
    color: #666;
    transition: color 0.3s, border-left-color 0.3s, background-color 0.3s;
    padding: 18px 20px;
    line-height: 24px;
    font-size: 16px;
}

.el-menu-item .el-icon, .el-submenu__title .el-icon {
    font-size: 16px;
    margin-right: 20px;
}

.el-menu-item.is-active i {
    color: #000;
}
.el-menu-item.is-active span {
    color: #409eff;
}
.el-menu-item span {
    color: #000;
}
.el-menu-item.is-active,
.el-submenu.is-opened .el-submenu__title,
.el-menu-item:hover,
.el-submenu__title:hover {
    color: #fff;
    background-color: #d5e9fd;
    border-left: 4px solid #409eff;
}

.el-menu-item .router-link, .el-submenu__title .router-link {
    color: inherit;
    display: block;
}

.el-menu-item a.router-link-exact-active,
.el-menu-item a.router-link-active,
.el-submenu__title a.router-link-exact-active,
.el-submenu__title a.router-link-active {
    text-decoration: none !important;
    color: #409eff;
}

.el-menu-item a:not(.router-link-exact-active):not(.router-link-active), 
.el-submenu__title a:not(.router-link-exact-active):not(.router-link-active) {
    color: #000;
    text-decoration: none;
}

.manager-container {
    flex-grow: 1;
    flex-basis: 0;
    display: flex;
    flex-direction: column;
    padding: 20px;
    background-color: #ffffff;
    box-shadow: -2px 0 5px rgba(0, 0, 0, 0.1);
    border-radius: 0 10px 10px 0;
    overflow-y: auto;
    margin-left: 10px;
}
</style>
