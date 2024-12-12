# AiVideoWeb

基于GB28181-2016标准的智能视频平台前端，负责实现核心信令与设备管理后台部分，支持NAT穿透，支持海康、大华、宇视等品牌的IPC、NVR接入。支持国标级联，也支持不带国标功能的摄像机/直播流/直播推流转发到其他国标视频平台。

## 引言
项目基于开源项目[wvp-GB28181-pro](https://github.com/648540858/wvp-GB28181-pro)中的前端项目二次开发而来

## 目录架构
- `src` 代码根目录
- `assets`  静态文件
- `layout` 布局文件
- `router` 路由文件
- `utils` 工具类和mixin配置
- `main.js` 入口文件
- `components` 组件以及页面的入口
  - `cockpit` 大屏组件
  - `common` 通用组件（视频播放器、设备树..）
  - `dialog` 弹窗组件
  - `service` 接口请求方法封装
  - `setting` 设置组件
  - `other` 其余一级vue文件都是页面,具体可以查看`router`目录下的路由配置

## 开发部署配置文件
1. `config/index.js` 配置开发环境接口地址

## 生产部署配置文件
1. `nginx/aivideo-web.conf` 配置生产环境ngxin部署地址
2. `static/js/config.js` - [window.baseUrl] 配置生产环境接口地址 、[window.iframeBaseUrl] 配置告警列表页面地址
