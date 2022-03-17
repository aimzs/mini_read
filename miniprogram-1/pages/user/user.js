// pages/user/user.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
      userinfo:[],

  },
  onShow(){
    const userinfo = wx.getStorageSync("userinfo");
    // console.log(userinfo);
    this.setData({
      userinfo
    })
   
  },


  getUserProfile(e) {
    // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认
    // 开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
    wx.getUserProfile({
      desc: '阅读使用', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {

      // console.log(res);
      const {userInfo} = res;
      wx.setStorageSync('userinfo', userInfo)
        // this.setData({
        //   userInfo: res.userInfo,
        //   hasUserInfo: true
        // })
        this.onShow();
      }
    })
   
  }
  
 
})