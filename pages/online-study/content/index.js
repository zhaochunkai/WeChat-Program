import weChatOnlineStudySao from '../../../service/weChatOnlineStudySao.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    knowledgePointId: '',
    trainingProgramsId: '',
    courseId: '',
    Progress: {},
    learningResource: [],
    name: '',
    level:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.judge(options.level)
    let knowledgePointId = options.knowledgePointId;
    let trainingProgramsId = options.trainingProgramsId;
    let courseId = options.courseId;
    let name = options.name;
    this.setData({
      courseInfo: options.courseInfo,
      knowledgepoint: options,
      knowledgePointId: knowledgePointId,
      trainingProgramsId: trainingProgramsId,
      courseId: courseId,
      name: name,
      title: options.level
    })
    this.studyschedule()
    this.studyresource()
  },
  onShow: function() {
    console.log('show')
    this.studyschedule()
    this.studyresource()
  },
  // 总体学习进度
  studyschedule() {
    weChatOnlineStudySao.getStudyProgress({
      trainingProgramId: this.data.trainingProgramsId,
      courseId: this.data.courseId,
      chaptersSectionsKnowledgePointId: this.data.knowledgePointId,
      type: this.data.level
    }).then(res => {
      this.setData({
        Progress: res
      })
    })
  },

  // 学习资源
  studyresource() {
    weChatOnlineStudySao.getOnlineStudyResource({
      trainingProgramId: this.data.trainingProgramsId,
      courseId: this.data.courseId,
      chaptersSectionsKnowledgePointId: this.data.knowledgePointId,
      type: this.data.level
    }).then(res => {
      this.setData({
        learningResource: res.items
      })
    })
  },

  // 进入学习页面
  go(e) {
    wx.setStorageSync('resourceId', e.currentTarget.dataset.items.resourceId)
    // 调用资源总次数
    this._putIncreaseBrowseCountApi(e.currentTarget.dataset.items.resourceId)
    // 单人调用
    this._IncreaseStudentStudyBrowseCount()
    weChatOnlineStudySao.pdf({
      fileName: e.currentTarget.dataset.filepath
    }).then(res => {
      wx.navigateTo({
        url: `/pages/online-study/content-detail/index?url=${JSON.stringify(res)}&items=${JSON.stringify(e.currentTarget.dataset.items)}&level=${this.data.level}`
      })
    })
  },

  // 单次资源访问
  _putIncreaseBrowseCountApi(resourceId){
    weChatOnlineStudySao.putIncreaseBrowseCount({
      resourceId:resourceId
    }).then(res=>{
      console.log(res)
    })
  },

  // 个人访问
  _IncreaseStudentStudyBrowseCount(){
    weChatOnlineStudySao.IncreaseStudentStudyBrowseCount({
      trainingProgramId:wx.getStorageSync('trainingProgramsId'),
        courseId:wx.getStorageSync('courseId'),
        chaptersSectionsKnowledgePointId:wx.getStorageSync('knowledgePointId'), // 章节知识点id
        type:'KnowledgePoint',  // 节点类型：Chapter, Section, KnowledgePoint
        resourceId:wx.getStorageSync('resourceId'),
    }).then(res=>{
      console.log(res)
    })
  },

  // 判断章节知识点
  judge(e){
    if(e=='章'){
      this.setData({
        level: 'Chapter'
      })
      return
    }
    if(e=='节'){
      this.setData({
        level: 'Section'
      })
      return
    }
    if(e=='知识点'){
      this.setData({
        level: 'KnowledgePoint'
      })
      return
    }
  },
  // 去在线练题
  goWork() {
    wx.navigateTo({
      url: `/pages/online-study/exercise/index?knowledgePoint=${JSON.stringify(this.data.knowledgepoint)}`,
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},


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