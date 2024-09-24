## 开发说明
|目录|名称|
|:-:|:-:|
|aivideo-web-v1|旧项目|
|aivideo-web-v2|新项目|

后续新功能尽量在aivideo-web-v2上开发
### aivideo-web.code-workspace
配置了vscode的工作空间
### aivideo-web-v1
aivideo-web-v1的登录页有v2链接，并将以/v2开头的请求代理到aivideo-web-v2
- 开发
```
npm run dev
```
### aivideo-web-v2
aivideo-web-v2使用[td-starter](https://tdesign.tencent.com/starter/docs/vue-next/get-started)创建

```
pnpm dev或npm run dev
```
