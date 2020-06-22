//获取应用实例
const app = getApp()
import weChatLiveRoomSao from '../../../service/weChatLiveRoomSao.js'
import myApi from '../../../service/myApi.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    motto: '小程序获取openId',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.setData({
      openId: wx.getStorageSync('openId')
    })
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  getUserInfo: function (e) {
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  // 资料绑定
  bindingInformation() {
    wx.navigateTo({
      url: '/pages/bindingInformation/index'
    })
  },
  // 清除缓存
  clearCache() {
    wx.showModal({
      content: '本次操作会清空缓存，导致重新选择租户',
      success(res) {
        if (res.confirm) {
          wx.removeStorageSync('TenantId')
          wx.showToast({
            title: '清除成功',
            icon: 'success',
            duration: 2000,
            success: () => {
              setTimeout(()=>{
                wx.switchTab({
                  url: '/pages/index/index'
                })
              },1500)
            }
          })
        } else if (res.cancel) {}
      }
    })
  },
  // 获取验证
  getVerify(){
    weChatLiveRoomSao.AttendanceStatus().then(res=>{
      if(res == false){
        this.setData({
          flag: res
        })
      }else{
        this.setData({
          flag: true
        })
      }
    })
  },
  // 我的信息
  goMyInfo() {
    myApi.StudentInfo().then(res=>{
      wx.navigateTo({
        url: `/pages/my/personalDetails/index?info=${JSON.stringify(res)}`,
      })
    })
  },
  // 学习报告
  goReportOnLearning(){
    wx.navigateTo({
      url: '/pages/my/reportOnLearning/reportOnLearningList/index',
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
    console.log(wx.getStorageSync('TenantId'))
    if(wx.getStorageSync('TenantId') == ''){
      wx.switchTab({
        url: "/pages/index/index"
      })
    }else{
      this.getVerify()
    }
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