var httpUtils = require('../utils/httpUtil.js');

// 获取培训项目下拉列表
let trainingProgramsDropdownsApi = "/Api/WeChatEntry/TrainingProgramsDropdowns";
// 获取培训项目信息
let trainingProgramsInfoApi = "/Api/WeChatEntry/TrainingProgramsInfo";
// 根据微信绑定Id查询学生报名项目信息
let entryInfoByWeChatIdApi = "/Api/WeChatEntry/EntryInfoByWeChatId";
// 报名:提交表单
let enrollApi = "/Api/WeChatEntry/Enroll";
// 获取腾讯云Token
let getTempFileUploadTokenApi = "/Api/ExternalFiles/GetTempFileUploadToken"
// 二次报名信息
let AgainEnrollApi = "/Api/weChatEntry/AgainEnroll";

function getTrainingProgramsDropdowns() {
  return httpUtils.get(trainingProgramsDropdownsApi, null)
}       

function getTrainingProgramsInfo(data) {
  return httpUtils.get(trainingProgramsInfoApi, data)
}

function getEntryInfoByWeChatId() {
  return httpUtils.get(entryInfoByWeChatIdApi, null)
}
// 报名
function postEnrollApi(data) {
  return httpUtils.post(enrollApi, data);
}

function getTempFileUploadToken() {
  return httpUtils.get(getTempFileUploadTokenApi,null);
}

function AgainEnroll(data) {
  return httpUtils.post(AgainEnrollApi,data);
}

module.exports = {
  getTrainingProgramsInfo: getTrainingProgramsInfo,
  getTrainingProgramsDropdowns: getTrainingProgramsDropdowns,
  getEntryInfoByWeChatId: getEntryInfoByWeChatId,
  postEnrollApi: postEnrollApi,
  getTempFileUploadToken: getTempFileUploadToken,
  AgainEnroll: AgainEnroll
}