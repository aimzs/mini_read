// pages/goods_detail/goods_detail.js
import {
  request
} from "../../request/index.js";

const db = wx.cloud.database();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodobj: [],
    isCollect: false,
    isShow: false

  },
  // 商品对象
  GoodsInfo: [],
  toggle() {

    if (this.data.isShow) {
      this.setData({
        isShow: false
      })
    } else {
      this.setData({
        isShow: true
      })
    }

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onShow: function () {
    let pages = getCurrentPages();
    let currentPage = pages[pages.length - 1];
    let options = currentPage.options;
    const {
      goods_id
    } = options;

    db.collection('collect').get().then(res => {
      // res.data 包含该记录的数据
      // console.log(res.data)
      let collect = res.data;
      // 4 把数组存入到缓存中
      try {
        wx.setStorageSync("collect", collect);
      } catch (e) {
        console.log("数据存储 失败！！！！")
      }

      // console.log("111");
    })
    this.getGoodsDetail(goods_id);
  },

  // 获取数据
  getGoodsDetail(goods_id) {

    var that = this;
    db.collection('book_detail').where({
      goods_id: goods_id
    }).get({
      success: function (res) {
        const goodsObj = res.data[0];
        that.GoodsInfo = goodsObj;
        // console.log(that.GoodsInfo)
        // 1 获取缓存中的商品收藏的数组
        let collect = wx.getStorageSync("collect") || [];
        // 2 判断当前商品是否被收藏
        let isCollect = collect.some(v => v.goods_id === that.GoodsInfo.goods_id);
        that.setData({
          goodobj: res.data[0],
          isCollect: isCollect
        })
      }
    })

  },
  // 点击 添加图书
  handleCartAdd(e) {
    let isCollect = false;
    // 1 获取缓存中的商品收藏数组
    let collect = wx.getStorageSync("collect") || [];

    // 2 判断该商品是否被收藏过
    let index = collect.findIndex(v => v.goods_id === this.GoodsInfo.goods_id);
    // 3 当index！=-1表示 已经收藏过 
    if (index !== -1) {
      // 能找到 已经收藏过了  在数组中删除该商品
      collect.splice(index, 1);
      isCollect = false;
      wx.showToast({
        title: '取消成功',
        icon: 'success',
        mask: true
      });
      var that = this;
      db.collection('collect').where({
        goods_id: that.GoodsInfo.goods_id
      }).remove({
        success: function (res) {
          // console.log(res.data)
        }
      })




    } else {
      // 没有收藏过
      collect.push(this.GoodsInfo);
      isCollect = true;
      wx.showToast({
        title: '收藏成功',
        icon: 'success',
        mask: true
      });
      var that = this;
      db.collection('collect').add({
        // data 字段表示需新增的 JSON 数据
        data: {
          // _id: 'todo-identifiant-aleatoire', // 可选自定义 _id，在此处场景下用数据库自动分配的就可以了
          book_author: that.GoodsInfo.book_author,
          cat_id: that.GoodsInfo.cat_id,
          goods_id: that.GoodsInfo.goods_id,
          goods_introduce: that.GoodsInfo.goods_introduce,
          goods_name: that.GoodsInfo.goods_name,
          goods_small_logo: that.GoodsInfo.goods_small_logo
        },
        success: function (res) {
          // res 是一个对象，其中有 _id 字段标记刚创建的记录的 id

        }
      })
    }
    // 4 把数组存入到缓存中
    wx.setStorageSync("collect", collect);
    // 5 修改data中的属性  isCollect
    this.setData({
      isCollect
    })

  }
})