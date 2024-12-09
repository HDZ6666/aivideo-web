## 开发说明
### 目录架构
+ aivideo-web
  + aivideo-web-v1
  + aivideo-web-v2
    + apps
      - datav
      - mobile
      - pc
    + packages
      - common
      - rest
  + aivideo-web-react

后续新功能尽量在aivideo-web-v2上开发
### aivideo-web.code-workspace
配置了vscode的工作空间
### aivideo-web-v1
aivideo-web-v1的登录页有pc、mobile、datav链接，并将请求代理到aivideo-web-v2相应的页面
#### 开发
```
npm run dev
```
### aivideo-web-react
aivideo-web-react为AI视界页面
#### 开发
```
npm run dev
```
### aivideo-web-v2/apps/pc
pc使用[td-starter](https://tdesign.tencent.com/starter/docs/vue-next/get-started)创建
#### 开发
```
pnpm dev
```

#### 添加内部模块依赖
- package.json
```
    "@aivideo/rest": "workspace:*",
    "@aivideo/common": "workspace:*"
```