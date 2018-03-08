// index.js
var Api = require('../../utils/api.js');

Page({
  data: {
    articles: [],
    hidden: false,
    curArticles: [],
    curIndex: 0,
    preDate:"",
    nextDate: "",
    curDate: ""
  },
  onPullDownRefresh: function () {
    this.fetchData();
    console.log('onPullDownRefresh', new Date())
  },
  // 事件处理函数
  redictDetail: function (e) {
    var title = e.currentTarget.id,
      url = '../detail/detail?title=' + title;

    wx.navigateTo({
      url: url
    })
  },

  onLoad: function () {
    // this.fetchData();
    this.initData();
  },



  initData: function () {
    var that = this;

    var openid = wx.getStorageSync("openId");
    if (openid != null && openid != '') {
      // 获取推荐文章
      this.getArticles(openid);
      return;
    }

    // openid不存在，则去请求
    wx.login({
      success: function (res) {
        if (res.code) {
          console.log(res.code);

          //发起网络请求
          wx.request({
            url: Api.getOpenId(),
            data: {
              code: res.code
            },
            success: function (res) {
              // 存储openid
              wx.setStorage({
                key: "openId",
                data: res.data.data
              });
              // 获取推荐文章
              that.getArticles(res.data.data);
            }
          })
        } else {
          console.log('获取用户登录态失败！' + res.errMsg);
          that.data.hidden = true;
        }
      },
      fail: function (res) {
        console.log(res);
        that.data.hidden = true;
      }
    });
  },



  /**
   * 获取推荐文章
   */
  getArticles: function (openid) {
    var that = this;

    wx.request({
      url: Api.getTitlesByDay(),
      data: {
        'wxid': openid,
        'days': 5
      },
      success: function (res) {
        console.log(res);
        // 获取文章成功
        if (res.data.success) {
          var dateKeys = Object.keys(res.data.data);
          var articles = [];
          for (var i = 0; i < dateKeys.length; i++) {
            articles.push({
              'date': that.formatDate(parseInt(dateKeys[i])),
              'articleList': res.data.data[dateKeys[i]]
            });
          }

          function compare(val1, val2) {
            return val2.date - val1.date;
          };
          articles.sort(compare);

          that.data.articles = articles;
          that.data.curArticles = articles[articles.length-1].articleList;
          that.data.curDate = articles[articles.length - 1].date;
          that.data.preDate = articles[articles.length - 2] == undefined ? undefined : articles[articles.length - 2].date;
          that.data.nextDate = undefined;
          that.data.curIndex = articles.length - 1;

          // TODO
          that.setData(that.data);
          setTimeout(function () {
            that.setData({
              hidden: true
            })
          }, 300);
        }
        // 用户不存在，则跳转类别选择页
        else if (res.data.errorCode == "006") {
          wx.redirectTo({
            url: '../category/category'
          });
        }
      }
    })
  },

  formatDate: function (millis) {
    var date = new Date(millis);
    return date.getMonth() + 1 + '月' + date.getDate() + '日';
  },


  prePage: function () {
    this.data.curIndex = this.data.curIndex-1;

    this.data.curArticles = this.data.articles[this.data.curIndex].articleList;
    this.data.curDate = this.data.articles[this.data.curIndex].date;
    this.data.preDate = this.data.articles[this.data.curIndex - 1] == undefined ? "" : this.data.articles[this.data.curIndex - 1].date;
    this.data.nextDate = this.data.articles[this.data.curIndex + 1] == undefined ? "" : this.data.articles[this.data.curIndex + 1].date;

    this.setData(this.data);
  },

  nextPage: function () {
    this.data.curIndex = this.data.curIndex + 1;

    this.data.curArticles = this.data.articles[this.data.curIndex].articleList;
    this.data.curDate = this.data.articles[this.data.curIndex].date;
    this.data.preDate = this.data.articles[this.data.curIndex - 1] == undefined ? "" : this.data.articles[this.data.curIndex - 1].date;
    this.data.nextDate = this.data.articles[this.data.curIndex + 1] == undefined ? "" : this.data.articles[this.data.curIndex + 1].date;

    this.setData(this.data);
  }

})