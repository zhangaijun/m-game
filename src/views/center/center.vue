<template>
  <div class="center">
    <NavigationBar />
    <PlayIcon />
    <div class="center-title">
      <div class="center-title-top">《智慧生活启示录》</div>
      <div class="center-title-btm">终极密卷</div>
    </div>
    <div class="center-tag">
      <div class="center-tag-ruler" @click="showToast = true">规则</div>
      <div class="center-tag-record"><div style="transform:rotate(180deg);" @click="findRecentRecord">PK战绩</div></div>
    </div>
    <div class="center-model" v-if="!showToast">
      <div class="center-model-top" @click="handleStart(0)">
      </div>
      <div>
        *仅供到店打本玩家体验
      </div>
      <div class="center-model-btm" @click="handleStart(1)">
      </div>
      <div>
       *可供线上玩家体验尝鲜
      </div>
    </div>

    <popup :show="showToast" @handleHidden="showToast = false" :type="3"></popup>
    <popup-inquiry :show.sync="showInquiry" :mode="mode" @handleConfirm="handleConfirm"></popup-inquiry>
  </div>
</template>

<script>
import NavigationBar from '../../components/navigationBar.vue'
import popup from "../../components/popup/popup"
import PlayIcon from '../../components/playIcon.vue'
import popupInquiry from "../../components/popup/popupInquiry"

export default {
  name: "center",

  components: {
    [NavigationBar.name]: NavigationBar,
    popupInquiry,
    popup,
    PlayIcon
  },
  data(){
    return{
      mode: 0,
      showToast: false,
      showInquiry: false,
    }
  },
  methods:{
    handleStart(num){
      this.mode = num
      this.showInquiry = true
    },

    handleConfirm() {
      if (this.mode){
        this.$router.push({
          path: '/chooseGroup',
          query: {
            mode: this.mode
          }
        })
      }else{
        this.$router.push({
          path: '/volumeOneStart',
          query: {
            mode: this.mode
          }
        })
      }
    },

    findRecentRecord() {
      this.$router.push(
        {
          path: '/gameOver',
          query: {
            record: true
          }
        }
      )
    }
  }
}
</script>

<style lang="scss" scoped>
.center {
  width: 100%;
  height: 100vh;
  background: url("../../assets/imgs/game/bg_2.png") no-repeat;
  background-size: 100% 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 100px;
  overflow: hidden;
  &-title{
    width: 100%;
    text-align: center;
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
      position: relative;
      left: -20px;
      width: 200px;
      height: 70px;
      background: url("../../assets/icon/tag.png") no-repeat;
      background-size: 100% 100%;
      font-size: 30px;
      color: white;
      transform: translateX(-10px);
      line-height: 70px;
      text-align: center;
    }
    &-record{
      position: relative;
      right: -20px;
      line-height: 70px;
      width: 200px;
      height: 70px;
      font-size: 30px;
      text-align: center;
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
      height: 260px;
      background: url("../../assets/button/button3.png") no-repeat;
      background-size: 100% 100%;
      // &-text{
      //   width: 100%;
      //   height: 100%;
      //   background: url("../../assets/button/button3.png") no-repeat;
      //   background-size: 100% 100%;
      // }
    }
    &-btm{
      width: 70%;
      height: 260px;
      background: url("../../assets/button/button2.png") no-repeat;
      background-size: 100% 100%;
      margin-top: 30px;
      // &-text{
      //   width: 100%;
      //   height: 100%;
      //   background: url("../../assets/button/button2.png") no-repeat;
      //   background-size: 100% 100%;
      // }
    }
  }
}
</style>
