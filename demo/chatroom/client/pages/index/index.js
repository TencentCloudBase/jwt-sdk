import regeneratorRuntime from '../../libs/runtime'
import TcbClientWS from '../../libs/tcb-websocket-mp-sdk/index'

const app = getApp()

Page({
  data: {
    isLogin: true,
    userInfo: null
  },

  onLoad: function() {
    this.getUserInfo()
  },

  // 获取用户信息
  getUserInfo() {
    // 查看是否授权
    wx.getSetting({
      success: (res) => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称
          wx.getUserInfo({
            success: (res) => {
              let userInfo = res.userInfo

              this.setData({
                userInfo: userInfo
              }, () => {
                this.checkWebSocketAuth(userInfo)
              })
            },
            fail: () => {
              this.setData({
                isLogin: false
              })
              TcbClientWS.auth.logout()
            }
          })
        } else {
          this.setData({
            isLogin: false
          })
          TcbClientWS.auth.logout()
        }
      },
      fail: () => {
        wx.showToast({
          title: '登陆失败，请重试',
          icon: 'none'
        })
      }
    })
  },

  /**
   * 检查 websocket 连接的鉴权 token 是否还有效
   */
  checkWebSocketAuth(userInfo) {
    console.log(!wx.getStorageSync('tcb-token'))
    if (!wx.getStorageSync('tcb-token')) {
      this.getWebSocketAuth({
        detail: {
          userInfo
        }
      })
    }
  },

  /**
   * 获取 websocket 连接的 token
   */
  async getWebSocketAuth(e){

    try {
      await TcbClientWS.auth.login(e.detail)
      this.setData({
        isLogin: true
      })
    } catch(e) {
      wx.showToast({
        title: '登陆失败，请重试',
        icon: 'none',
        mask: true
      })
    }
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
