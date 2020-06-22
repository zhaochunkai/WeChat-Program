// pages/evaluate/online-attendance/index.js
import weChatAttendanceSao from '../../../service/weChatAttendanceSao.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
      // time: 30 * 60 * 60 * 1000,
      flag: false
  },
  // 获取考勤列表
  getAttendanceTodo(){
    weChatAttendanceSao.getAttendanceTodo().then(res=>{
      if(res.length == 0){
        this.setData({
          flag: true
        })
        return
      }
      res.map(item=>{
        item.date = new Date(item.endTime).getTime() - new Date().getTime()
        item.startTime = item.startTime.substring(0,10)
        item.endTime = this.dateFunction(item.endTime)
        if(item.pointInTime=='Forenoon'){
          item.pointInTimeName='上午'
        }else if(item.pointInTime=='AfterNoon'){
          item.pointInTimeName='下午'
        }else if(item.pointInTime == 'Night'){
          item.pointInTimeName='晚上'
        }
        if(item.section==1){
          item.knob='一'
        }else if(item.section==2){
          item.knob='二'
        }else if(item.section == 3){
          item.knob='三'
        }else if(item.section == 4){
          item.knob='四'
        }
      })
      this.setData({
        dataDetail: res[0]
      })
    })
  },
  // 获取input值
  input(e){
    this.setData({
      input: e.detail
    })
  },
  // 时间处理
  dateFunction(time){
    var zoneDate = new Date(time).toJSON()
    var date = new Date(+new Date(zoneDate)+8*3600*1000).toISOString().replace(/T/g,' ').replace(/\.[\d]{3}Z/,'')
    return date
  },
  // 完成签到
  signIn (){
    weChatAttendanceSao.postAccept({
      trainingProgramId: this.data.dataDetail.trainingProgramId,
      classId: this.data.dataDetail.classId,
      courseId: this.data.dataDetail.courseId,
      section: this.data.dataDetail.section,
      authCode: this.data.input,
      pointInTime: this.data.dataDetail.pointInTime
    }).then(()=>{
      wx.showModal({
        content: '签到成功', 
        showCancel: false,
        success() {
          wx.navigateBack({
            delta: 1
          })
        }
      })
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
    this.getAttendanceTodo()
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