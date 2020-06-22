var httpUtils = require('../utils/httpUtil.js');

// 绑定微信id
let weChatURL = "/Api/WeChatEntry/WeChatBinding";

// 发送短信
let sendMsgUrl = "/Api/WeChatAccount/SendVerificationCode"

function weChatBinding(data) {
  return httpUtils.post(weChatURL, data)
}

function sendMsg(data) {
  return httpUtils.get(sendMsgUrl, data)
}

module.exports = {
  weChatBinding: weChatBinding,
  sendMsg: sendMsg
}