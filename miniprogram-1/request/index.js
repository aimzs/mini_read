let ajkxtimes =0; //存在同时发送请求，记录请求次数
export const request=(params)=>{
  ajkxtimes++;
  // 显示加载中效果
  wx.showLoading({
    title: '加载中',
    mask:true
  })
  
  
  return new Promise((resolve,reject)=>{
    wx-wx.request({
      ...params,
      success:(result)=>{
        resolve(result);
      },
      fail:(err)=>{
        reject(err);
      },
      complete:()=>{
        ajkxtimes--;
        // 关闭正在等待的图标
        if(ajkxtimes===0){
           wx.hideLoading()
        }
      }
    })
  });
}