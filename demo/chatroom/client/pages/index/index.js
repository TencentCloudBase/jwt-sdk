import regeneratorRuntime from '../../libs/runtime'
import TcbClientWS from '../../libs/websocket-mp-sdk/index'

const app = getApp()

Page({
  data: {
    userInfo: null,
    index: 0,
    joinType: [
      '新建房间',
      '已有房间'
    ],
    selectedRoomIndex: 0,
    joinRooms: [],
    room: null,
  },

  bindJoinRoomChange(e) {
    let index = e.detail.value
    this.setData({
      selectedRoomIndex: index,
      room: this.data.joinRooms[index]
    })
  },

  bindJoinTypeChange(e) {
    let index = e.detail.value
    let joinRooms = this.data.joinRooms
    let joinRoom = joinRooms.length ? joinRooms[0] : null

    this.setData({
      index,
      room: (index === 0) ? null : joinRoom
    })
  },

  typeRoom(e) {
    let room = e.detail.value
    this.setData({
      room
    })
  },

  onLoad() {
    this.login()
    this.getRooms()
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

  async getRooms() {
    let db = wx.cloud.database()
    let result = await db.collection('rooms').field({ room: true }).get()
    
    if (result.data && result.data.length) {
      let joinRooms = [];
      result.data.forEach((item) => {
        joinRooms.push(item.room)
      })
      
      this.setData({
        joinRooms
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
  join() {
    let room = this.data.room
    if (!room) {
      return wx.showToast({
        title: '请输入房间号',
        icon: 'none',
        mask: true
      })
    }
    wx.setStorageSync('userInfo', this.data.userInfo);
    wx.navigateTo({
      url: `/pages/room/index?room=${room}`,
    })
  }

})
