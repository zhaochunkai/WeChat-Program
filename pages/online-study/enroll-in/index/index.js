var weChatEntrySao = require('../../../../service/weChatEntrySao.js')
var weCahtPaymentSao = require('../../../../service/weChatPaymentSao.js')
import Dialog from '../../../../ui-lib/vant/dialog/dialog';
var config = require('../../../../common/config'); //依赖config.js文件
var rootDocment = config.apiDomain; //获取在config.js文件中的全局变量，域名
Page({
  /**
   * 页面的初始数据
   */
  data: {
    trainingPrograms: [],
    trainingProgramsInfo: [],
    value: '',
    disflag: true,
    but: false,
    number: '',
    top: true,
    applyUserInfo: false,
    passStatus: '',
    trainingProgramsId: ''
  },
  // input点击事件
  input() {
    this.setData({
      disflag: !this.data.disflag
    })
  },
  // 下拉选择项点击
  item(e) {
    this.setData({
      value: e.currentTarget.dataset.item,
      disflag: !this.data.disflag,
      trainingProgramsId: e.currentTarget.dataset.id
    })
    // 获取培训项目信息
    weChatEntrySao.getTrainingProgramsInfo({
      trainingProgramsId: e.currentTarget.dataset.id
    }).then(res => {
      if (res) {
        res.recruitStudentsStartDate = res.recruitStudentsStartDate.substring(-1, 10)
        res.recruitStudentsStopDate = res.recruitStudentsStopDate.substring(-1, 10)
        this.setData({
          top: false,
          trainingProgramsInfo: res,
          number: res.numberOfApplicants
        })
      }
    })
    this.getEntryInfoByWeChatId(e.currentTarget.dataset.id);
  },
  // 根据微信绑定Id查询学生报名项目信息
  getEntryInfoByWeChatId: function (_trainingProgramId) {
    var that = this;
    weChatEntrySao.getEntryInfoByWeChatId({}).then(res => {
      // 学生有报名过其他项目，有信息
      if (res) {
        let RegistrationProject = res.filter(r => {
          return r.trainingProgramsId == _trainingProgramId
        })
        // 有报名过选择的这个项目
        if (RegistrationProject.length != 0) {
          that.setData({
            but: true,
            passStatus: RegistrationProject[0].passStatus,
            payStatus:  RegistrationProject[0].payStatus
          })
          // 没有报名过选择的这个项目
        } else {
          this.setData({
            but: false,
            passStatus: '未报名',
            payStatus: ''
          })
        }
        // 没有报过任何科目，没有信息
      } else {
        this.setData({
          applyUserInfo: true,
          passStatus: '未报名'
        })
      }
    })
  },
  // 去缴费.调微信支付
  goPaymentClick: function () {
    // 统一下单接口
    weCahtPaymentSao.getJsSdkWeChatPrepayId({
      openId: wx.getStorageSync('openId'),
      registrationProjectId: '10'
    }).then(function (res) {
      // 根据预支付id生成签名
      weCahtPaymentSao.getJsSdkWeChatPayParameters({
        prepayId: res.prepayId
      }).then(function (wxPaySignature) {
        wx.requestPayment({
          nonceStr: wxPaySignature.nonceStr,
          package: wxPaySignature.package,
          paySign: wxPaySignature.paySign,
          signType: 'MD5',
          timeStamp: wxPaySignature.timeStamp.toString(),
          success(payRes) {
            console.log(payRes)
          },
          fail(failRes) {
            console.log(failRes)
            wx.showToast({
              title: '订单支付已取消',
              icon: 'none',
              duration: 1500
            })
          }
        })
      })
    })
  },

  // 开始报名
  enterNameClick: function () {
    if (this.data.value) {
      // 信息库里没有信息，需要跳转去报名
      if (this.data.applyUserInfo) {
        wx.navigateTo({
          url: `/pages/online-study/enroll-in/enter-name/index?name=${this.data.value}&registrationProject=${this.data.trainingProgramsId}`,
        })
        // 有信息，直接报名成功
      } else {
        Dialog.confirm({
          message: '你已报名过其他项目，是否再报本项目'
        }).then(() => {
          // 确定
          var header = {
            WeChatOpenId: wx.getStorageSync('openId')
          };
          header['X-TenantId'] = wx.getStorageSync('TenantId');
          header['content-type'] = 'application/json';
          header['WeChatType'] = 'Applets'
          wx.request({
            url: rootDocment+`/Api/weChatEntry/AgainEnroll?registrationProjectId=${this.data.trainingProgramsId}`,
            header: header,
            method: "post",
            success: res => {
              if (res.statusCode == 204) {
                wx.showModal({
                  content: '报名成功',
                  showCancel: false
                })
                this.getEntryInfoByWeChatId(this.data.trainingProgramsId)
              }
            }
          })
        }).catch(() => {
          // 取消
        });
      }
    } else {
      wx.showModal({
        content: '请选择学习项目',
        showCancel: false
      })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var that = this;
    //获取下拉列表
    weChatEntrySao.getTrainingProgramsDropdowns().then(res => {
      that.setData({
        trainingPrograms: res
      })
    })
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