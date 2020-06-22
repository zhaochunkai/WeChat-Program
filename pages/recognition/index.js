import weChatface from '../../service/faceRecognition'
import Dialog from '../../ui-lib/vant/dialog/dialog';
Page({
  data: {
    count: 3,
    face: true
  },
  onLoad(options) {
    console.log(options)
    // 获取上个页面跳转过来的路径
    this.setData({
      url: options.url,
      ultimateUrl: options.ultimateUrl,
      elselink: options.elselink
    })
    this.faceIdentification()
  },
  // 3秒后自动拍照
  faceIdentification() {
    let a = setInterval(() => {
      this.setData({
        count: this.data.count - 1
      })
      if (this.data.count == 0 || this.data.count < 0) {
        clearInterval(a)
        this.setData({
          count: ''
        })
        this.takePhoto()
        // wx.redirectTo({
        //   url: this.data.ultimateUrl,
        // })
      }
    }, 1000)
  },
  // 拍照事件
  takePhoto() {
    const ctx = wx.createCameraContext()
    ctx.takePhoto({
      quality: 'low',
      success: (res) => {
        wx.getFileSystemManager().readFile({
          filePath: res.tempImagePath, //选择图片返回的相对路径
          encoding: 'base64', //编码格式
          success: res => { //成功的回调
            if (this.data.url == 'FaceEntry') {
              // 录入
              weChatface.CreatePerson({
                image: res.data
              }).then(res => {
                if (res.data == '') {
                  wx.showToast({
                    title: '上传成功',
                    icon: 'success',
                    duration: 2000,
                  })
                  setTimeout(() => {
                    wx.navigateBack({
                      delta: 1
                    })
                  }, 1500);
                } else {
                  wx.showToast({
                    title: res.data.error.message,
                    icon: 'none',
                    duration: 2000,
                  })
                  setTimeout(() => {
                    wx.navigateBack({
                      delta: 1
                    })
                  }, 1500);
                }
              })
              // 识别
            } else if (this.data.url == 'VerifyFace') {
              weChatface.VerifyFace({
                image: res.data
              }).then(res => {
                var that = this
                console.log(res)
                if (!res.data.status) {
                  this.setData({
                    face: false
                  })
                  if (res.data.error && res.data.error.message == '图片中没有人脸。') {
                    Dialog.confirm({
                      message: '图片中没有信息，是否重新认证'
                    }).then(() => {
                      this.setData({
                        face: true,
                        count: 3
                      })
                      // 调用五秒事件
                      this.faceIdentification()
                    }).catch(() => {
                      wx.navigateBack({
                        delta: 1
                      })
                    });
                    return;
                  }
                  if (res.data.error && res.data.error.message.indexOf('底照') != -1) {
                    wx.showModal({
                      content: '还未录入底照，请前往 我的->采集 录入底照',
                      showCancel: false,
                      success(res) {
                        if (res.confirm) {
                          wx.navigateBack({
                            delta: 2
                          })
                        }
                      }
                    })
                    return
                  }
                  Dialog.confirm({
                    message: '识别失败，是否重新识别'
                  }).then(() => {
                    this.setData({
                      face: true,
                      count: 3
                    })
                    // 调用五秒事件
                    this.faceIdentification()
                  }).catch(() => {
                    wx.navigateBack({
                      delta: 1
                    })
                  });
                } else {
                  wx.showToast({
                    title: '识别成功',
                    icon: 'success',
                    duration: 2000,
                    success() {
                      wx.redirectTo({
                        url: that.data.ultimateUrl,
                      })
                      if (that.data.elselink == 'study') {
                        // 上传本次考勤记录
                        weChatface.CreateFaceAttendance({
                          trainingProgramsId: wx.getStorageSync('trainingProgramsId'),
                          coursesId: wx.getStorageSync('courseId'),
                          status: res.data.status,
                          score: res.data.score,
                          imageUrl: res.data.imageUrl
                        })
                        return
                      }
                      if (that.data.elselink == 'live') {
                        // 上传本次考勤记录
                        weChatface.UpRecognition({
                          status: res.data.status,
                          score: res.data.score,
                          imageUrl: res.data.imageUrl,
                          liveRoomId: wx.getStorageSync('liveId'),
                        })
                        return
                      }
                    }
                  })
                }
                return;
              })
            }
          }
        })
        this.setData({
          src: res.tempImagePath
        })
      }
    })
  },
  error(e) {
    console.log(e.detail)
  }

})