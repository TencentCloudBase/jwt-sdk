# Node SDK 文档

## new TcbJwt

### 参数说明

| 字段 | 类型 | 必填 | 默认值 | 说明
| --- | --- | --- | --- | ---
| options | objefct | 否 | | 鉴权相关配置

* options 新增参数

| 字段 | 类型 | 必填 | 默认值 | 说明
| --- | --- | --- | --- | ---
| isAutoLogin | boolean | 否 | true | 是否自动登陆
| isLogOff | boolean | 否 | false | 是否关闭日志打印
| type | string | 否 | http | 鉴权服务类型, http 或 websocekt
| tcb | object | 否 | | [tcb-admin-node](https://github.com/TencentCloudBase/tcb-admin-node) 对象，如果填写了 `tcb` 对象，则会忽略 `tcbConfig`
| tcbConfig | object | 否 | | [tcb-admin-node](https://github.com/TencentCloudBase/tcb-admin-node/blob/master/docs/initialization.md) 初始化配置

### 返回值说明

|类型 | 说明
| --- | ---
| object | TcbJwt 生成的对象

### 示例
```js
const tcbJwt = new TcbJwt({
    type: 'websocket',
    tcbConfig: {
        secretId: '', // 腾讯云可操作云开发资源的 secretid
        secretKey: '', // 腾讯云可操作云开发资源的 secretkey
    }
})
```

## init

自动登陆并获取

### 参数说明

| 字段 | 类型 | 必填 | 默认值 | 说明
| --- | --- | --- | --- | ---
| object | object | 否 | | 传入 `http` 的 `context`，或 `websocket` 对 `socket` 对象，登陆成功则用户信息会存放在 `context.user` 或 `socket.user` 里

* 示例
```js
tcbJwt.inint(socket);
```

## verifyLogin

检验 `jwt token` 并登陆

### 参数说明

| 字段 | 类型 | 必填 | 默认值 | 说明
| --- | --- | --- | --- | ---
| token | string | 是 | | `jwt token`

* 示例
```js
let token = 'xxx';
tcbJwt.verifyLogin(token).then((res) => {
    console.log(res); // 详细用户信息
});
```

## log

### 参数说明

| 字段 | 类型 | 必填 | 默认值 | 说明
| --- | --- | --- | --- | ---
| jsonObj | object json 对象 | 是 | | 需要断开的 socket
| logPathParam | string | 否 | 在 windows 系统下，默认存放在 `./server.log`，而在 mac 或 linux 系统下，默认存放在 `/data/logs/server.log`。本接口不保证文件存在，使用前请先创建好日志文件 | 存放日志的本地路径

### 返回值说明

|类型 | 说明
| --- | ---
| Promise | Promise

### 示例
```js
tcbJwt.log({
    a: 1
});
```
