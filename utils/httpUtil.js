var config = require('../common/config.js'); //依赖config.js文件
var stringUtil = require('../utils/stringUtil.js'); //依赖config.js文件

var rootDocment = config.apiDomain; //获取在config.js文件中的全局变量，域名

//get
function get(url, data) {
  url += "?" + stringUtil.stringify(data);
  return execute(url, null, "get");
}

//post
function post(url, data) {
  return execute(url, data, "post");
}

//remove
function remove(url, data) {
  return execute(url, data, "delete");
}

//put
function put(url, data) {
  return execute(url, data, "put");
}

function execute(url, data, method) {
  return new Promise(function (resolve, reject) {
    wx.showLoading({
      title: '加载中',
    })
    var header = {
      WeChatOpenId: wx.getStorageSync('openId'),
      WeChatType: 'Applets'
    };
    if(method == 'put'){
      header['Content-Type'] = 'application/json';
    }
    header['X-TenantId'] = wx.getStorageSync('TenantId');
    wx.request({
      url: rootDocment + url,
      method: method,
      data: data,
      header: header,
      success: function (res) {
        if (res.statusCode === 401) {
          wx.showToast({
            title: '无权限',
          })
        } else if (res.statusCode === 400) {
          wx.showModal({
            title: '提示',
            content: res.data.error.message,
            showCancel: false,
            success: res => { }
          })
          reject(res.data);
        } else if (res.statusCode === 403) {
          if (res.data.error.message.indexOf('非法的') != -1) {
            wx.showModal({
              content: '还未查询到学习信息，请和管理员联系', 
              showCancel: false,
              success() {
                wx.switchTab({
                  url: '/pages/index/index'
                })
              }
            })
            return
          }
          if (res.data.error.message.indexOf('已存在') != -1) {
            wx.hideLoading();
            wx.showModal({
              content: '你还未绑定，请绑定后报名',
              showCancel: false,
              success() {
                wx.navigateTo({
                  url: '/pages/register/index?url=applyPage'
                })
              }
            })
            return
          }
          if (res.data.error.message.indexOf('未找到所属班级') != -1) {
            wx.hideLoading();
            wx.showModal({
              content: res.data.error.message,
              showCancel: false,
              success() {
                wx.navigateBack({
                  delta: 1
                })
              }
            })
            return
          }
          if (res.data.error.message.indexOf('未找到') != -1) {
            wx.hideLoading();
            wx.showModal({
              content: res.data.error.message,
              showCancel: false,
              success() {
                wx.navigateBack({
                  delta: 1
                })
              }
            })
            return
          }
          if (res.data.error.message.indexOf('暂未查询到试题') != -1) {
            wx.hideLoading();
            wx.showModal({
              content: res.data.error.message,
              showCancel: false,
              success() {
                wx.navigateBack({
                  delta: 1
                })
              }
            })
            return
          }
          wx.showModal({
            content: res.data.error.message,
            showCancel: false,
            success: res => { }
          })
        } else if (res.statusCode === 500) {
          wx.showModal({
            title: '提示',
            content: res.data.error.message,
            showCancel: false,
            success: res => { }
          })
          reject(res.data);
        } else {
          resolve(res.data);
        }
        wx.hideLoading();
      },
      fail: function (res) {
        wx.hideLoading();
        reject(false)
      }
    });
  });
}

function uploadFile(url, tempFilePath) {
  return new Promise(function (resolve, reject) {
    var loginInfo = wx.getStorageSync('userInfo') || null;
    var header = {};
    if (null == loginInfo) {
      var app = getApp();
      app.login().then(function (loginInfo) {
        uploadFile(url, tempFilePath).then(resolve, reject);
      })
      return;
    }
    if (loginInfo.token) {
      header.token = loginInfo.token;
    }
    // header.token = loginInfo.AplusInfo.AccountInfo;
    // header.staffno = loginInfo.AplusInfo.Identify.UserNo;
    header['content-type'] = 'multipart/form-data;application/json';
    // 小程序上传
    wx.uploadFile({
      url: config.apiDomain + url,
      filePath: tempFilePath,
      name: 'files',
      header: header,
      formData: {

      },
      success: function (res) {
        res.data = JSON.parse(res.data);
        resolve(res);
      }
    })
  });
}

module.exports = {
  get: get,
  post: post,
  remove: remove,
  put: put,
  uploadFile: uploadFile
}