var config = require('./common/config'); //依赖config.js文件
var rootDocment = config.apiDomain; //获取在config.js文件中的全局变量，域名


App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        if (res.code) {
          let url = rootDocment + '/Api/WeChatApplets/AppletsOpenId';
          wx.showLoading({
            title: '正在初始化中',
          })
          wx.request({
            url: url,
            data: {
              jsCode: res.code
            },
            success: function (result) {
              wx.hideLoading()
              console.log(result.data)
              // wx.showToast({
              //   title: result.data,
              //   icon:'none'
              // })
              wx.setStorageSync('openId', result.data)
            }
          })
        }
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
    // 判断租户id过期时间   30天有效期
    if(wx.getStorageSync('TenantExpirationTime') < Math.floor(new Date().getTime()/1000)){
      wx.removeStorageSync('TenantExpirationTime')
      wx.removeStorageSync('TenantId')
    }
  },
  globalData: {
    userInfo: null
  },
  dealNetworkData: function (res) {
    // console.log(res.networkType)
    this.globalData.networkType = res.networkType;
    if (res.networkType == 'none') {
      wx.showModal({
        title: "提示",
        content: "当前网络异常，请检查网络并重新刷新",
        showCancel: false,
        confirmText: "知道了",
      });
    }
  }
})