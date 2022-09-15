<template>
  <div class="start" :class=" pageType === 1 ?'model1':'model2'">
    <NavigationBar />
    <PlayIcon />
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
import popupInquiry from "../../components/popup/popupInquiry"
import popupFlowPath from "../../components/popup/popupFlowPath"
import PlayIcon from '../../components/playIcon.vue'
import * as request from '../../api/service/game'
export default {
  name: "volumeOneStart",
  components:{popupInquiry,popupFlowPath,NavigationBar,PlayIcon},
  data(){
    return{
      showInquiry:false,
      showFlowPath:true,
      popupText:"",
      showTitleHide:false,
      pageType:2,
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
            title:'请输入房间号',
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
          this.pageTypeList={
            title:'警告',
            input:false,
            text: [res.data.error],
            btnText:'确定',
            pageState:'warring'
          }
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
          return
        }

        if ((data.consNumber >= data.consLimit && this.$route.query.type === '1') || (data.prosNumber >= data.prosLimit && this.$route.query.type === '0')) {
          this.pageTypeList={
            title:'警告',
            input:false,
            text:['手速慢啦，该阵营人数已满'],
            btnText:'确定',
            pageState:'warring'
          }
          return
        }
        
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
  background: url("../../assets/imgs/game/bg_2.png") no-repeat;
}
.model2{
  background: url("../../assets/imgs/game/bg_1.png") no-repeat;
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
}
</style>
