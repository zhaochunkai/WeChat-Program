// pages/online-study/work/index.js
import weChatQuestion from '../../../service/weChatQuestion.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    check: [],
    checkFlag: [],
    answer: [],
    radioChange: 'radioChange'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      knowledgePoint: JSON.parse(options.knowledgePoint),
      courseInfo: JSON.parse(JSON.parse(options.knowledgePoint).courseInfo)
    })
    this.getRandomQuestion()
  },
  // 获取试题
  getRandomQuestion() {
    weChatQuestion.getRandomQuestion({
      KnowledgePointId: this.data.knowledgePoint.knowledgePointId
    }).then(res => {
      let re = JSON.parse(JSON.stringify(res))
      this.setData({
        unTestQuestions: re
      })
      Object.keys(res).forEach(() => {
        res['answerAnalysis'] = decodeURIComponent(res['answerAnalysis'])
        res['paperTitle'] = decodeURIComponent(res['paperTitle'])
        res['questionSubjectOptions'].map((item) => {
          item.optionContent = decodeURIComponent(item.optionContent)
        })
        res['questionSubjectOptions'].sort((a, b)=> {
          return a.optionNumber.localeCompare(b.optionNumber)
        })
      })
      this.setData({
        testQuestions: res
      })
    })
  },
  // 单选框单击事件
  radioChange(event) {
    this.data.unTestQuestions.questionSubjectOptions.map(r=>{
      if(r.id == event.currentTarget.dataset.selectdetail.id){
        r.flagChoose = true
      }else{
        r.flagChoose = false
      }
    })
    this.setData({
      unTestQuestions: this.data.unTestQuestions
    })
    this.setData({
      radio: event.currentTarget.dataset.selectdetail.id,
      flagAnswer: event.currentTarget.dataset.selectdetail.flagAnswer,
      answer: event.currentTarget.dataset.selectdetail.optionNumber
    });
  },
  // 多选择
  CheckChange(event) {
    var index = this.data.check.indexOf(event.currentTarget.dataset.selectdetail.id)
    if (index > -1) {
      this.data.check.splice(index, 1)
      this.data.checkFlag.splice(index, 1)
      this.data.answer.splice(index, 1)
    } else {
      this.data.check.push(event.currentTarget.dataset.selectdetail.id)
      this.data.checkFlag.push(event.currentTarget.dataset.selectdetail.flagAnswer)
      this.data.answer.push(event.currentTarget.dataset.selectdetail.optionNumber)
    }
    var flagAnswer = this.data.checkFlag.every(item => {
      return item == true
    })
    this.data.unTestQuestions.questionSubjectOptions.map(r=>{
      if(r.id == event.currentTarget.dataset.selectdetail.id){
        if(index > -1){
          r.flagChoose = false
          return
        }
        r.flagChoose = true
      }
    })
    this.setData({
      check: this.data.check,
      flagAnswer: flagAnswer,
      answer: this.data.answer
    })
  },
  // 下一题
  nextTopic() {
    this.getRandomQuestion()
    this.setData({
      flagSubmit: false,
      radio: '',
      check: [],
      answer: [],
      radioChange: 'radioChange'
    })
  },
  // 提交
  submit() {
    if (this.data.answer.length == 0) {
      wx.showToast({
        title: '请选择答案后提交',
        icon: 'none',
      })
      return
    }
    weChatQuestion.getCreateWeChatTryToPractice({
      flagAnswerCorrect: this.data.flagAnswer,
      knowledgePointId: this.data.knowledgePoint.knowledgePointId,
      questionId: this.data.unTestQuestions.id,
      questionName: this.data.unTestQuestions.paperTitle,
      questionRecord: this.data.unTestQuestions.questionSubjectOptions,
      answerAnalysis: this.data.unTestQuestions.answerAnalysis,
    }).then(res => {
      this.setData({
        flagSubmit: true,
        radioChange: ''
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
  onShow: function () {},

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