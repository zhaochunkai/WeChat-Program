// pages/examination-module/examination-paper/index.js

import weChatExamination from '../../../service/weChatExamination.js'
import Dialog from '../../../ui-lib/vant/dialog/dialog';
import Notify from '../../../ui-lib/vant/notify/notify';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    parameter: {},
    examinationInfo: {}, // 考试详情
    questionIndex: 0, // 当前试题对应的下标
    questionContent: {}, // 当前试题内容
    questionLists: [], // 试卷中的所有试题的集合
    radio: '', // 单选
    checkedList: [], // 复选
    clearTime: null, // 定时器
    time: 0, // 考试提供时长，主要用于页面倒计时展示，单位 毫秒
    resetTime: null, // 剩余时长，用于判断交卷，单位 秒
    isSave: false, // 是否保存过的状态。默认false-未交卷
    questionTypeList: [
      { name: 'SingleChoice', label: '单选题' },
      { name: 'MultipleChoice', label: '多选题' },
      { name: 'TrueFalse', label: '判断题' }
      // {name: 'BlankFill', label: '填空题'},
      // {name: 'ShortAnswer', label: '解答题'},
      // {name: 'Read', label: '阅读题'}
    ],
    answerVisible: false, // 是否显示答题卡
  },
  // 获取试卷内容
  _getExaminationPaperById() {
    let data = {
      id: this.data.parameter.examinationPaperId,
      classId: this.data.parameter.classId,
      ExamSupplementaryArrangeId: '',
      examinationArrangeId: ''
    };
    // 判断是否是补考
    if (this.data.parameter.flagSupplementaryExam) {
      // 补考：只传递补考安排id，考试id为null
      data.ExamSupplementaryArrangeId = this.data.parameter.id
      data.examinationArrangeId = null
    } else {
      // 正式考|模拟考：只传递安排id
      data.ExamSupplementaryArrangeId = null
      data.examinationArrangeId = this.data.parameter.examinationArrangeId
    }
    weChatExamination.getExaminationPaperById(data).then(res => {
      // 针对用户提供操作说明
      Notify({
        message: '1.点击左上角箭头将自动交卷！2.点击右上角圆点隐藏小程序后，后台将继续计时并到点交卷！',
        color: '#fff',
        background: '#F00',
        duration: 120000,
      });
      res.data.examPaperQuestions.forEach(el => {
        el.examPaperQuestionOptionsRequests = JSON.parse(JSON.stringify(el.examPaperQuestionOptionsResponse))
        delete (el.examPaperQuestionOptionsResponse)
      })
      let newExamPaperQuestions = []
      this.data.questionTypeList.forEach(item => {
        let obj = Object.assign({}, item, { children: [] })
        item.children = []
        res.data.examPaperQuestions.forEach(el => {
          if (item.label === el.questionTypeName) {
            item.children.push(el)
            newExamPaperQuestions.push(el)
          }
        })
      })
      this.setData({
        time: res.data.examinationInformation.examinationDuration * 60 * 1000, // 考试要求时长
        resetTime: res.data.examinationInformation.examinationDuration * 60, // 后台页面剩余时长
        questionLists: newExamPaperQuestions, // 试题列表
        questionTypeList: this.data.questionTypeList, // 各题型数据
        examinationInfo: res.data.examinationInformation // 试卷基本信息
      })
      if (res.data.examPaperQuestions.length > 0) {
        // 获取第一个元素，赋值给this.data.questionContent
        this.setData({
          questionContent: newExamPaperQuestions[0] // 页面默认展示试题内容
        })
      }
    })
  },
  // 切换到指定题目
  changeQuestion(e) {
    // 新的试题下标
    let typeIndex = Number(e.currentTarget.dataset.index)  // 题型所在的下标
    let questionIndex = Number(e.currentTarget.dataset.num) // 当前题型下，题目所在的下标
    let lenIndex = null;
    for (let i = 0; i < this.data.questionTypeList.length; i++) {
      let len = this.data.questionTypeList[i].children.length
      if (i < typeIndex) {
        lenIndex += len
      } else if (i == typeIndex) {
        lenIndex += questionIndex
      }
    }
    // 生成新的试题内容和选项选择状态
    this.generateQuestionContent(lenIndex)
    this.setData({
      checkedList: this.data.checkedList
    })
  },
  // 切换上一题或下一题
  nextQuestion(e) {
    // 当前下标
    let currentIndex = Number(e.currentTarget.dataset.index)
    let newIndex = this.data.questionIndex + currentIndex
    // 生成新的试题内容和选项选择状态
    this.generateQuestionContent(newIndex)
    this.setData({
      checkedList: this.data.checkedList
    })
  },
  // 根据新的元素下标，生成新的试题内容和选项选择状态
  generateQuestionContent(newQesIndex) {
    // 新的试题内容
    let questionContent = this.data.questionLists[newQesIndex]
    // 选项初始化
    let radio = ''
    let checkedList = []
    questionContent.examPaperQuestionOptionsRequests.forEach(item => {
      if (item.flagChecked) {
        radio = item.questionSubjectOptionId
        checkedList.push(item.questionSubjectOptionId)
      }
    })
    questionContent.checkedList = checkedList
    this.setData({
      radio: radio, // 初始化单选数据
      checkedList: checkedList, // 初始化复选数据
      questionIndex: newQesIndex,
      questionContent: questionContent,
      answerVisible: false
    })
  },
  // 单选事件
  radioChange(e) {
    let questionContent = this.data.questionContent
    // 对每个选项的选择状态进行标记
    this.data.questionContent.examPaperQuestionOptionsRequests.forEach(item => {
      item.flagChecked = false
      if (item.questionSubjectOptionId === e.currentTarget.dataset.selectdetail.questionSubjectOptionId) {
        item.flagChecked = true
      }
    })
    this.data.questionContent.radio = e.currentTarget.dataset.selectdetail.questionSubjectOptionId
    // 将选项选中
    this.setData({
      radio: e.currentTarget.dataset.selectdetail.questionSubjectOptionId,
      questionContent: this.data.questionContent
    })
  },
  // 复选事件
  checkChange(e) {
    // 查询当前选中的元素在选中数组checkedList中对应的下标
    var index = this.data.checkedList.indexOf(e.currentTarget.dataset.selectdetail.questionSubjectOptionId);
    if (index > -1) {
      // 如果存在则从选中数组checkedList删除
      this.data.checkedList.splice(index, 1)
    } else {
      // 不存在则向选中数组checkedList中添加
      this.data.checkedList.push(e.currentTarget.dataset.selectdetail.questionSubjectOptionId)
    }
    // 对每个选项的选择状态进行标记
    this.data.questionContent.examPaperQuestionOptionsRequests.forEach(item => {
      item.flagChecked = false
      if (this.data.checkedList.indexOf(item.questionSubjectOptionId) > -1) {
        item.flagChecked = true
      }
    })
    this.data.questionContent.checkedList = this.data.checkedList
    this.setData({
      checkedList: this.data.checkedList,
      questionContent: this.data.questionContent
    })
  },
  // 生成考试相关内容
  generageExamPaperContent() {
    let examPaperHeader = Object.assign({}, this.data.examinationInfo, {
      trainingProgramsId: this.data.parameter.trainingProgramId
    })
    let data = {
      classId: this.data.parameter.classId,
      constructionExaminationPaperId: this.data.parameter.examinationPaperId, // 试卷id
      examinationType: this.data.parameter.examinationType, // 考试类型
      methodOfExamination: this.data.parameter.methodOfExamination, // 考试方式
      courseId: this.data.parameter.courseId, // 课程id
      flagSupplementaryExam: this.data.parameter.flagSupplementaryExam, // 是否补考 true-补考
      examPaperHeader: examPaperHeader, // 试题信息
      examPaperRequest: this.data.questionLists // 试题列表
    };
    // 判断是否是补考
    if (this.data.parameter.flagSupplementaryExam) {
      // 补考：需要传递补考安排的id 、 考试安排的id
      data.ExamSupplementaryArrangeId = this.data.parameter.id
      data.examinationArrangeId = this.data.parameter.examinationArrangeId
    } else {
      // 正式考|模拟考：只需要考试安排id 、 补考安排id为null
      data.ExamSupplementaryArrangeId = null
      data.examinationArrangeId = this.data.parameter.examinationArrangeId
    }
    return data
  },
  // 交卷接口公共函数
  _commonSubmitExaminationPaper(data) {
    weChatExamination.submitExaminationPaper(data).then(res => {
      this.setData({
        isSave: true
      })
      wx.showToast({
        title: '试卷提交成功',
        icon: 'success',
        duration: 2000
      })
    })
    setTimeout(() => {
      wx.navigateBack({
        delta: 1
      })
    }, 2000)
  },
  // 提交试卷
  _submitExaminationPaper() {
    let data = this.generageExamPaperContent()
    let that = this
    wx.showModal({
      title: '提示',
      content: '试卷一旦提交后将不能再进行更改，是否继续提交？',
      success(res) {
        if (res.confirm) {
          if (!that.data.isSave) {
            that._commonSubmitExaminationPaper(data)
          }
        } else if (res.cancel) {

        }
      }
    })
  },
  // 显示答题卡
  showAnswerCard() {
    this.data.questionTypeList.forEach(ques => {
      ques.children.forEach(el => {
        // 选项初始化
        let radio = ''
        let checkedList = []
        el.examPaperQuestionOptionsRequests.forEach(item => {
          if (item.flagChecked) {
            radio = item.questionSubjectOptionId
            checkedList.push(item.questionSubjectOptionId)
          }
        })
      })
    })
    this.setData({
      answerVisible: true,
      questionTypeList: this.data.questionTypeList
    })
  },
  // 隐藏答题卡
  onClose() {
    this.setData({ answerVisible: false });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      parameter: JSON.parse(wx.getStorageSync('parameter')),
      isSave: false
    })
    // 如果试卷的试题集合中是空白的，则获取试题
    if (this.data.questionLists.length === 0) {
      this._getExaminationPaperById()
    }
    // 进入页面就增加定时器，每秒
    this.data.clearTime = setInterval(() => {
      if (this.data.resetTime === 10 * 60) {
        Dialog.alert({
          message: '请注意时间，离考试结束还有10分钟！'
        }).then(() => {
        })
      }
      if (this.data.resetTime <= 1) {
        wx.showToast({
          title: '结束考试，即将自动交卷！',
          icon: 'none'
        })
        clearInterval(this.data.clearTime)
        this.setData({ clearTime: 0 })
        setTimeout(() => {
          let data = this.generageExamPaperContent()
          if (!this.data.isSave) {
            this._commonSubmitExaminationPaper(data)
          }
        }, 1000);
        return;
      }
      this.setData({
        resetTime: this.data.resetTime - 1
      })
    }, 1000);

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
    // 对于直接隐藏，不做任何处理，照常计时和交卷
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    clearInterval(this.data.clearTime)
    this.setData({ clearTime: 0 })
    setTimeout(() => {
      let data = this.generageExamPaperContent()
      if (!this.data.isSave) {
        this._commonSubmitExaminationPaper(data)
      }
    }, 1);
    wx.showToast({
      title: '试卷提交成功',
      icon: 'none',
      duration: 2000
    })
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