<template>
  <div class="start" :class=" pageType === 1 ?'model1':'model2'">
    <NavigationBar />
    <!-- <div class="start-top">
      <div class="start-top-back" @click="$router.go(-1)"></div>
      <div class="start-top-share"></div>
    </div> -->
    <div class="start-title">
      <div class="start-title-hide" v-if="showTitleHide">三翼鸟沉浸式剧本游戏</div>
      <div class="start-title-top">《智慧生活启示录》</div>
      <div class="start-title-btm">终极密卷</div>
    </div>
    <popup-inquiry :show="showInquiry" :text="popupText" @handleConfirm="handleConfirm"></popup-inquiry>
    <popup-flow-path :show="showFlowPath" @handleHidden="showFlowPath = false" :type="pageTypeList" @handleConfirm="handleConfirm"></popup-flow-path>
  </div>
</template>

<script>
import NavigationBar from '../../components/navigationBar.vue'
import popupInquiry from "../../components/popup/popupInquiry";
import popupFlowPath from "../../components/popup/popupFlowPath";
import * as request from '../../api/service/game'
export default {
  name: "volumeOneStart",
  components:{popupInquiry,popupFlowPath,NavigationBar},
  data(){
    return{
      showInquiry:true,
      showFlowPath:false,
      popupText:"",
      showTitleHide:false,
      pageType:1,
      pageTypeList:{
        title:'输入房间号',
        input:true,
        text:'',
        btnText:'确定',
        pageState:''
      }
    }
  },
  methods:{
    handleConfirm(e){
      if (this.pageType === 1){
        this.pageType = 2
        this.showInquiry = false
        this.showFlowPath = true
        return false
      }
      if (this.pageType === 2){
        if (e.type === 'warring'){
          this.pageTypeList={
            title:'输入房间号',
            input:true,
            text:'',
            btnText:'确定',
            pageState:''
          }
          return false
        }
        if (e.inputText === ''){
          this.pageTypeList={
            title:'警告',
            input:false,
            text:['请输入房间号'],
            btnText:'确定',
            pageState:'warring'
          }
          return false
        }else{
          this.getRoom(e.inputText)
          // this.pageType = 3
          // this.pageTypeList={
          //   title:'',
          //   input:false,
          //   text:['短暂的体验已经结束~','点击预约，Get四维世界','同款家生活吧！'],
          //   btnText:'立即预约',
          //   pageState:''
          // }
          // return false
        }
      }
      if (this.pageType === 3) {
        this.pageTypeList = {
          title: '',
          input: false,
          text: ['没玩够？', '点击预约探店三翼鸟免费打本', '体验什么的智慧生活吧！', '更有惊喜好礼等你领'],
          btnText: '立即预约',
        }
        this.showFlowPath = false
      }
    },

    getRoom(roomNo) {
      const params = {
        memberId: this.$store.getters['getUserId'],
        memberName: this.$store.getters['getNickname'],
        mode: 0,
        roomNo
      }
      request.getRoom(params).then(res => {
        if (!res.data.success) {
          console.log(res.data.error)
          return
        }

        const data = res.data.result
        if (data.consNumber + data.prosNumber >= data.limitNumber) {
          this.pageTypeList={
            title:'警告',
            input:false,
            text:['当前房间号人数已满，请输入其他房间号'],
            btnText:'确定',
            pageState:'warring'
          }
          // console.log('当前房间号人数已满，请输入其他房间号')
          return
        }

        if ((data.consNumber >= data.consLimit && this.$route.query.type === '1') || (data.prosNumber >= data.prosLimit && this.$route.query.type === '0')) {
          // console.log('手速慢啦，该阵营人数已满')
          this.pageTypeList={
            title:'警告',
            input:false,
            text:['手速慢啦，该阵营人数已满'],
            btnText:'确定',
            pageState:'warring'
          }
          return
        }
        
        // 车队创建人
        // this.createNumberId = data.memberId
        // this.roomId = data.id
        this.$router.push({
          path: '/chooseGroup',
          query: {
            mode: this.$route.query.mode,
            roomId: data.id
          }
        })
      }).catch(() => {
        console.log('网络异常，请稍后重试')
      })  
    },
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
.start {
  width: 100%;
  height: 100vh;
  background-size: 100% 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 100px;
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
  &-tag{
    width: 100%;
    display: flex;
    margin-top: 30px;
    justify-content: space-between;
    &-ruler{
      width: 200px;
      height: 70px;
      background: url("../../assets/icon/tag.png") no-repeat;
      background-size: 100% 100%;
      font-size: 30px;
      color: white;
      transform: translateX(-10px);
      line-height: 70px;
    }
    &-record{
      line-height: 70px;
      width: 200px;
      height: 70px;
      font-size: 30px;
      color: white;
      background: url("../../assets/icon/tag.png") no-repeat;
      background-size: 100% 100%;
      transform: translateX(10px) rotate(180deg);
    }
  }

  &-model{
    width: 100%;
    margin-top: 30px;
    display: flex;
    flex-direction: column;
    align-items: center;
    font-size: 16px;
    color: white;
    &-top{
      width: 70%;
      height: 200px;
      background: url("../../assets/button/button4.png") no-repeat;
      background-size: 100% 100%;
      &-text{
        width: 100%;
        height: 100%;
        background: url("../../assets/button/button3.png") no-repeat;
        background-size: 100% 100%;
      }
    }
    &-btm{
      width: 70%;
      height: 200px;
      background: url("../../assets/button/button5.png") no-repeat;
      background-size: 100% 100%;
      margin-top: 30px;
      &-text{
        width: 100%;
        height: 100%;
        background: url("../../assets/button/button2.png") no-repeat;
        background-size: 100% 100%;
      }
    }
  }
}
</style>
