// pages/cart/cart.js

const db = wx.cloud.database();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // text:"这是一个页面"
    list: [],
   
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onShow: function () {

    this.getcollection();
  },

  getcollection(){

    var that = this;
    db.collection('collect').get().then(res => {
      // res.data 包含该记录的数据
      // console.log(res.data)
      let list = res.data;
      that.setData({
        list: list
      })
    })
  }

})