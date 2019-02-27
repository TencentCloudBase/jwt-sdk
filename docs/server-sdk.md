# Node SDK 文档

## new TcbServerWS

### 参数说明

| 字段 | 类型 | 必填 | 默认值 | 说明
| --- | --- | --- | --- | ---
| server | object | 是 | | (http.Server) 需要绑定的服务对象
| options | objefct | 否 | | [socket.io 服务端参数](https://socket.io/docs/server-api/#new-Server-httpServer-options)

* options 新增参数

| 字段 | 类型 | 必填 | 默认值 | 说明
| --- | --- | --- | --- | ---
| namespace | string | 否 | | 命名空间，默认值：`/`

### 返回值说明

|类型 | 说明
| --- | ---
| object | TcbServerWS 生成的对象

* object 对象说明

| 字段 | 类型 | 说明
| --- | --- | ---
| io | object | 由 [`require('socket.io').` `new`](https://socket.io/docs/server-api/#Server) 出来的对象
| socket | object | socket.io 的 [Socket](https://socket.io/docs/server-api/#Socket) 对象
| tcb | object | [`tcb-admin-node`](https://github.com/TencentCloudBase/tcb-admin-node) 初始化后的对象

### 示例
```js
// 接入 Koa2
const Koa = require('koa');
const app = new Koa();
const serve = require('koa-static');
const TcbServerWS = require('tcb-websocket-js-sdk');
const server = require('http').Server(app.callback());
const tcbServerWS = new TcbServerWS(server, { config });

// 添加 namespace
const tcbServerWS = new TcbServerWS(server, { namespace: '/tcb/', config });
```

## open

建立 WebSocket 连接

### 参数说明

| 字段 | 类型 | 必填 | 默认值 | 说明
| --- | --- | --- | --- | ---
| options | objefct | 否 | | 建立 WebSocket 连接参数

* `options` 参数说明

| 字段 | 类型 | 必填 | 默认值 | 说明
| --- | --- | --- | --- | ---
| open | function | 否 | | 成功连接回调
| close | function | 否 | | 断开连接回调
| closing | function | 否 | | 正在断开连接回调
| error | function | 否 | | 错误信息回调

* 示例
```js
tcbServerWS.open({
    open: (socket) => {
    
    },
    close: (socket) => {

    },
    closing: (socket) => {

    },
    error: (err) => {

    }
});
```

## close

断开 WebSocket 连接

### 参数说明

| 字段 | 类型 | 必填 | 默认值 | 说明
| --- | --- | --- | --- | ---
| socket | Socket 对象 | 是 | | 需要断开的 socket

### 示例
```js
tcbServerWS.open({
    open: (socket) => {
        // 1秒后断开连接
        setTimeout(() => {
            tcbServerWS.close(socket);
        }, 1000);
    },
    close: (socket) => {

    },
    error: (err) => {

    }
});
```

## join

加入房间

### 参数说明

| 字段 | 类型 | 必填 | 默认值 | 说明
| --- | --- | --- | --- | ---
| socket | Socket 对象 | 是 | | 需要断开的 socket
| roomID | string | 是 | | 房间ID

### 返回值说明

|类型 | 说明
| --- | ---
| Promise | Promise

### 示例
```js
tcbServerWS.open({
    open: (socket) => {
        tcbServerWS.join(socket, 'Lobby');
    },
    close: (socket) => {

    },
    error: (err) => {

    }
});
```

## leave

离开房间

### 参数说明

| 字段 | 类型 | 必填 | 默认值 | 说明
| --- | --- | --- | --- | ---
| socket | Socket 对象 | 是 | | 需要断开的 socket
| roomID | string | 是 | | 房间ID

### 返回值说明

|类型 | 说明
| --- | ---
| Promise | Promise

* 示例
```js
tcbServerWS.open({
    open: (socket) => {
        tcbServerWS.join(socket, 'Lobby');
        tcbServerWS.leave(socket, 'Lobby');
    },
    close: (socket) => {

    },
    error: (err) => {

    }
});
```

## onJoin

监听加入房间事件

### 参数说明

| 字段 | 类型 | 必填 | 默认值 | 说明
| --- | --- | --- | --- | ---
| socket | Socket 对象 | 是 | | socket 对象
| callback | function | 否 | | 事件回调

## onLeave

监听离开房间事件

### 参数说明

| 字段 | 类型 | 必填 | 默认值 | 说明
| --- | --- | --- | --- | ---
| socket | Socket 对象 | 是 | | socket 对象
| callback | function | 否 | | 事件回调

## send

发送消息

### 参数说明

| 字段 | 类型 | 必填 | 默认值 | 说明
| --- | --- | --- | --- | ---
| socket | Socket 对象 | 是 | | 需要断开的 socket
| options | object | 是 | | 发送参数

* `options` 参数详情

| 字段 | 类型 | 必填 | 默认值 | 说明
| --- | --- | --- | --- | ---
| event | string | 是 | | 事件名称
| mode | string | 否 | | 房间ID，`broadcast` 表示广播消息，`room` 表示对房间发送消息，不填代表只给自己发消息
| roomID | string | 否 | | 房间ID，只有在 `mode` 值为 `room` 的时候才需要填
| message | object|string | 是 | | 消息数据

### 返回值说明

|类型 | 说明
| --- | ---
| Promise | Promise

### 示例
```js
tcbServerWS.open({
    open: (socket) => {
        tcbServerWS.join(socket, 'Lobby');
        tcbServerWS.send(socket, {
            event: 'message',
            mode: 'room',
            roomID: 'Lobby',
            message: {
                value: 'hello world!'
            }
        })
    },
    close: (socket) => {

    },
    error: (err) => {

    }
});
```

## receive

### 参数说明

| 字段 | 类型 | 必填 | 默认值 | 说明
| --- | --- | --- | --- | ---
| socket | Socket 对象 | 是 | | 需要断开的 socket
| options | object | 是 | | 接收参数

* `options` 参数详情

| 字段 | 类型 | 必填 | 说明
| --- | --- | --- | ---
| event | string | 是 | 事件名称
| callback | function | 否 | 接收消息回调

### 返回值说明

|类型 | 说明
| --- | ---
| Promise | Promise

### 示例
```js
tcbServerWS.open({
    open: (socket) => {
        tcbServerWS.join(socket, 'Lobby');
        tcbServerWS.receive(socket, {
            event: 'message',
            callback: (data) => {
                // process data
            }
        })
    },
    close: (socket) => {

    },
    error: (err) => {

    }
});
```
