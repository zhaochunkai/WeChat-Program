// pages/evaluate/online-evaluate/evaluation-comment/index.js
import weChatEvaluationPlanSao from '../../../../service/weChatEvaluationPlanSao.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    parameter: '',
    courseList: [
      ['trainingProgramsName', '学习项目'],
      ['evaluationName', '评价计划'],
      ['evaluationTypeName', '评价类型'],
      ['beCommentPersonName', '被评对象'],
      ['evaluationPeriod', '评价周期'],
      ['hasBeenEvaluated', '是否评价']
    ],
    evaluationPlanInfo: {},
    indicators:[]
  },
  // 获取评价详情
  _getEvaluationPlanById(){
    weChatEvaluationPlanSao.getEvaluationPlanById(this.data.parameter).then(res => {
      // 未评价时，指标默认满分
      if (!res.hasBeenEvaluated){
        res.indicators.forEach(item => {
          item.score = 5
        })
      }
      this.setData({
        evaluationPlanInfo: res,
        indicators: res.indicators
      })
    })
  },
  // 评分
  onChangeRate(e){
    let item = e.currentTarget.dataset.item
    let score = e.detail
    this.data.indicators.forEach(el => {
      if (el.evaluationIndicatorId == item.evaluationIndicatorId){
        el.score = score
      }
    })
    this.setData({
      indicators: this.data.indicators
    })
  },
  // 评论内容
  onChangeContent(e) {
    this.data.evaluationPlanInfo.content = e.detail
    this.setData({
      evaluationPlanInfo: this.data.evaluationPlanInfo
    })
  },
  // 保存评价
  save() {
    if (!this.data.evaluationPlanInfo.content) {
      wx.showToast({
        title: '请输入评价内容！',
        icon: 'none',
        duration: 2000
      })
      return;     
    }
    let data = Object.assign({}, this.data.evaluationPlanInfo, {
      indicators: this.data.indicators,
      commentPersonType: this.data.parameter.commentPersonType,
      beCommentPersonType: this.data.parameter.beCommentPersonType,
    })
    weChatEvaluationPlanSao.submitEvaluationPlanById(data).then(res => {
      wx.showToast({
        title: '提交成功',
        icon: 'success',
        duration: 2000
      })
      setTimeout(() => {
        wx.navigateBack({
          delta: 1
        })
      },2000)
    })
    
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      parameter: JSON.parse(options.parameter)
    })
    this._getEvaluationPlanById()
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