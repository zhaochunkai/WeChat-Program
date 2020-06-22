var httpUtils = require('../utils/httpUtil.js');

// 获取学生信息
let StudentInfoApi = "/Api/WeChatStudent/StudentInfo";
// 获取学习报告列表
let StudyReportApi = "/Api/WeChatStudyReport/ProjectInfos";
// 获取在线报告概述
let overviewOfStudyReportApi = "/Api/WeChatStudyReport/Overview"
// 获取个人基本信息
let StudentBasicInfoApi = "/Api/WeChatStudyReport/StudentBasicInfo"
// 获取直播学习
let liveStudyApi = "/Api/WeChatStudyReport/LiveStudy"
// 获取在线学习那棵树
let onlineStudyApi = "/Api/WeChatStudyReport/OnlineStudy"

function StudentInfo() {
  return httpUtils.get(StudentInfoApi, {});
}

function StudyReportList() {
  return httpUtils.get(StudyReportApi, {});
}

function overviewOfStudyReport(data) {
  return httpUtils.get(overviewOfStudyReportApi, data);
}

function getStudentBasicInfo(data) {
  return httpUtils.get(StudentBasicInfoApi, data);
}

function getLiveStudy(data) {
  return httpUtils.get(liveStudyApi, data);
}

function getOnlineStudy(data) {
  return httpUtils.get(onlineStudyApi, data);
}


module.exports = {
  StudentInfo: StudentInfo,
  StudyReportList: StudyReportList,
  overviewOfStudyReport: overviewOfStudyReport,
  getStudentBasicInfo: getStudentBasicInfo,
  getLiveStudy: getLiveStudy,
  getOnlineStudy: getOnlineStudy
}