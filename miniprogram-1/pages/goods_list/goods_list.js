// pages/goods_list/goods_list.js
import { request} from "../../request/index.js";
const db = wx.cloud.database();
Page({
  data: {
    tabs:[
      {
        id:0,
        value:"综合",
        isActive:true
      },
      {
        id:1,
        value:"最热",
        isActive:false
      },
      {
        id:1,
        value:"评分",
        isActive:false
      }
    ],
    goodslist:[],
    goodslist2:[],
    
  },
  
  QueryParam:{
    query:"",
    cid:9,
    pagenum:1,
    pagesize:10,
  },

totalPages:1,
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
    this.QueryParam.cid = options.cat_id||"";
    this.getDoodsList();
    // this.getDoodsList2();
    // console.log( this.QueryParam.cid)


    wx.showLoading({
      title: '加载中',
    })
    
    setTimeout(function () {
      wx.hideLoading()
    }, 2000)
  },
//获取商品列表数据
 getDoodsList(){

//定义到这里，让that先获取到外面方法的this
var that = this;

db.collection('search').where({
  cat_id: Number(this.QueryParam.cid)
}).get({
  success: function (result) {
    const res = result.data[0];
    
    const total = res.total;
   
    that.totalPages = Math.ceil(total/that.QueryParam.pagesize);
    // console.log(that.totalPages);
    
   that.setData({
    goodslist: [...that.data.goodslist,...res.goods]
   })
  }
  
})
    //关闭下拉刷新的窗口
    wx.stopPullDownRefresh();
  
 },
 getDoodsList2(){
  // request({url:'http://localhost:8081/getueserlist'}).then(result=>{
  //     console.log(result);
  //     const goodlist2 = result.data;
  //     this.setData({
  //       goodsList2: goodlist2
  //     })
  // }
  // )
 },
  
  handletabsitemchange(e){
      //console.log(e)
      // 获取被点击的标题索引
      const {index} = e.detail;
      // 修改原数组
      let {tabs} = this.data;
      tabs.forEach((v,i)=>i===index?v.isActive=true:v.isActive=false)
      //赋值到data中
      this.setData({
        tabs
      })
  },
  // 页面触底事件
  onReachBottom(){

    // 由于后台接口不存在按pagenum封装，所以分页无法实现，给定触底显示结束
    // console.log(this.totalPages);
    // console.log(this.QueryParam.pagenum);
    // //判断还有没有下一页数据
    // if(this.QueryParam.pagenum>=this.totalPages){
    //   //没有下一页数据
    //   console.log("没有下一页数据");
    //   wx-wx.showToast({
    //     title: '没有下一页数据了',
        
    //   })
    // }else{
    //   // 有下一页数据
    //   console.log("有下一页数据")
    //   this.QueryParam.pagenum++;
    //   this.getDoodsList();
    // }
    //
    wx-wx.showToast({
          title: '没有下一页数据了',
          
        })
  },
  onPullDownRefresh(){
    //console.log("刷新成功");
    // 重置数据
    this.setData({
      goodslist:[]
    })
    // 重置页码
    this.QueryParam.pagenum = 1;
    // 重新发送请求
    this.getDoodsList();
  }
})