var httpUtils = require('../utils/httpUtil.js');

// 统一下单接口
let getJsSdkWeChatPrepayIdApi = "/Api/WeChatPay/GetJsSdkWeChatPrepayId";

// 根据统一下单接口返回的预支付 Id 生成支付签名
let getJsSdkWeChatPayParametersApi = "/Api/WeChatPay/GetJsSdkWeChatPayParameters";

function getJsSdkWeChatPrepayId(data) {
  return httpUtils.get(getJsSdkWeChatPrepayIdApi, data);
}

function getJsSdkWeChatPayParameters(data) {
  return httpUtils.get(getJsSdkWeChatPayParametersApi, data);
}

module.exports = {
  getJsSdkWeChatPrepayId: getJsSdkWeChatPrepayId,
  getJsSdkWeChatPayParameters: getJsSdkWeChatPayParameters
}