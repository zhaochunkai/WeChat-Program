import weChatAttendanceSao from '../../service/weChatAttendanceSao.js'
Page({
  /**
   * 页面的初始数据
   */
  data: {
    "topBannerPath": "/images/banner.jpg",
    "paythefeesPath": "/images/content-png/buqian.png",
    "onLineStudyPath": "/images/content-png/tushujiangoushenqing.png"
  },

  redirectPage: function (e) {
    let value = e.currentTarget.dataset.value;
    switch (value) {
      case 'attendance':
        wx.navigateTo({
          url: '/pages/evaluate/online-attendance/index',
        })
        break;
      case 'evaluate':
        wx.navigateTo({
          url: '/pages/evaluate/online-evaluate/index',
        })
        break;
      default:
        break;
    }
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