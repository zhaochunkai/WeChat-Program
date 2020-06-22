var stringUtil = require('./stringUtil.js'); //依赖config.js文件
var config = require('../common/config.js'); //依赖config.js文件
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
      WeChatType:'Applets'
    };
    header['X-TenantId'] = wx.getStorageSync('TenantId');
    wx.request({
      url: rootDocment + url,
      method: method,
      data: data,
      header: header,
      success: function (res) {
        console.log(res)
        if(res.statusCode == 403){
          wx.showToast({
            title: res.data.error.message,
            icon:'none',
            duration:1500
          })
        }
        resolve(res);
        wx.hideLoading();
      },
      fail: function (res) {
        wx.hideLoading();
        reject(res)
      }
    });
  });
}

module.exports = {
  get: get,
  post: post,
  remove: remove,
  put: put,
}