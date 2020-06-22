import weChatface from '../../service/faceRecognition'
Page({
  data: {
    /**
     * 页面的初始数据
     */
    tempFilePaths: '',
    flage1: true,
    flage2: true,
    PositiveImg: '',
    NegativeImg: '',
    icon1Src: '../../images/authentication/icon6.png',
    icon2Src: '../../images/authentication/icon6.png'
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // try {
    //   var res = wx.getSystemInfoSync()
    //   var platform = res.platform
    //   if (platform == 'ios') {
    //     util.msg("警告", "IOS系统暂不支持拍照，请从相册选择照片")
    //     this.setData({
    //       sourceType: ['album']
    //     })
    //   }
    //   console.log(platform)
    // } catch (e) { }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {},
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {},
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {},
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {},
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {},
  // 正面
  frontimage: function () {
    var _this = this;
    var Type = _this.data.sourceType
    //微信小程序提供的众多API中，wx.chooseImage函数就是用来访问手机相册或摄像头的
    wx.chooseImage({
      count: 1, // 默认9 
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有 
      success: function (res) {
        wx.getFileSystemManager().readFile({
          filePath: res.tempFilePaths[0], //选择图片返回的相对路径
          encoding: 'base64', //编码格式
          success: res => { //成功的回调,获取base64码
            _this.setData({
              PositiveImg: res.data,
              icon1Src: '../../images/authentication/icon5.png'
            })
          }
        })
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片;选择成功后替代默认照片
        _this.setData({
          FilePaths: res.tempFilePaths,
          flage1: false
        })
      },
    })
  },
  // 反面
  backimage: function () {
    var _this = this;
    wx.chooseImage({
      count: 1, // 默认9 
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有 
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有 
      success: function (res) {
        wx.getFileSystemManager().readFile({
          filePath: res.tempFilePaths[0], //选择图片返回的相对路径
          encoding: 'base64', //编码格式
          success: res => { //成功的回调,获取base64码
            _this.setData({
              NegativeImg: res.data,
              icon2Src: '../../images/authentication/icon5.png'
            })
          }
        })
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片;选择成功后替代默认照片
        _this.setData({
          recitePaths: res.tempFilePaths,
          flage2: false
        })
      }
    })
  },
  // 提交
  pageJump: function () {
    var _this = this;
    weChatface.Authentication({
      PositiveImg: this.data.PositiveImg,
      NegativeImg: this.data.NegativeImg,
    }).then(res => {
      if (res.statusCode == 204) {
        wx.navigateTo({
          url: '/pages/sucCollection/index?param=1'
        });
        return
      }
      wx.navigateTo({
        url: `/pages/sucCollection/index?param=0&err=${res.data.error.message}`
      });
    });
  },
})