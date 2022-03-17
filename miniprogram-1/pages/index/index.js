// index.js
// 引入用来发送请求的 方法   微信小程序中一定需要补全
import {
  request
} from "../../request/index.js";

const db = wx.cloud.database();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 轮播图数组
    swiperList: [],
    // 导航数组
    cateList: [],
    floorList1: [],
    floorList2: [],
    floorList3: [],
    floorList4: []
  },

  onLoad: function (options) {
    // 发送异步请求 获取轮播图数据
    // wx-wx.request({
    //   url: 'https://api-hmugo-web.itheima.net/api/public/v1/home/swiperdata',
    //   method: "GET",
    //   success: (result) => {
    //     console.log(result);
    //     this.setData(
    //       {
    //         swiperList:result.data.message
    //       }
    //     )
    //   }
    // })
    //promise 用来解决回调地狱
    this.getSwperList();
    //this.getCateList();
    this.getFloorList();

  },
  //获取轮播图数据
  getSwperList() {
    
   //定义到这里，让that先获取到外面方法的this
    var that = this;
    
    db.collection('swiperdata').get({
      success: function (res) {
        //console.log(res.data.RECORDS)
        const swiper = res.data[0].RECORDS;
        //console.log(swiper);
        that.setData({
          swiperList: swiper
        })
      }
      
    })

  },
  //获取导航数组
  getCateList() {
    request({
      url: 'https://api-hmugo-web.itheima.net/api/public/v1/home/catitems'
    }).then(result => {
      this.setData({
        cateList: result.data.message
      })
    })
  },
  getFloorList() {
    // 
    
    //定义到这里，让that先获取到外面方法的this
    var that = this;
    
    db.collection('book_bar').doc("f52c1ebe60e2e4e600519c2b709c6466").get({
      success: function (res) {
        // console.log(res)
        const floorlist1 = res.data.message1;
        const floorlist2 = res.data.message2;
        const floorlist3 = res.data.message3;
        const floorlist4 = res.data.message4;
        // console.log(floorlist1);
        that.setData({
          floorList1: floorlist1,
          floorList2: floorlist2,
          floorList3: floorlist3,
          floorList4: floorlist4
        })
      }
      
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})