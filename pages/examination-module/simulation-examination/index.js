import weChatExamination from '../../../service/weChatExamination.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    reachBottomTxt: '',
    page: 0,
    flag: true, // 触底开关
    examArrangeList: [],
    activeNames: [],
    false: true
  },
  // 更新面板选中数组
  onChange(event) {
    this.setData({
      activeNames: event.detail,
    });
  },
  // 获取考试安排列表
  _getExaminationArrangeList() {
    // "模拟考试" Simulation = 1, "正式考试" Official = 2, "全部" All = 3
    let data = {
      SkipCount: this.data.page * 10,
      MaxResultCount: 10,
      ExaminationType: 1
    }
    weChatExamination.getExaminationArrangeList(data).then(res => {
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
          examArrangeList: this.data.examArrangeList.concat(res.data.items),
          page: this.data.page + 1
        })
      }
      if (this.data.examArrangeList.length === 0) {
        this.setData({
          showTip: true
        })
      }
    })
  },
  // 查看考试结果
  toExamResult(e) {
    let arrange = e.currentTarget.dataset.arrange
    let paper = e.currentTarget.dataset.paper
    let data = {
      examinationArrangeId: arrange.id, // 考试安排id
      classId: arrange.classId,
      examinationPaperId: paper.examinationPaperId, // 试卷id
      courseId: paper.courseId, // 课程id
      courseName: paper.courseName, // 课程名称
      examinationType: 'Simulation', // 考试类型
    }
    wx.navigateTo({
      url: `/pages/examination-module/examination-record-list/index?parameter=${JSON.stringify(data)}`
    })    
  },
  // 开始考试
  toExam(e) {
    let arrange = e.currentTarget.dataset.arrange
    let paper = e.currentTarget.dataset.paper
    // 未到开始时间不允许进入考试
    if (new Date(paper.examinationBeginTime) > new Date()) {
      wx.showToast({
        title: '未到考试开始时间，无法考试！',
        icon: 'none',
        duration: 2000
      })
      return
    }
    // 过了结束时间不允许进入考试
    if (new Date(paper.examinationEndTime) < new Date()) {
      wx.showToast({
        title: '考试已结束，无法考试！',
        icon: 'none',
        duration: 2000
      })
      return
    }
    let data = {
      trainingProgramId: arrange.trainingProgramId, // 项目id
      classId: arrange.classId,
      examinationPaperId: paper.examinationPaperId,
      examinationArrangeId: arrange.id,
      examinationType: arrange.examinationType, // 考试类型
      methodOfExamination: arrange.methodOfExamination, // 考试方式
      courseId: paper.courseId,
      flagSupplementaryExam: false // 非补考
    }
    wx.setStorageSync('parameter', JSON.stringify(data))
    wx.navigateTo({
      url: `/pages/examination-module/examination-paper/index?parameter=${JSON.stringify(data)}`
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

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // 初始化数据
    this.setData({
      examArrangeList: [],
      page: 0,
      activeNames: [],
      flag: true
    })
    // 1.获取考试安排
    this._getExaminationArrangeList()
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
        this._getExaminationArrangeList()
      }, 50)
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})