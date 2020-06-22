import weChatOnlineStudySao from '../../../service/weChatOnlineStudySao'
import Dialog from '../../../ui-lib/vant/dialog/dialog';
import weChatface from '../../../service/faceRecognition'
Page({
  /**
   * 页面的初始数据
   */
  data: {
    url: '',              // 页面链接
    videoBtn: false,      // 视频控制器
    imgBtn: false,        // 图片控制器
    audioBtn: false,      // 音频控制器
    PdfBtn: false,        // 文档控制器
    detail: {},           // 知识点详情
    learningTimeTimer: '',              // 学习时间定时器
    learningTime: 0,                // 学习时间
    displayTime: '0秒',         // 汉字展示秒数
    ViewTimeFlag: true,      // 根据学习进度是否已满来判断学习定时器是否出现
    FaceAuthenticationPage: false,     // 拍照页面
    LearningPage: true,  // 学习页面
    FaceCycleTimer: '',    // 周期定时器
    count: 3,             // 拍照倒计时
    videoTime: 0
  },

  // 生命周期函数--监听页面加载
  onLoad: function (options) {
    // 进来立即调用
    this.audioCtx = wx.createAudioContext('myAudio')
    this.promptlyFace(0)
    this.setData({
      type: options.level
    })
    this.setData({
      detail: JSON.parse(options.items),
      videoBtn: false,
      imgBtn: false,
      audioBtn: false,
      PdfBtn: false
    })
    // 判断是否传了资源服务器地址
    if (JSON.parse(options.url).domainName.length !== 0) {
      this.setData({
        url: JSON.parse(options.url).domainName + JSON.parse(options.url).filePath
      })
    } else {
      this.setData({
        url: 'https://ets-wechat.gedewisdom.com/' + JSON.parse(options.url).filePath
      })
    }
    // 判断学习进度
    this.learningProgress()
    // 截取后三位判断是什么资源
    this.DetermineTheAddress()
  },

  // 生命周期函数--监听页面隐藏
  onHide: function () {
  },

  // 生命周期函数--监听页面卸载
  onUnload: function () {
    // 保存学习进度
    this.SaveLearningProgress()
    clearTimeout(this.data.FaceCycleTimer)
    clearInterval(this.data.learningTimeTimer)
    // wx.removeStorageSync('timer')
  },

  // 生命周期函数--监听页面初次渲染完成
  onReady: function () {
  },

  // 生命周期函数--监听页面显示
  onShow: function () { },

  // 截取后三位判断是什么资源
  DetermineTheAddress() {
    let str = this.data.url.substr(this.data.url.lastIndexOf(".") + 1)
    let imgUrl = ['bmp', 'jpg', 'png', 'tif', 'gif', 'pcx', 'tga', 'exif', 'fpx', 'svg', 'psd', 'cdr', 'pcd', 'dxf', 'ufo', 'eps', 'ai', 'raw', 'WMF', 'webp']
    let audioUrl = ['ogg', 'wav', 'mp3']
    let PdfUrl = ['txt', 'pdf', 'doc', 'docx', 'rtf', 'fodt', 'odt', 'ods', 'odp', 'xls', 'xlsx', 'ppt', 'pptx']
    if (str) {
      // 图片
      if (imgUrl.indexOf(str) !== -1) {
        this.setData({
          imgBtn: true
        })
        // 调用学习定时器
        this._learningTimeTimer()
        // 获取后端传过来的时间做周期调用
        this.RandomVerification()
        // 音频
      } else if (audioUrl.indexOf(str) !== -1) {
        this.setData({
          audioBtn: true
        })
        // 调用学习定时器
        this._learningTimeTimer()
        // 获取后端传过来的时间做周期调用
        this.RandomVerification()
        // 文档
      } else if (PdfUrl.indexOf(str) !== -1) {
        this.setData({
          PdfBtn: true
        })
        // 视频
      } else if (str === 'mp4') {
        this.setData({
          videoBtn: true,
          videoType: 'mp4'
        })
        // 调用学习定时器
        this._learningTimeTimer()
        // 获取后端传过来的时间做周期调用
        this.RandomVerification()
      }
    }
  },

  // 时间定时器
  _learningTimeTimer() {
    console.log('调用时间定时器')
    this.data.learningTimeTimer = setInterval(() => {
      this.setData({
        learningTime: this.data.learningTime + 1,
        displayTime: this.formatSeconds(this.data.learningTime)
      })
    }, 1000);
  },
  // 时间转换方法
  formatSeconds(value) {
    var theTime = parseInt(value); // 需要转换的时间秒 
    var theTime1 = 0; // 分 
    var theTime2 = 0; // 小时 
    var theTime3 = 0; // 天
    if (theTime > 60) {
      theTime1 = parseInt(theTime / 60);
      theTime = parseInt(theTime % 60);
      if (theTime1 > 60) {
        theTime2 = parseInt(theTime1 / 60);
        theTime1 = parseInt(theTime1 % 60);
        if (theTime2 > 24) {
          //大于24小时
          theTime3 = parseInt(theTime2 / 24);
          theTime2 = parseInt(theTime2 % 24);
        }
      }
    }
    var result = '';
    if (theTime > 0) {
      result = "" + parseInt(theTime) + "秒";
    }
    if (theTime1 > 0) {
      result = "" + parseInt(theTime1) + "分" + result;
    }
    if (theTime2 > 0) {
      result = "" + parseInt(theTime2) + "小时" + result;
    }
    if (theTime3 > 0) {
      result = "" + parseInt(theTime3) + "天" + result;
    }
    return result;
  },

  // 打开pdf
  openPdf() {
    wx.showLoading({
      title: '正在打开文档',
    })
    wx.downloadFile({
      url: this.data.url,
      success: res => {
        const filePath = res.tempFilePath
        wx.openDocument({
          filePath: filePath,
          success: res => {
            wx.hideLoading()
            // 调用学习定时器
            this._learningTimeTimer()
            // 获取后端传过来的时间做周期调用
            this.RandomVerification()
          }
        })
      }
    })
  },

  // 视频出错事件
  videoErrorCallback: function (e) {
    console.log('视频错误信息:')
    console.log(e.detail.errMsg)
  },
  // 音频播放事件
  audioPlay: function () {
    this.audioCtx.play()
  },
  // 音频暂停事件
  audioPause: function () {
    this.audioCtx.pause()
  },
  // 设置当前播放时间
  audio14: function (time) {
    this.audioCtx.seek(time)
  },

  // 保存学习进度
  SaveLearningProgress() {
    console.log('保存学习进度')
    if (this.data.learningTime >= 3) {
      // 学习了3秒
      weChatOnlineStudySao.postSetStudyProgress({
        chaptersSectionsKnowledgePointId: wx.getStorageSync('knowledgePointId'),
        courseId: wx.getStorageSync('courseId'),
        duration: this.data.learningTime,
        resourceId: wx.getStorageSync('resourceId'),
        trainingProgramId: wx.getStorageSync('trainingProgramsId'),
        type: this.data.type,
      }).then(res => {
        if (!res) {
          wx.showToast({
            title: '已保存本次学习',
            icon: 'success',
            time: 2000
          })
        }
      })
    } else {
      // 没有学习3秒
      wx.showToast({
        title: '本次学习不足3秒，不做保存',
        icon: 'none',
        duration: 3000
      })
    }
  },
  // 判断学习进度
  learningProgress() {
    if (this.data.detail.studyProgress == 100) {
      // 学习已满
      this.setData({
        ViewTimeFlag: false,
      })
    } else {
      // 学习未满
      this.setData({
        ViewTimeFlag: true
      })
    }
  },

  // 获取后端传过来的周期时间弹出认证
  RandomVerification() {
    let timer = wx.getStorageSync('timer') * 1000
    // var timer = 10000
    if (timer == 0) {
      return
    }
    this.promptlyFace(timer)
  },

  // 周期定时器
  promptlyFace(timer) {
    this.data.FaceCycleTimer = setTimeout(() => {
      // 暂停学习定时器
      clearInterval(this.data.learningTimeTimer)
      clearInterval(this.data.FaceCycleTimer)
      // 暂停视频
      var videoCtx = wx.createVideoContext('myVideo')
      videoCtx.pause()
      // 暂停音频
      this.audioCtx.pause()
      this.setData({
        LearningPage: false
      })
      Dialog.alert({
        message: '请进行考勤'
      }).then(() => {
        // 判断是否是视频
        if (this.data.videoType == 'mp4') {
          this.setData({
            videoBtn: false
          })
        }
        // 调出
        this.setData({
          FaceAuthenticationPage: true,
          LearningPage: false,
        })
        // 执行五秒拍照认证事件
        this.fiveSecond()
      });
    }, timer)
  },
  // 3秒事件
  fiveSecond() {
    console.log('调用五秒事件')
    // 3秒后自动拍照
    this.setData({
      count: 3
    })
    let five = setInterval(() => {
      this.setData({
        count: this.data.count - 1
      })
      if (this.data.count == 0 || this.data.count < 0) {
        clearInterval(five)
        this.setData({
          count: ''
        })
        // 拍照事件
        this.takePhoto()
      }
    }, 1000)
  },

  // 拍照事件
  takePhoto() {
    console.log('拍照事件')
    const ctx = wx.createCameraContext()
    ctx.takePhoto({
      quality: 'low',
      success: (res) => {
        wx.getFileSystemManager().readFile({
          filePath: res.tempImagePath, //选择图片返回的相对路径
          encoding: 'base64', //编码格式
          success: res => { //成功的回调
            weChatface.VerifyFace({
              image: res.data
            }).then(res => {
              if (!res.data.status) {
                if (res.data.error && res.data.error.message == '图片中没有人脸。') {
                  this.setData({
                    FaceAuthenticationPage: false,
                    LearningPage: false,
                  })
                  Dialog.confirm({
                    message: '图片中没有信息，是否重新认证'
                  }).then(() => {
                    this.setData({
                      FaceAuthenticationPage: true,
                      LearningPage: false,
                    })
                    // 调用五秒事件
                    this.fiveSecond()
                  }).catch(() => {
                    // wx.removeStorageSync('timer')
                    clearTimeout(this.data.FaceCycleTimer)
                    clearInterval(this.data.learningTimeTimer)
                    wx.navigateBack({
                      delta: 1
                    })
                  });
                  return;
                }
                this.setData({
                  FaceAuthenticationPage: false,
                  LearningPage: false,
                })
                Dialog.confirm({
                  message: '识别失败，是否重新认证'
                }).then(() => {
                  this.setData({
                    FaceAuthenticationPage: true,
                    LearningPage: false,
                  })
                  // 调用五秒事件
                  this.fiveSecond()
                }).catch(() => {
                  // wx.removeStorageSync('timer')
                  clearTimeout(this.data.FaceCycleTimer)
                  clearInterval(this.data.learningTimeTimer)
                  wx.navigateBack({
                    delta: 1
                  })
                });
              } else {
                wx.showToast({
                  title: '识别成功',
                  icon: 'success',
                  duration: 2000,
                  success: () => {
                    // 上传本次考勤记录
                    weChatface.CreateFaceAttendance({
                      trainingProgramsId: wx.getStorageSync('trainingProgramsId'),
                      coursesId: wx.getStorageSync('courseId'),
                      status: res.data.status,
                      score: res.data.score,
                      imageUrl: res.data.imageUrl
                    })
                  }
                })
                // 调用学习定时器
                this._learningTimeTimer()
                // 播放视频
                var videoCtx = wx.createVideoContext('myVideo')
                videoCtx.play()
                // 播放音频
                this.audioCtx.play()
                this.audio14(this.data.learningTime-2)
                // 再次调用下一次识别
                this.RandomVerification()
                // 判断是否是视频
                if (this.data.videoType == 'mp4') {
                  this.setData({
                    videoBtn: true
                  })
                }
                this.setData({
                  FaceAuthenticationPage: false,
                  LearningPage: true,
                  videoTime: this.data.learningTime - 2,
                })
              }
              return;
            })
          }
        })
      }
    })
  },
  error(e) {
    console.log(e.detail)
  },

  // a(){
  //   // 播放视频
  //   var videoCtx = wx.createVideoContext('myVideo')
  //   videoCtx.play()
  // },
  // b(){
  //   // 播放视频
  //   var videoCtx = wx.createVideoContext('myVideo')
  //   videoCtx.pause()
  // }
})