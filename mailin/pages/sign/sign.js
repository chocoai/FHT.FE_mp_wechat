
var content = null;
var touchs = [];
var canvasw = 0;

var canvash = 0;
const upng = require('../../utils/upng-js/UPNG.js')
const Ajax = require('../../utils/api.js')
//获取系统信息
wx.getSystemInfo({
  success: function (res) {
    canvasw = res.windowWidth;
    canvash = res.windowHeight;
  },
}),

  Page({
    /**
    * 页面的初始数据
    */
    data: {
      signImage: '',
      contractNo: null,
      activeTab: null,
      canvash: canvash,
      hasDraw:null
    },
    // 画布的触摸移动开始手势响应
    start: function (event) {
       console.log("触摸开始" + event.changedTouches[0].x)
       console.log("触摸开始" + event.changedTouches[0].y)
      //获取触摸开始的 x,y
      let point = { x: event.changedTouches[0].x, y: event.changedTouches[0].y }
      touchs.push(point)
      this.setData({
        hasDraw: event.changedTouches[0].y
      })
    },

    // 画布的触摸移动手势响应
    move: function (e) {
      let point = { x: e.touches[0].x, y: e.touches[0].y }
      touchs.push(point)
      if (touchs.length >= 2) {
        this.draw(touchs)
      }
    },

    // 画布的触摸移动结束手势响应
    end: function (e) {
      console.log("触摸结束" + e)
      //清空轨迹数组
      for (let i = 0; i < touchs.length; i++) {
        touchs.pop()
      }

    },

    // 画布的触摸取消响应
    cancel: function (e) {
      console.log("触摸取消" + e)
    },

    // 画布的长按手势响应
    tap: function (e) {
      console.log("长按手势" + e)
    },

    error: function (e) {
      console.log("画布触摸错误" + e)
    },
    /**
    * 生命周期函数--监听页面加载
    */
    onLoad: function (options) {
      //获得Canvas的上下文
      this.setData({
        contractNo: options.contractNo,
        activeTab: options.activeTab ||null
      })
      content = wx.createCanvasContext('myCanvas')
      //设置线的颜色
      content.setStrokeStyle("#123123")
      //设置线的宽度
      content.setLineWidth(5)
      //设置线两端端点样式更加圆润
      content.setLineCap('round')
      //设置两条线连接处更加圆润
      content.setLineJoin('round')
    },

    /**
    * 生命周期函数--监听页面初次渲染完成
    */
    onReady: function () {
    },

    //绘制
    draw: function (touchs) {
      let point1 = touchs[0]
      let point2 = touchs[1]
      touchs.shift()
      content.moveTo(point1.x, point1.y)
      content.lineTo(point2.x, point2.y)
      content.stroke()
      content.draw(true)
    },
    //清除操作
    clearClick: function () {
      //清除画布
      content.clearRect(0, 0, canvasw, canvash)
      content.draw(true)
      this.setData({
        hasDraw: null
      })
    },
    signContract(){
      this.data.hasDraw !== null ?this.sign()
        : wx.showModal({
          title: '提示',
          content: '画布为空，请先手绘签名再提交',
          success: function (res) {
            wx.hideLoading()
          }
          })
     
    },
    sign() {
      let that = this
      Ajax({
        url: '/contract',
        method: 'signContract',
        params: {
          contractNo: this.data.contractNo,
          sealData: this.data.signImage
        }
      }).then(res => {
        wx.hideLoading()
        wx.showModal({
          title: '提示',
          content: '您已签约成功，请前去支付',
          showCancel: false,
          success: function (res) {
            if (res.confirm) {
              wx.redirectTo({
                url: `/pages/order/Order?activeTab=${that.data.activeTab}`
              })
            } else if (res.cancel) {
              console.log('用户点击取消')
            }
          }
        })

      })
    },
    //保存图片
    saveClick: function () {
      var that = this
      wx.showLoading()
      wx.canvasGetImageData({
        canvasId: 'myCanvas',
        x: 0,
        y: 0,
        width: canvasw ,
        height: canvash,
        success(res) {
          //将图片转化成utf-8格式
          let pngData = upng.encode([res.data.buffer], res.width, res.height)
          // 4. base64编码
          let base64 = wx.arrayBufferToBase64(pngData)
          console.log(res.data.buffer)
          var b64 = 'data:image/jpeg;base64,' + base64
          that.setData({
            signImage: b64
          })
          that.signContract()
        }
      })
    }
  })