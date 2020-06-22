var httpUtils = require('../utils/httpUtil.js');
var httpLive = require('../utils/live')

// 直播观众列表
let audienceUrl = "/Api/LiveRoom/Audience";

// 直播间信息
let weChatLiveRoomUrl = "/Api/weChatLiveRoom"

// 自动签到
let CheckInUrl = "/Api/LiveRoom/CheckIn"

// 查询是否签到
let CheckInflagUrl = "/Api/LiveRoom/CheckIn"

// 直播时长
let LearningTimeUrl = "/Api/LiveRoom/LearningTime"

// 上传直播时长
let UpLearningTimeUrl = "/Api/LiveRoom/LearningTime"

function getAudience(data) {
  return httpLive.get(audienceUrl, data)
}

function getweChatLiveRoom(data) {
  return httpUtils.get(weChatLiveRoomUrl+'/'+data,null)
}

function getCheckIn(data) {
  return httpLive.put(CheckInUrl+`?roomNumber=${data.roomNumber}`,{})
}

function CheckInflag(data) {
  return httpLive.get(CheckInflagUrl,data)
}

function LearningTime(data) {
  return httpLive.get(LearningTimeUrl,data)
}

function UpLearningTime(data) {
  return httpLive.put(UpLearningTimeUrl+`?roomNumber=${data.roomNumber}&learningTime=${data.learningTime}`,{})
}

module.exports = {
  getAudience: getAudience,
  getweChatLiveRoom: getweChatLiveRoom,
  getCheckIn: getCheckIn,
  CheckInflag: CheckInflag,
  LearningTime: LearningTime,
  UpLearningTime: UpLearningTime
}