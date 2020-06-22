import weChatOnlineStudySao from '../../../service/weChatOnlineStudySao.js'
import Dialog from '../../../ui-lib/vant/dialog/dialog';
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  redirectDetailClick(e) {
    let that = this;
    // 科目id
    let courseId = e.currentTarget.dataset.courseid;
    // 存储科目id
    wx.setStorageSync('courseId', courseId)
    // 考勤状态
    weChatOnlineStudySao.AttendanceStatus().then(res => {
      this.setData({
        name: res.name,
        idCardNumber: res.idCardNumber
      })
      if (res) {
        Dialog.alert({
          message: '请进行考勤'
        }).then(() => {
          wx.navigateTo({
            url: `/pages/recognition/index?url=VerifyFace&ultimateUrl=${'/pages/online-study/study-detail/index'}&elselink=study`
          })
        })
      } else {
        weChatOnlineStudySao.studentInformation().then(res => {
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
                      url: '/pages/online-study/study-detail/index'
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
    let that = this;
    // 培训项目id
    let trainingProgramsId = options.trainingProgramsId;
    // 存储项目id
    wx.setStorageSync('trainingProgramsId', Number(trainingProgramsId))
    // 培训项目基本信息
    let trainingProgram = JSON.parse(options.trainingProgram);

    // 根据微信绑定Id和培训项目id查询课程信息
    weChatOnlineStudySao.getOnlineStudyCourseInfo({
      trainingProgramId: trainingProgramsId
    }).then(function (res) {
      that.setData({
        courseInfos: res,
        trainingProgram: trainingProgram,
        trainingProgramsId: trainingProgramsId
      })
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