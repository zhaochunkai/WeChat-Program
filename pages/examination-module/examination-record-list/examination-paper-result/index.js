import weChatExamination from '../../../../service/weChatExamination.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    parameter:{}, // 正式|补考页面传参
    recordId:'', // 模拟考试页面传递的记录id
    examinationType: null, // 考试类型
    flagSupplementaryExam: null, // 是否补考
    examPaperInfo:{}, // 答卷详情
    examPaperQuestions: {}, // 答卷试题集合
    questionTypeList: [
      { name: 'SingleChoice', label: '单选题' },
      { name: 'MultipleChoice', label: '多选题' },
      { name: 'TrueFalse', label: '判断题' }
      // {name: 'BlankFill', label: '填空题'},
      // {name: 'ShortAnswer', label: '解答题'},
      // {name: 'Read', label: '阅读题'}
    ],
  },
  // 获取考试记录列表
  _getExamPaperRecordList() {
    // "模拟考试" Simulation = 1, "正式考试" Official = 2, "全部" All = 3
    let data = {
      examinationArrangeId: this.data.parameter.examinationArrangeId, // 考试安排id
      examinationPaperId: this.data.parameter.examinationPaperId, // 试卷id
      courseId: this.data.parameter.courseId, // 课程id
      courseName: this.data.parameter.courseName, // 课程名称
      examinationType: this.data.parameter.examinationType, // 考试类型
      classId: this.data.parameter.classId, // 考试类型
    }
    weChatExamination.getExamPaperRecordList(data).then(res => {
      if (res.data.items.length > 0) {
        this.setData({
          recordId: res.data.items[0].id
        })
        this._getExamPaperRecordDetailById()
      }
    })
  },
  // 获取考试记录详情
  _getExamPaperRecordDetailById() {
    let data = {
      id: this.data.recordId
    }
    weChatExamination.getExamPaperRecordDetailById(data).then(res => {

      let newExamPaperQuestions = []
      let examPaperQuestions = JSON.parse(res.data.examPaperContent).ExamPaperRequest
      this.data.questionTypeList.forEach(item => {
        let obj = Object.assign({}, item, { children: [] })
        examPaperQuestions.forEach(el => {
          if (item.label === el.QuestionTypeName) {
            let checkedList = []
            let checkedListLetter = []
            let correctAns = ''
            el.CorrectAnswerLetter = []
            el.ExamPaperQuestionOptionsRequests.forEach(ops => {
              if (ops.FlagChecked === true) {
                checkedList.push(ops.QuestionSubjectOptionId) // 选择的答案id集合
                checkedListLetter.push(ops.OptionNumber) // 选择的答案选项集合
              }
              if (
                el.CorrectAnswerId.indexOf(ops.QuestionSubjectOptionId) !==
                -1
              ) {
                correctAns += ops.OptionNumber + ' '
                el.CorrectAnswerLetter.push(ops.OptionNumber) // 选择的答案选项集合
              }
            })
            checkedList = checkedList.sort((a, b) => a - b) // 选择的答案id集合
            checkedListLetter = checkedListLetter.sort((a, b) => a - b) // 选择的答案选项集合
            let correctAnswerLetter = el.CorrectAnswerLetter.sort((a, b) => a - b) // 正确答案的选项集合
            if (
              checkedListLetter.length > 0 &&
              JSON.stringify(correctAnswerLetter) ===
              JSON.stringify(checkedListLetter)
            ) {
              el.judgeAnswer = '回答正确'
              this.correctAnsCount++
            } else {
              el.judgeAnswer = '回答错误'
              this.errorAnsCount++
            }
            if (item.name === 'SingleChoice' || item.name === 'TrueFalse') {
              el.checkValue = Number(checkedList.join(','))
            }
            el.checkValue = checkedList.join(',')
            el.checkedList = checkedList
            el.correctAns = correctAns
            obj.children.push(el)
          }
        })
        newExamPaperQuestions.push(obj)
      })
      this.setData({
        examinationType: res.data.examinationType,
        flagSupplementaryExam: res.data.flagSupplementaryExam,
        examPaperInfo: JSON.parse(res.data.examPaperContent),
        examPaperQuestions: newExamPaperQuestions
      })
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.parameter){
      // 从正式|补考页面过来
      this.setData({
        parameter: JSON.parse(options.parameter)
      })
      // 先获取考试记录，通过记录id获取数据
      this._getExamPaperRecordList()
    } else {
      // 从模拟考试页面过来
      this.setData({
        recordId: options.id
      })
      this._getExamPaperRecordDetailById()
    }
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