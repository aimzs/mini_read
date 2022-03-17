
const db = wx.cloud.database();


function countPageNum(str, fontSize, lineHeight, windowW, windowH, pixelRatio) {
  var returnNum = 0;
  fontSize = fontSize;
  lineHeight = lineHeight;
  //将str根据’\n‘截成数组
  var strArray = str.split(/\n+/);
  var splitArray = [];//换行符的个数集合
  var reg = new RegExp('\n+', 'igm');
  var result = '';
  //这里写一个for循环去记录每处分隔符的\n的个数，这将会影响到计算换行的高度
  while ((result = reg.exec(str)) != null) {
    splitArray.push(result.toString().match(/\n/img).length);
  }
  var totalHeight = 0;
  strArray.forEach(function (item, index) {
    var wrapNum = 0;
    //splitArray的长度比strArray小1
    if (splitArray.length < index) {
      wrapNum = splitArray[index] - 1;
    }
    //Math.ceil向上取整
    totalHeight += Math.ceil(item.length / Math.floor((windowW - 120 / pixelRatio) / fontSize)) * lineHeight + wrapNum * lineHeight;
   
  });
  return Math.ceil(totalHeight / windowH)+1;
}
Page({
  data: {
    // 用来控制可滑动
    flag: true,
    all_content: [],
    scroll_top:1,
    Text:"",//用于存放文本
    fontSize:'24',
    pageIndex: 1,
    title:'',
    pageNum: 0,
    serialNumber: 1,
    title: '',
    Name :'',
    content: '',
    lineHeight: 26, //单位rpx
    windows: { windowsHeight: 0, windowsWidth: 0, pixelRatio: 1 },
    colorArr: [{
      value: '#f7eee5',
      name: '米白',
      font: ''
    }, {
      value: '#e9dfc7',
      name: '纸张',
      font: '',
      id: "font_normal"
    }, {
      value: '#a4a4a4',
      name: '浅灰',
      font: ''
    }, {
      value: '#cdefce',
      name: '护眼',
      font: ''
    }, {
      value: '#283548',
      name: '灰蓝',
      font: '#7685a2',
      bottomcolor: '#fff'
    }, {
      value: '#0f1410',
      name: '夜间',
      font: '#4e534f',
      bottomcolor: 'rgba(255,255,255,0.7)',
      id: "font_night"
    }],
    nav:'none',
    ziti:'none',
    _num:1,
    bodyColor:'#e9dfc7',
    daynight:false,
    zj:'none',
    cata:"none"

  },
  page_index: 0,
  // 临时存储 数组
  message: [],
  onLoad: function (options) {

    const { goods_id } = options;
    
    this.getcontent(goods_id);
   
    var that = this;
    wx.getStorage({
      key: 'fontSize',
      success: function (res) {
        // console.log(res.data)
        that.setData({
          fontSize: res.data
        })
      }
    })
    //存储背景色
    wx.getStorage({
      key: 'bodyColor',
      success: function (res) {
        // console.log(res.data)
        that.setData({
          bodyColor: res.data
        })
      }
    })
    wx.getStorage({
      key: '_num',
      success: function (res) {
        // console.log(res.data)
        that.setData({
          _num: res.data
        })
      }
    })
    wx.getStorage({
      key: 'daynight',
      success: function (res) {
        // console.log(res.data)
        that.setData({
          daynight: res.data
        })
      }
    })
    //数据接口
    wx.request({
      url: '', //仅为示例，并非真实的接口地址
      data: {
          "bookId": "86",
          "chapterId": "2",
          "isDel": 1, 
          "token": "",
          "os": 3,
          "channel": "", 
          "netname": "m" 
      },
      method:'POST',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        console.log(res.data)
      }
    })
  },

// 定义 章节内容获取函数
getcontent(goods_id){
  var that = this;

  // db.collection('book_content').get({
  //   success: function(res) {
  //     // res.data 是一个包含集合中有权限访问的所有记录的数据，不超过 20 条
  //     console.log(res.data)
  //   }
  // })
  // 使用promise 风格
  db.collection('book_content').where({
    goods_id: Number(goods_id)
  }).get().then(res => {
    // res.data 是一个包含集合中有权限访问的所有记录的数据，不超过 20 条
    // console.log(res.data[0])
    this.message = res.data[0].meassage;
    console.log(this.message) 
    let content = res.data[0];
    that.setData({
      all_content: content,
      Text: content.meassage[0].content,
      title: content.meassage[0].title
    })
  })
  
},

   //事件处理函数
   //字体变大
  bindBig: function () {
    var that=this;
    if (that.data.fontSize>20){
      return;
    }
    var FontSize=parseInt(that.data.fontSize)
    that.setData({
      fontSize: FontSize +=1
    })
    // console.log(that.data.fontSize)
    wx.setStorage({
      key: "fontSize",
      data: that.data.fontSize
    })
  },
  //字体变小
  bindSmall: function () {
    var that = this;
    if (that.data.fontSize <12) {
      return;
    }
    var FontSize = parseInt(that.data.fontSize)
    that.setData({
      fontSize: FontSize -= 1
    })
    // console.log(that.data.fontSize)
    wx.setStorage({
      key: "fontSize",
      data: that.data.fontSize
    })
  },
  //点击中间区域显示底部导航
  midaction:function(){

    if(this.data.cata=='block'){
      this.setData({
        nav: 'none',
        ziti: 'none',
        zj:'none',
        cata:'none'
      })
    }
    else if (this.data.nav=='none'){
      this.setData({
        nav:'block',
        zj:'block'
      })
    }else{
      this.setData({
        nav: 'none',
        ziti: 'none',
        zj:'none',
        cata:'none'
      })

    }
  },
  //点击目录出现窗口
  cataaction:function(){
    if (this.data.cata == 'none') {
      this.setData({
       cata:'block',
       ziti:'none',
       zj:'none',
       nav:'none'
      })
    } else {
      this.setData({
        cata:'none'
      })
    }
  },
  //点击字体出现窗口
  zitiaction:function(){
    if (this.data.ziti == 'none') {
      this.setData({
        ziti: 'block',
        cata:'none'
      })
    } else {
      this.setData({
        ziti: 'none',
        
      })
    }
  },
  //选择背景色
  bgChange:function(e){
    // console.log(e.target.dataset.num)
    // console.log(e)
    this.setData({
      _num: e.target.dataset.num,
      bodyColor: this.data.colorArr[e.target.dataset.num].value
    })
    wx.setStorage({
      key: "bodyColor",
      data: this.data.colorArr[e.target.dataset.num].value
    })
    wx.setStorage({
      key: "_num",
      data: e.target.dataset.num
    })
  },
  //切换白天夜晚
  dayNight:function(){
      if(this.data.daynight==true){
       this.setData({
         daynight:false,
         bodyColor:'#e9dfc7',
         _num:1
       })
       wx.setStorage({
         key: "bodyColor",
         data: '#e9dfc7'
       })
       wx.setStorage({
         key: "_num",
         data:1
       })

      }else{
        this.setData({
          daynight: true,
          bodyColor: '#000',
          _num:5
        })
        wx.setStorage({
          key: "bodyColor",
          data: '#000'
        })
        wx.setStorage({
          key: "_num",
          data:5
        })
      }
      wx.setStorage({
        key: "daynight",
        data: this.data.daynight
      })
  },
  //滚动隐藏窗口
  scrollContain:function(){
    this.setData({
      nav: 'none',
      ziti: 'none',
      zj:'none'
    })
  },
  //滚动到底部
  bindscrolltolower:function(){
    this.setData({
      zj: 'block',
    })
    wx.showToast({
      title: '本章已经完,请观看下一章',
    })
  },
  //上一页下一页
  lastPage:function(){
    if(this.page_index < 0){
      wx.showToast({
        title: '已到最初章',
      })
    }else{
      this.page_index--;
      const index = this.page_index;
      this.setData({
        Text: this.message[index].content,
        title: this.message[index].title,
        pageIndex:index,
        scroll_top: 0,
      })
      wx.pageScrollTo({
        scrollTop: 0,
        duration: 1
      })
    }
  },
  nextPage:function(){
    if(this.page_index >99){
      wx.showToast({
        title: '已到最后一章',
      })
    }else{
      this.page_index++;
      let index = this.page_index;
      this.setData({
        Text: this.message[index].content,
        title: this.message[index].title,
        pageIndex: index,
        scroll_top: 0 ,
      });
      wx.pageScrollTo({
        scrollTop: 0,
        duration: 1
      })
    }
  },
  // 自定义事件用来接收 menu 组件传过来的 index值 
  handleitemChange(e){
    const {index} =  e.detail;
    console.log(index);
    this.page_index = index;
    this.setData({
      Text: this.message[this.page_index].content,
      title: this.message[this.page_index].title,
      pageIndex: this.page_index,
      scroll_top: 0,
      cata:"none"
    });
    wx.pageScrollTo({
      scrollTop: 0,
      duration: 1
    })
  }
})
  
  