import weChatOpenid from '../../service/weChatOpenid'
import Dialog from '../../ui-lib/vant/dialog/dialog';
var config = require('../../common/config.js'); //依赖config.js文件
var rootDocment = config.apiDomain; //获取在config.js文件中的全局变量，域名
Page({
  /**
   * 页面的初始数据
   */
  data: {
    "topBannerPath": "/images/banner.jpg",
    "paythefeesPath": "/images/content-png/wangzhanzhanghao.png",
    "onLineStudyPath": "/images/content-png/study.png",
    "onLivePath": "/images/content-png/live.png",
    "officialExamPath": "/images/content-png/officialExam.png",
    "simulationExamPath": "/images/content-png/simulationExam.png",
    "supplyExamPath": "/images/content-png/supplyExam.png",
    userInfo: false,
    radio: '',
    selectFlag: true,
    input: ''
  },
  /**
   * 跳转子页面
   */
  redirectPage: function (e) {
    let value = e.currentTarget.dataset.value;
    switch (value) {
      case 'paythefees':
        wx.navigateTo({
          url: '/pages/online-study/enroll-in/index/index',
        })
        break;
      case 'onLineStudy':
        weChatOpenid.referOpenid(res => {
          if (res.data == "student") {
            // 学生
            wx.navigateTo({
              url: '/pages/online-study/study/index',
            })
          } else if (res.data == "teacher") {
            // 教师
            wx.navigateTo({
              url: '/pages/online-study/study/index',
            })
            // 没有绑定去绑定
          } else if (res.data == "neither") {
            Dialog.alert({
              message: '你还未绑定，请先去绑定'
            }).then(() => {
              wx.navigateTo({
                url: '/pages/register/index',
              })
            });
          }
        })
        break;
      case 'onLive':
        weChatOpenid.referOpenid(res => {
          if (res.data == "student") {
            // 学生
            wx.navigateTo({
              url: '/pages/online-study/on-live/index',
            })
          } else if (res.data == "teacher") {
            // 教师
            wx.navigateTo({
              url: '/pages/online-study/on-live/index',
            })
            // 没有绑定去绑定
          } else if (res.data == "neither") {
            Dialog.alert({
              message: '你还未绑定，请先去绑定'
            }).then(() => {
              wx.navigateTo({
                url: '/pages/register/index',
              })
            });
          }
        })
        break;
      case 'officialExam':
        weChatOpenid.referOpenid(res => {
          if (res.data == "student" || res.data == "teacher") {
            // 学生 | 教师
            wx.navigateTo({
              url: '/pages/examination-module/official-examination/index',
            })
          }else if (res.data == "neither") {
            Dialog.alert({
              message: '你还未绑定，请先去绑定'
            }).then(() => {
              wx.navigateTo({
                url: '/pages/register/index',
              })
            });
          }
        })
        break;
      case 'simulationExam':
        weChatOpenid.referOpenid(res => {
          if (res.data == "student" || res.data == "teacher") {
            // 学生 | 教师
            wx.navigateTo({
              url: '/pages/examination-module/simulation-examination/index',
            })
          } else if (res.data == "neither") {
            Dialog.alert({
              message: '你还未绑定，请先去绑定'
            }).then(() => {
              wx.navigateTo({
                url: '/pages/register/index',
              })
            });
          }
        })
        break;
      case 'supplyExam':
        weChatOpenid.referOpenid(res => {
          if (res.data == "student" || res.data == "teacher") {
            // 学生 | 教师
            wx.navigateTo({
              url: '/pages/examination-module/supply-examination/index',
            })
          } else if (res.data == "neither") {
            Dialog.alert({
              message: '你还未绑定，请先去绑定'
            }).then(() => {
              wx.navigateTo({
                url: '/pages/register/index',
              })
            });
          }
        })
        break;
      default:
        break;
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    wx.getSetting({
      success(res) {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称
          wx.getUserInfo({
            success: function (res) {
              wx.setStorage({
                data: JSON.stringify(res.userInfo),
                key: 'userInfo',
              })
              that.setData({
                userInfo: false
              })
            }
          })
        } else {
          that.setData({
            userInfo: true
          })
        }
      }
    })
    if (wx.getStorageSync('TenantId').length >= 32 ) {
      this.setData({
        selectFlag: false
      })
    }else{
      this.setData({
        selectFlag: true
      })
    }
  },
  bindGetUserInfo() {
    let that = this
    wx.getUserInfo({
      success: function (res) {
        wx.setStorage({
          data: JSON.stringify(res.userInfo),
          key: 'userInfo',
        })
        that.setData({
          userInfo: false
        })
      }
    })
  },
  // 检索
  searching() {
    wx.request({
      url: rootDocment + '/Api/customize-tenancy/tenants-combobox',
      header: {
        WeChatOpenId: wx.getStorageSync('openId'),
        WeChatType: 'Applets'
      },
      method: 'get',
      data: {
        SkipCount: 0,
        MaxResultCount: 5,
        Filter: this.data.input
      },
      success: res => {
        this.setData({
          tenantList: res.data.items
        })
      }
    })
  },
  // 获取input值
  bindKeyInput(e) {
    this.setData({
      input: e.detail.value
    })
  },
  // 选择框点击
  onChange(event) {
    this.setData({
      radio: event.detail
    });
  },
  // 确定点击
  confirm() {
    if (this.data.radio) {
      var Tenant =this.data.tenantList.filter(item=>{
        return item.id == this.data.radio
      })
      wx.setStorageSync('TenantName', Tenant[0].name)
      wx.setStorageSync('TenantId', this.data.radio)
      wx.setStorageSync('TenantExpirationTime', Math.floor(new Date().getTime() / 1000) + 30 * 24 * 3600)
      this.setData({
        selectFlag: false
      })
    } else {
      wx.showToast({
        title: '请选择租户',
        icon: 'none',
        duration: 1500
      })
    }
  },
  // 清空
  empty(){
    this.setData({
      input:'',
      tenantList: []
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
    if (wx.getStorageSync('TenantId')) {
      this.setData({
        selectFlag: false
      })
    }else{
      this.setData({
        selectFlag: true
      })
    }
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