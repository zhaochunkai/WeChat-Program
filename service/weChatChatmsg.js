var httpUtils = require('../utils/httpUtil.js');

// 直播间地址
let websocketURL = "/Api/Chat";

function getTrainingProgramsDropdowns() {
  return httpUtils.get(trainingProgramsDropdownsApi, null)
}

module.exports = {
  getTrainingProgramsDropdowns: getTrainingProgramsDropdowns
}