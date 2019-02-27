# 开发环境体验 Demo

## 1. 前置条件

* 安装 `Node` 和 `npm`
* 安装[微信开发者工具](https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html)最新版本
* 获取 `secretId` 和 `secretKey`。通过此[链接](https://www.qcloud.com/login/mp?s_url=https%3A%2F%2Fconsole.cloud.tencent.com%2Fcam%2Fcapi)登录小程序对应的腾讯云帐号(需要小程序管理员权限)，然后在[云API密钥](https://console.cloud.tencent.com/cam/capi) 里获取。

![](https://main.qcloudimg.com/raw/63512b321eee6c8779d6cb5b20f641cf.png)

## 2. 小程序DEMO

* 将本项目 `tcb-websocket-sdk` 下载下来（`git clone` 或者 下载压缩包均可）。
* 用微信开发者工具，导入 `demo/miniprogram`，并填写好小程序 `appid`。
* 在 `client/config/index.js` 的配置文件中，填入稍后本地服务的地址，本地开发一般是填 `localhost`，默认的 DEMO 地址是 `localhost:1809`。如果后续后台服务端口更改，此处也需要更改。
* 创建并部署 `cloud/funtions/auth` 云函数。
* 在 `demo/miniprogram/server` 项目中，运行 `npm i`，安装项目依赖。
* 在 `demo/miniprogram/server/config` 中，基于 `example.js` 创建 `index.js`，并填好小程序云开发对应的腾讯云账号的 `secretId` 和 `secretKey` (在前置条件已经获取)。如果本地网络有代理，还需要设置 `proxy`。
* 在 `demo/miniprogram/server` 项目中，运行 `npm start`，启动服务器。


## 3. H5 DEMO

上面已经将一个小程序的 DEMO 运转起来了，但一台电脑里只能运行一个小程序的项目，因此往往需要建一个 H5 的 DEMO 来辅助开发。

* 在微信开发者工具的预览界面中，登陆，并进入房间
* 在微信开发者工具的调试面板中的 `Storage` 板块中，获取 `tcb-token` 的值。如果你想使用另一个用户的信息，那你可以用另一个用户登陆微信开发者工具后，再获取此 `tcb-token`。

![](https://main.qcloudimg.com/raw/5ce1a256a3c83cc2b43ee99ceab04d43.png)

* 在 `demo/miniprogram/server/static/config/` 中，基于 `example.js` 创建 `index.js` 并给 `token` 变量填写刚才获取的 `tcb-token` 值：

```js
let token = ''; // 填写从小程序里 tcb-token 获取的值
```

* 在浏览器打开 `localhost:1809`，这样就可以在web页面和小程序两端，模拟两个用户在房间里对话。 
