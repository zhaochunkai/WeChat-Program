var httpUtils = require('../utils/httpUtil.js');

// WeChat获取默认学期
let getDefaultSemesterApi = "/Api/WeChatSemester/GetDefaultSemester";

function GetDefaultSemester() {
  return httpUtils.get(getDefaultSemesterApi, null);
}

module.exports = {
  GetDefaultSemester : GetDefaultSemester
}