var httpUtils = require('../utils/httpUtil.js');

// 获取在线评价列表
function getEvaluationPlanList(data) {
  return httpUtils.get("/Api/WeChatEvaluationPlan/List", data);
}
// 评价详情
function getEvaluationPlanById(data) {
  return httpUtils.get("/Api/WeChatEvaluationPlan", data);
}
// 保存评价内容
function submitEvaluationPlanById(data) {
  return httpUtils.post("/Api/WeChatEvaluationPlan", data);
}

module.exports = {
  getEvaluationPlanList: getEvaluationPlanList,
  getEvaluationPlanById: getEvaluationPlanById,
  submitEvaluationPlanById: submitEvaluationPlanById
}