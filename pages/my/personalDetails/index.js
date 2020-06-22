// pages/my/personalDetails/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    fileList: [],
    actions: [{
        "name": "博士",
        "code": "5"
      },
      {
        "name": "硕士",
        "code": "4"
      },
      {
        "name": "双学士",
        "code": "3"
      },
      {
        "name": "本科",
        "code": "2"
      },
      {
        "name": "大专",
        "code": "1"
      },
      {
        "name": "高中中专及以下",
        "code": "0"
      },
    ],
    gender: [{
        "name": "男性",
        "code": "1"
      },
      {
        "name": "女性",
        "code": "2"
      },
      {
        "name": "未知的性别",
        "code": "0"
      },
      {
        "name": "未说明的性别",
        "code": "9"
      }
    ],
  },
  afterRead(event) {
    const {
      file
    } = event.detail;
    console.log(file)
    // 当设置 mutiple 为 true 时, file 为数组格式，否则为对象格式
    wx.uploadFile({
      url: 'https://example.weixin.qq.com/upload', // 仅为示例，非真实的接口地址
      filePath: file.path,
      name: 'file',
      formData: {
        user: 'test'
      },
      success(res) {
        // 上传完成需要更新 fileList
        const {
          fileList = []
        } = this.data;
        fileList.push({
          ...file,
          url: res.data
        });
        this.setData({
          fileList
        });
      },
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let info = JSON.parse(options.info)
    Object.keys(info).forEach(function (key) {
      if (key == 'birthday') {
        info['birthday'] = info['birthday'].substring(0,10)
      }
    });
    this.setData({
      studentInfo: info
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
  onShow: function () {
    this.setData({
      userInfo: JSON.parse(wx.getStorageSync('userInfo'))
    })
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