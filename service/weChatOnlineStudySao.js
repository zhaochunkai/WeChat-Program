//在线学习
var httpUtils = require('../utils/httpUtil.js');

// 获取课程的基本信息
let getOnlineStudyCourseBasicsInfoApi = "/Api/WeChatOnlineStudy/OnlineStudyCourseBasicsInfo";
// 根据微信绑定Id查询培训项目信息
let getTrainingProgramInfoByWeChatIdApi = "/Api/WeChatOnlineStudy/OnlineStudyTrainingProgramInfoByWeChatId";
// 根据微信绑定Id和培训项目id查询课程信息
let getOnlineStudyCourseInfoApi = "/Api/WeChatOnlineStudy/OnlineStudyCourseInfo";
// 设置学习进度
let postSetStudyProgressApi = "/Api/WeChatOnlineStudy/SetStudyProgress"
// 获取某个节的学习进度
let getStudyProgressApi = "/Api/WeChatOnlineStudy/GetStudyProgress"
// 获取绑定的资源
let getOnlineStudyResourceApi = "/Api/WeChatOnlineStudy/OnlineStudyResource"
// 增加资源浏览量
let putIncreaseBrowseCountApi = "/Api/WeChatOnlineStudy/IncreaseBrowseCount?resourceId="
// 增加学生个人某资源的访问量
let IncreaseStudentStudyBrowseCountApi= "/Api/WeChatOnlineStudy/IncreaseStudyBrowseCount"
// 获取pdf
let pdfApi = "/Api/ExternalFiles/Preview"
// 获取考勤状态
let AttendanceStatusApi = "/Api/WeChatStudent/AttendanceSetting"
// 获取信息
let studentInformationApi = "/Api/WeChatStudent/StudentInfo"
// 获取错题本
let wrongQuestionApi = "/Api/WeChatQuestion/GetWrongQuestion"

function getOnlineStudyCourseBasicsInfo(data) {
  return httpUtils.get(getOnlineStudyCourseBasicsInfoApi, data);
}

function getTrainingProgramInfoByWeChatId() {
  return httpUtils.get(getTrainingProgramInfoByWeChatIdApi, null);
}

function getOnlineStudyCourseInfo(data) {
  return httpUtils.get(getOnlineStudyCourseInfoApi, data);
}

function postSetStudyProgress(data) {
  return httpUtils.post(postSetStudyProgressApi, data);
}

function getStudyProgress(data) {
  return httpUtils.get(getStudyProgressApi, data);
}

function getOnlineStudyResource(data) {
  return httpUtils.get(getOnlineStudyResourceApi, data);
}

function putIncreaseBrowseCount(data) {
  return httpUtils.put(putIncreaseBrowseCountApi+data.resourceId, {});
}

function IncreaseStudentStudyBrowseCount(data) {
  return httpUtils.put(IncreaseStudentStudyBrowseCountApi, data);
}

function pdf(data) {
  return httpUtils.get(pdfApi, data);
}

function AttendanceStatus() {
  return httpUtils.get(AttendanceStatusApi, null);
}

function studentInformation() {
  return httpUtils.get(studentInformationApi, null);
}

function getWrongQuestion() {
  return httpUtils.get(wrongQuestionApi, null);
}

module.exports = {
  getOnlineStudyCourseBasicsInfo: getOnlineStudyCourseBasicsInfo,
  getTrainingProgramInfoByWeChatId: getTrainingProgramInfoByWeChatId,
  getOnlineStudyCourseInfo: getOnlineStudyCourseInfo,
  postSetStudyProgress: postSetStudyProgress,
  getStudyProgress: getStudyProgress,
  getOnlineStudyResource: getOnlineStudyResource,
  putIncreaseBrowseCount: putIncreaseBrowseCount,
  pdf: pdf,
  IncreaseStudentStudyBrowseCount: IncreaseStudentStudyBrowseCount,
  AttendanceStatus: AttendanceStatus,
  studentInformation: studentInformation,
  getWrongQuestion: getWrongQuestion
}