var config = require('../common/config.js'); //依赖config.js文件
var rootDocment = config.apiDomain; //获取在config.js文件中的全局变量，域名

// 查询openid状态
function referOpenid(result){
  let url = rootDocment+'/Api/WeChatEntry/CheckOpenIdValid'
  let header = {
    WeChatOpenId: wx.getStorageSync('openId'),
    WeChatType:'Applets'
  };
  header['X-TenantId'] = wx.getStorageSync('TenantId');
  wx.request({
    url: url,
    header:header,
    success:res=>{
      result(res)
    }
  })
}

module.exports = {
  referOpenid: referOpenid
}