import regeneratorRuntime from '../../libs/runtime'
import config from '../../config/index'
import TcbClientWS from '../../libs/websocket-mp-sdk/index'

const app = getApp()

Page({
  data: {
    userInfo: null
  },

  onLoad: function() {
    this.login()
  },

  async login(e) {
    try {
      let info = null;
      // 点击登陆按钮，进行首次授权并登陆
      if (e) {
        info = await TcbClientWS.auth.tapToLogin(e);
      }
      // 有过首次授权后，可自动获取用户信息
      else {
        info = await TcbClientWS.auth.autoLogin();
      }
      this.setUserInfo(info);
      this.connect()
    }
    catch (e) {
      console.log(e)
      wx.showToast({
        title: '登陆失败，请重试',
        icon: 'none',
        mask: true
      })
    }
  },

  // 登陆成功后，于本页面设置用户数据
  setUserInfo(info) {
    this.setData({
      userInfo: info ? info.userInfo : null
    })
  },
  
  // 连接服务
  connect() {
    const token = TcbClientWS.auth.getToken()
    let option = {}
    if (token) {
      option = {
        query: {
          token
        }
      }
    }
    this.tcbClientWS = new TcbClientWS(config.url, option)
    this.tcbClientWS.open()
    this.onMessage()
  },

  // 接收并处理消息
  onMessage() {
    this.tcbClientWS.receive({
      event: 'message',
      callback: (data) => {
        console.log(data);
        this.setData({
          [data.type]: data.val
        }, () => {
          if (data.type === 'welcome') {
            this.tcbClientWS.send({
              event: 'message',
              message: 'Thank you for sharing!'
            })
          }
        })
      }
    })
  },

})
