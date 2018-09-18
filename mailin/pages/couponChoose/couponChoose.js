// pages/couponChoose/couponChoose.js
const Ajax = require('../../utils/api.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    canuse:null,
    source:'',
    orderBillNo:'',
    couponList:null,
    coupon:null,
    couponName:null,
    discountAmount: null,
    money: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      orderBillNo: options.billNo,
      money: options.money,
      chooseCoupon: options.chooseCoupon || ''
    })
  },
  chooseActive(e){
    let canIf = e.currentTarget.dataset.inf.status
    if (canIf == 1){
      this.setData({
        canuse: e.currentTarget.dataset.inf.customerId,
        coupon: e.currentTarget.dataset.inf.id,
        discountAmount: e.currentTarget.dataset.inf.discountAmount
      })
      console.log(this.data.canuse)
    }
  },
  go(){
    if (!this.data.coupon) {
      wx.redirectTo({
        url: `/pages/payment/payment?billNo=${this.data.orderBillNo}&money=${this.data.money}&couponReceiveId=''`,
      })
      return
    }
    Ajax({
      url: '/coupon',
      method: 'useCoupons',
      params: {
        billNo: this.data.orderBillNo,
        couponReceiveId: this.data.coupon,
      }
    }).then(res => {
      console.log(res)
      wx.redirectTo({
        url: `/pages/payment/payment?billNo=${this.data.orderBillNo}&money=${res.data.billActualFee}&couponReceiveId=${this.data.coupon}&discountAmount=${this.data.discountAmount}`,
      })
    })
  },
  getcouponList(){
   Ajax({
     url: '/coupon',
     method: 'canUseCoupons',
     params: {
       billNo: this.data.orderBillNo,
     }
   }).then(res =>{
     this.setData({
       couponList: res.data.couponList
     })
     if (this.data.chooseCoupon) {
       let chooseCoupon = this.data.couponList.filter(item => item.id == this.data.chooseCoupon)
       if (chooseCoupon.length) {
        this.setData({
          canuse: chooseCoupon[0].customerId,
          coupon: chooseCoupon[0].id,
          discountAmount: chooseCoupon[0].discountAmount
        })
       }
     }
     console.log(res.data.couponList)
   })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.getcouponList()
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