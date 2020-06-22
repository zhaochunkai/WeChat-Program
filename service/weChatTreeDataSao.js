// 树
var httpUtils = require('../utils/httpUtil.js');

// 获取课程知识点树
// let getKnowledgePointTreeApi = "/Api/WeChatTreeData/KnowledgePointTreeData";

// 获取章
let getKnowledgePointTreeApi = "/Api/WeChatTreeData/ChapterChildren";

// 获取节
let sectionChildrenApi = "/Api/WeChatTreeData/SectionChildren";

// 获取知识点
let knowledgePointChildrenApi = "/Api/WeChatTreeData/KnowledgePointChildren";

function getKnowledgePointTree(data) {
  return httpUtils.get(getKnowledgePointTreeApi, data);
}


function getSectionChildren(data) {
  return httpUtils.get(sectionChildrenApi, data)
}

function knowledgePointChildren(data) {
  return httpUtils.get(knowledgePointChildrenApi, data);
}

module.exports = {
  getKnowledgePointTree: getKnowledgePointTree,
  getSectionChildren: getSectionChildren,
  knowledgePointChildren: knowledgePointChildren
}