# 聊天室 ChatRoom

## 开发环境体验 Demo

### 1. 前置条件

* 安装 `Node` 和 `npm`
* 安装[微信开发者工具](https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html)最新版本。
* 在微信开发者工具中，点击左上角 “云开发” 菜单，开通小程序·云开发能力。
* 获取 `secretId` 和 `secretKey`。通过此[链接](https://www.qcloud.com/login/mp?s_url=https%3A%2F%2Fconsole.cloud.tencent.com%2Fcam%2Fcapi)登录小程序对应的腾讯云帐号(需要小程序管理员或拥有者权限)，然后在[云API密钥](https://console.cloud.tencent.com/cam/capi) 里获取。

![](https://main.qcloudimg.com/raw/63512b321eee6c8779d6cb5b20f641cf.png)

### 2. 小程序DEMO

* 将本项目 `tcb-websocket-sdk` 下载下来（`git clone` 或者 下载压缩包均可）。
* 用微信开发者工具，导入 `demo/chatroom`，并填写好小程序 `appid`。
* 在 `client/config/index.js` 的配置文件中，填入稍后本地服务的地址，本地开发一般是填 `localhost`，默认的 DEMO 地址是 `localhost:3000`。如果后续后台服务端口更改，此处也需要更改。同时测试的时候，请在微信开发者工具中，勾选不校验验名和 HTTPS 证书。

![](https://main.qcloudimg.com/raw/21232aa061bb501f840ee85c0817c6cf.png)

* 创建并部署 `cloud/funtions/tcb-auth` 云函数。
* 在 `demo/chatroom/server` 项目中，运行 `npm i`，安装项目依赖。
* 在 `demo/chatroom/server/config` 中，基于 `example.js` 创建 `index.js`，并填好小程序云开发对应的腾讯云账号的 `secretId` 和 `secretKey` (在前置条件已经获取)。如果本地网络有代理，还需要设置 `proxy`。
* 在 `demo/chatroom/server` 项目中，运行 `npm start`，启动服务器。


### 3. H5 DEMO

上面已经将一个小程序的 DEMO 运转起来了，但一台电脑里只能运行一个小程序的项目，因此往往需要建一个 H5 的 DEMO 来辅助开发。

* 在微信开发者工具的预览界面中，登陆，并进入房间
* 在微信开发者工具的调试面板中的 `Storage` 板块中，获取 `tcb-token` 的值。如果你想使用另一个用户的信息，那你可以用另一个用户登陆微信开发者工具后，再获取此 `tcb-token`。

![](https://main.qcloudimg.com/raw/5ce1a256a3c83cc2b43ee99ceab04d43.png)

* 在 `demo/miniprogram/server/static/config/` 中，基于 `example.js` 创建 `index.js` 并给 `token` 变量填写刚才获取的 `tcb-token` 值：

```js
let token = ''; // 填写从小程序里 tcb-token 获取的值
```

* 在浏览器打开 `localhost:3000`，这样就可以在web页面和小程序两端，模拟两个用户在房间里对话。 

## 生产环境体验

### 1. 前置条件
* 获取云主机的 `IP` 和 `SSH` 登陆密码。
* 安装[微信开发者工具](https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html)最新版本。
* 在微信开发者工具中，点击左上角 “云开发” 菜单，开通小程序·云开发能力，并获取 `环境id`

![](https://main.qcloudimg.com/raw/1eff71814df41476c2dfd505eb7c42cf.png)

* 获取 `secretId` 和 `secretKey`。通过此[链接](https://www.qcloud.com/login/mp?s_url=https%3A%2F%2Fconsole.cloud.tencent.com%2Fcam%2Fcapi)登录小程序对应的腾讯云帐号(需要小程序管理员或拥有者权限)，然后在[云API密钥](https://console.cloud.tencent.com/cam/capi) 里获取。

### 2. 机器部署及小程序 DEMO
* 通过 `SSH` 登陆机器，比如

```shell
ssh root@chatroom.pai.tcloudbase.com
```

* 将 `/demo/shell.sh` 脚本，拷贝到机器的以下目录，并执行：

```shell
# 创建目录
mkdir /data/scripts/
# 新建脚本文件 shell.sh
vim /data/shell.sh
# 将脚本内容复杂到 shell.sh中

# 让脚本可执行
chmod +x /data/shell.sh

# 运行脚本并告诉脚本当前机器使用的域名，这里的域名是指 chatroom.pai.tcloudbase.com
export DOMAIN_NAME=chatroom.pai.tcloudbase.com && ./shell.sh
```

* 基于 `demo/chatroom/tcb.example.json` 在同级目录创建 `tcb.json` 文件，并将前置条件中的云主机 `IP`，`SSH` 登陆密码， `secretId`， `secretKey` 和云开发 `环境id`，填入 `tcb.json`中。
* 在本地开发机器中，运行以下命令安装 `@cloudbase/cli`：

```js
npm i -g @cloudbase/cli
```

* 在 `/demo/chatroom` 目录下，运行以下命令上传服务端代码，并启动服务进程（此处是借助 pm2 能力在机器中启动进程）：

```js
tcb deploy --start
```

* 如果想重启，则用以下脚本：

```js
tcb deploy
```

* 在 `client/config/index.js` 的配置文件中，填入稍后本地服务的地址，域名改成该你配置的域名，比如 `wss://chatroom.pai.tcloudbase.com`。同时测试的时候，请在微信开发者工具中，勾选不校验验名和 HTTPS 证书，除非你在小程序的管理后台给该域名配置了白名单。
