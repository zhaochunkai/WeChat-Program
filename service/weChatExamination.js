// var httpUtils = require('../utils/httpUtil.js');
var httpExam = require('../utils/httpExam.js');

// 获取考试安排列表
function getExaminationArrangeList(data) {
  return httpExam.get("/Api/WeChatExamArrange", data);
}
// 获取补考安排列表
function getResitExaminationArrangeList(data) {
  return httpExam.get("/Api/WeChatResitExamArrange", data);
}
// 获取考试记录列表
function getExamPaperRecordList(data) {
  return httpExam.get("/Api/WeChatExamPaperRecord/GetExamPaperRecord", data);
}
// 获取考试记录详情
function getExamPaperRecordDetailById(data) {
  return httpExam.get("/Api/WeChatExamPaperRecord/ExamPaperRecordDetail", data);
}
// 获取试卷内容
function getExaminationPaperById(data) {
  return httpExam.get("/Api/WeChatOnlineExamination/GetExaminationPaper", data);
}
// 提交试卷
function submitExaminationPaper(data) {
  return httpExam.post("/Api/WeChatExamPaperRecord/saveExamPaper", data);
}

module.exports = {
  getExaminationArrangeList: getExaminationArrangeList,
  getResitExaminationArrangeList: getResitExaminationArrangeList,
  getExaminationPaperById: getExaminationPaperById,
  submitExaminationPaper: submitExaminationPaper,
  getExamPaperRecordList: getExamPaperRecordList,
  getExamPaperRecordDetailById: getExamPaperRecordDetailById
}