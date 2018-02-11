
var Api = require('../../utils/api.js');

Page({

  data: {
    categories:[
      // {id:'ai',name:'人工智能'},
      // { id: 'front', name: '前端' },
      // { id: 'java', name: 'Java' },
      // { id: 'cc', name: 'c/c++' },
      // { id: 'ops', name: '运维' },
    ],
    loading: false,
    disabled: true,
    selectedCategoryIds: []
  },



  initData: function () {
    var that = this;
    wx.request({
      url: Api.getAllCategories(),
      data: {},
      success: function (res) {
        that.data.categories = res.data.data;
        that.setData({
          categories: res.data.data
        });
      }
    })
  },







  onLoad: function () {
    this.initData();
  },

/**
 * 提交所选类别
 */
  selectCategory: function () {

    var categoryIdsStr = "";
    for (var i = 0; i < this.data.selectedCategoryIds.length; i++) {
      categoryIdsStr += this.data.selectedCategoryIds[i];
      if (i != this.data.selectedCategoryIds.length-1) {
        categoryIdsStr += ",";
      }
    }

    this.setData({
      'loading':true
    });
    wx.request({
      url: Api.createUserAndSelectCategory(),
      data: { 'wxid': wx.getStorageSync("openId"),categoryIds: categoryIdsStr},
      success: function (res) {
        wx.switchTab({
          url: '../index/index'
        });
      }
    });

  },

  checkboxChange: function (e) {
    console.log('checkbox发生change事件，携带value值为：',e.detail.value);
    this.data.selectedCategoryIds = e.detail.value;
    if (this.data.selectedCategoryIds.length > 0) {
      this.setData({
        disabled: false
      });
    }
    else {
      this.setData({
        disabled: true
      });
    }
  }
})