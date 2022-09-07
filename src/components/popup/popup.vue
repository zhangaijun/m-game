<template>
    <div>
      <van-popup
          class="popup"
          v-model="show"
          :close-on-click-overlay="false"
          v-if="type === 1"
      >
        <div class="popup-content">
          <div class="popup-content-close" @click="handleClose"></div>
          <div class="popup-content-text">
            {{text}}
          </div>
        </div>
      </van-popup>
      <van-popup
          :overlay="false"
          class="ruler"
          v-model="show"
          :close-on-click-overlay="false"
          v-if="type === 2"
      >
        <div class="ruler-content" @click.stop.prevent="handleClose" >
          <div class="ruler-content-close" @click="handleClose"></div>
          <div class="ruler-content-text">
            <div class="ruler-content-text1">
              游戏规则
            </div>
            <div class="ruler-content-text2">
              1.未注册三翼鸟APP的用户，参与及助力本活动时需先下载注册登录三翼鸟APP。<br>
              2.「打本模式」中用户获得积分后可凭借手机截图至DM处兑换道具，限用户参与活动当时兑换，过期不予受理。<br>
              3.「游客模式」中，若您获得三翼鸟实物奖品，请务必在72小时内提供有效收货地址等信息（收货地址信息一经填写确认则不可更改），若超时未提供，即视为您放弃领取奖品，商家将无法为您发货。奖品将在活动结束后30个工作日内陆续发出，如遇不可抗力因素导致发货延迟，请您理解并耐心等待。<br>
              4.同一个账号、同一个手机号、同一个支付账号以及同一个设备号均视为同一用户；如果用户以任何不正当手段或舞弊方式参与本活动，一经发现，三翼鸟有权对该用户的账号进行异常标记。对于账号异常用户的奖励发放，三翼鸟有权采取不发奖品等措施，亦有权收回用户可领取的奖励，追讨已发放的奖励，并保留追究该户责任的权利。如因此给用户造成的损失，三翼鸟不进行任何赔偿或补偿。不正当手段及舞弊行为包括但不限于：使用非法工具分享、下载、安装、注册、登录多个账号及其他不正当手段。<br>
              5.活动方可根据活动举办的实际情况，在法律允许范围内，对本活动说明进行变动或者调整。<br>
              6.本活动与Apple.lnc无关，本活动仅限18岁以上用户参与。<br>
              7.本次活动最终解释权归三翼鸟所有。
            </div>
            <div class="ruler-content-iconText"></div>
          </div>
        </div>
      </van-popup>
    </div>
</template>

<script>
export default {
name: "popup",
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
    type: {
      type: Number,
      default: 'todo'
    },
  },
  methods:{
    handleClose(){
      this.$emit('handleHidden')
    }
  }
}
</script>

<style lang="scss" scoped>
.popup{
  width: 80%;
  height: 20%;
  background:rgba(255,255,255,0);
  padding: 20px;
  box-sizing: border-box;
  &-content{
    position: relative;
    width: 100%;
    height: 100%;
    background: url("../../assets/popup/popup1.png") no-repeat;
    background-size:100% 100%;
    font-size: 30px;
    color: #fff;
    &-close{
      position: absolute;
      right: 12px;
      top: -20px;
      width: 46px;
      height: 46px;
      background: url("../../assets/popup/close.png") no-repeat;
      background-size:100% 100%;
    }
    &-text{
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
}

.ruler{
  width: 94%;
  height: 70%;
  background:rgba(255,255,255,0);
  &-content{
    position: relative;
    width: 100%;
    height: 100%;
    background: url("../../assets/popup/popup2.png") no-repeat;
    background-size:100% 100%;
    font-size: 30px;
    color: #fff;
    &-close{
      position: absolute;
      right: 12px;
      top: 0;
      width: 60px;
      height: 60px;
      background: url("../../assets/popup/close.png") no-repeat;
      background-size:100% 100%;
    }
    &-icon{
      position: absolute;
      right: 12px;
      top: -20px;
      width: 46px;
      height: 46px;
      background: url("../../assets/popup/close.png") no-repeat;
      background-size:100% 100%;
    }
    &-text{
      width: 100%;
      height: 100%;
    }
    &-text1{
      padding-top: 20%;
      font-size: 50px;
      text-align: center;
      color: #86F8FF;
    }
    &-text2{
      height: 460px;
      overflow: auto;
      padding: 0 16%;
      margin-top: 40px;
      font-size: 20px;
      color: #cde1e8;
      text-align: start;
    }
    &-iconText{
      position: absolute;
      bottom: -4px;
      left: 50%;
      transform: translateX(-50%);
      width: 290px;
      height: 150px;
      background: url("../../assets/textIcon/text1.png") no-repeat;
      background-size:100% 100%;
    }
  }
}


::v-deep .van-popup{
  font-size: 11px;
  background:rgba(255,255,255,0);
}
</style>
