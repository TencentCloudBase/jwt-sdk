import regeneratorRuntime from '../../libs/runtime'
import TcbClientWS from '../../libs/websocket-mp-sdk/index'
import config from '../../config/index.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    roomsList: [],
    roomIndex: 0,
    userInfo: {},
    room: '',
    inputValue: '',
    message: []
  },

  updateUser(userInfo) {
    setTimeout(() => {
      this.setData({
        userInfo
      })
    }, 300)
  },

  joinRoom(room) {
    this.setData({
      room
    }, async () => {
      await this.tcbClientWS.join(room)
    })
  },

  onMessage() {
    this.tcbClientWS.receive({
      event: 'message',
      callback: (data) => {
        this.data.message.push(data)
        this.setData({
          message: this.data.message
        })
      }
    });
  },

  // onRoomListUpdate() {
  //   this.tcbClientWS.receive({
  //     event: 'room-list',
  //     callback: (data) => {
  //       // console.log(data);
  //       let roomsList = Object.keys(data)
  //       let roomIndex = roomsList.indexOf(this.data.room)
  //       this.setData({
  //         roomsList,
  //         roomIndex
  //       })
  //     }
  //   });
  // },

  connectSocket() {
    const token = TcbClientWS.auth.getToken()
    let option = {}
    if(token) {
      option = {
        query: {
          token
        }
      }
    } else {
      // TODO to login
    }
    this.tcbClientWS = new TcbClientWS(config.url, option)
    this.tcbClientWS.open({
      connect: () => {
        this.joinRoom(this.room)
      }
    })

    this.onMessage()
    // this.onRoomListUpdate()
  },

  async send(e) {
    let message = e.detail.value.message
    let result = await this.tcbClientWS.send({
      event: 'message',
      message,
    })

    // console.log('message: ')
    // console.log(result)
    this.setData({
      inputValue: ''
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.room = options.room || 'Lobby'
    this.connectSocket();
    this.updateUser(wx.getStorageSync('userInfo'))

    wx.setNavigationBarTitle({
      title: `房间  ${this.room} `
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    this.tcbClientWS.close();
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
