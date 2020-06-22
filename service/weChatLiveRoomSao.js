var httpUtils = require('../utils/httpUtil.js');

// 根据 Header 中的 OpenId 获取直播列表
let listApi = "/Api/WeChatLiveRoom";
// 获取直播间详情
let detailApi = "/Api/WeChatLiveRoom/{id}";
// 获取用户聊天所需的信息
let chatUserInfoApi = "/Api/WeChatLiveRoom/ChatUserInfo";
// 获得房间受众
let audienceApi = "/Api/WeChatLiveRoom/Audience";
// 获取考勤状态
let AttendanceStatusApi = "/Api/WeChatStudent/AttendanceSetting"
// 获取信息
let studentInformationApi = "/Api/WeChatStudent/StudentInfo"

function list() {
  return httpUtils.get(listApi, null);
}

function detail(data) {
  return httpUtils.get(detailApi, data);
}

function chatUserInfo(data) {
  return httpUtils.get(chatUserInfoApi, data);
}

function audience(data) {
  return httpUtils.get(audienceApi, data);
}

function AttendanceStatus() {
  return httpUtils.get(AttendanceStatusApi, null);
}

function studentInformation() {
  return httpUtils.get(studentInformationApi, null);
}

module.exports = {
  list: list,
  detail: detail,
  chatUserInfo: chatUserInfo,
  audience: audience,
  AttendanceStatus: AttendanceStatus,
  studentInformation: studentInformation
}