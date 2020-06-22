import weChatExamination from '../../../service/weChatExamination.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    parameter: {},
    reachBottomTxt: '',
    page: 0,
    flag: true, // 触底开关
    examRecordList:[]
  },
  // 获取考试记录列表
  _getExamPaperRecordList() {
    // "模拟考试" Simulation = 1, "正式考试" Official = 2, "全部" All = 3
    let data = {
      SkipCount: this.data.page * 10,
      MaxResultCount: 10,
      examinationArrangeId: this.data.parameter.examinationArrangeId, // 考试安排id
      examinationPaperId: this.data.parameter.examinationPaperId, // 试卷id
      courseId: this.data.parameter.courseId, // 课程id
      courseName: this.data.parameter.courseName, // 课程名称
      examinationType: this.data.parameter.examinationType, // 考试类型
      classId: this.data.parameter.classId, // 考试类型
    }
    weChatExamination.getExamPaperRecordList(data).then(res => {
      if (res.data.items.length === 0) {
        this.setData({
          flag: false,
          reachBottomTxt: '已经到底啦'
        })
      } else {
        // 获取第一页的数据时，取考试安排的第一个元素的id，赋值给this.data.activeNames
        if (this.data.page == 0) {
          this.setData({
            activeNames: [res.data.items[0].id]
          })
        }
        this.setData({
          examRecordList: this.data.examRecordList.concat(res.data.items),
          page: this.data.page + 1
        })
        // 正式考或补考，直接跳转查看具体的试卷
        if (this.data.parameter.examinationType !== 'Simulation') {
          wx.navigateTo({
            url: `/pages/examination-module/examination-record-list/examination-paper-result/index?id=${res.data.items[0].id}`
          })
        }
      }
    })
  },
  // 查看答卷
  toExamResult(e){
    console.log(e.currentTarget.dataset.record.id)
    wx.navigateTo({
      url: `/pages/examination-module/examination-record-list/examination-paper-result/index?id=${e.currentTarget.dataset.record.id}`
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      parameter: JSON.parse(options.parameter)
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
    // 初始化数据
    this.setData({
      examRecordList: [],
      page: 0,
      flag: true
    })
    this._getExamPaperRecordList()
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
    if (this.data.flag) {
      this.setData({
        reachBottomTxt: '数据加载中...'
      })
      setTimeout(() => {
        this._getExamPaperRecordList()
      }, 50)
    }

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  }
})