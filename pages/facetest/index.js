const AUTH_MODE = 'facial'

Page({
  startAuth() {
    wx.checkIsSupportFacialRecognition({
      checkAliveType: 2,
      success: res => {
        if (res.errCode === 0 || res.errMsg === "checkIsSupportFacialRecognition:ok") {
          //调用人脸识别
          wx.startFacialRecognitionVerify({
            name: '杜娟',
            idCardNumber: '513723199702050755',
            success:res=>{
              console.log(res)
            }
          })
        }
        wx.showToast('微信版本过低，暂时无法使用此功能，请升级微信最新版本')
      }
    })
  }
})