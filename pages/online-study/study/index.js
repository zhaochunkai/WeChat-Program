import weChatOnlineStudySao from '../../../service/weChatOnlineStudySao.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    block:false
  },

  // 点击跳转事件
  redirectDetailClick: function (e) {
    let trainingProgramsId = e.currentTarget.dataset.trainingprogramid;
    let trainingProgram = e.currentTarget.dataset.trainingprogram;
    wx.setStorageSync('timer', e.currentTarget.dataset.facetime)
    wx.navigateTo({
      url: '/pages/online-study/course/index?trainingProgramsId=' + trainingProgramsId + '&trainingProgram=' + JSON.stringify(trainingProgram)+'&elselink=study',
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
    // 根据微信绑定Id查询培训项目信息
    weChatOnlineStudySao.getTrainingProgramInfoByWeChatId().then(function (res) {
      res.map(r=>{
        r.attendClassStartDate = r.attendClassStartDate.slice(0,10)
        r.attendClassStopDate = r.attendClassStopDate.slice(0,10)
        return r
      })
      if(res.length == 0){
        that.setData({
          block:true
        })
      }else{
        that.setData({
          programInfos: res
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