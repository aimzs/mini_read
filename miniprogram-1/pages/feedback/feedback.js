// pages/feedback/feedback.js
Page({
  data: {
    tabs: [
      {
        id: 0,
        value: "体验问题",
        isActive: true
      },
      {
        id: 1,
        value: "书籍或别的问题投诉",
        isActive: false
      }
    ],
    // 被选中的图片路径 数组
    chooseImgs: [],
    // 文本域的内容
    textVal: ""
  },
  // 外网的图片的路径数组
  UpLoadImgs: [],

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
 // 点击 “+” 选择图片
 handleChooseImg() {
  // 2 调用小程序内置的选择图片api
  wx.chooseImage({
    // 同时选中的图片的数量
    count: 9,
    // 图片的格式  原图  压缩
    sizeType: ['original', 'compressed'],
    // 图片的来源  相册  照相机
    sourceType: ['album', 'camera'],
    success: (result) => {

      this.setData({
        // 图片数组 进行拼接 
        chooseImgs: [...this.data.chooseImgs, ...result.tempFilePaths]
      })
    }
  });

},
   // 点击 自定义图片组件
   handleRemoveImg(e) {
    // 2 获取被点击的组件的索引
    const { index } = e.currentTarget.dataset;
    // 3 获取data中的图片数组
    let { chooseImgs } = this.data;
    // 4 删除元素
    chooseImgs.splice(index, 1);
    this.setData({
      chooseImgs
    })
  },
   // 文本域的输入的事件
   handleTextInput(e) {
    this.setData({
      textVal: e.detail.value
    })
  },
  // 提交按钮的点击
  handleFormSubmit() {
    // 1 获取文本域的内容 图片数组
    const { textVal, chooseImgs } = this.data;
    // 2 合法性的验证
    if (!textVal.trim()) {
      // 不合法
      wx.showToast({
        title: '输入不合法',
        icon: 'none',
        mask: true
      });
      return;
    }
    // 3 准备上传图片 到专门的图片服务器 
    // 上传文件的 api 不支持 多个文件同时上传  遍历数组 挨个上传 
    // 显示正在等待的图片
    wx.showLoading({
      title: "正在上传中",
      mask: true
    });
    // 判断有没有需要上传的图片数组
    if (chooseImgs.length != 0) {
      chooseImgs.forEach((v, i) => {
        wx.cloud.uploadFile({
          cloudPath: "submitted-picture/"+ new Date().getTime() +"-"+ Math.floor(Math.random() * 1000), // 上传至云端的路径
          filePath: v, // 小程序临时文件路径
          success: (result) => {
            console.log(result);
            
            // 所有的图片都上传完毕了才触发  
            if (i === chooseImgs.length - 1) {
              wx.hideLoading();
              
              console.log("已成功提交所有图片到 云开发服务器上");
              //  提交都成功了
              // 重置页面
              this.setData({
                textVal: "",
                chooseImgs: []
              })
              // 返回上一个页面
              wx.navigateBack({
                delta: 1
              });

            }
          }
        });
      })
    }else{
      wx.hideLoading();
        
      console.log("只是提交了文本");
      wx.navigateBack({
        delta: 1
      });
        
    }
  }
})