// pages/my/reportOnLearning/index.js
import myApi from '../../../../service/myApi.js'
import Dialog from '../../../../ui-lib/vant/dialog/dialog';
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  // 获取学习报告列表
  StudyReportList(){
    myApi.StudyReportList().then(res=> {
      this.setData({
        StudyReportList: res
      })
    })
  },
  // 查看学习报告
  viewStudyReport(e){
    if(e.currentTarget.dataset.project.status == '培训中'){
      Dialog.alert({
        message: '结束后才能查看学习报告哦!',
      }).then(() => {
        return
      });
    }
    if(e.currentTarget.dataset.project.status == '已结束'){
      wx.navigateTo({
        url: `/pages/my/reportOnLearning/SummaryOfStudyReport/index?projectDetail=${JSON.stringify(e.currentTarget.dataset.project)}`
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.StudyReportList()
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