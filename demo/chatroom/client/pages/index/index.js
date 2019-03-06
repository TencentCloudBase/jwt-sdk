import regeneratorRuntime from '../../libs/runtime'
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
    }
    catch (e) {
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
  
  /**
   * 加入房间
   */
  join(e) {
    let room = e.detail.value.room
    wx.setStorageSync('userInfo', this.data.userInfo);
    wx.navigateTo({
      url: `/pages/room/index?room=${room}`,
    })
  }

})
