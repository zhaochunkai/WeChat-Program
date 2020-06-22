import weChatLiveRoomSao from '../../../service/weChatLiveRoomSao.js'
import Dialog from '../../../ui-lib/vant/dialog/dialog';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    src: '/images/live.png',
    hint: false
  },
  // 跳转到直播详情页
  redirectDetailClick(e) {
    let liveRoom = e.currentTarget.dataset.liveroom;
    wx.setStorageSync('livefacetime', e.currentTarget.dataset.livefacetime)
    wx.setStorageSync('liveId', e.currentTarget.dataset.liveid)
    let liveObj = {
      id: liveRoom.id,
      flvPlayAddress: encodeURIComponent(liveRoom.flvPlayAddress),
      roomNumber: liveRoom.roomNumber,
      liveId: e.currentTarget.dataset.liveid
    };
    wx.setStorageSync('liveObj', JSON.stringify(liveObj))
    // 考勤状态
    weChatLiveRoomSao.AttendanceStatus().then(res => {
      if (res) {
        Dialog.alert({
          message: '请进行考勤'
        }).then(() => {
          wx.navigateTo({
            url: `/pages/recognition/index?url=VerifyFace&ultimateUrl=${'/pages/online-study/onlive-detail/index'}&elselink=live`
          })
        })
      } else {
        weChatLiveRoomSao.studentInformation().then(res => {
          this.setData({
            name: res.name,
            idCardNumber: res.idCard
          })
          wx.checkIsSupportFacialRecognition({
            checkAliveType: 2,
            success: res => {
              console.log(res)
              if (res.errCode === 0 || res.errMsg === "checkIsSupportFacialRecognition:ok") {
                wx.startFacialRecognitionVerify({
                  name: this.data.name,
                  idCardNumber: this.data.idCardNumber,
                  success: () => {
                    wx.navigateTo({
                      url: '/pages/online-study/onlive-detail/index'
                    })
                  }
                })
              }
              wx.showToast('微信版本过低，暂时无法使用此功能，请升级微信最新版本')
            }
          })
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    let that = this;
    // 获取到直播列表数据
    weChatLiveRoomSao.list().then(function (res) {
      if (res.length !== 0) {
        let arr = res.map(r => {
          r.planStartTime = r.planStartTime.slice(0, 10)
          return r
        })
        that.setData({
          chatLiveRooms: arr
        })
      } else {
        that.setData({
          hint: true
        })
      }
    })
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