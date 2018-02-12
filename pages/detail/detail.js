// detail.js
var Util = require('../../utils/util.js');
var Api = require('../../utils/api.js');
var WxParse = require('../../wxParse/wxParse.js');

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
          article: res.data.data,
          hidden: true
        });

        var content = res.data.data.content;
        /**
        * WxParse.wxParse(bindName , type, data, target,imagePadding)
        * 1.bindName绑定的数据名(必填)
        * 2.type可以为html或者md(必填)
        * 3.data为传入的具体数据(必填)
        * 4.target为Page对象,一般为this(必填)
        * 5.imagePadding为当图片自适应是左右的单一padding(默认为0,可选)
        */
        // var that = this;
        WxParse.wxParse('content', 'html', content, that, 5);
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
