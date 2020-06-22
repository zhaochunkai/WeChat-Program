import weChatOnlineStudySao from '../../../service/weChatOnlineStudySao.js'
import weChatTreeDataSao from '../../../service/weChatTreeDataSao.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    activeNames: ['1'],
    courseId: '',
    trainingProgramsId: '',
    chapters: {}, // 所有章数据
    questionChapters: [], // 练题章的知识点
    block: true
  },
  onChange(event) {
    this.setData({
      activeNames: event.detail
    });
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    // 获取上个页面传来的科目id
    let courseId = wx.getStorageSync('courseId');
    // 获取上个页面传来的项目id
    let trainingProgramsId = wx.getStorageSync('trainingProgramsId');
    that.setData({
      trainingProgramsId: trainingProgramsId,
      courseId: courseId
    })

    // 基础信息
    weChatOnlineStudySao.getOnlineStudyCourseBasicsInfo({
      courseId: courseId
    }).then(function (res) {
      that.setData({
        courseInfo: res
      })
    })

    // 获取章
    weChatTreeDataSao.getKnowledgePointTree({
      trainingProgramId: trainingProgramsId,
      courseId: courseId
    }).then(res => {
      res.forEach(item => {
        item.level = item.level.split(',')
      });
      that.setData({
        chapters: res
      })
    })
  },

  /**
   * 点击章获取节
   */
  getSectionChildren(e) {
    var arr = this.data.chapters.filter(d => {
      return e.currentTarget.dataset.chapterid === d.id
    })
    if (arr[0].children != null) {
      this.data.chapters.map(r => {
        if (e.currentTarget.dataset.chapterid === r.id) {
          r.children = null
          return r
        }
      })
      this.setData({
        chapters: this.data.chapters
      })
    } else {
      weChatTreeDataSao.getSectionChildren({
        trainingProgramId: this.data.trainingProgramsId,
        chapterId: e.currentTarget.dataset.chapterid
      }).then(res => {
        this.data.chapters.map(r => {
          if (e.currentTarget.dataset.chapterid === r.id) {
            res.forEach(item => {
              item.level = item.level.split(',')
            });
            r.children = res
            return r
          }
        })
        this.setData({
          chapters: this.data.chapters
        })
      })
    }
  },

  /**
   * 点击节获取知识点
   */
  getKnowledgePointChildren(event) {
    let that = this;
    this.data.chapters.map(r => {
      if (r.children !== null) {
        r.children.map(e => {
          if (event.currentTarget.dataset.sectionid === e.id) {
            if (e.children == null) {
              weChatTreeDataSao.knowledgePointChildren({
                trainingProgramId: that.data.trainingProgramsId,
                sectionId: event.currentTarget.dataset.sectionid
              }).then(res => {
                this.data.chapters.map(r => {
                  if (r.children !== null) {
                    r.children.map(e => {
                      if (event.currentTarget.dataset.sectionid === e.id) {
                        res.forEach(item => {
                          item.level = item.level.split(',')
                        });
                        e.children = res
                        return e
                      }
                    })
                  }
                })
                this.setData({
                  chapters: this.data.chapters
                })
              })
            } else {
              this.data.chapters.map(r => {
                if (r.children !== null) {
                  r.children.map(e => {
                    if (event.currentTarget.dataset.sectionid === e.id) {
                      e.children = null
                      return e
                    }
                  })
                }
              })
              this.setData({
                chapters: this.data.chapters
              })
            }
          }
        })
      }
    })
  },

  /**
   * 跳转知识点学习页面
   */
  gotoStudy: function (e) {
    var level = e.currentTarget.dataset.level
    if (level[1] == "True") {
      let that = this;
      let knowledgePointId = e.currentTarget.dataset.knowledgepointid
      // 储存知识点的id
      wx.setStorage({
        data: knowledgePointId,
        key: 'knowledgePointId',
      })
      let name = e.currentTarget.dataset.name
      wx.navigateTo({
        url: `/pages/online-study/content/index?name=${name}&knowledgePointId=${knowledgePointId}&trainingProgramsId=${that.data.trainingProgramsId}&courseId=${that.data.courseId}&level=${level[0]}&courseInfo=${JSON.stringify(this.data.courseInfo)}`,
      })
    } else {
      return
    }
  },
  splitStr(str) {
    return str.split(',')
  },
  // 获取错题本
  _getWrongQuestion() {
    weChatOnlineStudySao.getWrongQuestion().then(res => {
      res.items.map(item => {
        item.answerAnalysis = decodeURIComponent(item.answerAnalysis)
        item.questionName = decodeURIComponent(item.questionName)
        item.questionRecord = JSON.parse(item.questionRecord)
        item.questionRecord.map(it => {
          it.OptionContent = decodeURIComponent(it.OptionContent)
        })
        item.answerArr=[]
        item.errorArr=[]
        item.questionRecord.filter(r => {
          if (r.FlagAnswer) {
            item.answerArr.push(r.OptionNumber)
          }
          if(r.FlagChoose){
            item.errorArr.push(r.OptionNumber)
          }
        })
        item.questionRecord.sort((a, b) => {
          return a.OptionNumber.localeCompare(b.OptionNumber)
        })
      })
      if (res.totalCount > 0) {
        this.setData({
          block: false,
          questionData: res.items
        })
      }
    })
  },
  onShow() {
    this._getWrongQuestion()
  }
})