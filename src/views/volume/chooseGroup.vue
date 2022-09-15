<template>
  <div class="wait" :class=" pageType === 1 ?'model1':'model2'">
    <NavigationBar />
    <PlayIcon />
    <div class="wait-title">
      <div class="wait-title-top">《智慧生活启示录》</div>
      <div class="wait-title-btm">终极密卷</div>
    </div>
    <div class="wait-model"></div>
    <div class="wait-content">
      <div :class="['wait-content-lft', userSelect === 0 && 'wait-content-lftchoose']" @click="handleSelectGroup(0)"></div>
      <div :class="['wait-content-rgt', userSelect === 1 && 'wait-content-rgtchoose']" @click="handleSelectGroup(1)"></div>
      <div class="wait-content-text">
        <span style="transform: translate(10px,10px);display: inline-block">V</span>
        <span style="transform: translate(2px,30px);display: inline-block">S</span>
      </div>
    </div>
    <div class="wait-button">
      <div class="wait-button-center" @click="handleConfirm">确定</div>
    </div>
    <popup-inquiry :show="showInquiry" @handleHidden="showInquiry = false" :text="popupText" @handleConfirm="showInquiry = false"></popup-inquiry>
    <ErrorDialog :show.sync="errorShow" :text="errorText"></ErrorDialog>
  </div>
</template>

<script>
import popupInquiry from "../../components/popup/popupInquiry";
import NavigationBar from '../../components/navigationBar.vue'
import ErrorDialog from '../../components/errorDialog.vue'
import PlayIcon from '../../components/playIcon.vue'
import * as request from '../../api/service/game'

export default {
  name: "chooseGroup",
  components:{popupInquiry, NavigationBar, ErrorDialog, PlayIcon},
  data(){
    return{
      pageType:1,
      userSelect: null,
      showInquiry:false,
      popupText:'请选择一方阵营！',
      errorText: '',
      errorShow: false
    }
  },
  mounted() {

  },
  methods:{
    handleSelectGroup(e){
      this.userSelect = e
    },
    handleConfirm(){
      if (this.userSelect === null){
        this.showInquiry = true
        return false
      }
      let params = {
        memberId: this.$store.getters['getUserId'],
        memberName: this.$store.getters['getNickname'],
        type: this.userSelect
      }

      if (this.$route.query.mode === '0') params.roomId = this.$route.query.roomId
      const fn = this.$route.query.mode === '0' ? request.joinCamp : request.joinRoomAndCamp
      fn(params).then(res => {
        if (!res.data.success) {
          this.errorText = res.data.error
          this.errorShow = true
          return
        }
        
        this.$router.push({
          path: '/prepare',
          query: {
            roomId: this.$route.query.mode === '0' ? this.$route.query.roomId : res.data.result,
            type: this.userSelect,
            mode: this.$route.query.mode
          }
        })
      }).catch(() => {
        this.errorText = '网络异常，请稍后重试'
        this.errorShow = true
      }) 
    }
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
.wait {
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

  &-model{
    margin: 22% 0 10% 0;
    width: 76%;
    height: 60px;
    background: url("../../assets/textIcon/text4.png") no-repeat;
    background-size: 100% 100%;
  }

  &-content{
    position: relative;
    width: 90%;
    height: 40%;
    display: flex;
    font-size: 16px;
    color: #FFFFFF;
    text-shadow: hotpink 2px 0 0 ;
    &-lft{
      width: 50%;
      display: flex;
      flex-direction: column;
      padding-right: 9%;
      padding-top: 10%;
      box-sizing: border-box;
      background: url("../../assets/button/button9.png") no-repeat;
      background-size: 100% 100%;
    }
    &-lftchoose {
      width: 50%;
      display: flex;
      flex-direction: column;
      padding-right: 9%;
      padding-top: 10%;
      box-sizing: border-box;
      background: url("../../assets/button/button7.png") no-repeat;
      background-size: 100% 100%;
    }
    &-rgt{
      width: 50%;
      display: flex;
      flex-direction: column;
      padding-left: 9%;
      padding-top: 10%;
      box-sizing: border-box;
      background: url("../../assets/button/button8.png") no-repeat;
      background-size: 100% 100%;
    }
    &-rgtchoose{
      width: 50%;
      display: flex;
      flex-direction: column;
      padding-left: 9%;
      padding-top: 10%;
      box-sizing: border-box;
      background: url("../../assets/button/button6.png") no-repeat;
      background-size: 100% 100%;
    }
    &-text{
      position: absolute;
      top: 34%;
      left: 50%;
      transform: translateX(-50%);
      font-size: 1.2rem;
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
    &-center{
      width: 250px;
      height: 86px;
      line-height: 86px;
      text-align: center;
      background: url("../../assets/button/button1.png") no-repeat;
      background-size: 100% 100%;
    }
  }
}
</style>
