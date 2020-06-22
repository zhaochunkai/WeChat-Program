import weChatEvaluationPlanSao from '../../../service/weChatEvaluationPlanSao.js'
// pages/evaluate/online-evaluate/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    evaluationPlanList: [],
    courseList: [
      ['trainingProgramsName', '学习项目'],
      ['evaluationName', '评价计划'],
      ['evaluationTypeName', '评价类型'],
      ['beCommentPersonName', '被评对象'],
      ['evaluationPeriod', '评价周期'],
      ['hasBeenEvaluated', '是否评价']
    ],
    active: 'All',
    page: 0,
    flag: true // 触底开关
  },
  // 获取选项卡的值
  onChange(e){
    // console.log(e.detail.name)
    // 根据name的值查询对应时间节点下的数据
    // this._getEvaluationPlanList()
  },
  // 获取评价列表
  _getEvaluationPlanList() {
    let data = {      
      SkipCount: this.data.page * 10,
      MaxResultCount: 10
    }
    weChatEvaluationPlanSao.getEvaluationPlanList(data).then(res => {
      if (res.items.length === 0) {
        this.setData({
          flag: false
        })
      } else {
        this.setData({
          evaluationPlanList: this.data.evaluationPlanList.concat(res.items),
          page: this.data.page + 1
        })
      }
    })
  },
  // 跳转去评价
  toEvaluate(e){
    let item = {
      beCommentPersonLongId: e.currentTarget.dataset.item.beCommentPersonLongId,
      beCommentPersonGuidId: e.currentTarget.dataset.item.beCommentPersonGuidId,
      commentPersonType: e.currentTarget.dataset.item.commentPersonType,
      beCommentPersonType: e.currentTarget.dataset.item.beCommentPersonType,
      id: e.currentTarget.dataset.item.id
    }
    wx.navigateTo({
      url: `/pages/evaluate/online-evaluate/evaluation-comment/index?parameter=${JSON.stringify(item)}`
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // // 初始化数据
    // this.setData({
    //   evaluationPlanList: [],
    //   page: 0,
    //   flag: true // 触底开关
    // })
    // // 获取在线评价列表
    // this._getEvaluationPlanList()
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
      evaluationPlanList: [],
      page: 0,
      flag: true // 触底开关
    })
    // 获取在线评价列表
    this._getEvaluationPlanList()

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
    // console.log(this.data.page)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})