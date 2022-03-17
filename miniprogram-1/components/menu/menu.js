// components/menu/menu.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {

    all_content:{
      type: Object,
      value:[]
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    hanldeitemTap(e){
      
      const {index} = e.currentTarget.dataset;
      // 触发父组件的事件 同时传递数据给父组件
      // 子组件像父组件 是通过事件传递 参数的
      this.triggerEvent("itemChange",{index})

    }
  }
})
