// pages/register/index.js
import weChatBinding from '../../service/weChatBinding'
var config = require('../../common/config.js'); //依赖config.js文件
var rootDocment = config.apiDomain; //获取在config.js文件中的全局变量，域名
Page({

  /**
   * 页面的初始数据
   */
  data: {
    option: [
      { text: '学生', value: 'student' },
      { text: '教师', value: 'teacher' },
    ],
    value: 'student',
    tel: '',
    telRuls: '',
    sms: '',
    telFlag: true,
    btnMsg: '发送验证码',
    count: 60,
    smsflag: false,
    info:{}
  },
  // 手机号验证
  telRuls(e) {
    let reg = /^1[3456789]\d{9}$/;
    if (e.detail.cursor > 0 && e.detail.value) {
      if (!reg.test(e.detail.value)) {
        this.setData({
          telRuls: '请输入合法手机号'
        })
      } else {
        this.setData({
          telRuls: '',
          telFlag: true
        })
      }
    } else {
      this.setData({
        telRuls: '请输入合法手机号'
      })
    }
  },
  // 输入验证码
  sms(e) {
    this.setData({
      sms: e.detail
    })
  },
  // 输入手机号
  phone(e) {
    this.setData({
      tel: e.detail
    })
  },
  // 发送验证码
  sendMsg() {
    if (this.data.telFlag) {
      this.setData({
        btnMsg: '秒',
        smsflag: true
      })
      let a = setInterval(() => {
        this.setData({
          count: this.data.count - 1,
          telFlag: false
        })
        if (this.data.count == 0 || this.data.count < 1) {
          clearInterval(a)
          this.setData({
            count: 60,
            btnMsg: '发送验证码',
            smsflag: false,
            telFlag: true
          })
        }
      }, 1000);
      weChatBinding.sendMsg({
        phoneNumber: this.data.tel,
        personalType: this.data.value
      })
    } else if (this.data.tel.length != 11) {
      wx.showToast({
        title: '请输入正确手机号',
        icon: 'none',
        duration: 2000
      })
    }
  },

  // 绑定验证码
  binding() {
    let that = this
    if (this.data.url == 'applyPage') {
      weChatBinding.weChatBinding({
        tel: this.data.tel,
        verificationCode: this.data.sms
      }).then(res => {
        wx.showModal({
          content: '绑定成功，检测到你正在报名【' + this.data.info.projectName + '】，请确认是否报名',
          success(res) {
            if (res.confirm) {
              var header = {
                WeChatOpenId: wx.getStorageSync('openId')
              };
              header['X-TenantId'] = wx.getStorageSync('TenantId');
              header['content-type'] = 'application/json';
              header['WeChatType'] = 'Applets'
              wx.request({
                url: rootDocment + `/Api/weChatEntry/AgainEnroll?registrationProjectId=${that.data.info.registrationProject}`,
                header: header,
                method: "post",
                success: res => {
                  if (res.statusCode == 204) {
                    wx.showModal({
                      content: '报名成功',
                      showCancel: false,
                      success (res) {
                        wx.switchTab({
                          url: '/pages/index/index'
                        })
                      }
                    })
                  }
                }
              })
            } else if (res.cancel) {
              wx.switchTab({
                url: '/pages/index/index'
              })
            }
          }
        })
      })
    } else {
      weChatBinding.weChatBinding({
        tel: this.data.tel,
        verificationCode: this.data.sms
      }).then(res => {
        wx.showToast({
          title: '绑定成功',
          icon: 'success',
          duration: 2000
        })
        wx.switchTab({
          url: '/pages/index/index'
        })
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    console.log(JSON.parse(wx.getStorageSync('info')))
    this.setData({
      url: options.url,
      info: JSON.parse(wx.getStorageSync('info')),
      tel: JSON.parse(wx.getStorageSync('info')).tel
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