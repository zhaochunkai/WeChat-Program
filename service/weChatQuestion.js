var httpUtils = require('../utils/httpUtil.js');

// 获取随机试题练习
let getRandomQuestionApi = "/Api/WeChatQuestion/GetRandomQuestion";
// 试题练习记录
let postWeChatTryToPracticeApi = "/api/app/weChatQuestion/weChatTryToPractice";
// 获取章
let getChapterApi = "/Api/WeChatTreeData/Chapter";
// 获取节
let getSectionApi = "/Api/WeChatTreeData/Section";
// 获取知识点
let getKnowledgePointApi = "/Api/WeChatTreeData/KnowledgePoint";
// 提交练题
let CreateWeChatTryToPracticeApi = "/Api/WeChatQuestion/CreateWeChatTryToPractice";

function getRandomQuestion(data) {
  return httpUtils.get(getRandomQuestionApi, data);
}

function postWeChatTryToPractice(data) {
  return httpUtils.post(postWeChatTryToPracticeApi, data);
}

function getChapter(data) {
  return httpUtils.get(getChapterApi, data);
}

function getSectio(data) {
  return httpUtils.get(getSectionApi, data);
}

function getKnowledgePoint(data) {
  return httpUtils.get(getKnowledgePointApi, data);
}

function getCreateWeChatTryToPractice(data) {
  return httpUtils.post(CreateWeChatTryToPracticeApi, data);
}

module.exports = {
  getRandomQuestion: getRandomQuestion,
  postWeChatTryToPractice: postWeChatTryToPractice,
  getChapter: getChapter,
  getSectio: getSectio,
  getKnowledgePoint: getKnowledgePoint,
  getCreateWeChatTryToPractice: getCreateWeChatTryToPractice
}