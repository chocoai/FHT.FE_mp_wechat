// pages/entryHouse/roomType/roomType.js
const fetch = require('../../../utils/api.js')
Page({
  /**
   * 页面的初始数据
   */
  data: {
    active: 1,
    checked:false,
    pickerColumn:'',
    popupShow:false,
    chamberCountShow:false,//室
    roomDataShow:false, //
    currentDataset:'',
    currentDatasetName:'',
    boardCountShow: false,//厅
    kitchenCountShow: false,//厨
    toiletCountShow: false,//卫
    dataArray:[
      ['1', '2', '3', '4', '5', '6', '7', '8','9'],  //室
      ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],// 厅
      ],
    steps: [
      {
        // text: '步骤一',
        desc: '编辑地址'
      },
      {
        // text: '步骤二',
        desc: '编辑户型'
      }
    ],
     etryHouseData:{  
      estateName: "", //品牌公寓
      provinceId: "", //省ID
      cityId: "", //市ID
      regionId: "", //区Id
      zoneId: "", //板块id
      regionAddressId: "", //小区ID
      buildingName: "",//楼幢名
      unitCode: '',//单元
      roomNo: '',//房间号
      floorName: '',//楼层
      floorAmount: '', //楼层总数
      chamberCount: 1, // 室
      boardCount: 0, //厅
      toiletCount: 0, //wei
      kitchenCount:0 // 厨
    },
    houseRentType:0
  },
  onLoad(params){
    //上一步传过来的参数
    console.log(params)
    // if (!!params.etryHouseData){
      let etryHouseData = JSON.parse(params.etryHouseData)
      this.setData({
        etryHouseData: etryHouseData,
        houseRentType: params.houseRentType
      })
    // } 
  },
  //室厅厨卫生点击事件
  chamberCountClick(e){
    this.setData({
      popupShow:true,
      chamberCountShow: true,//室
      roomDataShow: false,
      currentDataset: e.currentTarget.dataset.name
    })
  },
  roomCountClick(e){
    console.log(e.currentTarget.dataset.name)
    this.setData({
      popupShow: true,
      chamberCountShow: false,
      boardCountShow: false,//厅
      kitchenCountShow: false,//厨
      toiletCountShow: false,//卫
      roomDataShow: true,
      currentDataset: e.currentTarget.dataset.name
    })
    if (e.currentTarget.dataset.name === 'boardCount'){
        this.setData({
          boardCountShow: true,//厅
          kitchenCountShow: false,//厨
          toiletCountShow: false,//卫
        })
    } else if (e.currentTarget.dataset.name === 'toiletCount'){
      this.setData({
        boardCountShow: false,//厅
        kitchenCountShow: false,//厨
        toiletCountShow: true,//卫
      })

    } else if (e.currentTarget.dataset.name === 'kitchenCount'){
      this.setData({
        boardCountShow: false,//厅
        kitchenCountShow: true,//厨
        toiletCountShow: false,//卫
      })
    }
  },
  //点击选项
  pickerBindChange(e){
    this.data.etryHouseData[this.data.currentDataset] = parseInt(e.detail.value)+1
    this.setData({
      etryHouseData: this.data.etryHouseData
    })
  },
  //点击确定
  sureClick(){
    this.setData({
      popupShow: false,
      chamberCountShow: false,//室
      boardCountShow: false,//厅
      kitchenCountShow: false,//厨
      toiletCountShow: false,//卫
    })
  },
  //changedata
  onChange({detail}){
    console.log(detail)
    this.setData({
      checked:detail
    })
  },
  nextTeps(){  //合租 下一步
    wx.navigateTo({
      url: '../../entryHouse/addRoom/addRoom',
    })
  },
  //提交数据
  submitEntry(e){
    let datasetName = e.currentTarget.dataset.name
    console.log('params',this.data.etryHouseData)
    // fetch('/presaveRoom',{
    //   method: 'savePresaveRoom', //保存未完善房源
    //   params: {
    //     hostingInfo:JSON.stringify(this.data.etryHouseData)
    //   }
    // }).then((res)=>{
      if (datasetName === 'continueEntryHouse'){  //继续录入
         wx.navigateBack({
             delta: 1
          })
      } else if (datasetName === 'saveEntryHouse'){
          wx.redirectTo({
            url: '../../wanShanHouse/wanShanHouse?lr=true',  // 跳转到完善房源页面
          })
      }
  //   })
  }
})