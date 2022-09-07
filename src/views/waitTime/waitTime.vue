<template>
  <div class="wait" :class=" pageType === 1 ?'model1':'model2'">
    <div class="wait-top">
      <div class="wait-top-back" @click="$router.go(-1)"></div>
      <div class="wait-top-share"></div>
    </div>
    <div class="wait-title">
      <div class="wait-title-top">《智慧生活启示录》</div>
      <div class="wait-title-btm">终极密卷</div>
    </div>
    <div class="wait-head">
      <div class="wait-head-lft">拥护AI阵营</div>
      <div class="wait-head-center">00:{{time}}</div>
      <div class="wait-head-rgt">反AI阵营</div>
    </div>
    <div class="wait-content">
      <div class="wait-content-lft">
        <div class="wait-content-lft-pic" v-for="(item,index) in img.imgList1" :key="index">
          <img :src="require('@/assets/'+ item.url +'.png')" width="80">
          <div v-show="!item.isWait">
            微信名：{{item.name}}
          </div>
        </div>
      </div>
      <div class="wait-content-rgt">
        <div class="wait-content-rgt-pic" v-for="(item,index) in img.imgList2" :key="index">
          <img :src="require('@/assets/'+ item.url +'.png')" width="80">
          <div v-show="!item.isWait">
            微信名：{{item.name}}
          </div>
        </div>
      </div>
      <div class="wait-content-text">
        V<span style="transform: translateY(4px);display: inline-block">S</span>
      </div>
    </div>
    <div class="wait-button">
      <div class="wait-button-lft">准备开始</div>
      <div class="wait-button-center"></div>
      <div class="wait-button-rgt">退出</div>
    </div>
  </div>
</template>

<script>
export default {
  name: "waitTime",
  data(){
    return{
      pageType:1,
      time:'30',
      img:{
        imgList1:[
          {url:'headPic/head1',name:'111',isWait:false},
          {url:'headPic/head1',name:'111',isWait:false},
          {url:'headPic/head2',name:'111',isWait:true},
        ],
        imgList2:[
          {url:'headPic/head1',name:'111',isWait:false},
          {url:'headPic/head1',name:'111',isWait:false},
          {url:'headPic/head2',name:'111',isWait:true},
        ],
      }
    }
  },
  mounted() {
    this.init()
    console.log(this.$route.params.group)
  },
  methods:{
    init(){
      let num = false
      let lastTime = setInterval(()=>{
        if (num){
          this.time = `0${ this.time.toString().substr(-1) - 1}`
          if (this.time === '00'){
            clearInterval(lastTime)
          }
          return
        }
        if (this.time === 10){
          this.time = '09'
          num = true
        } else{
          this.time = this.time - 1
        }
      },1000)
    }
  }
}
</script>

<style lang="scss" scoped>
.model1{
  background: url("../../assets/pageGround/page4.jpg") no-repeat;
}
.model2{
  background: url("../../assets/pageGround/page3.jpg") no-repeat;
}
.wait {
  width: 100%;
  height: 100vh;
  background-size: 100% 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 14%;
  overflow: hidden;
  &-top{
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 4% 10% 0;
    &-back{
      width: 70px;
      height: 70px;
      background: url("../../assets/icon/back.png") no-repeat;
      background-size: 100% 100%;
    }
    &-share{
      width: 70px;
      height: 70px;
      background: url("../../assets/icon/share.png") no-repeat;
      background-size: 100% 100%;
    }
  }
  &-title{
    width: 100%;
    text-align: center;
    &-hide{
      height: 30px;
      font-size: 16px;
      color: #FFF;
      margin-bottom: 2px;
    }
    &-top{
      font-size: 26px;
      color: #93FFFF;
      margin-bottom: 2px;
    }
    &-btm{
      font-size: 50px;
      color: #93FFFF;
      font-weight: 500;
    }
  }
  &-head{
    margin-top: 2%;
    width: 90%;
    height: 140px;
    background: url("../../assets/pageGround/page6.png") no-repeat;
    background-size: 100% 100%;
    display: flex;
    align-items: center;
    justify-content: space-around;
    padding: 0 80px 0 60px;
    box-sizing: border-box;
    &-lft{
      font-size: 24px;
      color: RGB(207, 251, 255,);
      filter: blur(0.6px);
    }
    &-center{
      color: #fff;
      font-size: 50px;
      align-self: center;
      padding-bottom: 10px;
      text-shadow: 0.5px 2px 2px #eb8aee;
      filter: blur(0.3px);
    }
    &-rgt{
      font-size: 24px;
      color: RGB(255, 241, 14);
      filter: blur(0.6px);
    }
  }
  &-content{
    position: relative;
    width: 90%;
    height: 48%;
    background: url("../../assets/pageGround/page5.png") no-repeat;
    background-size: 100% 100%;
    display: flex;
    font-size: 16px;
    color: #FFFFFF;
    text-shadow: hotpink 2px 0 0 ;
    &-lft{
      width: 50%;
      display: flex;
      flex-direction: column;
      padding-right: 10%;
      padding-top: 10%;
      box-sizing: border-box;
    }
    &-rgt{
      width: 50%;
      display: flex;
      flex-direction: column;
      padding-left: 10%;
      padding-top: 10%;
      box-sizing: border-box;
    }
    &-text{
      position: absolute;
      top: 34%;
      left: 50%;
      transform: translateX(-50%);
      font-size: 1.5rem;
      color: #FFFFFF;
    }
  }
  &-button{
    width: 100%;
    margin-top: 10%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 30px;
    color: #FFFFFF;
    text-shadow: hotpink 2px 0 0 ;
    &-lft{
      width: 200px;
      height: 80px;
      line-height: 80px;
      background: url("../../assets/button/button1.png") no-repeat;
      background-size: 100% 100%;
    }
    &-center{
      width: 16%;
    }
    &-rgt{
      width: 200px;
      height: 80px;
      line-height:  80px;
      background: url("../../assets/button/button1.png") no-repeat;
      background-size: 100% 100%;
    }
  }
}
</style>
