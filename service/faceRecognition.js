var httpFace = require('../utils/httpFace.js');

// 录入
let CreatePersonApi = "/Api/WeChatFaceAttendance/CreatePerson";

// 识别
let VerifyFaceApi = "/Api/WeChatFaceAttendance/VerifyFace";

// 在线学习上传考勤记录
let CreateFaceAttendanceApi = "/Api/WeChatFaceAttendance/CreateFaceAttendance";

// 在线直播上传考勤记录
let UpRecognitionUrl = "/Api/WeChatLiveRoom/VerifyFace"

//身份验证
let AuthenticationUrl = "/Api/WeChatRealNameCertification/RealNameCertification"


function CreatePerson(data) {
  return httpFace.post(CreatePersonApi, data);
}

function VerifyFace(data) {
  return httpFace.post(VerifyFaceApi, data);
}

function CreateFaceAttendance(data) {
  return httpFace.post(CreateFaceAttendanceApi, data);
}

function UpRecognition(data) {
  return httpFace.post(UpRecognitionUrl, data)
}

function Authentication(data) {
  return httpFace.post(AuthenticationUrl, data)
}

module.exports = {
  CreatePerson: CreatePerson,
  VerifyFace: VerifyFace,
  CreateFaceAttendance: CreateFaceAttendance,
  UpRecognition: UpRecognition,
  Authentication: Authentication
}