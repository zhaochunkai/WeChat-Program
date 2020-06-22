var httpUtils = require('../utils/httpUtil.js');

// 接收学生签到
let acceptApi = "/Api/WeChatAttendance/Accept";
// 获取当前签到代办，信息
let attendanceTodoApi = "/Api/WeChatAttendance/AttendanceTodo";
// 教师绑定微信，为发起考勤
let teacherBindApi = "/Api/WeChatAttendance/TeacherBind";
// 获取发起考勤前的基本信息
let attendanceInitiateInfoApi = "/Api/WeChatAttendance/AttendanceInitiateInfo";
// 发起签到
let initiateAttendanceApi = "/Api/WeChatAttendance/InitiateAttendance";
// 推送提醒到本班学校
let sendToStudentsOfClassApi = "/Api/WeChatAttendance/SendToStudentsOfClass";

function postAccept(data) {
  return httpUtils.post(acceptApi, data);
}

function getAttendanceTodo() {
  return httpUtils.get(attendanceTodoApi);
}

function postTeacherBind(data) {
  return httpUtils.post(teacherBindApi, data);
}

function getAttendanceInitiateInfo() {
  return httpUtils.get(attendanceInitiateInfoApi);
}

function postInitiateAttendance(data) {
  return httpUtils.post(initiateAttendanceApi, data);
}

function postSendToStudentsOfClass(data) {
  return httpUtils.post(sendToStudentsOfClassApi, data);
}

module.exports = {
  postAccept: postAccept,
  getAttendanceTodo: getAttendanceTodo,
  postTeacherBind: postTeacherBind,
  getAttendanceInitiateInfo: getAttendanceInitiateInfo,
  postInitiateAttendance: postInitiateAttendance,
  postSendToStudentsOfClass: postSendToStudentsOfClass
}