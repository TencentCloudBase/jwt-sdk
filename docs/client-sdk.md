# Web与小程序 JavaScript SDK 文档

## new TcbJwt

### 参数说明

| 字段 | 类型 | 必填 | 默认值 | 说明
| --- | --- | --- | --- | ---
| options | objefct | 否 | | 与鉴权有关的配置项

* options 对象说明

| 字段 | 类型 | 默认值 | 说明
| --- | --- | --- | ---
| storageKey | string | tcb-token | 生成的鉴权 token 的键值

### 返回值说明

|类型 | 说明
| --- | ---
| object | TcbJwt 生成的对象


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

## auth.tapToLogin

首次授权，获取用户信息并登陆

### 参数说明

| 字段 | 类型 | 必填 | 默认值 | 说明
| --- | --- | --- | --- | ---
| e | object | 是 | | 小程序授权按钮事件及数据

### 返回值说明

|类型 | 说明
| --- | ---
| object | 小程序用户信息

### 示例
```js
// js
tapToLogin(e) {
    tcbJwt.auth.tapToLogin(e);
}

// wxml
<button
    open-type='getUserInfo'
    bindgetuserinfo="tapToLogin"
>
    登陆
</button>

```

## auth.autoLogin

首次授权后，可自动获取用户信息并登陆

### 返回值说明

|类型 | 说明
| --- | ---
| Promsise<UserInfo> | 小程序用户信息
