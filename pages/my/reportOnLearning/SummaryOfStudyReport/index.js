// pages/my/reportOnLearning/SummaryOfStudyReport/index.js
import myApi from '../../../../service/myApi.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  // 获取概述
  getOverview(){
    myApi.overviewOfStudyReport({
      projectId: this.data.projectDetail.id
    }).then(res=>{
      this.setData({
        summarize: res
      })
    })
  },
  // 跳转到基本信息
  goToBasicInformation(){
    wx.navigateTo({
      url: `/pages/my/reportOnLearning/basicInformation/index?projectDetail=${JSON.stringify(this.data.projectDetail)}`
    })
  },
  // 跳转到在线学习
  goToOnLineStudy(){
    wx.navigateTo({
      url: `/pages/my/reportOnLearning/onLineStudy/index?projectDetail=${JSON.stringify(this.data.projectDetail)}`
    })
  },
  // 跳转到直播学习
  goToLiveToLearn(){
    wx.navigateTo({
      url: `/pages/my/reportOnLearning/liveToLearn/index?projectDetail=${JSON.stringify(this.data.projectDetail)}`
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      projectDetail: JSON.parse(options.projectDetail),
      TenantName: wx.getStorageSync('TenantName')
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
    this.getOverview()
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