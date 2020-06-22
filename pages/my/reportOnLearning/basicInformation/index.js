// pages/my/reportOnLearning/basicInformation/index.js
import myApi from '../../../../service/myApi.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  // 获取个人基本信息
  getMeInfo() {
    myApi.getStudentBasicInfo({
      projectId: this.data.projectDetail.id
    }).then(res => {
      for (let key in res) {
        res['birthday'] = this.dateDispose(res['birthday'])
        res['recruitStudentsStartDate'] = this.dateDispose(res['recruitStudentsStartDate'])
      }
      this.setData({
        myDetail: res
      })
    })
  },
  // 时间处理
  dateDispose(str) {
    var arr = str.split("T")
    return arr[0]
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      projectDetail: JSON.parse(options.projectDetail)
    })
    this.getMeInfo()
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