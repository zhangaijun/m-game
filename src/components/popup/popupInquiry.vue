<template>
  <div>
    <van-popup
        class="popup"
        v-model="show"
        :close-on-click-overlay="false"
    >
      <div class="popup-content">
        <div class="popup-content-close" @click="handleConfirm"></div>
        <div class="popup-content-text" v-if="text">
          {{ text }}
        </div>
        <div class="popup-content-text" v-else>
          欢迎你，三维世界的人类朋友~
          请选择你的阵营，完成6道问答，抽精美家装礼！还可预约免费体验三翼鸟沉浸式剧本游戏！加油吧！
        </div>
        <div class="popup-content-btn" @click="handleConfirm">
          {{btnText}}
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script>
export default {
  name: "popupInquiry",
  data() {
    return {

    };
  },
  props: {
    show: {
      type: Boolean,
      default: false
    },
    text: {
      type: String,
      default: ''
    },
    btnText: {
      type: String,
      default: '确定'
    },
  },
  methods:{
    handleConfirm(){
      this.$emit('handleConfirm',{})
    }
  }
}
</script>

<style lang="scss" scoped>
.popup{
  width: 80%;
  height: 50%;
  background:rgba(255,255,255,0);
  padding: 20px;
  box-sizing: border-box;
  &-content{
    position: relative;
    width: 100%;
    height: 100%;
    background: url("../../assets/popup/popup3.png") no-repeat;
    background-size:100% 100%;
    font-size: 32px;
    color: #fff;
    padding: 10%;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    align-items: center;
    &-close{
      position: absolute;
      right: -0.1333rem;
      top: -0.1333rem;
      width: 46px;
      height: 46px;
      background: url("../../assets/popup/close.png") no-repeat;
      background-size:100% 100%;
    }
    &-text{
      width: 100%;
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      text-align: center;
    }
    &-btn{
      width: 80%;
      height: 16%;
      display: flex;
      align-items: center;
      justify-content: center;
      background: url("../../assets/button/button1.png") no-repeat;
      background-size:100% 100%;
    }
  }
}

::v-deep .van-popup{
  font-size: 11px;
  background:rgba(255,255,255,0);
}
</style>
