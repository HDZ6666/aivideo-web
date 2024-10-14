<template>
    <div class="navbar">
        <!-- 左侧菜单栏控制按钮 -->
        <hamburger
            id="hamburger-container"
            :is-active="appStore.sidebar.opened"
            class="hamburger-container"
            @toggleClick="toggleSideBar"
            v-show="isShow"
        />
        <!-- 面包屑 -->
        <breadcrumb id="breadcrumb-container" class="breadcrumb-container" v-if="!settingsStore.topNav" />
        <top-nav id="topmenu-container" class="topmenu-container" v-if="settingsStore.topNav" />
        <!-- <div class="popular-text">
            欢迎使用管理系统，现在时间：{{ formatDate(new Date()) }}
        </div> -->

        <div class="right-menu">
        <template v-if="appStore.device !== 'mobile'">
            <header-search id="header-search" class="right-menu-item" />

            <!-- <el-tooltip content="源码地址" effect="dark" placement="bottom">
            <ruo-yi-git id="ruoyi-git" class="right-menu-item hover-effect" />
            </el-tooltip>

            <el-tooltip content="文档地址" effect="dark" placement="bottom">
            <ruo-yi-doc id="ruoyi-doc" class="right-menu-item hover-effect" />
            </el-tooltip> -->

            <screenfull id="screenfull" class="right-menu-item hover-effect" />

            <el-tooltip content="布局大小" effect="dark" placement="bottom">
            <size-select id="size-select" class="right-menu-item hover-effect" />
            </el-tooltip>
        </template>
            <div class="avatar-container">
                <el-dropdown
                    @command="handleCommand"
                    class="right-menu-item hover-effect"
                    trigger="click"
                >
                    <div class="avatar-wrapper flex-center flex-middle">
                        <img :src="userStore.avatar" class="user-avatar" />
                        <div class="flex-column ml10">
                            <span class="nickname">admin</span>
                            <span class="role-label">系统管理员</span>
                        </div>
                        <!-- <el-icon><caret-bottom /></el-icon> -->
                    </div>
                    <template #dropdown>
                        <el-dropdown-menu>
                            <router-link to="/user/profile">
                                <el-dropdown-item>个人中心</el-dropdown-item>
                            </router-link>
                            <el-dropdown-item
                                command="setLayout"
                                v-if="settingsStore.showSettings"
                            >
                                <span>布局设置</span>
                            </el-dropdown-item>
                            <el-dropdown-item divided command="logout">
                                <span>退出登录</span>
                            </el-dropdown-item>
                        </el-dropdown-menu>
                    </template>
                </el-dropdown>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ElMessageBox } from 'element-plus';
import Breadcrumb from '@/components/Breadcrumb';
import TopNav from '@/components/TopNav';
import Hamburger from '@/components/Hamburger';
import Screenfull from '@/components/Screenfull';
import SizeSelect from '@/components/SizeSelect';
import HeaderSearch from '@/components/HeaderSearch';
import RuoYiGit from '@/components/RuoYi/Git';
import RuoYiDoc from '@/components/RuoYi/Doc';
import useAppStore from '@/store/modules/app';
import useUserStore from '@/store/modules/user';
import useSettingsStore from '@/store/modules/settings';
import { formatDate } from '@/utils/index';

const appStore = useAppStore();
const userStore = useUserStore();
const settingsStore = useSettingsStore();
const isShow = ref(import.meta.env.MODE === 'development');
function toggleSideBar() {
    appStore.toggleSideBar();
}

function handleCommand(command) {
    switch (command) {
        case 'setLayout':
            setLayout();
            break;
        case 'logout':
            logout();
            break;
        default:
            break;
    }
}

function logout() {
    ElMessageBox.confirm('确定注销并退出系统吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
    })
        .then(() => {
            userStore.logOut().then(() => {
                location.href = '/admin/#/index';
            });
        })
        .catch(() => {});
}

const emits = defineEmits(['setLayout']);
function setLayout() {
    emits('setLayout');
}
</script>

<style lang="scss" scoped>
.navbar {
    height: 74px;
    overflow: hidden;
    position: relative;
    background: #fff;
    box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
    padding: 10px;

    .hamburger-container {
        line-height: 54px;
        height: 100%;
        float: left;
        cursor: pointer;
        transition: background 0.3s;
        -webkit-tap-highlight-color: transparent;

        &:hover {
            background: rgba(0, 0, 0, 0.025);
        }
    }
    .popular-text {
        height: 100%;
        line-height: 54px;
        float: left;
        margin-left: 6px;
        color: rgba(32, 34, 42, 0.8);
        font-family: PingFang SC;
        font-size: 16px;
        letter-spacing: 5px;
    }

    .breadcrumb-container {
        float: left;
    }

    .topmenu-container {
        position: absolute;
        left: 50px;
    }

    .errLog-container {
        display: inline-block;
        vertical-align: top;
    }

    .right-menu {
        float: right;
        height: 100%;
        line-height: 54px;
        display: flex;

        &:focus {
            outline: none;
        }

        .right-menu-item {
            display: inline-block;
            padding: 0 8px;
            height: 100%;
            font-size: 18px;
            color: #5a5e66;
            vertical-align: text-bottom;

            &.hover-effect {
                cursor: pointer;
                transition: background 0.3s;

                &:hover {
                    background: rgba(0, 0, 0, 0.025);
                }
            }
        }

        .avatar-container {
            margin-right: 36px;

            .avatar-wrapper {
                // margin-top: 5px;
                height: 54px;
                position: relative;

                .user-avatar {
                    cursor: pointer;
                    width: 38px;
                    height: 38px;
                    border-radius: 19px;
                }

                i {
                    cursor: pointer;
                    position: absolute;
                    right: -20px;
                    top: 25px;
                    font-size: 12px;
                }
                .nickname {
                    color: #1c1a1f;
                    font-family: PingFang SC;
                    font-size: 18px;
                    line-height: 26px;
                }
                .role-label {
                    display: inline-block;
                    height: 20px;
                    border-radius: 4px;
                    background: #8eb9ff;
                    padding: 0 5px;
                    color: #0e3f8d;
                    font-family: PingFang SC;
                    font-size: 12px;
                    line-height: 20px;
                }
            }
        }
    }
}
</style>
