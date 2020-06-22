import weChatLiveRoom from '../../../service/weChatLiveRoom'
import Dialog from '../../../ui-lib/vant/dialog/dialog';
import faceRecognition from '../../../service/faceRecognition'
import weChatLiveRoomSao from '../../../service/weChatLiveRoomSao.js'
Page({
  /**
   * 页面的初始数据
   */
  data: {
    msgarr: [],
    value: '',
    disabled: true,
    liveTime: 0,
    watchTime: 0,
    liveTimes: '0秒',
    userInfo: {},
    SignInState: '',
    flagColor: '',
    livetimer: '', // 直播定时器
    FaceAuthenticationPage: 'none',
    livePage: 'block',
    msghintMessage: '',
    orientation:'vertical',
    topHeight: '200px',
    bigIcon:'block',
    smallIcon:'none',
    tabDisplay:'block',
    checkFlag: false,
    spotCheck: false
  },
  statechange: function (e) {
    console.log('live-player code:', e.detail.code)
  },
  error(e) {
    console.error('live-player error:', e.detail.errMsg)
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // setInterval(()=>{
    //   console.log(123)
    // },1000)
    // 获取到授权的信息
    let userInfo = wx.getStorageSync('userInfo')
    this.setData({
      userInfo: JSON.parse(userInfo)
    })
    let that = this;
    // 获取直播地址
    let liveRoom = JSON.parse(wx.getStorageSync('liveObj'));
    liveRoom.flvPlayAddress = decodeURIComponent(liveRoom.flvPlayAddress)
    that.setData({
      liveRoom: liveRoom
    })
    console.log(this.data.liveRoom)
    // 查询签到接口
    this.GetsTheCheckin()

    // 获取聊天室
    wx.connectSocket({
      url: `wss://ets-wechat.gedewisdom.com/Api/Chat?TenantId=${wx.getStorageSync('TenantId')}&WeChatOpenId=${wx.getStorageSync('openId')}&WeChatType=Applets`,
      // url: `wss://ws.gedewisdom.com:50002/Api/Chat?TenantId=${wx.getStorageSync('TenantId')}&WeChatOpenId=${wx.getStorageSync('openId')}&WeChatType=Applets`,
      header: {
        ['X-TenantId']: wx.getStorageSync('TenantId'),
        WeChatOpenId: wx.getStorageSync('openId'),
        WeChatType: 'Applets'
      }
    });
    // 监听聊天室打开
    wx.onSocketOpen(res => {
      console.log("WebSocket连接已打开！")
      this.setData({
        msghintMessage: '聊天室已链接成功'
      })
      let data = {
        "MessageType": "OnConnected",
        "GroupName": this.data.liveRoom.roomNumber,
        "Message": "连接成功",
        "NickName": this.data.userInfo.nickName,
        "HeadImageUrl": this.data.userInfo.avatarUrl,
        "DateTime": this.formatTime(new Date().getTime())
      }
      // 发送消息
      wx.sendSocketMessage({
        data: JSON.stringify(data)
      });
      // 发送心跳
      this.heartBeat()
    })
    // 聊天室打开失败
    wx.onSocketError(res => {
      console.log("WebSocket连接打开失败，请检查！")
      this.setData({
        msghintMessage: '聊天室已链接失败，正在重连...'
      })
    })
    // 监听返回消息
    wx.onSocketMessage(res => {
      if(JSON.parse(res.data).MessageType != 5){
        this.data.msgarr.push(JSON.parse(res.data))
      }else{
        let arr = JSON.parse(JSON.parse(res.data).Message)
        let openId = wx.getStorageSync('openId')
        var a = arr.filter(ite=>{
          return ite == openId
        })
        this.isSpotCheckAttendance(a)
      }
      this.setData({
        msgarr: this.data.msgarr,
        value: '',
        disabled: true
      })
    })
    // 获取直播观众
    this.getLiveRoomPerson();
    // 获取直播间详情
    this.liveBrief()
    // 判断是否开启考察
    if(wx.getStorageSync('livefacetime') == 0){
      setTimeout(() => {
        // 获取直播列表
        this.liveList()
      }, 600000);
    }
  },
  // 判断是否接受抽查考勤
  isSpotCheckAttendance(arr){
    if(arr.length > 0){
      setTimeout(()=>{
        if(this.data.checkFlag){
          return
        }else{
          console.log('10秒')
          faceRecognition.UpRecognition({
            status: false,
            score: 0,
            imageUrl: '',
            SpotCheck: 1,
            liveRoomId: this.data.liveRoom.id
          }).then(function () {
            wx.navigateBack({
              delta: 1
            })
          })
        }
      },10000)
      Dialog.confirm({
        message: '随机抽查，是否接受，取消将会影响你的考勤率；',
      })
        .then(() => {
          this.setData({
            FaceAuthenticationPage: 'block',
            livePage: 'none',
            checkFlag: true
          })
          this.setData({
            spotCheck: true
          })
          this.fiveSecond()
        })
        .catch(() => {
          faceRecognition.UpRecognition({
            status: false,
            SpotCheck: 1,
            score: 0,
            imageUrl: '',
            liveRoomId: this.data.liveRoom.id
          }).then(function () {
            console.log('上传成功')
          })
        })
    }
  },
  // 获取直播列表判断直播间是否还存在
  liveList() {
    weChatLiveRoomSao.list().then(res => {
      var arr = res.filter(r=>{
        return r.id == wx.getStorageSync('liveId')
        // return r.id == 1000
      })
      if(arr.length>0){
        // 直播还在继续
      }else{
        // 直播已关闭
        clearInterval(this.data.livetimer)
        this.departureTime()
        Dialog.alert({
          message: '直播室已关闭即将退出直播间'
        }).then(() => {
          wx.navigateBack({
            delta: 1
          })
        });
      }
    })
  },
  // 获取签到状态
  GetsTheCheckin() {
    let that = this;
    weChatLiveRoom.CheckInflag({
      roomNumber: that.data.liveRoom.roomNumber,
      WeChatOpenId: wx.getStorageSync('openId'),
      WeChatType: 'Applets'
    }).then(res => {
      if (res.data == 'NotCheck') {
        console.log('NotCheck')
        that.sign()
      } else if (res.data == 'Normal') {
        that.setData({
          SignInState: '正常',
          flagColor: '#006699'
        })
      } else if (res.data == 'Late') {
        that.setData({
          SignInState: '迟到',
          flagColor: '#cc3300'
        })
      }
    })
  },

  // 发送点击事件
  send() {
    let data = {
      "MessageType": "Normal",
      "GroupName": this.data.liveRoom.roomNumber,
      "Message": this.data.value,
      "NickName": this.data.userInfo.nickName,
      "HeadImageUrl": this.data.userInfo.avatarUrl,
      "DateTime": this.formatTime(new Date().getTime())
    }
    // 发送消息
    wx.sendSocketMessage({
      data: JSON.stringify(data)
    });
    // 重新发送心跳
    this.heartBeat()
  },
  formatTime(time) { // 时间转换：时分秒
    let date = new Date(time);
    let h = date.getHours();
    h = h < 10 ? ('0' + h) : h;
    let minute = date.getMinutes();
    minute = minute < 10 ? ('0' + minute) : minute;
    let second = date.getSeconds();
    second = second < 10 ? ('0' + second) : second;
    return h + ':' + minute + ':' + second;
  },
  // input失去焦点触发
  sendBlur(e) {
    if (e.detail.value.length > 0) {
      this.setData({
        disabled: false
      })
    } else {
      this.setData({
        disabled: true
      })
    }
    this.setData({
      value: e.detail.value
    })
  },
  // 签到
  sign() {
    let that = this;
    console.log(that.data.liveRoom.roomNumber)
    weChatLiveRoom.getCheckIn({
      roomNumber: that.data.liveRoom.roomNumber
    }).then(res => {
      if (res.data.checkInResult == 'Normal') {
        that.setData({
          SignInState: '正常',
          flagColor: '#006699'
        })
      } else if (res.data.checkInResult == 'Late') {
        that.setData({
          SignInState: '迟到',
          flagColor: '#cc3300'
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var that = this;
    that.liveStreamCounter()
  },
  // 直播观众
  getLiveRoomPerson: function () {
    let that = this;
    weChatLiveRoom.getAudience({
      roomNumber: this.data.liveRoom.roomNumber,
      WeChatOpenId: wx.getStorageSync('openId'),
      WeChatType: 'Applets'
    }).then(res => {
      that.setData({
        liveRoomPerson: res.data
      })
    })
  },

  // 直播简介
  liveBrief() {
    let that = this;
    let data = this.data.liveRoom.id
    weChatLiveRoom.getweChatLiveRoom(data).then(res => {
      this.setData({
        endTime: new Date(res.actuallyStartTime).getTime() + 3600 * 4 * 1000
      })
      for (let key in res) {
        if (key == 'actuallyStartTime') {
          res[key] = this.formatDateTime(res.actuallyStartTime.replace(/T/ig, ' ').replace(/-/ig, '/').replace(/\.\d+/, ' '))
        }
      }
      that.setData({
        liveBrief: res
      })
    })
  },

  // 直播计数器
  liveStreamCounter() {
    this.data.livetimer = setInterval(() => {
      this.setData({
        liveTime: this.data.liveTime + 1,
        watchTime: this.data.watchTime + 1,
        liveTimes: this.formatSeconds(this.data.watchTime)
      })
    }, 1000)
    // 调用认证
    this.RandomVerification()
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
  // 时间转换
  formatDateTime(time) { // 日期时间转换
    let date = new Date(time);
    let y = date.getFullYear();
    let m = date.getMonth() + 1;
    m = m < 10 ? ('0' + m) : m;
    let d = date.getDate();
    d = d < 10 ? ('0' + d) : d;
    let h = date.getHours();
    h = h < 10 ? ('0' + h) : h;
    let minute = date.getMinutes();
    minute = minute < 10 ? ('0' + minute) : minute;
    let second = date.getSeconds();
    second = second < 10 ? ('0' + second) : second;
    return y + '-' + m + '-' + d + ' ' + h + ':' + minute + ':' + second;
  },
  // 上传直播时间
  departureTime: function () {
    let that = this;
    weChatLiveRoom.UpLearningTime({
      roomNumber: that.data.liveRoom.roomNumber,
      learningTime: that.data.liveTime
    }).then(res => {
      this.setData({
        learningTime: 0
      })
    })
  },

  // 离开直播
  LeaveTheLive() {
    let data = {
      "MessageType": "OnDisConnected",
      "GroupName": this.data.liveRoom.roomNumber,
      "Message": "离开直播",
      "NickName": this.data.userInfo.nickName,
      "HeadImageUrl": this.data.userInfo.avatarUrl,
      "DateTime": this.formatTime(new Date().getTime())
    }
    // 发送消息
    wx.sendSocketMessage({
      data: JSON.stringify(data)
    });
    wx.removeStorageSync('livefacetime')
    clearTimeout(this.data.FaceCycleTimer)
    this.setData({
      liveTime: 0
    })
    // 提交时间
    this.departureTime()
  },

  // 心跳发送消息
  heartBeat() {
    setInterval(() => {
      let data = {
        "MessageType": "Heartbeat",
        "GroupName": this.data.liveRoom.roomNumber,
        "Message": "心跳消息",
        "NickName": this.data.userInfo.nickName,
        "HeadImageUrl": this.data.userInfo.avatarUrl,
        "DateTime": this.formatTime(new Date().getTime())
      }
      wx.sendSocketMessage({
        data: JSON.stringify(data)
      });
    }, 180000)
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    this.LeaveTheLive()
    this.departureTime()
    wx.showToast({
      title: '已保存本次学习',
      icon: 'none',
      duration: 1500
    })
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    this.LeaveTheLive()
    wx.showToast({
      title: '已保存本次学习',
      icon: 'none',
      duration: 1500
    })
  },

  // 获取后端传过来的周期时间弹出认证
  RandomVerification() {
    let timer = wx.getStorageSync('livefacetime') * 1000
    // var timer = 10000
    if (timer == 0) {
      return
    }
    this.FaceCycleTimer(timer)
  },
  // 周期定时器
  FaceCycleTimer(timer) {
    this.data.FaceCycleTimer = setTimeout(() => {
      // 暂停学习定时器
      clearInterval(this.data.livetimer)
      Dialog.alert({
        message: '请进行考勤'
      }).then(() => {
        // 调出
        this.setData({
          FaceAuthenticationPage: 'block',
          livePage: 'none',
        })
        // 执行五秒拍照认证事件
        this.fiveSecond()
      });
    }, timer)
  },
  // 3秒事件
  fiveSecond() {
    console.log('调用三秒事件')
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
    const ctx = wx.createCameraContext()
    ctx.takePhoto({
      quality: 'low',
      success: (res) => {
        wx.getFileSystemManager().readFile({
          filePath: res.tempImagePath, //选择图片返回的相对路径
          encoding: 'base64', //编码格式
          success: res => { //成功的回调
            faceRecognition.VerifyFace({
              image: res.data
            }).then(res => {
              if (!res.data.status) {
                if (res.data.error && res.data.error.message == '图片中没有人脸。') {
                  this.setData({
                    FaceAuthenticationPage: 'none',
                    livePage: 'none',
                  })
                  Dialog.confirm({
                    message: '图片中没有信息，是否重新认证'
                  }).then(() => {
                    this.setData({
                      FaceAuthenticationPage: 'block',
                      livePage: 'none',
                    })
                    // 调用五秒事件
                    this.fiveSecond()
                  }).catch(() => {
                    clearTimeout(this.data.FaceCycleTimer)
                    wx.removeStorageSync('livefacetime')
                    wx.navigateBack({
                      delta: 1
                    })
                  });
                  return
                }
                // 失败
                this.faceFailure()
              } else {
                // 成功回调
                this.faceSucceed(res)
              }
              return;
            })
          }
        })
      }
    })
  },
  // 识别成功回调
  faceSucceed(res) {
    let that = this;
    if (new Date().getTime() < this.data.endTime) {
      // 上传本次时间
      this.departureTime()
      this.setData({
        liveTime: 0
      })
    }
    wx.showToast({
      title: '认证成功',
      icon: 'success',
      duration: 2000,
      success: () => {
        // 上传本次考勤记录
        if(this.data.spotCheck){
          this.selectiveExaminationToUpload()
        }else{
          this.normalToUpload()
        }
        this.normalToUpload()
      }
    })
    // 调用学习定时器
    that.liveStreamCounter()
    // 再次调用下一次识别
    that.RandomVerification()
    that.setData({
      FaceAuthenticationPage: 'none',
      livePage: 'block',
    })
  },
  // 正常考勤上传
  normalToUpload() {
    console.log('正常上传')
    faceRecognition.UpRecognition({
      status: res.data.status,
      score: res.data.score,
      imageUrl: res.data.imageUrl,
      liveRoomId: that.data.liveRoom.id,
      SpotCheck: 0
    }).then(function () {
      console.log('上传成功')
    })
  },
  // 抽查考勤上传
  selectiveExaminationToUpload() {
    console.log('抽查上传')
    faceRecognition.UpRecognition({
      status: res.data.status,
      score: res.data.score,
      imageUrl: res.data.imageUrl,
      liveRoomId: that.data.liveRoom.id,
      SpotCheck: 1
    }).then(function () {
      console.log('上传成功')
    })
  },
  // 认证失败
  faceFailure() {
    this.setData({
      FaceAuthenticationPage: 'none',
      livePage: 'none',
    })
    Dialog.confirm({
      message: '识别失败，是否重新认证'
    }).then(() => {
      this.setData({
        FaceAuthenticationPage: 'block',
        livePage: 'none',
      })
      // 调用五秒事件
      this.fiveSecond()
    }).catch(() => {
      clearTimeout(this.data.FaceCycleTimer)
      wx.removeStorageSync('livefacetime')
      wx.navigateBack({
        delta: 1
      })
    });
  },
  error(e) {
    console.log(e.detail)
  },
  // 放大
  bigIcon(){
    this.setData({
      orientation: 'horizontal',
      topHeight:'100%',
      bigIcon:'none',
      smallIcon:'block',
      tabDisplay:'none'
    })
  },
  // 缩小
  smallIcon(){
    this.setData({
      orientation: 'vertical',
      topHeight:'200px',
      bigIcon:'block',
      smallIcon:'none',
      tabDisplay:'block'
    })
  }
})