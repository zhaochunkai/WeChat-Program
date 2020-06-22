import postEnrollApi from '../../../../service/weChatEntrySao.js'
// 获取腾讯云token
// import getTempFileUploadToken from '../../../../service/weChatEntrySao.js'
// var COS = require('cos-js-sdk-v5');

Page({
  /**
   * 页面的初始数据
   */
  data: {
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
    show: false,
    sexbtn: false,
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
    fileList: [],
    projectName: '',
    name: '',
    nameRuls: '',
    sex: '',
    sexName: '',
    idCard: '',
    idCardRuls: '',
    birthday: '',
    tel: '',
    telRuls: '',
    education: '',
    educationName: '',
    address: '',
    email: '',
    remark: '',
    registrationProject: '',
    weChatId: wx.getStorageSync('openId'),
    // 腾讯云存储桶配置
    Bucket: 'd780c447-3f23-9212-f4d3-39f3d9a69a3e-1301412513',
    Region: 'ap-chengdu'
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
      }
    });
  },

  // 学历点击选择事件
  block() {
    this.setData({
      show: true
    });
  },
  onClose() {
    this.setData({
      show: false
    });
  },
  onSelect(event) {
    this.setData({
      education: event.detail.code,
      educationName: event.detail.name
    })
  },

  // 性别点击选择事件
  sexbtn() {
    this.setData({
      sexbtn: true
    })
  },
  sexonClose() {
    this.setData({
      sexbtn: false
    });
  },
  sexonSelect(e) {
    this.setData({
      sex: e.detail.code,
      sexName: e.detail.name
    })
  },

  // 姓名验证
  nameRule(e) {
    console.log(e)
    let reg = /^[\u4e00-\u9fa5]{2,6}$/;
    if (e.detail.value) {
      if (!reg.test(e.detail.value)) {
        this.setData({
          nameRuls: '请输入合法用户名'
        })
      } else {
        this.setData({
          nameRuls: '',
          name: e.detail.value,
        })
      }
    } else {
      this.setData({
        nameRuls: '请输入合法用户名'
      })
    }
  },

  // 身份证号验证
  idCardRuls(e) {
    let reg = /^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$|^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/
    if (e.detail.value) {
      if (!reg.test(e.detail.value)) {
        this.setData({
          idCardRuls: '请输入合法身份证号码'
        })
      } else {
        this.setData({
          idCardRuls: '',
          idCard: e.detail.value,
          birthday: this.getBirthdayFromIdCard(e.detail.value)
        })
      }
    } else {
      this.setData({
        idCardRuls: '请输入合法身份证号码'
      })
    }
  },

  // 身份证提取出生日期
  getBirthdayFromIdCard: function (idCard) {
    var birthday = "";
    if (idCard != null && idCard != "") {
      if (idCard.length == 15) {
        birthday = "19" + idCard.substr(6, 6);
      } else if (idCard.length == 18) {
        birthday = idCard.substr(6, 8);
      }
      birthday = birthday.replace(/(.{4})(.{2})/, "$1-$2-");
    }
    return birthday;
  },

  // 手机号验证
  telRuls(e) {
    let reg = /^1[3456789]\d{9}$/;
    if (e.detail.value) {
      if (!reg.test(e.detail.value)) {
        this.setData({
          telRuls: '请输入合法手机号'
        })
      } else {
        this.setData({
          telRuls: '',
          tel: e.detail.value
        })
      }
    } else {
      this.setData({
        telRuls: '请输入合法手机号'
      })
    }
  },

  // 住址失去焦点事件
  address(e) {
    this.setData({
      address: e.detail.value
    })
  },

  // 邮箱失去焦点事件
  email(e) {
    this.setData({
      email: e.detail.value
    })
  },

  // 备注失去焦点事件
  remark(e) {
    this.setData({
      remark: e.detail.value
    })
  },
  /**
   * 提交报名数据
   */
  commitDataClick: function () {
    const data = {
      projectName: this.data.projectName,
      name: this.data.name,
      sex: this.data.sex,
      sexName: this.data.sexName,
      idCard: this.data.idCard,
      birthday: this.data.birthday,
      tel: this.data.tel,
      education: this.data.education,
      educationName: this.data.educationName,
      address: this.data.address,
      email: this.data.email,
      remark: this.data.remark,
      registrationProject: this.data.registrationProject,
      weChatId: this.data.weChatId
    }
    postEnrollApi.postEnrollApi(data).then(res => {
      if (res) {} else {
        wx.showToast({
          title: '报名成功',
          icon: 'success',
          duration: 2000,
          success(){
            setTimeout(()=>{
              wx.navigateBack({
                delta: 1
              })
            },1500)
          }
        })
      }
    })
  },

  // 取消按钮
  cancel() {
    wx.navigateBack({
      delta: 1
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // var COS = require('../../../../utils/cos-wx-sdk-v5')
    // this._getTempFileUploadToken()
    // // 初始化实例
    // var cos = new COS({
    //   getAuthorization: function (options, callback) {
    //     var url = '../server/sts.php'; // 这里替换成您的服务接口地址
    //     var xhr = new XMLHttpRequest();
    //     xhr.open('GET', url, true);
    //     xhr.onload = function (e) {
    //       try {
    //         var data = JSON.parse(e.target.responseText);
    //         var credentials = data.credentials;
    //       } catch (e) {}
    //       if (!data || !credentials) return console.error('credentials invalid');
    //       callback({
    //         TmpSecretId: credentials.tmpSecretId,
    //         TmpSecretKey: credentials.tmpSecretKey,
    //         XCosSecurityToken: credentials.sessionToken,
    //         StartTime: data.startTime, // 时间戳，单位秒，如：1580000000，建议返回服务器时间作为签名的开始时间，避免用户浏览器本地时间偏差过大导致签名错误
    //         ExpiredTime: data.expiredTime, // 时间戳，单位秒，如：1580000900
    //       });
    //     };
    //     xhr.send();
    //   }
    // });
    this.setData({
      projectName: options.name,
      registrationProject: options.registrationProject
    })
  },
  // COS 初始化实例
  // _getTempFileUploadToken(){
  //   getTempFileUploadToken.getTempFileUploadToken().then(res=>{ // 获取上传的token等参数
  //     console.log(res)
  //     // this.expireTime=new Date(res.expireTime*1000)
  //     // this.cos = new COS({
  //     //   getAuthorization: function (options, callback) {
  //     //     callback({
  //     //       TmpSecretId: res.tempAppId,
  //     //       TmpSecretKey: res.tempAppSecret,
  //     //       XCosSecurityToken:  res.tempToken,
  //     //       StartTime:  res.startTimestamp, // 时间戳，单位秒，如：1580000000，建议返回服务器时间作为签名的开始时间，避免用户浏览器本地时间偏差过大导致签名错误
  //     //       ExpiredTime: res.endTimestamp // 时间戳，单位秒，如：1580000900
  //     //     });
  //     //   }
  //     // });
  //   })
  // },
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
    let info ={
      tel:this.data.tel,
      projectName:this.data.projectName,
      registrationProject:this.data.registrationProject
    }
    wx.setStorageSync('info', JSON.stringify(info))
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    let info ={
      tel:this.data.tel,
      projectName:this.data.projectName,
      registrationProject:this.data.registrationProject
    }
    wx.setStorageSync('info', JSON.stringify(info))
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