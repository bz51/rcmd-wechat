// detail.js
var Util = require('../../utils/util.js');
var Api = require('../../utils/api.js');

Page({
  data: {
    title: '话题详情',
    article: {},
    replies: [],
    hidden: false
  },


  fetchDetail: function(id) {
    var that = this;
    wx.request({
      url: Api.getTopicInfo({
        id: id
      }),
      success: function(res) {
        res.data[0].created = Util.formatTime(Util.transLocalTime(res.data[0].created));
        that.setData({
          detail: res.data[0]
        })
      }
    })
    that.fetchReplies(id);
  },


  initData: function(title) {
    var that = this;
    wx.request({
      url: Api.getArticleDetailByTitle(),
      data: {
        title: title,
        wxid: wx.getStorageSync('openId')
      },
      success: function (res) {
        that.setData({
          article: res.data.data
        });
        that.setData({
          hidden: true
        });
      },
      fail: function (res) {
        console.log(res);
      }
    })
  },


  onLoad: function (options) {
    this.initData(options.title);
  }
})
