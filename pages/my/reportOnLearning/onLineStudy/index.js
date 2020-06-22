// pages/my/reportOnLearning/basicInformation/index.js
import myApi from '../../../../service/myApi.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  // 获取树结构
  treeList() {
    myApi.getOnlineStudy({
      projectId: this.data.projectDetail.id
      // projectId: 8079
    }).then(res => {
      res.map(ite=>{
        ite.learningRecord.map(i=>{
          i.checkFlag = false
          if(i.children != 0){
            i.children.map(r=>{
              r.checkFlag = false
              if(r.children != 0){
                r.children.map(e=>{
                  e.checkFlag = false
                })
              }
            })
          }
        })
      })
      this.setData({treeDetail:res})
    })
  },
  change(e) {
    console.log(e.currentTarget.dataset.detail.checkFlag)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      projectDetail: JSON.parse(options.projectDetail)
    })
    this.treeList()
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