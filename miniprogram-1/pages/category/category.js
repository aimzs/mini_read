// pages/category/category.js
import {
  request
} from "../../request/index.js";
const db = wx.cloud.database();
Page({

  data: {
    // 顶部标签
    tabs:[
      {
        id:0,
        value:"全部分类",
        isActive:true
      },
      {
        id:1,
        value:"男生",
        isActive:false
      },
      {
        id:2,
        value:"女生",
        isActive:false
      }
    ],
    
   MenuList: [],
    
  },
  Cates: [],

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    

    this.getCates();

  },
  //获取分类数据
  
  getCates() {
     //定义到这里，让that先获取到外面方法的this
     var that = this;
    
     db.collection('categories').where({_id: "a7fd268860e668e20013db6152a61ff5"
  }).get({
       success: function (res) {
         //console.log(res.data.RECORDS)
         const cate = res.data[0].message;
        //  console.log(cate);
         that.setData({
          MenuList: cate
         })
       }
       
     })

   
  },
  // 左侧菜单的点击事件
  handlditemtap(e){
    
    const {index} = e.currentTarget.dataset;
    let tabs =this.data.tabs;
 
    tabs.forEach((v,i)=>i===index?v.isActive=true:v.isActive=false)
    this.setData({
      tabs
    })
  }
})