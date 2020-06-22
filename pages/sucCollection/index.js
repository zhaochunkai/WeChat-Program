Page({

  /**
   * 页面的初始数据
   */
  data: {
    // src: '../../images/authentication/icon3.png'
    flage1: false,
    flage2: false,
    error: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (e) {
    if(e.param==1){
      this.setData({
        flage1: true
      });
      wx.showToast({
        title: '认证成功',
        icon: 'success',
        success(){
          setTimeout(() => {
            wx.navigateTo({
              url: "/pages/index/index"
            })
          }, 1500);
        }
      })
      return
    }else{
      this.setData({
        error: e.err,
        flage2: true
      })
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