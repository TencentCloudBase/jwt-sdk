# Web与小程序 JavaScript SDK 文档

## new TcbClientWS

### 参数说明

| 字段 | 类型 | 必填 | 默认值 | 说明
| --- | --- | --- | --- | ---
| url | string | 是 | | WebSocket 地址 
| options | objefct | 否 | | [socket.io 客户端参数](https://socket.io/docs/client-api/#Initialization-examples)

### 返回值说明

|类型 | 说明
| --- | ---
| object | TcbClientWS 生成的对象

* object 对象说明

| 字段 | 类型 | 说明
| --- | --- | ---
| io | object | 由 [`require('socket.io-client').`生成的](https://socket.io/docs/client-api/#IO) 出来的函数
| socket | object | `socket.io-client` 的 [Socket](https://socket.io/docs/client-api/#Socket) 对象

## auth.login

通过云函数鉴权，并且生成 token 保存到小程序本地存储

### 参数说明

| 字段 | 类型 | 必填 | 默认值 | 说明
| --- | --- | --- | --- | ---
| userInfo | object | 是 | | 小程序用户数据，详参 [UserInfo](https://developers.weixin.qq.com/miniprogram/dev/api/UserInfo.html)

### 返回值说明

|类型 | 说明
| --- | ---
| string | 用户保存到小程序用于认证的 `token`

## auth.logout

用户断开链接，本质是将生成的 `token` 清除

## auth.getToken

在小程序侧获取已经存储到小程序本地存储的 `token` 数据

## open
建立 WebSocket 连接

### 返回值说明

|类型 | 说明
| --- | ---
| Socket | Socket 对象

### 示例
```js
tcbClientWS = new TcbClientWS('http://localhost:8080');
tcbClientWS.open();
```

## close

断开 WebSocket 连接

### 示例
```js
tcbClientWS = new TcbClientWS('http://localhost:8080');
tcbClientWS.close();
```

## join

### 参数说明

| 字段 | 类型 | 必填 | 默认值 | 说明
| --- | --- | --- | --- | ---
| roomID | string | 是 | | 加入的房间号

### 返回值说明

|类型 | 说明
| --- | ---
| Promise | Promise

### 示例
```js
tcbClientWS = new TcbClientWS('http://localhost:8080');
tcbClientWS.open();
tcbClientWS.join('Lobby');
```

## leave

### 参数说明

| 字段 | 类型 | 必填 | 默认值 | 说明
| --- | --- | --- | --- | ---
| roomID | string | 否 | | 退出的房间号

### 返回值说明

|类型 | 说明
| --- | ---
| Promise | Promise

### 示例
```js
tcbClientWS = new TcbClientWS('http://localhost:8080');
tcbClientWS.open();
tcbClientWS.join('Lobby');
tcbClientWS.leave();
```

## send

发送消息

### 参数说明

| 字段 | 类型 | 必填 | 默认值 | 说明
| --- | --- | --- | --- | ---
| options | object | 是 | | 发送消息的参数

* `options` 参数说明

| 字段 | 类型 | 必填 | 默认值 | 说明
| --- | --- | --- | --- | ---
| event | string | 是 | | 事件名称
| message | object|string | 是 | | 消息数据

### 返回值说明

|类型 | 说明
| --- | ---
| Promise | Promise

### 示例
```js
tcbClientWS = new TcbClientWS('http://localhost:8080');
tcbClientWS.open();
tcbClientWS.send({ event: 'message', message: { type: 'normal', value: 'hello world!' } });
```

## receive

接收消息

### 参数说明

| 字段 | 类型 | 必填 | 默认值 | 说明
| --- | --- | --- | --- | ---
| options | object | 是 | | 发送消息的参数

* `options` 参数说明

- 接收参数详情
| 字段 | 类型 | 必填 | 默认值 | 说明
| --- | --- | --- | --- | ---
| event | string | 是 | | 事件名称
| callback | function | 否 | | 接收消息回调

### 示例
```js
tcbClientWS = new TcbClientWS('http://localhost:8080');
tcbClientWS.open();
tcbClientWS.receive({ event: 'message', callback: (data) => {
    // process data
}})
```
